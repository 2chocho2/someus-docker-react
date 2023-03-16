import axios from "axios";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './datepicker.css';
import MyDiaryEach from "./MyDiaryEach";
import ko from 'date-fns/locale/ko';
import NaviDiary from "../navigation/NaviDiary";
import '../navigation/navi.css';
import './mydiarylist.css';
import jwt_decode from "jwt-decode";
import TodoList from "./TodoList";
import Modal_Mydiary from "./Modal_Mydiary";


const MyDiaryList = ({ match, history }) => {

    const [list, setList] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [memberId, setMemberId] = useState('');
    const [memberName, setMemberName] = useState('');
    const [modalState, setModalState] = useState([]);
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setMemberId(decode_token.sub);
        setMemberName(decode_token.name);
        let memberId = decode_token.sub;
        const today = formatDate(new Date());

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/page/${memberId}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                setList(response.data.diaryList);
                getTodos(today);
                for (let i = 0; i < list.length; i++) {
                    setModalState(prevState => {
                        const updateModalArray = [...prevState];
                        updateModalArray[i] = false;
                        return updateModalArray;
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                return;
            })
    }, []);

    // 날짜에 따라 목표 설정
    async function getTodos(createdDt) {
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);

        try {
            const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/list/goal/${decode_token.sub}/${createdDt}`,
                { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } });
            setTodos(response.data);
        } catch (error) {
            console.log(error);
            return;
        };
    };

    const closeModal = (index) => {
        setModalState(prevState => {
            const updateArray = [...prevState];
            updateArray[index] = false;
            return updateArray;
        });
    };

    // datepicker - 요일의 이름 반환
    const getDayName = (date) => {
        return date.toLocaleDateString('ko-KR', {
            weekday: 'long',
        }).substr(0, 1);
    };

    // datepicker - 날짜를 년, 월, 일로 비교
    const createDate = (date) => {
        return new Date(new Date(date.getFullYear()
            , date.getMonth()
            , date.getDate()
            , 0
            , 0
            , 0));
    };

    // datepicker의 날짜 형태를 sql 날짜 형태와 맞게 변경
    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${ year }-${ month }-${ day }`;
    };

    // 날짜 변경 시 해당 날짜를 기준으로 목록이 리랜더링
    const handlerChangeDate = (date) => {
        const createdDt = formatDate(date);
        setStartDate(date);

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/page/${memberId}/${createdDt}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                console.log(response);
                getTodos(createdDt);
                setList(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const handlerClickDetail = (index) => {
        setModalState(prevState => {
            const updateArray = [...prevState];
            updateArray[index] = true;
            return updateArray;
        });
    };

    const handlerClickWrite = () => {
        history.push(`/someus/private/write`)
    };

    const result = () => {
        return list && list.map((lst, index) => {
            return (
                <div key={index} id={lst.diaryId}>
                    {modalState[index]
                        &&
                        <Modal_Mydiary match={match}
                                        closeModal={() => closeModal(index)}
                                        id={lst.diaryId}
                                        list={lst} />}

                    <button className="diaryeachbutton"
                            type="button"
                            value={lst.diaryId}
                            onClick={() => handlerClickDetail(index)}>
                        <MyDiaryEach list={lst} />
                    </button>

                </div>
            );
        });
    };

    return (
        <>
            <div>
                <NaviDiary history={history} />
                <div className='diarylist_background'>
                    <div className="calendar-container">
                        <div className="calendar-box">
                            <DatePicker locale={ko}
                                        selected={startDate}
                                        // 날짜가 클릭되면 해당 날짜로 이동
                                        onChange={handlerChangeDate}
                                        inline
                                        // 토, 일 색깔 변경
                                        dayClassName={date =>
                                            getDayName(createDate(date)) === '토' ? "saturday"
                                                :
                                                getDayName(createDate(date)) === '일' ? "sunday" : undefined
                                        }
                                        todayButton="today"
                            />
                        </div>
                        <div className="todo-box">
                            <TodoList todos={todos}
                                    setTodos={setTodos}
                                    startDate={startDate}
                                    getTodos={getTodos} />
                        </div>
                    </div>
                    <div className='diary-container'>
                        <div>
                            <p className="name_diary">{memberName}의 일기</p>
                            <p className='date'>{startDate.getMonth() + 1} {startDate.toLocaleString("en-US", { month: "long" })}</p>
                        </div>

                        <button className='private_write' onClick={handlerClickWrite}>
                            <div className='privateWrite-button' />
                            <span className="private_writetext"> 일기쓰기 </span>
                        </button>

                        <div className='diary'>
                            <div className="diaryWrap">{ result() }</div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );

}

export default MyDiaryList;
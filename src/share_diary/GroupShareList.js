import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../private_diary/datepicker.css';
import ko from 'date-fns/locale/ko';
import NaviDiary from "../navigation/NaviDiary";
import GroupShareListEach from "./GroupShareListEach";
import './groupsharelist.css';
import Modal from "./Modal";
import jwt_decode from "jwt-decode";


const GroupShareList = ({ history, name, match }) => {
    // 모달
    const [modalState, setModalState] = useState([]);
    const { shareroomid } = match.params;
    const [list, setList] = useState([]);
    const [allList, setAllList] = useState([]);
    const [memberList, setMemberList] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [memberId, setMemberId] = useState('');
    const [memberName, setMemberName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const closeModal = (index) => {
        setModalState(prevState => {
            const updateArray = [...prevState];
            updateArray[index] = false;
            return updateArray;
        });
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setMemberId(decode_token.sub);
        setMemberName(decode_token.name);

        let memberId = decode_token.sub;

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/shareroom/${shareroomid}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                setList(() => {
                    const updateArray = response.data;
                    //createdDt 글자 앞 10글자로 변경
                    const updateArray2 = updateArray.map(item => ({
                        ...item, createdDt: item.createdDt.slice(0, 10)
                    }));

                    //같은 날짜인 데이터가 있다면 줄여야함. 줄이기 전에 0과 1로 중복 날짜 구분 표시.
                    for (let i = 0; i < updateArray2.length; i++) {
                        if (i !== updateArray2.length - 1 && updateArray2[i].createdDt == updateArray2[i + 1].createdDt) {
                            updateArray2[i] = { ...updateArray2[i], number: 0 };
                            updateArray2[i + 1] = { ...updateArray2[i + 1], number: 1 };
                            i++;
                        } else {
                            updateArray2[i] = { ...updateArray2[i], number: 0 };
                        }
                    };

                    //중복날짜 포함 일기 리스트
                    setAllList(updateArray2);

                    //number가 0인 것만 추출
                    const updateArray3 = updateArray2.filter((data) => data.number === 0);

                    for (let i = 0; i < updateArray3.length; i++) {
                        for (let j = 0; j < updateArray2.length; j++) {
                            if (updateArray3[i].createdDt === updateArray2[j].createdDt) {
                                updateArray3[i] = { ...updateArray3[i], number: updateArray2[j].number };
                            } else {
                            }
                        };
                    };
                    return updateArray3;
                });

                //현재 list로 모달에 뿌리는데 개수 조정 필요. 왜냐? 같은 날짜인 데이터는 뺴야하니까
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

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/shareroom/member/${shareroomid}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                setMemberList(response.data);
            })
            .catch((error) => {
                console.log(error);
                return;
            })
    }, []);

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

    const handlerClickWrite = () => {
        history.push(`/someus/share/${shareroomid}/write`)
    };

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    // 날짜 변경 시 해당 날짜를 기준으로 목록이 리랜더링
    const handlerChangeDate = (date) => {
        const createdDt = formatDate(date);
        setStartDate(date);
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/shareroom/${shareroomid}/${createdDt}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                setList(() => {
                    const updateArray = response.data;
                    //createdDt 글자 앞 10글자로 변경
                    const updateArray2 = updateArray.map(item => ({
                        ...item, createdDt: item.createdDt.slice(0, 10)
                    }));

                    //같은 날짜인 데이터가 있다면 줄여야함. 줄이기 전에 0과 1로 중복 날짜 구분 표시.
                    for (let i = 0; i < updateArray2.length; i++) {
                        if (i !== updateArray2.length - 1 && updateArray2[i].createdDt == updateArray2[i + 1].createdDt) {
                            updateArray2[i] = { ...updateArray2[i], number: 0 };
                            updateArray2[i + 1] = { ...updateArray2[i + 1], number: 1 };
                            i++;
                        } else {
                            updateArray2[i] = { ...updateArray2[i], number: 0 };
                        }
                    };

                    //중복날짜 포함 일기 리스트
                    setAllList(updateArray2);

                    //number가 0인 것만 추출
                    const updateArray3 = updateArray2.filter((data) => data.number === 0);

                    for (let i = 0; i < updateArray3.length; i++) {
                        for (let j = 0; j < updateArray2.length; j++) {
                            if (updateArray3[i].createdDt === updateArray2[j].createdDt) {
                                updateArray3[i] = { ...updateArray3[i], number: updateArray2[j].number };
                            } else {
                            }
                        };
                    };
                    return updateArray3;
                });
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

    const result = () => {
        return list && list.map((lst, index) => {
            return (
                <div key={index} id={lst.diaryId}>
                    {modalState[index] 
                    && 
                    <Modal match={match} 
                            closeModal={() => closeModal(index)} 
                            id={lst.diaryId} 
                            list={lst} 
                            allList={allList} />}
                    
                    <button className="diaryeachbutton" 
                            type="button" 
                            value={lst.diaryId} 
                            onClick={() => handlerClickDetail(index)}>
                        <GroupShareListEach list={lst} />
                    </button>
                </div>
            );
        });
    };

    return (
        <>
            <NaviDiary history={history} />
            <div className='groupshare_background'>
                <div className='body1' >
                    <div className="groupcalendar-container">
                        <div className="groupcalendar-box">
                            <DatePicker
                                locale={ko}
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
                        <div className="group-member_box">
                            <p className="group-member_title">함께 기록하는 사람</p> {memberList.map((memberList, index) => {
                                return (
                                    <>
                                        {/* <div className="group-member_icon"/> */}
                                        <div className="group-memberlist" key={index} >
                                            <div className="group-member_icon" />
                                            <div className="group-member_id">
                                                <b>{memberList.memberName}</b> ( {memberList.memberId} )
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                            }

                        </div>
                    </div>
                    <div className="group_line" />
                    <div className='groupdiary-container'>
                        <div>
                            {/* <p className="name_diary">{list.shareRoomName}</p> */}
                            <p className='date'>{startDate.getMonth() + 1} {startDate.toLocaleString("en-US", { month: "long" })}</p>
                        </div>

                        <button className='group_write' onClick={handlerClickWrite}>
                            <div className='groupWrite-button' />
                            <span className="writebutton_text"> 일기 쓰기 </span>
                        </button>

                        <div className='diary1'>
                            {/* { list.map((list, index) => <GroupShareEach key={ index } list={ list } />) } */}
                            <div className="diaryWrap1">
                                {result()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GroupShareList;
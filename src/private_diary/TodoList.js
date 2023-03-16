import "./TodoList.css";
import { FaEraser } from "react-icons/fa";
import axios from "axios";
import jwt_decode from 'jwt-decode';

const TodoList = (props) => {

    const token = sessionStorage.getItem('token');
    const memberId = jwt_decode(token).sub;

    // 체크박스를 누를 때 마다 바뀔 이미지 3개, images[인덱스번호]를 통해 사용
    const images = [
        '../img/todo_null.png',
        '../img/todo_ing.png',
        '../img/todo_ok.png'
    ];

    //{ 핸들러 } todolist의 input 텍스트 업데이트 해주는 핸들러
    //onChange 이벤트 사용 (id: goalId, e: e.target.value)
    function handlerChange(id, e) {
        props.setTodos(prevState => {
            const updateArray = [...prevState];
            const index = updateArray.findIndex(item => item.goalId === id);
            updateArray[index] = { ...updateArray[index], goalContents: e };
            return updateArray;
        });
    };

    //{ 핸들러 }포커스 아웃 되면 put으로 입력되게 updateGoal api요청 필요
    const handlerInputFocusOut = (id, e) => {

        //Todos 내용 중에 받아온 id와 일치하는 goal객체를 수정 반영
        props.setTodos(prevState => {
            const updateArray = [...prevState];
            const index = updateArray.findIndex(item => item.goalId === id);
            updateArray[index] = { ...updateArray[index], goalContents: e };

            //인자 id를 가지고 해당 goalId를 갖고 하나의 객체를 가져와서 할당
            const arrayTodos = props.todos.find(array => {
                if (array.goalId === id) return array
            }
            );

            //서버에 보낼 RequestBody 데이터 지정( 멤버ID, 목표내용, 목표상태, 목표날짜 )
            const data = {
                memberId: memberId,
                goalContents: arrayTodos.goalContents,
                goalState: Number(arrayTodos.goalState),
                goalDate: arrayTodos.goalDate
            };

            //서버에 보낼 Header로서 토큰과 컨텐츠타입(JSON) 지정
            const header = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            };

            //서버에 put으로 수정 요청
            axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/list/goal/${id}`, data,
                {
                    headers: header
                }).then(response => {
                    if (response.data === 1) {
                        console.log('수정완료');
                    } else {
                        console.log('수정실패');
                        return;
                    }
                }).catch(error => console.log(error));

            return updateArray;
        });
    };

    //{ 핸들러 } 삭제 이미지(지우개) 누르면 해당 목표 삭제 (작업완료)
    const handlerClickEraser = (id) => {
        //id값을 기준으로 서버에 delete 요청
        axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/list/goal/${id}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },  })
            .then(response => {
                if (response.data === 1) {
                    //서버에서 수정이 되면 1을 반환, 삭제된 id를 지우고(filter), Todos를 최신 상태로 반영
                    props.setTodos(prevState => {
                        const newArray = prevState.filter(item => item.goalId !== id);
                        return newArray;
                    })               } else {
                    alert('수정실패');
                    return;
                }
            }).catch(error => console.log(error));
    };

    // { 핸들러 } 하트 그림 클릭 -> [빈하트, 반하트, 꽉찬 하트] 로 변경 (작업완료)
    const handlerImgClick = (id) => {

        //인덱스를 구하고, 해당 goal의  goalState를 0, 1, 2가 반복 수정되도록 함 
        props.setTodos(prevState => {
            const updateArray = [...prevState];
            const index = updateArray.findIndex(item => item.goalId === id);
            updateArray[index] = { ...updateArray[index], goalState: (updateArray[index].goalState + 1) % 3 };

            //객체 배열에서 수정한 객체를 가져옴
            const arrayTodos = updateArray.find(array => array.goalId === id);

            //서버에 보낼 RequestBody 데이터 지정( 멤버ID, 목표내용, 목표상태, 목표날짜 )
            const data = {
                memberId: memberId,
                goalContents: arrayTodos.goalContents,
                goalState: Number(arrayTodos.goalState),
                goalDate: arrayTodos.goalDate
            };
            //서버에 보낼 Header로서 토큰과 컨텐츠타입(JSON) 지정
            const header = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            };
            //서버에 put으로 수정 요청
            axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/list/goal/${id}`, data,
                {
                    headers: header
                }).then(response => {
                    if (response.data === 1) {
                        console.log('수정완료');
                    } else {
                        console.log('수정실패');
                        return;
                    }
                }).catch(error => console.log(error));

            return updateArray;
        });
    }

    //{ 핸들러 } '+' 버튼 누르면 멤버ID와 달력의 날짜를 기준으로 기본 목표 내용 추가
    const handelrAddTodo = () => {

        //날짜형태를 MyDiaryList의 달력날짜에서 가져오고 'yyyy-mm-dd'로 바꿈
        const startDate = props.startDate;
        const startDateYear = startDate.getFullYear();
        const startDateMonth = startDate.getMonth() + 1;
        const startDateDay = startDate.getDate();
        const newStartDate = startDateYear + '-' + startDateMonth + '-' + startDateDay;

        //서버에 보낼 RequestBody 데이터 지정( 멤버ID, 목표내용(빈값), 목표상태(0), 목표날짜 )
        const data = {
            memberId: memberId,
            goalContents: '',
            goalState: 0,
            goalDate: newStartDate
        };
        //서버에 보낼 Header로서 토큰과 컨텐츠타입(JSON) 지정
        const header = {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        };

        //서버에 post로 입력 요청
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/list/goal`, data,
            {
                headers: header
            }).then(response => {
                if (response.data === 1) {
                    console.log('추가완료');
                    props.getTodos(newStartDate);
                } else {
                    console.log('추가실패');
                    return;
                }
            }).catch(error => console.log(error));
    };
 
    return (
        <>
            <div className="todo_box">

                <div className="Todo">이번 달 목표
                    <button onClick={handelrAddTodo}>+</button>
                </div>
                <div className="TodoListCheckBox">

                    <ul>
                        {/* MyDiaryList에서 가져온 todos를 map으로 반복 출력 해주고 [이미지, 목표내용, 삭제버튼] 생성 */}
                        {props.todos && props.todos.map((todo, index) => (
                            <li key={index}>
                                {todo.goalState == 0 ? <span><img className="checkboxImg" src={process.env.PUBLIC_URL + images[0]} alt="x" onClick={() => handlerImgClick(todo.goalId)} /></span> : ""}
                                {todo.goalState == 1 ? <span><img className="checkboxImg" src={process.env.PUBLIC_URL + images[1]} alt="x" onClick={() => handlerImgClick(todo.goalId)} /></span> : ""}
                                {todo.goalState == 2 ? <span><img className="checkboxImg" src={process.env.PUBLIC_URL + images[2]} alt="x" onClick={() => handlerImgClick(todo.goalId)} /></span> : ""}
                                <input key={index} type="text" value={todo.goalContents} onBlur={(e) => handlerInputFocusOut(todo.goalId, e.target.value)} onChange={e => handlerChange(todo.goalId, e.target.value)} placeholder=""></input>
                                <FaEraser id="edit" onClick={() => handlerClickEraser(todo.goalId)} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default TodoList;
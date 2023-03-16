import mypage from '../img/navicon_my.png'
import logout from '../img/navicon_logout.png'
import home from '../img/navicon_home.png'
import './navi.css'
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

const NaviDiary = (props) => {

    const [name, setName] = useState('');
    const [memberId, setMemberId] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        const decode_token = jwt_decode(token)
        setName(decode_token.name);
        setMemberId(decode_token.sub)

        let memberId = decode_token.sub;

    }, []);

    const handlerClickHome = () => {
        props.history.push('/someus/mainpage');
    };

    const handlerClickMyPage = () => {
        props.history.push(`/someus/mypage`);
    };

    const handlerClickLogout = () => {
        alert('로그아웃되었습니다.');
        sessionStorage.clear();
        props.history.push('/someus/mainpage')
    };


    return (
        <>
            <div id='header'>
                <div className='menu'>
                    <input type="image"
                        className='home'
                        src={home}
                        onClick={handlerClickHome}></input>
                    <div className='loginMessage'>
                        <p className="name">{name}의 일기장 ◡̈⋆*</p>
                        <button type="button"
                            className='myPage'
                            value="마이페이지"
                            onClick={handlerClickMyPage}><img src={mypage} /></button>
                        <button type="button"
                            className='logout'
                            value="로그아웃"
                            onClick={handlerClickLogout}><img src={logout} /></button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NaviDiary;

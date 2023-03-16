import './navi.css'
import logo from '../img/logo_main.png'
import mypage from '../img/navicon_my.png'
import howTo from '../img/navicon_howTo.png'
import logout from '../img/navicon_logout.png'

const NaviLogin = ({ name,
                    handlerClickHome,
                    handlerClickHowTo,
                    handlerClickLogout,
                    handlerClickMyPage }) => {

    return (
        <>
            <div id='header'>
                <div className="menu">
                    <input type="image"
                        className='navi_icon'
                        src={logo}
                        alt="SOMEUS"
                        onClick={handlerClickHome}></input>
                    <button type="button"
                        className='howTo'
                        onClick={handlerClickHowTo}><img src={howTo} /></button>
                    <div className="loginMessage">
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

export default NaviLogin;


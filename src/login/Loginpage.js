import axios from "axios";
import { useState, useEffect } from "react";
import './Login.css';

const Loginpage = ({ history }) => {

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');


    const handlerIdInput = (e) => {
        setId(e.target.value);
    };

    const handlerPwInput = (e) => {
        setPw(e.target.value);
    };

    const handlerRegist = () => {
        console.log(history);
        history.push('/someus/regist');
    };

    const handlerSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/login`,
            { "memberId": id, "memberPw": pw })
            .then((response) => {
                if (response.data) {
                    sessionStorage.setItem("token", response.data);
                    alert('로그인에 성공했습니다.');
                    history.push('/someus/mainpage');
                } else {
                    sessionStorage.clear();
                    alert('일치하는 정보가 없습니다.');
                }
            })
            .catch(error => {
                sessionStorage.clear();
                alert('일치하는 정보가 없습니다.');
                setId('');
                setPw('');
            })
    };

    useEffect(() => {
        document.body.style.cssText = `
        position: fixed;
        top: -${window.scrollY}px;
        overflow-y: scroll;
        width: 100%;`;

        return () => {
            const scrollY = document.body.style.top;
            document.body.style.cssText = '';
            window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        };
    }, []);


    return (
        <>
            <div className="loginPage">
                <div className="loginContainer">
                    <div className="loginLogo"></div>
                    <div className="loginInput" >
                        <form className="loginForm" onSubmit={handlerSubmit}>
                            {/* id, pw가 값이 있다면 label의 클래스명이 바뀌어서 다른 css가 적용되도록. */}
                            <div className={id === '' ? "loginInputBox1" : "loginInputBox2"}>
                                <label>
                                    <span>
                                        아이디
                                    </span>
                                </label><span className="A">
                                    <div className="login_logo"></div>
                                </span>
                                <input id="loginId"
                                    value={id}
                                    onChange={handlerIdInput}
                                    placeholder="아이디">

                                </input>
                            </div>
                            <div className={pw === '' ? "loginInputBox1" : "loginInputBox2"}>
                                <label>
                                    <span>비밀번호</span>
                                </label>
                                <span className="A">
                                    <div className="login_logo"></div>
                                </span>
                                <input id="loginPassword"
                                    type="password"
                                    value={pw}
                                    onChange={handlerPwInput}
                                    placeholder="비밀번호"></input>

                            </div>
                            <div className="loginBtnBox">
                                <button type="button" onClick={handlerRegist}>회원가입</button>
                                <button type="submit">로그인</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Loginpage;
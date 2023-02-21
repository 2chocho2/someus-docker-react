import axios from "axios";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
import NavigationDiary from "../navigation/NaviDiary";
import './mydiarywrite.css'


const MyDiaryWrite = ({ history, name }) => {

    console.log(history);

    const [ weather, setWeather ] = useState([]);
    const [ mood, setMood ] = useState([]);
    const [ weatherActive, setWeatherActive ] = useState('');
    const [ moodActive, setMoodActive ] = useState('');
    const [ imgBase64, setImgBase64 ] = useState([]);
    const [ imgBase, setImgBase ] = useState([1]);
    const [ imgFile, setImgFile ] = useState([]);
    const [ contents, setContents ] = useState('');

    // 화면이 로드될 때 get 방식을 사용해 weather 버튼과 mood 버튼 출력
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        console.log(decode_token);
        
        axios.get(`http://localhost:8080/api/someus/private/write`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                console.log(response.data);
                console.log(response.data.weatherList[1]);
                console.log(response.data.moodList);
                setWeather(response.data.weatherList);
                setMood(response.data.moodList);
            })
            .catch((error) => {
                console.log(error);
                return;
            })
    }, [])

    // 날씨 버튼 출력
    const weatherList = () => {
        const result=[];
        for( let i=0; i<weather.length; i++) {
            result.push(
                <>
                    <img src={weather[i].weatherImg} 
                        className={"btn" + (weather[i].weatherId == weatherActive ? " active" : "")}
                        onClick={toggleWeatherActive}/>
                </>
                );
        
        } return result;
    };
    
    // 기분 버튼 출력
    const moodList = () => {
        const result=[];
        console.log(mood.length);
        for( let i=0; i<mood.length; i++) {
            result.push(
                <>
                    <img src={mood[i].moodImg} 
                        className={"btn" + (mood[i].moodId == moodActive ? " active" : "")}
                        onClick={toggleMoodActive} />
                </>
                );
        
        } return result;
    };

    // 날씨, 기분 토글
    const toggleWeatherActive = (e) => {
        e.preventDefault();
        setWeatherActive(() => {
            console.log(e.target.value);
            return e.target.value;
        });
    };

    const toggleMoodActive = (e) => {
        e.preventDefault();
        setMoodActive(() => {
            return e.target.value;
        });
    };

    const handlerOnChangeContents = (e) => {
        setContents(e.target.value);
    };

    const formData = new FormData();

    const handleChangeFile = (e) => {
        const newImgBase = [1];
        // 1MB
        let maxSize = 1 * 1024 * 1024;
        setImgFile(e.target.files);
        setImgBase(newImgBase);
        setImgBase([]);

        if (e.target.files.length >= 2) {
            alert(`이미지는 1개만 업로드가 가능합니다.`);
            const newImgBase = [1];
            setImgBase(newImgBase);
            setImgBase64([]);
        } else {
            for (var i = 0; i < e.target.files.length; i++) {
                if (!e.target.files[i].type.match("image/.*")) {
                    alert("이미지 파일만 업로드가 가능합니다.");
                    return;
                } else if (e.target.files[i].size > maxSize) {
                    alert("이미지 크기는 1MB를 초과할 수 없습니다.");
                    return;
                } else if (e.target.files[i]) {
                    console.log(e.target.files[i].size);
                    let reader = new FileReader();
                    // 1. 파일을 읽어 버퍼에 저장합니다.
                    reader.readAsDataURL(e.target.files[i]);
                    // 2. 읽기가 완료되면 아래코드가 실행됩니다.
                    reader.onloadend = () => {
                        const base64 = reader.result;
                        newImgBase.pop();

                        if (base64) {
                            var base64Sub = base64.toString();
                            setImgBase64((imgBase64) => [...imgBase64, base64Sub]);
                            setImgBase(newImgBase);
                        }
                    };
                }
            }
        };
    };

    const diarySet = {
        weather_id: 'weatherActive',
        mood_id: 'moodActive',
        diary_content: 'contents'
    };

    formData.append(
        "data",
        new Blob([JSON.stringify(diarySet)], { type: "application/json" })
    );
    Object.values(imgFile).forEach((file) => formData.append("diary_img", file));


    const onSubmit = (e) => {
        e.preventDefault();

        axios({
            method: 'post',
            url: `http://localhost:8080/api/someus/private/write`,
            data: formData,
            headers: {
                "Content-Type": `multipart/form-data; `,
                'Authorization' : `Bearer ${ sessionStorage.getItem('token') }`
              },
            })
            .then((response) => {
                console.log(response);
                if(response.data.count === 1) {
                    alert(`정상적으로 등록되었습니다.`);
                    history.push('/someus/private');
                };
            })
            .catch(error => {
                console.log(error);
            })
        }

    return (
        <>
            <div className='background' style={{ backgroundImage: `url('../img/bg_myWrite.png')` }}>
                <NavigationDiary name={ name }/>
                <div className='container'>
                    <h1>오늘의 일기</h1>
                    <form onSubmit={ onSubmit }>
                        <div>
                            <div className='writeheader'>
                                <div className='weather-container'>
                                    <p>오늘의 날씨</p>
                                    {weatherList()}
                                </div>
                                <div className='mood-container'>
                                    <p>오늘의 기분은?</p>
                                    {moodList()}
                                </div>
                            </div>

                            <div className='writebody'>
                                <textarea placeholder="오늘의 하루를 입력해 주세요."
                                    value={contents}
                                    onChange={handlerOnChangeContents}></textarea>
                            </div>

                            <div className='writefooter'>
                                <div className='fileBox'>
                                    <input type='file' id='file' onChange={handleChangeFile} />
                                </div>
                            </div>
                            <input className='submit' type='submit' value='제출' />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );

}

export default MyDiaryWrite;
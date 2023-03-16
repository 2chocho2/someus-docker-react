import axios from "axios";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
import NaviDiary from "../navigation/NaviDiary";
import './mydiarywrite.css'


const MyDiaryWrite = ({ history }) => {

    const [weather, setWeather] = useState([]);
    const [mood, setMood] = useState([]);
    const [weatherActive, setWeatherActive] = useState(1);
    const [moodActive, setMoodActive] = useState(1);
    const [imgBase64, setImgBase64] = useState([]);
    const [imgBase, setImgBase] = useState([1]);
    const [imgFile, setImgFile] = useState([]);
    const [contents, setContents] = useState('');
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');

    // 화면이 로드될 때 get 방식을 사용해 weather 버튼과 mood 버튼 출력
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/write`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                setWeather(response.data.weatherList);
                setMood(response.data.moodList);
                setUsername(decode_token.name);
                setUserId(decode_token.sub);
            })
            .catch((error) => {
                console.log(error);
                return;
            })
    }, [])

    // 날씨 버튼 출력
    const weatherList = () => {
        const result = [];
        for (let i = 0; i < weather.length; i++) {
            result.push(
                <>
                    <img className="privateweather_img"
                        src={weather[i].weatherId == weatherActive
                            ? `/img/weatherC_${weather[i].weatherId}.png`
                            : `/img/weather_${weather[i].weatherId}.png`}
                        onClick={toggleWeatherActive}
                        alt={weather[i].weatherId} />
                </>
            );
        } return result;
    };

    // 기분 버튼 출력
    const moodList = () => {
        const result = [];
        for (let i = 0; i < mood.length; i++) {
            result.push(
                <>
                    <img className="privatemood_img"
                        src={mood[i].moodId == moodActive
                            ? `/img/moodC_${mood[i].moodId}.png`
                            : `/img/mood_${mood[i].moodId}.png`}
                        onClick={toggleMoodActive}
                        alt={mood[i].moodId} />
                </>
            );
        } return result;
    };

    // 날씨, 기분 토글
    const toggleWeatherActive = (e) => {
        e.preventDefault();
        setWeatherActive(e.target.alt);
        console.log(weatherActive);
    };

    const toggleMoodActive = (e) => {
        e.preventDefault();
        setMoodActive(e.target.alt);
    };

    const handlerOnChangeContents = (e) => {
        setContents(e.target.value);
    };

    const formData = new FormData();

    // 사진 업로드 핸들러
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
                    // 1. 파일을 읽어 버퍼에 저장
                    reader.readAsDataURL(e.target.files[i]);
                    // 2. 읽기가 완료되면 아래코드 실행
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

    // 파일을 제외한 다른 데이터를 담는 객체
    const diaryDto = {
        weatherId: weatherActive,
        moodId: moodActive,
        diaryContent: contents,
        memberId: userId
    };

    // formData 형식으로 사진, 그 외 데이터 추가
    // Blob - 멀티데이터의 처리를 위해 사용하는 함수
    formData.append(
        "data",
        new Blob([JSON.stringify(diaryDto)], { type: "application/json" })
    );
    Object.values(imgFile).forEach((file) => formData.append("files", file));


    const onSubmit = (e) => {
        e.preventDefault();

        axios({
            method: 'post',
            url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/write`,
            data: formData,
            headers: {
                "Content-Type": `multipart/form-data; `,
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then((response) => {
                console.log(response);
                if (response.data.count === 1) {
                    alert(`정상적으로 등록되었습니다.`);
                    history.push('/someus/private');
                };
            })
            .catch(error => {
                console.log(error);
            })
    };

    return (
        <>
            <NaviDiary history={history} />
            <div className='mydiarywrite_background'>
                <div className='container'>
                    <h1>오늘의 일기</h1>
                    <form onSubmit={ onSubmit }>
                        <div>
                            <div className='writeheader'>
                                <div className='weather-container'>
                                    <p>오늘의 날씨</p>
                                    { weatherList() }
                                </div>
                                <div className='mood-container'>
                                    <p>오늘의 기분은?</p>
                                    { moodList() }
                                </div>
                            </div>


                            <textarea className="writebody_private"
                                placeholder="오늘의 하루를 입력해 주세요."
                                value={ contents }
                                onChange={ handlerOnChangeContents }></textarea>


                            <div className='writefooter'>
                                <input className='fileBox_private' type='file' id='file' onChange={ handleChangeFile } />
                            </div>
                            <input className='submit_private' type='submit' value='제출' />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );

}

export default MyDiaryWrite;
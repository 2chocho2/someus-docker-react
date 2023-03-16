import axios from "axios";
import jwt_decode from "jwt-decode";
import { useState, useRef, useEffect } from "react";
import NaviDiary from "../navigation/NaviDiary";
import './groupdiarywrite.css';

const GroupDiaryWrite = ({ history, match }) => {

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

    const { shareroomid } = match.params;

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);

        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/share/${shareroomid}/write`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                setWeather(response.data.weatherList);
                setMood(response.data.moodList);
                setUsername(decode_token.name);
                setUserId(decode_token.sub);
                console.log(shareroomid);
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
                    <img className="groupweather_img" 
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
                    <img className="groupmood_img"
                        src={mood[i].moodId == moodActive
                            ? `/img/moodC_${mood[i].moodId}.png`
                            : `/img/mood_${mood[i].moodId}.png`}
                        onClick={toggleMoodActive}
                        alt={mood[i].moodId} />
                </>
            );
        } return result;
    };

    // 사용자가 날씨 이미지를 누르면 해당 날씨의 id가 active 형태로 바뀜
    const toggleWeatherActive = (e) => {
        e.preventDefault();
        setWeatherActive(e.target.alt);
    };

    // 사용자가 기분 이미지를 누르면 해당 기분의 id가 active 형태로 바뀜
    const toggleMoodActive = (e) => {
        e.preventDefault();
        setMoodActive(e.target.alt);
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

    const diaryDto = {
        weatherId: weatherActive,
        moodId: moodActive,
        diaryContent: contents,
        memberId: userId,
        shareRoomId: shareroomid
    };

    formData.append(
        "data",
        new Blob([JSON.stringify(diaryDto)], { type: "application/json" })
    );
    Object.values(imgFile).forEach((file) => formData.append("files", file));


    const onSubmit = (e) => {
        e.preventDefault();

        axios({
            method: 'post',
            url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/share/${shareroomid}/write`,
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
                    history.push(`/someus/share/groupsharelist/${shareroomid}`);
                };
            })
            .catch(error => {
                console.log(error);
            })
    };

    return (
        <>
            <NaviDiary history={history} />
            <div className='groupWrite_background'>
                <div className='groupWrite_container'>
                    <h1>오늘의 일기</h1>
                    <form onSubmit={ onSubmit }>
                        <div>
                            <div className='writeheader0'>
                                <div className='weather-container0'>
                                    <p>오늘의 날씨</p>
                                    { weatherList() }
                                </div>
                                <div className='mood-container0'>
                                    <p>오늘의 기분은?</p>
                                    { moodList() }
                                </div>
                            </div>

                            <textarea className='writebody_box'
                                placeholder="오늘의 하루를 입력해 주세요."
                                value={ contents }
                                onChange={ handlerOnChangeContents }></textarea>

                            <div className='writefooter0'>
                                <input className='fileBox0' type='file' id='file' onChange={ handleChangeFile } />
                            </div>
                            <input className='submit0' type='submit' value='제출' />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );

}

export default GroupDiaryWrite;
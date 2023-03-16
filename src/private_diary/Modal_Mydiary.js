import axios from "axios";
import { useEffect, useState } from "react";
import './modal_mydiary.css';

const Modal_Mydiary = (props) => {

    const [weather, setWeather] = useState('');
    const [mood, setMood] = useState('');
    const [contents, setContents] = useState('');
    const image = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/` + props.list.diaryImg;

    const diaryId = props.list.diaryId;

    useEffect(() => {
        // 모달 화면 설정
        document.body.style.cssText = `a
        position: fixed;
        top: -${window.scrollY}px;
        overflow-y: scroll;
        width: 100%;`;

        // 마운트될 때 diaryid를 기준으로 내용, 기분, 날씨 설정
        console.log(props.list);
        setContents(props.list.diaryContent);
        setMood(props.list.moodId);
        setWeather(props.list.weatherId);

        return () => {
            const scrollY = document.body.style.top;
            document.body.style.cssText = '';
            window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        };
    }, []);

    // moodId에 따라 moodImg 설정
    const moodImg = (mood) => {
        if (mood == 1) { return <img className="mood_detail" src={`../img/moodC_1.png`} /> }
        else if (mood == 2) { return <img className="mood_detail" src={`../img/moodC_2.png`} /> }
        else if (mood == 3) { return <img className="mood_detail" src={`../img/moodC_3.png`} /> }
        else if (mood == 4) { return <img className="mood_detail" src={`../img/moodC_4.png`} /> }
        else if (mood == 5) { return <img className="mood_detail" src={`../img/moodC_5.png`} /> }
    };

    // weatherId에 따라 weatherImg 설정
    const weatherImg = (weather) => {
        if (weather == 1) { return <img className="weather_detail" src={`../img/weather_1.png`} /> }
        else if (weather == 2) { return <img className="weather_detail" src={`../img/weather_2.png`} /> }
        else if (weather == 3) { return <img className="weather_detail" src={`../img/weather_3.png`} /> }
        else if (weather == 4) { return <img className="weather_detail" src={`../img/weather_4.png`} /> }
        else if (weather == 5) { return <img className="weather_detail" src={`../img/weather_5.png`} /> }
    };

    const hanlderChangeContents = (e) => {
        setContents(e.target.value);
    };

    // 내용 수정 이벤트 핸들러
    const handlerOnClickUpdate = () => {
        axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/${diaryId}`,
            { "diaryContent": contents },
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                if (response.data === 1) {
                    alert(`정상적으로 수정되었습니다.`);
                    window.location.reload();
                } else {
                    alert(`수정에 실패했습니다.`);
                    return;
                }
            })
            .catch((error) => {
                console.log(contents);
                console.log(error);
                alert(`수정에 실패했습니다.`);
                return;
            })
    };

    // 일기 삭제 이벤트 핸들러
    const handlerOnClickDelete = () => {
        axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/someus/private/${diaryId}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then((response) => {
                if (response.data === 1) {
                    alert(`정상적으로 삭제되었습니다.`);
                    props.closeModal();
                    window.location.reload();
                } else {
                    alert(`삭제에 실패했습니다.`);
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
                alert(`삭제에 실패했습니다.`);
                return;
            })
    };

    return (
        <>
            <div className="private_modal" onClick={props.closeModal}>
                {/* 이벤트가 상위 엘리먼트에게 전달되지 않도록 해 주는 설정 */}
                <div className="private_modalBody" onClick={(e) => e.stopPropagation()}>
                    <div className="modelLeft">
                        <img className="modalImg" src={image} />
                    </div>
                    
                    <div className="modalRight">
                        <div className="modalRightHeader">
                            <span className="write_day">{props.list.createdDt}</span>
                            <div className="modalRightHeaderRight">
                                <span>{weatherImg(weather)}</span>
                                <span>{moodImg(mood)}</span>
                            </div>
                        </div>
                        
                        <textarea className='dairyContents' value={contents} onChange={hanlderChangeContents}></textarea>

                        <div className="bottom">
                            <button className="modalCloseBtn" onClick={handlerOnClickUpdate}>연필</button>
                            <button className="modalCloseBtn" onClick={handlerOnClickDelete}>휴지통</button>
                        </div>
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal_Mydiary;
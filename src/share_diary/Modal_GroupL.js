import { useEffect, useState } from "react";

const Modal_GroupL = (props) => {

    // 모달
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

    const modalClose = () => {
        props.closeModal();
        console.log(props.closeModal());
    };

    // moodId에 따라 moodImg 설정
    const moodImg = (mood) => {
        if (mood == 1) { return <img className="groupL_mood" src={`../img/moodC_1.png`} /> }
        else if (mood == 2) { return <img className="groupL_mood" src={`../img/moodC_2.png`} /> }
        else if (mood == 3) { return <img className="groupL_mood" src={`../img/moodC_3.png`} /> }
        else if (mood == 4) { return <img className="groupL_mood" src={`../img/moodC_4.png`} /> }
        else if (mood == 5) { return <img className="groupL_mood" src={`../img/moodC_5.png`} /> }
    };

    // weatherId에 따라 weatherImg 설정
    const weatherImg = (weather) => {
        if (weather == 1) { return <img className="groupL_weather" src={`../img/weather_1.png`} /> }
        else if (weather == 2) { return <img className="groupL_weather" src={`../img/weather_2.png`} /> }
        else if (weather == 3) { return <img className="groupL_weather" src={`../img/weather_3.png`} /> }
        else if (weather == 4) { return <img className="groupL_weather" src={`../img/weather_4.png`} /> }
        else if (weather == 5) { return <img className="groupL_weather" src={`../img/weather_5.png`} /> }
    };


    return (
        <>
            <div className="groupL_modal">
                <div className="groupL_modalImgbox">
                    <img className="groupL_modalImg" src={props.diaryDetailInfo ? `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/` + props.diaryDetailInfo.diary_img : ''} />
                </div>
                <div className="groupL_write">
                    <div className="groupL_modalHeader">
                        <div className="groupL_date">{props.diaryDetailInfo ? props.diaryDetailInfo.createdDt : ""}</div>
                        <div className="groupL_modalHeaderRight">
                            <div className="groupL_weather">{props.diaryDetailInfo ? weatherImg(props.diaryDetailInfo.weather_id) : ''}</div>
                            <div className="groupL_mood">{props.diaryDetailInfo ? moodImg(props.diaryDetailInfo.mood_id) : ''}</div>
                        </div>
                    </div>
                    <div className="group_dairyContents">{props.diaryDetailInfo ? props.diaryDetailInfo.diaryContent : ""}</div>
                    {props.children}
                </div>
            </div>
            {/* </div> */}

        </>
    );
};

export default Modal_GroupL;
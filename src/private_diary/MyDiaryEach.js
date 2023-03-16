import './mydiaryeach.css'

const MyDiaryEach = ({ list }) => {

    const image = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/` + list.diaryImg;

    return (
        <div className='eachdiary' >
            <div className='diaryimg_box'><img className='diaryimg' src={ image } /></div>
            <div className='diarydate'>{ list.createdDt }</div>
        </ div>
        
    );
}

export default MyDiaryEach;
import groupdiaryimg from '../img/groupD_1.png';
import './groupshareEach.css';

const GroupShareEach = ({ list, history }) => {

    const handlerClick = () => {
        history.push(`/someus/share/groupsharelist/${list.shareRoomId}`);
    };
    
    return (
        <>
        <div className='groupEachdiary' onClick={ handlerClick }>
            <div className='groupdiaryimg'>
                <img src={ groupdiaryimg } />
            </div>
            <div className='share_title'>{ list.shareRoomName }</div>
        </ div>
        </>
    );
}

export default GroupShareEach;
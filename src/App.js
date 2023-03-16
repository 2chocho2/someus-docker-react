import { Route } from 'react-router-dom';
import GroupList from './share_diary/GroupList';
import GroupShareList from './share_diary/GroupShareList';
import MyDiaryWrite from './private_diary/MyDiaryWrite';
import MyDiaryList from './private_diary/MyDiaryList';
import Regist from './regist/Regist.js'
import Loginpage from './login/Loginpage';
import GroupDiaryWrite from './share_diary/GroupDiaryWrite'
import Main from './main/Main';
import MainHowTo from './main/MainHowTo';
import MyPage from './mypage/MyPage';

function App() {

  return (
    <>
      <Route path='/' component={ (props) => <Main {...props} /> } exact={true} />
      <Route path='/login' component={Loginpage} exact={true} />
      <Route path="/someus/regist" component={Regist} exact={true} />
      <Route path='/someus/mypage' component={ (props) => <MyPage {...props} /> } exact={true} />
      <Route path='/someus/mainpage' component={ (props) => <Main {...props} /> } exact={true} />
      <Route path='/someus/howto' component={ (props) => <MainHowTo {...props}  /> } exact={true} />

      <Route path='/someus/private' component={(props) => <MyDiaryList {...props}  />} exact={true} />
      <Route path='/someus/private/write' component={ (props) => <MyDiaryWrite {...props}  /> } exact={true} />
      
      <Route path='/someus/share/grouplist' component={ (props) => <GroupList {...props} /> } exact={true} />
      <Route path='/someus/share/groupsharelist/:shareroomid' component={ (props) => <GroupShareList {...props}  /> } exact={true} />
      <Route path='/someus/share/:shareroomid/write' component={ (props) => <GroupDiaryWrite {...props}  /> } exact={true} />
    </>
  );
}

export default App;

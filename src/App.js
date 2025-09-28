import { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';

// 헤더 풋터
import Header4 from './Header/Header4';
import Footer from './Footer/Footer';
//페이지 임포트
import LoginStart from './Login/LoginStart';
import Main from './Main/Main';
import Notice from './Admin-Notice/Notice';
import Login from './Login/Login';
import ReportPage from './Report/ReportPage';
import SignUp from './SignUp/SignUp';
import TipList from './Tip/TipList';
import ReportDetail from './Admin-Report/ReportDetail';
import JamList from './Jam/Jamlist';
import Doing from './Doing/Doing';
import Charge from './Charge/Charge';
import DealListAd from './Administrator/DealListAd';
import MainAd from './Administrator/MainAd';
import PartnerWrite from './Partner/PartnerWrite';
import Payment from './Payment/Payment';
import Chatting from './Chatting/Chatting';
import ProfileWrite from './Profile/ProfileWrite';
import JamWrite from './Jam/JamWrite';
import NoticeWrite from './Admin-Notice/NoticeWrite';
import NoticeDetail from './Admin-Notice/NoticeDetail';
import TipWrite from './Tip/TipWrite'
import JamDetail from './Jam/JamDetail2';
import MusicSplit from './MusicSplit/MusicSplit';
import ReportList from './Admin-Report/ReportList';
import TipEdit from './Tip/TipEdit'
import TipDetail from './Tip/TipDetail'
import PartnerList from './Partner/PartnerList';
import PartnerDatail from './Partner/PartnerDatail';
import LoginTest from './Login/LoginTest';
import Finduser from './Login/Finduser';
import SignUpTest from './SignUp/SignUpTest';
import PaymentTest from './Payment/PaymentTest';
import PaymentTest2 from './Payment/PaymentTest2';
import Portfolio from './Profile/Portfolio';
import PaymentList from './Payment/PaymentList';
import ProfileDetail from './Profile/ProfileDetail';
import DoingTest from './Doing/DoingTest';
import DoingList from './Doing/DoingList';
import DoingDetail from './Doing/DoingDetail';
import Review from './Doing/Review';
import ProfileDetailUser from './Profile/ProfileDetailUser';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
    {/* 충전하기 거래내역 안뜸 */}
      <Header4 isLogin={isLogin} setIsLogin={setIsLogin} />

      {/* 기능 & 디자인 완성된 페이지 */}
      <Route path="/" component={Main} exact={true} />
      <Route path="/login/start" component={LoginStart} exact={true} />
      <Route path="/login" component={(props) => <LoginTest {...props} setIsLogin={setIsLogin} />} exact={true} />
      <Route path="/signup" component={SignUpTest} exact={true} />

      <Route path="/deal/list" component={PaymentList} exact={true} />

      <Route path="/jam/list" component={JamList} exact={true} />
      <Route path="/jam/write" component={JamWrite} exact={true} />


      <Route path="/admin" component={MainAd} exact={true} />
      <Route path="/admin/notice/list" component={Notice} exact={true} />
      <Route path="/admin/notice/write" component={NoticeWrite} exact={true} />
      <Route path="/admin/deal/list" component={DealListAd} exact={true} />
      <Route path="/admin/report/list" component={ReportList} exact={true} />
      <Route path="/admin/report/detail/:reportIdx" component={ReportDetail} exact={true} /> {/* 영구정지 권한 제어 필요 */} {/* 기능 됐는데 시현만 있음 */}

      <Route path="/notice/detail/:noticeIdx" component={NoticeDetail} exact={true} />
      
      <Route path="/partner/list" component={PartnerList} exact={true} />
      <Route path="/partner/write" component={PartnerWrite} exact={true} />
      <Route path="/partner/detail/:crIdx" component={PartnerDatail} exact={true} />
      <Route path="/partner/charge/:total" component={Charge} exact={true} />

      <Route path="/tip/list" component={TipList} exact={true} /> {/* 좋아요 / 좋아요순 기능 구현 x / DESC  */}
      <Route path="/tip/write" component={TipWrite} exact={true} />
      <Route path="/tip/edit/:tbIdx" component={TipEdit} excat={true} />
      <Route path="/tip/detail/:tbIdx" component={TipDetail} exact={true} />

      <Route path="/split" component={MusicSplit} exact={true} />

      {/* 이 위로 주석 안지워짐 // 나중에 로컬호스트로 된거 있는지 재체크 필요 // 권한 설정 다 됐는지 재확인 */}
      <Route path="/profile/write" component={ProfileWrite} exact={true} />
      <Route path="/report/write/:userId" component={ReportPage} exact={true} />


      {/* 기능 완성 & 디자인 x */}
      <Route path="/find/:idx" component={Finduser} exact={true} /> 

      <Route path="/partner/doing" component={DoingList} exact={true} /> 
      <Route path="/partner/doing/detail/:cidx" component={DoingDetail} exact={true} />

      <Route path="/chatting" component={Chatting} exact={true} />

      <Route path="/jam/detail/:cIdx" component={JamDetail} exact={true} /> 

      <Route path="/profile/detail" component={ProfileDetail} exact={true} />
      <Route path="/profile/detail/:user" component={ProfileDetailUser} exact={true} />

{/* 파트너쪽 밑에 안됨 */}

      {/* 디자인 & 기능 미완 */}
      <Route path="/partner/payment/:producer" component={PaymentTest2} exact={true} /> {/* 프로필 불러오기 필요 (기능만 필요) */}
      <Route path="/partner/review/:userId2" component={Review} exact={true} />
      <Footer />
    </>
  )
}
export default App;
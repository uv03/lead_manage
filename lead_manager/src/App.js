import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from './components/Home';
import Userregister from './components/Userregister';
import Userlogin from './components/Userlogin';
import Admindashboard from './components/Admindashboard';
import Userdashboard from './components/Userdashboard';
import Addlead from './components/Addlead';
import Editlead from './components/Editlead';
import Usercomm from './components/Usercomm';
import Admincomm from './components/Admincomm';
import Userfollow from './components/Userfollow';
import Adminfollow from './components/Adminfollow';
import Addfollow from './components/Addfollow';
import Navbar from './components/Navbar'
import Addcom from './components/Addcom';
import Editcomm from './components/Editcomm';
import Editfollow from './components/Editfollow';
import Resetpass from './components/Resetpass';
import Password from './components/Password';
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/users/register" element={<Userregister/>}/>
          <Route path="/users/login" element={<Userlogin/>}/>
          <Route path="/dashboard/user" element={<Userdashboard/>}/>
          <Route path="/dashboard/admin" element={<Admindashboard/>}/>
          <Route path="/lead/newlead" element={<Addlead/>}/>
          <Route path="/lead/:leadid" element={<Editlead/>}/>
          <Route path="/lead/user/comm" element={<Usercomm/>}/>
          <Route path="/lead/admin/comm/:leadid" element={<Admincomm/>}/>
          <Route path="/lead/comm/newcomm/:leadid" element={<Addcom/>}/>
          <Route path="/lead/comm/:commid" element={<Editcomm/>}/>
          <Route path="/lead/user/follow" element={<Userfollow/>}/>
          <Route path="/lead/admin/follow/:leadid" element={<Adminfollow/>}/>
          <Route path="/lead/follow/newfollow/:leadid" element={<Addfollow/>}/>
          <Route path="/lead/follow/newfollow/:leadid" element={<Addfollow/>}/>
          <Route path="/lead/follow/:followid" element={<Editfollow/>}/>
          <Route path="/users/reset" element={<Resetpass/>}/>
          <Route path="/users/changepassword/:email" element={<Password/>}/>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

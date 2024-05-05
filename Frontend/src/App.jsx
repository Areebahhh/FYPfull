import {BrowserRouter,Routes,Route, Router} from 'react-router-dom';
import Login from './Pages/login/Login';
import Register from './Pages/register/Register'
import Test from './Pages/PagesLayout/StudentHomePage';
import ProfilePage from './Pages/PagesLayout/ProfilePage';
import Messenger from './Pages/PagesLayout/MessengerPage';
import RecruiterHomePage from './Pages/PagesLayout/RecruiterHomePage';
import RecruiterJobPage from './Pages/PagesLayout/RecruiterJobPage';
import StudentJobPage from './Pages/PagesLayout/StudentJobPage';
import StudentAppliedJobs from './Pages/PagesLayout/StudentAppliedJobsPage';
import RecruiterApplicationPage from './Pages/PagesLayout/RecruiterApplicationPage';
import RecruiterInterviewPage from './Pages/PagesLayout/RecruiterInterviewPage';
import StudentInterviewPage from './Pages/PagesLayout/StudentInterviewPage';
import SavedPage from './Pages/PagesLayout/StudentSavedPage';
function App() {
  
  return (
    <>  
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route> 
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/profile/:userId" element={<ProfilePage/>}></Route>
          <Route path="/messenger" element={<Messenger/>}></Route>
          <Route path="/messenger/:ConversationId" element={<Messenger/>}></Route>
          <Route path="/saved" element={<SavedPage/>}></Route>

          {/* student routes   */}
          <Route path="/studentHome" element={<Test/>}></Route>  
          <Route path="/studentJob" element={<StudentJobPage/>}></Route>
          <Route path="/studentAppliedJob" element={<StudentAppliedJobs/>}></Route>
          <Route path="/studentInterview" element={<StudentInterviewPage/>}></Route>


          {/* recruiter routes   */}
          <Route path="/recruiterHome" element={<RecruiterHomePage/>}></Route> 
          <Route path="/recruiterJob" element={<RecruiterJobPage/>}></Route>
          <Route path="/recruiterApplication" element={<RecruiterApplicationPage/>}></Route>
          <Route path="/recruiterInterview" element={<RecruiterInterviewPage/>}></Route>
         


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

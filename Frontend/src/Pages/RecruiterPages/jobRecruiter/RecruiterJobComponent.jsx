import Stories from "../../../components/stories/Stories"
 import Posts from "../../../components/RecruiterComponents/jobPosts/JobPosts"
// import Posts from "../../../components/RecruiterComponents/jobPosts/JobPosts"
import Share from "../../../components/share/Share"
import ShareRecruiter from "../../../components/RecruiterComponents/shareRecruiter/ShareRecruiter"
import "./recruiterJobComponent.scss"
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";


const RecruiterJobComponent = ({ student }) => {

  const { currentUser } = useContext(AuthContext); 

  const userId = currentUser.id
 

  return (
    <div className="home">
      <Stories/>
      <h1>{student ? "All Jobs" : "YOUR JOBS"}</h1>
      {/* <Share/> */}
      {student ? <Share/> : <ShareRecruiter/>}
      {student ? <Posts /> : <Posts Puserid={userId} />}

    </div>
  )
}

export default RecruiterJobComponent
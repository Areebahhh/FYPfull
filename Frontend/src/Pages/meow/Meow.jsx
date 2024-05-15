import React, { useEffect, useRef, useContext, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // For FontAwesome icons


import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
// import jwtDecode from "jwt-decode"; // Import a JWT decoding library

const Meow = () => {
  
  


// LOGIN LOGIC CODE




// const { login } = useContext(AuthContext);


// const [loginputs, setlogInputs] = useState({
//   email: "",
//   password: "",
// });

// const [logerr, setlogErr] = useState(null);
// // Step 1: Define a new state variable for the login message
// const [isLoggedIn, setIsLoggedIn] = useState(false);

// const navigate = useNavigate()

// const loghandleChange = (e) => {
//   setlogInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// };


// const loghandleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     await login(loginputs);
//     navigate("/test")

//     // Step 2: Update the state on successful login
//     setIsLoggedIn(true);
    
//   } catch (logerr) {
//     setlogErr(logerr.response.data);
//     setIsLoggedIn(false); // Optionally reset on error
//   }


// };



// const [loginputs, setLoginputs] = useState({ email: "", password: "" });
// const [isLoggedIn, setIsLoggedIn] = useState(false);
// const [logErr, setLogErr] = useState("");
// const navigate = useNavigate(); // Correct context for hooks

// const handleSubmit = async (e) => {
//   // Call the refactored loghandleLogin function with proper arguments
//   loghandleLogin(e, navigate, setIsLoggedIn, login, loginputs, setLogErr);
// };




// const loghandleLogin = async (e, navigate, setIsLoggedIn, login, loginputs, setlogErr) => {
//   e.preventDefault();
//   try {
//     // Attempt login
//     const response = await login(loginputs);

//     // Extract and decode the token
//     const token = response.data.token || response.data.accessToken;
//     console.log("Received token:", token); // Add this to debug token extraction

//     const decodedToken = jwtDecode(token);
//     const userType = decodedToken.type;
//     console.log("Decoded user type:", userType); // Add this to debug user type

//     console.log("Navigating to", userType === "admin" ? "/AdminPage" : "/test");

//     // Navigate based on the user type
//     if (userType === "admin") {
//       navigate("/AdminPage");
//     } else {
//       navigate("/test");
//     }

//     // Update the state on successful login
//     setIsLoggedIn(true);

//   } catch (logerr) {
//     // Handle errors
//     setlogErr(logerr.response?.data || "An error occurred");
//     setIsLoggedIn(false);
//   }
// };





// LOGIN LOGIC CODE





  

  


// FRONTEND TOGGLE AND BUTTONS ETC LOGIC CODE
  const containerRef = useRef(null);
  const signInRef = useRef(null);
  const RecruiterSignUpRef = useRef(null);
  const StudentSignUpRef = useRef(null); // Reference for the new "Student" button

  useEffect(() => {


    const container = containerRef.current;
    const signInButton = signInRef.current;
    const RecruiterSignUpButton = RecruiterSignUpRef.current;
    const StudentSignUpButton = StudentSignUpRef.current;

    const handleSignIn = () => {
      container.classList.remove('right-panel-active');
      container.classList.remove('student-panel-active'); // Reset to show sign-in form
    };

    const handleRecruiterSignUp = () => {
      container.classList.add('right-panel-active');
      container.classList.remove('student-panel-active'); // Ensure only the "Sign Up" form is active
    };

    const handleStudentSignUp = () => {
      container.classList.add('student-panel-active');
      container.classList.remove('right-panel-active'); // Ensure only the "Student" form is active
    };

    signInButton.addEventListener('click', handleSignIn);
    RecruiterSignUpButton.addEventListener('click', handleRecruiterSignUp);
    StudentSignUpButton.addEventListener('click', handleStudentSignUp);



    return () => {
      signInButton.removeEventListener('click', handleSignIn);
      RecruiterSignUpButton.removeEventListener('click', handleRecruiterSignUp);
      StudentSignUpButton.removeEventListener('click', handleStudentSignUp);
    };
  }, []);
//  FRONTEND TOGGLE AND BUTTONS ETC LOGIC CODE








// STUDENT AND RECRUITER SIGNUP LOGIC CODE

const [recruiterInputs, setRecruiterInputs] = useState({
  username: "",
  email: "",
  password: "",
  name: "",
});

const [studentInputs, setStudentInputs] = useState({
  username: "",
  email: "",
  password: "",
  name: "",
});

const [signUpError, setSignUpError] = useState(null);
// const navigate = useNavigate();

// Handle changes to the recruiter form inputs
const handleRecruiterChange = (e) => {
  setRecruiterInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};

// Handle changes to the student form inputs
const handleStudentChange = (e) => {
  setStudentInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};

// Handle recruiter sign-up form submission
const handleRecruiterSubmit = async (e) => {
  e.preventDefault();

  try {
    // Send a POST request to the backend with the recruiter data
    const response = await axios.post("http://localhost:8800/api/auth/register", {
      ...recruiterInputs,
      role: "recruiter",
    });

    // Navigate to a different page on success
    navigate("/"); // Replace with the desired page

  } catch (error) {
    // Set the error state to display in the form
    setSignUpError(error.response?.data || "An error occurred");
  }
};

// Handle student sign-up form submission
const handleStudentSubmit = async (e) => {
  e.preventDefault();

  try {
    // Send a POST request to the backend with the student data
    const response = await axios.post("http://localhost:8800/api/auth/register", {
      ...studentInputs,
      role: "student",
    });

    // Navigate to a different page on success
    navigate("/"); // Replace with the desired page

  } catch (error) {
    // Set the error state to display in the form
    setSignUpError(error.response?.data || "An error occurred");
  }
};
// STUDENT AND RECRUITER SIGNUP LOGIC CODE







//LOGIN LOGIC CODE FOR RECRUITER, STUDENT AND ADMIN




// const { login } = useContext(AuthContext); // Use the AuthContext for authentication
//   const [inputs, setInputs] = useState({ email: '', password: '' }); // Combined input state
//   const [loginError, setLoginError] = useState(null); // Track login errors
//   const navigate = useNavigate(); // For navigation

//   // Update state when inputs change
//   const handleChange = (e) => {
//     const { name, value } = e.target; // Get input name and value
//     setInputs((prev) => ({ ...prev, [name]: value })); // Update input state
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent form from submitting the default way

//     try {
//       // // Attempt login using the login function from AuthContext
//       // const user = await login(inputs);

//       // // Navigate based on userType
//       // if (user.userType === 'admin') {
//       //   navigate('/AdminPage'); // Admin page
//       // } else {
//       //   navigate('/test'); // Test page for non-admins
//       // }
//       // const user = await login(inputs);
//       // console.log("user in login func: ", user);
//       await login(inputs);
//       navigate("/test")

//     } catch (err) {
//       // Handle login errors
//       const errorMessage = err.response?.data || 'Login failed'; // Extract error message
//       setLoginError(errorMessage); // Set error message in state
//     }
//   };

  


const { login } = useContext(AuthContext); // Get login function from context
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // Hook for navigation
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(inputs); // Call login function and get user data
      console.log("user after login", user);

      // Navigate based on user type
      // if (user.userType === 'admin') {
      //   navigate('/AdminPage'); // Admin page for admins
      // } else {
      //   navigate('/studentHome'); // Test page for students/recruiters
      // }


      if (user.userType === 'admin') {
        navigate('/AdminPage'); // Admin page for admins
      } else if (user.userType === 'recruiter') {
        navigate('/recruiterHome'); // Test page for students/recruiters
      } else if(user.userType === 'student') {
        navigate('/studentHome');
      }
    
    } catch (err) {
      const errorMessage = err.response?.data || 'Login failed';
      setLoginError(errorMessage); // Set login error message
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };









//LOGIN LOGIC CODE FOR RECRUITER, STUDENT AND ADMIN
























  return (
    <>
      <div>
        <style>
          {`
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

* {
	box-sizing: border-box;
}

body {
	background: #f6f5f7;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-family: 'Montserrat', sans-serif;
	height: 100vh;
	margin: -20px 0 50px;
}

h1 {
	font-weight: bold;
	margin: 0;
}

h2 {
	text-align: center;
}

p {
	font-size: 14px;
	font-weight: 100;
	line-height: 20px;
	letter-spacing: 0.5px;
	margin: 20px 0 30px;
}

span {
	font-size: 12px;
}

a {
	color: #333;
	font-size: 14px;
	text-decoration: none;
	margin: 15px 0;
}

button {
	border-radius: 20px;
	border: 1px solid #FF4B2B;
	background-color: #FF4B2B;
	color: #FFFFFF;
	font-size: 12px;
	font-weight: bold;
	padding: 12px 45px;
	letter-spacing: 1px;
	text-transform: uppercase;
	transition: transform 80ms ease-in;
}

button:active {
	transform: scale(0.95);
}

button:focus {
	outline: none;
}

button.ghost {
	background-color: transparent;
	border-color: #FFFFFF;
}

form {
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 50px;
	height: 100%;
	text-align: center;
}

input {
	background-color: #eee;
	border: none;
	padding: 12px 15px;
	margin: 8px 0;
	width: 100%;
}

.container {
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 14px 28px rgba(0,0,0,0.25), 
			0 10px 10px rgba(0,0,0,0.22);
	position: relative;
	overflow: hidden;
	width: 768px;
	max-width: 100%;
	min-height: 480px;
}

.form-container {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.6s ease-in-out;
}

.sign-in-container {
	left: 0;
	width: 50%;
	z-index: 2;
}

.container.right-panel-active .sign-in-container {
	transform: translateX(100%);
}

.container.student-panel-active .sign-in-container {
	transform: translateX(100%);
}

.sign-up-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.container.right-panel-active .sign-up-container {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: show 0.6s;
}

.student-sign-up-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.container.student-panel-active .student-sign-up-container {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: show 0.6s;
}

.overlay-container {
	position: absolute;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: transform 0.6s ease-in-out;
	z-index: 100;
}

.container.right-panel-active .overlay-container {
	transform: translateX(-100%);
}

.container.student-panel-active .overlay-container {
	transform: translateX(-100%);
}

.overlay {
	background: #FF416C;
	background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
	background: linear-gradient(to right, #FF4B2B, #FF416C);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 0 0;
	color: #FFFFFF;
	position: relative;
	left: -100%;
	height: 100%;
	width: 200%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
	transform: translateX(50%);
}

.container.student-panel-active .overlay {
	transform: translateX(50%);
}

.overlay-panel {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 40px;
	text-align: center;
	top: 0;
	height: 100%;
	width: 50%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.overlay-left {
	transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
	transform: translateX(0);
}

.container.student-panel-active .overlay-left {
	transform: translateX(0);
}

.overlay-right {
	right: 0;
	transform: translateX(0);
}

.container.right-panel-active .overlay-right {
	transform: translateX(20%);
}

.container.student-panel-active .overlay-right {
	transform: translateX(20%);
}

.social-container {
	margin: 20px 0;
}

.social-container a {
	border: 1px solid #DDDDDD;
	border-radius: 50%;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	margin: 0 5px;
	height: 40px;
	width: 40px;
}

footer {
    background-color: #222;
    color: #fff;
    font-size: 14px;
    bottom: 0;
    position: fixed;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 999;
}

footer p {
    margin: 10px 0;
}

footer i {
    color: red.
}

footer a {
    color: #3c97bf;
    text-decoration: none.
}

          `}
        </style>
      </div>

      {/* <h2></h2> */}
      <div className="container" ref={containerRef}>
        



        {/* SIGN UP AS RECRUITER */}
 
<div className="form-container sign-up-container">
          <form onSubmit={handleRecruiterSubmit}>
            <h1>Recruiter Sign-Up</h1>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={recruiterInputs.username}
              onChange={handleRecruiterChange}
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={recruiterInputs.email}
              onChange={handleRecruiterChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={recruiterInputs.password}
              onChange={handleRecruiterChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={recruiterInputs.name}
              onChange={handleRecruiterChange}
            />
            <button type="submit">Sign Up as Recruiter</button>
            {/* {signUpError && <div>{signUpError.message}</div>}  */}
            {/* Display error message */}
          </form>
        </div>

        {/* SIGN UP AS RECRUITER */}






{/* LOG IN */}
{/* 
<div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <div className="social-container">
          <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
          <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
        </div>
        <span>or use your account</span>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />

        <a href="#">Forgot your password?</a>

        <button type="submit">Sign In</button> // Submit the form

        
        {loginError && <div>{loginError}</div>}
      </form>
    </div> */}


<div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}> 
        <h1>Sign In</h1>

        <input
          type="email"
          name="email" // Use name to map to inputs state
          placeholder="Email"
          value={inputs.email} // Get value from inputs state
          onChange={handleChange} // Use handleChange to update state
        />

        <input
          type="password"
          name="password" // Use name to map to inputs state
          placeholder="Password"
          value={inputs.password} // Get value from inputs state
          onChange={handleChange} // Use handleChange to update state
        />

        <button type="submit">Sign In</button> 

        {/* Display login error if any */}
        {loginError && <div style={{ color: 'red' }}>{loginError}</div>} 
      </form>
    </div>

{/* LOG IN */}
       







{/* SIGN UP FOR STUDENT */}


<div className="form-container student-sign-up-container">
          <form onSubmit={handleStudentSubmit}>
            <h1>Student Sign-Up</h1>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={studentInputs.username}
              onChange={handleStudentChange}
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={studentInputs.email}
              onChange={handleStudentChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={studentInputs.password}
              onChange={handleStudentChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={studentInputs.name}
              onChange={handleStudentChange}
            />
            <button type="submit">Sign Up as Student</button>
            {/* {signUpError && <div>{signUpError.errorMessage}</div>}  */}
            {/* Display error message */}
          </form>
        </div>

{/* SIGN UP FOR STUDENT */}





{/* LEFT SIDE PAGE FOR GOING TO LOGIN PAGE */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us, please login with your personal info</p>
              <button className="ghost" ref={signInRef}>Sign In</button> 
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" ref={RecruiterSignUpRef}>Sign Up as Recruiter</button>
              
              <button className="ghost" ref={StudentSignUpRef}>Sign up as Student</button>
            </div>
          </div>
        </div>
{/* LEFT SIDE PAGE FOR GOING TO LOGIN PAGE */}







      </div>

      <footer>
        <p>
          Created with <i className="fa fa-heart"></i> by
          <a target="_blank" href="https://florin-pop.com">Florin Pop</a>
          - Read how I created this and how you can join the challenge
          <a target="_blank" href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/">here</a>.
        </p>
      </footer>
    </>
  );
};

export default Meow;

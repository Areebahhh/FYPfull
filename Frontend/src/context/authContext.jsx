// import axios from "axios";
// import { createContext, useEffect, useState } from "react";

// export const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );

  

//   const login = async (inputs) => {
//     const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
//       withCredentials: true,
//     });

    



//     console.log("response data", res.data)
//     setCurrentUser(res.data)
//     return res.data; 





//     // Return the user data to the caller

//     // const login = () => {
//     // setCurrentUser({id:1, 
//     //   name:"Ammar", 
//     //   profilePic: "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" 
//     // })    
// };

//   useEffect(() => {
//     localStorage.setItem("user", JSON.stringify(currentUser));
//   }, [currentUser]);

//   return (
//     <AuthContext.Provider value={{ currentUser, login }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data);
    return res.data; // Return the user data to the caller
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:8800/api/logout", {}, {
        withCredentials: true,
      });
      setCurrentUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


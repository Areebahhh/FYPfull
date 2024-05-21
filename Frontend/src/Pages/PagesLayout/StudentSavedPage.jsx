import React from "react";
import Navbar from "../../components/navbar/Navbar";
import LeftBar from "../../components/leftBar/LeftBar";
import LeftBarRec from "../../components/RecruiterComponents/leftBarRecruiter/LeftBarRecruiter";
import Home from "../RecruiterPages/homeRecruiter/RecruiterHome";
import SavedPostPage from "../savedPost/SavedPostPage";
import RightBar from "../../components/rightBar/RightBar";
import "../../style.scss"
import { useContext , useEffect ,useRef , useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export default function SavedPage() {
  
    const { darkMode } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext);

    const queryClient = new QueryClient();



    return (
      <QueryClientProvider client={queryClient}>
          <div className={`theme-${darkMode ? "dark" : "light"}`}>

            <Navbar />
          
            <div style={{ display: "flex" }}>

              {/* <LeftBar /> */}
              {currentUser.userType === 'student' ? <LeftBar /> : <LeftBarRec />}
              <div style={{ flex: 6 }}>
              <SavedPostPage />
              </div>
              <RightBar/>
            </div>
          </div>
    </QueryClientProvider>
  );
}

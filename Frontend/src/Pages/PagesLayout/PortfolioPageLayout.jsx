import React from 'react'
import "../../style.scss"
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import Navbar from "../../components/navbar/Navbar";
import PortfolioPage from "../../portfolio/PortfolioPage";


export default function PortfolioPageLayout() {
    const { darkMode } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext); 
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
        <PortfolioPage />
        </div>
  
        
  
      </div>
    )
}

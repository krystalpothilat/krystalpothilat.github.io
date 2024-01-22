// import React from 'react';
import React, { useState } from "react";
import "./Navbar.css";
import profexp from "./imgs/profexp.png";
import leadership from "./imgs/leadership.png";
import proj from "./imgs/proj.png";
import more from "./imgs/girl.png";
import contact from "./imgs/email.png";
import home from "./imgs/home.png";

const Navbar = () => {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
      setExpanded(true);
    };
  
    const handleCollapse = () => {
      setExpanded(false);
    };

    const handleScroll = (targetId) => {
      const targetElement = document.getElementById(targetId);
  
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

  return (
    <div className= {`navbar ${expanded ? 'expanded' : ''}`}
        onMouseEnter={handleExpand}
        onMouseLeave={handleCollapse}>
        <div className="nav-item" onClick={() => handleScroll('home')}>
            <img src={home} alt= "Home" className = "section-img"/>
            <span className="nav-text">Home</span>
        </div>
        <div className="nav-item">
            <img src={profexp} className = "section-img"/>
            <span className="nav-text">Experience</span>
        </div>
        <div className="nav-item">
            <img src={proj} className = "section-img"/>
            <span className="nav-text">Projects</span>
        </div>
        <div className="nav-item">
            <img src={leadership}  className = "section-img"/>
            <span className="nav-text">Leadership</span>
        </div>
        {/* <div className="nav-item">
            <img src={more}className = "section-img"/>
            <span className="nav-text">About Me</span>
        </div>
        <div className="nav-item">
            <img src={contact} className = "section-img"/>
            <span className="nav-text">Contact</span>
        </div> */}
    </div>
  );
};

export default Navbar;

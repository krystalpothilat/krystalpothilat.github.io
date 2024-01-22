import React, { useState } from "react";
import "./Navbar.css";
import profexp from "./imgs/profexp.png";
import leadership from "./imgs/leadership.png";
import proj from "./imgs/proj.png";
import more from "./imgs/girl.png";
import contact from "./imgs/email.png";
import home from "./imgs/home.png";

const Navbar = ({ handleScrollToPage }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCollapse = () => {
    setExpanded(false);
  };


  return (
    <div className= {`navbar ${expanded ? 'expanded' : ''}`}
        onMouseEnter={handleExpand}
        onMouseLeave={handleCollapse}>
        <div className="nav-item" onClick={() => handleScrollToPage("home")}>
            <img src={home} className = "section-img"/>
            <span className="nav-text">Home</span>
        </div>
        <div className="nav-item" onClick={() => handleScrollToPage("profexp")}>
            <img src={profexp} className = "section-img"/>
            <span className="nav-text">Experience</span>
        </div>
        <div className="nav-item" onClick={() => handleScrollToPage("proj")}>
            <img src={proj} className = "section-img"/>
            <span className="nav-text">Projects</span>
        </div>
        <div className="nav-item" onClick={() => handleScrollToPage("leadership")}>
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

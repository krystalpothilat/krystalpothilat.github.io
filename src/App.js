// import React from "react";
import React, { useState } from 'react';
import "./App.css";
import Page from "./Page";
import Navbar from "./Navbar";

import mePic from "./imgs/me2.jpg";
import ga from "./imgs/ga-logo.png";
import winc from "./imgs/winc-logo.png";
import banner from "./imgs/banner.png";
import cookie from "./imgs/fullcookie.png";
import github from "./imgs/github.png";
import linkedin from "./imgs/linkedin.png";
import email from "./imgs/email.png";
import resume from "./imgs/resume.png";

import profexpdata from './data/profexpdata.json';
import leadershipexpdata from './data/leadershipexpdata.json';
import projdata from './data/projdata.json';

function App() {

  const [raindrops, setRaindrops] = useState([]);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);


  const handleScrollToPage = (pageId) => {
    const p = document.getElementById(pageId);
    console.log ("beginning scroll");
    if( p ){
      p.scrollIntoView({ behavior: "smooth"});
      console.log ("scrolling to page");
    }
  };

  const startRainfall = () => {
    if (isAnimationRunning) {
      return;
    }

    setIsAnimationRunning(true);

    const newRaindrops = [];

    for (let i = 0; i < 75; i++) {
      const startTime = Math.random() * 2; // Random start times between 0 and 5 seconds
      const speed = Math.random() * 3 + 1;

      newRaindrops.push({
        id: i,
        left: `${Math.random() * 100}vw`,
        startTime: `${startTime}s`,
        speed: `${speed}s`,
      });
    }

    setRaindrops(newRaindrops);
    
    setTimeout(() => {
      setIsAnimationRunning(false);
      setRaindrops([]);
    },5000);
  };

  const resumeurl = process.env.PUBLIC_URL + "KrystalPothilatResume.pdf";

  return (
    <div>
      <div className="raindrops-container">
        {raindrops.length > 0 &&
          raindrops.map((raindrop) => (
            <div
              key={raindrop.id}
              className="raindrop"
              style={{
                left: raindrop.left,
                top: "-30px",
                backgroundImage: `url(${cookie})`,
                animation: `fly ${raindrop.speed} ease-out ${raindrop.startTime}`,
              }}
            />
          ))}
      </div>
      <div className="App">
        <div className = "container"> 
        </div>
        <div className =  "content">
          <Navbar handleScrollToPage = {handleScrollToPage} startRainfall={startRainfall} isAnimationRunning={isAnimationRunning}/>
          <Page id = "home" img = {mePic} alt = "" about1 = "true" style={{ backgroundColor: "blue" }}></Page>
          <Page id = "profexp"  img = {banner} alt = "" section = "Industry Experience" info = {profexpdata} logo = {ga} ></Page>
          <Page id = "proj"  img = {banner} alt = "" section = "Projects" info = {projdata} ></Page>
          <Page id = "leadership"  img = {banner} alt = "" section = "Leadership" info = {leadershipexpdata} logo = {winc} ></Page>
        </div>
        <div className = "links">
          <a href={resumeurl} target="_blank" rel="noopener noreferrer">
              <img src ={resume} alt = "" className="link-img"/>
          </a>
          <a href={`mailto:${"krystalpothilat@gmail.com"}`} target="_blank" rel="noopener noreferrer"  >
              <img src ={email} alt = "" className="link-img"  />
          </a>
          <a href={"https://www.linkedin.com/in/krystalpothilat"} target="_blank" rel="noopener noreferrer">
              <img src ={linkedin} alt = "" className="link-img" />
          </a>
          <a href={"https://github.com/krystalpothilat"} target="_blank" rel="noopener noreferrer">
              <img src ={github} alt = "" className="link-img" />
          </a>
        </div>
      </div>
    </div>

  );
}

export default App;

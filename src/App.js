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

function App() {
  const profexpdata = [
    { id: "pe1", title: "Summer 2024", description: "Expanded payload configurations on the P3E.", date: "June 2023 - August 2023",
    bulletpoints: ["Implementing 2 new function payloads", "Developing the messaging process and updating the user interface on the AV Config page to provide functionality for the new payloads"],
    skills: ["C++", "XML", "JavaScript", "TortoiseSVN"]},
    { id: "pe2", title: "Summer 2023", description: "Updated user interface for increased functionality for CGCS and P3E.", date: "June 2022 - August 2022",
    bulletpoints: ["Reorganizing and enhancement of 10+ visual components on the Heads-Up Display for the CGCS", "Expanding informational components on the Payloads Page on the P3E to allow ID visibility"],
    skills: ["C++",  "XML", "JavaScript"]},
  ];

  const leadershipexpdata = [
    { id: "leader1", title: "President", description: "Led the largest computer science student organization on campus empowering women in tech.", date: "March 2022 - March 2023",},
    { id: "leader2", title: "Secretary", description: "Main support for the organization's  infrastructure and both internal/external communication.", date: "March 2021 - March 2022",}  ];

  const projdata = [
    { id: "proj1", title: "Notion Customizable Bingo Widget", 
    description: "Create a custom 'Bingo Card-esque' widget that is embeddable onto a Notion workspace. Inspired by the '2024 Bingo Card' trend on TikTok, this widget provides Notion users with an electronic version of the New Years resolutions checklist format.",
    skills: ["ReactJS", "Node.js", "Express.js", "MongoDB", "Git"],
    link: "https://notion-bingo-widget.vercel.app/",
    githublink: "https://github.com/krystalpothilat/notion-bingo-widget"},
    { id: "proj2", title: "Movie Bucketlist", 
    description: "A virtual version of my movie bucketlist, filled with IMDB's top 100 movies and more.",
    skills: ["ReactJS", "Node.s", "Express.js", "MongoDB", "Git"],
    link: "https://movie-bucketlist.vercel.app/",
    githublink: "https://github.com/krystalpothilat/movie-bucketlist"},
    { id: "proj3", title: "TicTacToe", 
    description: "Play Tic-Tac-Toe against an AI player",
    skills: ["HTML", "CSS", "Javascript"],
    link: "https://tictactoe-kp.vercel.app/",
    githublink: "https://github.com/krystalpothilat/tictactoe"},
  ];

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

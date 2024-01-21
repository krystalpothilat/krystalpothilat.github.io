import React from "react";
import "./App.css";
import Page from "./Page";
import Navbar from "./Navbar";

import mePic from "./imgs/me.jpg";
import ga from "./imgs/ga-logo.png";
import winc from "./imgs/winc-logo.png";

function App() {
  const profexpdata = [
    { id: 1, title: 'Summer 2024', description: 'Additional info for Item 1.' },
    { id: 2, title: 'Summer 2023', description: 'Additional info for Item 2.' },
  ];

  const leadershipexpdata = [
    { id: 1, title: 'President', description: 'Additional info for Item 1.' },
    { id: 2, title: 'Secretary', description: 'Additional info for Item 2.' },
  ];

  return (
    <div className="App">
      <Navbar/>
      <Page id = "home" mainCookie = {mePic}> </Page>
      <Page id = "profexp" mainCookie = "Professional Experience" info = {profexpdata} logo = {ga}> </Page>
      <Page id = "proj" mainCookie = "Projects" info = "Test"> </Page>
      <Page id = "leadership" mainCookie = "Leadership" info = {leadershipexpdata} logo = {winc}> </Page>
      <Page id = "about" mainCookie = "More About Me" info = "Test"> </Page>
      <Page id = "contact" mainCookie = "Reach out!" info = "Test"> </Page>
    </div>
  );
}

export default App;

import React from "react";
import "./Page.css";
import List from "./List";

function Page({ mainCookie, info, logo }) {

  return (
    <div className="Page">
        <div className = "circle">
        {mainCookie && /\.(jpg|jpeg|png|gif)$/.test(mainCookie) ? (
            <img src={mainCookie} alt="Circle Content" className="profpic" />
        ) : (
            <p className="section-name">{mainCookie}</p>
        )}
        </div>
    
        <div className = "section-info">
            {logo && <img src={logo} alt="Logo" className="logo" />}


            {Array.isArray(info) ? (
                <List data={info} />
            ) : (
                <p className="additional-info">{info}</p>
            )}
        </div>
        
    </div>
  );
}

export default Page;

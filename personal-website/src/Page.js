import React from "react";
import "./Page.css";
import List from "./List";

function Page({ mainCookie, about1, about2, section, info, logo }) {

  return (
    <div className="Page">
        <div className = "header-container">
            <div className = "circle">
                <img src={mainCookie} alt="" className ="pic" />
            </div>
                <p className = "header">{section}</p>
        </div>
    
        <div className = "section-info">
            {about1 && 
                <div id = "mainintro">
                    <h2> hello! I'm Krystal Pothilat</h2>
                    <ul className = "cookiepoints">
                        <li> San Diego, CA</li>
                        <li> B.S. in Computer Science at UC Riverside</li>
                    </ul>
                
                </div>  
            }

            
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

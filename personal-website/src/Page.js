import React from "react";
import "./Page.css";
import List from "./List";

function Page({ mainCookie, about1, about2, section, info, logo }) {

  return (
    <div className="Page">
        <div className = "header-container">
            <div className = "circle">
                <img src={mainCookie} alt="Circle Content" id ="profpic" />
            </div>
            <p className = "header">{section}</p>
        </div>
    
        <div className = "section-info">
            {about1 && 
                <div className = "mainintro">
                    <h2> hello! I'm Krystal Pothilat</h2>
                    <ul className = "cookiepoints">
                        <li> San Diego, CA</li>
                        {/* <li> Software Engineer</li> */}
                        {/* <li> can you tell I like cookies? :D</li> */}
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

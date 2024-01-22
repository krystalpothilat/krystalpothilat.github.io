import React from "react";
import "./Page.css";

function Page({ img, about1, about2, section, info, logo }) {

  return (
    <div className="Page">

        {about1 ? (
        <div className = "mainpage">
            <div className = "circle">
                <img src = {img} alt ="" className = "pic"/>
            </div>
            <div id = "mainintro">
                <h2> hello! I'm Krystal Pothilat</h2>
                <ul className = "cookiepoints">
                    <li> San Diego, CA</li>
                    <li> B.S. in Computer Science at UC Riverside</li>
                </ul>
                </div>
        </div>  
        ) : (
            <div className = "infopage">
                <img src = {img} alt = "" className = "header-banner"/>
                {logo && <img src={logo} alt="Logo" className="logo" />}
                <div className = "info">
                    {Array.isArray(info) && info.map((item) => (
                        <div className = "info-container">
                            <h2 id = "title"> {item.title}</h2>
                            <p id = "desc"> {item.description} </p>
                            {item.bulletpoints && (
                            <ul>
                                {item.bulletpoints.map((bulletpoints, index) => (
                                    <li key={index}>{bulletpoints}</li>
                                ))}
                            </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
        
         {/* <div className = "header-container">
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
        </div>  */}
        
    </div>
  );
}

export default Page;

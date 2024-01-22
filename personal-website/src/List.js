import React, { useState } from 'react';
import downarrow from "./imgs/downarrow.png";
import './List.css';

function List({ data }) {
  const [showInfo, setShowInfo] = useState({});

  const toggleInfo = (itemId) => {
    setShowInfo((prevShowInfo) => ({
      ...prevShowInfo,
      [itemId]: !prevShowInfo[itemId],
    }));
  };

  const getWidth = (skill, fontSize) => {
    const textLength = skill.length;
    const additionalPercentage = textLength * 0.25;
    const calculatedWidth = `calc(${textLength * 20}px + ${additionalPercentage}%)`;
    return calculatedWidth;
  };


  return (
    <div className="List">
      {data.map((item) => (
        <div key={item.id} className={`list-item ${showInfo[item.id] ? 'active' : ''}`}>
          <div className="item-header" onClick={() => toggleInfo(item.id)}>
            <span>{item.title}</span>
            <img
              src={downarrow} 
              alt={showInfo[item.id] ? 'Hide Info' : 'Show Info'}
              className="info-image"
            />
          </div>
          {showInfo[item.id] && (
            <div className="additional-info">
              {item.description && <p>{item.description}</p>}
              {item.bulletpoints && (
                <ul>
                  {item.bulletpoints.map((bulletpoints, index) => (
                    <li key={index}>{bulletpoints}</li>
                  ))}
                </ul>
              )}
              {item.skills && (
                <div className = "skills-container">
                  {item.skills.map((skills, index) => (
                    <div className = "skill-rectangle" style={{ width: getWidth(skills, 25) }}>
                      {skills}
                      </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default List;

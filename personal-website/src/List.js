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
              <p>{item.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default List;

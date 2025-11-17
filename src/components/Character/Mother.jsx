import React from 'react';
import './Mother.css';

const Mother = ({ position, emotion, isHoldingHands }) => {
  return (
    <div
      className={`character mother emotion-${emotion} ${isHoldingHands ? 'holding-hands' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="character-sprite">
        <div className="head"></div>
        <div className="body"></div>
        <div className="arm-left"></div>
        <div className="arm-right"></div>
        <div className="leg-left"></div>
        <div className="leg-right"></div>
      </div>
    </div>
  );
};

export default Mother;

import React from 'react';
import { getByeolAnimation } from '../../systems/stabilitySystem';
import './Byeol.css';

const Byeol = ({ position, stabilityLevel, isHoldingHands, sensoryOverload }) => {
  const animation = getByeolAnimation(stabilityLevel, isHoldingHands);

  return (
    <div
      className={`character byeol animation-${animation} ${sensoryOverload ? 'overloaded' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* 안정도 오라 */}
      <div
        className="stability-aura"
        style={{
          opacity: stabilityLevel / 100,
          backgroundColor: stabilityLevel > 70 ? '#4ade80' : stabilityLevel > 40 ? '#fbbf24' : '#ef4444'
        }}
      ></div>

      <div className="character-sprite">
        <div className="head">
          <div className="headphones"></div>
        </div>
        <div className="body"></div>
        <div className="arm-left"></div>
        <div className="arm-right"></div>
        <div className="leg-left"></div>
        <div className="leg-right"></div>
      </div>
    </div>
  );
};

export default Byeol;

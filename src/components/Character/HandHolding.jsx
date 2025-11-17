import React from 'react';
import './HandHolding.css';

const HandHolding = ({ motherPos, byeolPos, isHolding }) => {
  if (!isHolding) return null;

  // 두 캐릭터 사이의 중간점 계산
  const x1 = motherPos.x + 40; // 어머니 오른손 위치
  const y1 = motherPos.y + 30;
  const x2 = byeolPos.x; // 별이 왼손 위치
  const y2 = byeolPos.y + 28;

  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  return (
    <div
      className="hand-connection"
      style={{
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <div className="connection-line"></div>
    </div>
  );
};

export default HandHolding;

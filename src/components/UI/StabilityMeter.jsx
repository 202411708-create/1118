import React from 'react';
import { getStabilityColor, getStabilityStatus } from '../../systems/stabilitySystem';
import './StabilityMeter.css';

const StabilityMeter = ({ stabilityLevel, visible = true }) => {
  if (!visible) return null;

  const color = getStabilityColor(stabilityLevel);
  const status = getStabilityStatus(stabilityLevel);

  const statusText = {
    calm: '안정',
    stressed: '긴장',
    overwhelmed: '압도됨',
    overload: '과부하'
  };

  return (
    <div className="stability-meter">
      <div className="stability-label">별이 안정도</div>
      <div className="stability-bar-container">
        <div
          className={`stability-bar status-${status}`}
          style={{
            width: `${stabilityLevel}%`,
            backgroundColor: color
          }}
        >
          <div className="stability-shine"></div>
        </div>
      </div>
      <div className="stability-status" style={{ color }}>
        {statusText[status]} ({Math.round(stabilityLevel)}%)
      </div>
    </div>
  );
};

export default StabilityMeter;

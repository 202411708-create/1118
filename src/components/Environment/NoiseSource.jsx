import React from 'react';
import './NoiseSource.css';

const NoiseSource = ({ source, onDeactivate, viewpoint }) => {
  const handleClick = () => {
    if (source.active && onDeactivate) {
      onDeactivate(source.id);
    }
  };

  if (!source.active && viewpoint === 'mother') {
    return null; // 비활성화된 소음원은 어머니 시점에서 보이지 않음
  }

  return (
    <div
      className={`noise-source ${source.active ? 'active' : 'inactive'} viewpoint-${viewpoint}`}
      style={{
        left: `${source.x}px`,
        top: `${source.y}px`,
      }}
      onClick={handleClick}
    >
      <div className="noise-icon">
        {source.type === '기계1' && '⚙️'}
        {source.type === '환풍기' && '🌀'}
        {source.type === '컨베이어' && '📦'}
      </div>

      {source.active && (
        <>
          <div className="noise-wave wave-1"></div>
          <div className="noise-wave wave-2"></div>
          <div className="noise-wave wave-3"></div>
        </>
      )}

      {viewpoint === 'mother' && source.active && (
        <div className="noise-tooltip">클릭하여 비활성화</div>
      )}
    </div>
  );
};

export default NoiseSource;

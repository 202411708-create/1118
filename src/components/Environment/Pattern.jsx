import React, { useState } from 'react';
import useGameStore from '../../systems/gameState';
import './Pattern.css';

const Pattern = ({ pattern }) => {
  const [isObserved, setIsObserved] = useState(false);
  const viewpoint = useGameStore((state) => state.viewpoint);
  const byeolPos = useGameStore((state) => state.characters.byeol.position);
  const addObservedPattern = useGameStore((state) => state.addObservedPattern);
  const observedPatterns = useGameStore((state) => state.characters.byeol.observedPatterns);

  // 이미 관찰된 패턴인지 확인
  const alreadyObserved = observedPatterns.some(p => p.id === pattern.id);

  // 별이가 가까이 있는지 확인
  const distance = Math.sqrt(
    Math.pow(byeolPos.x - pattern.x, 2) + Math.pow(byeolPos.y - pattern.y, 2)
  );
  const isNearby = distance < 80;

  const handleObserve = () => {
    if (viewpoint === 'byeol' && !alreadyObserved && isNearby) {
      setIsObserved(true);
      addObservedPattern(pattern);
    }
  };

  // 어머니 시점에서는 패턴이 희미하게 보임
  if (viewpoint === 'mother') {
    return (
      <div
        className="pattern pattern-hidden"
        style={{
          left: pattern.x,
          top: pattern.y
        }}
      >
        <div className="pattern-shimmer" />
      </div>
    );
  }

  // 별이 시점에서는 패턴이 선명하게 보임
  return (
    <div
      className={`pattern pattern-visible ${alreadyObserved ? 'observed' : ''} ${isNearby ? 'nearby' : ''}`}
      style={{
        left: pattern.x,
        top: pattern.y
      }}
      onClick={handleObserve}
    >
      <div className={`pattern-visual type-${pattern.type}`}>
        {pattern.type === 'geometric' && (
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="30" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="30" cy="30" r="4" fill="currentColor" />
          </svg>
        )}
        {pattern.type === 'star' && (
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path
              d="M30,10 L35,25 L50,25 L38,35 L43,50 L30,40 L17,50 L22,35 L10,25 L25,25 Z"
              fill="currentColor"
            />
          </svg>
        )}
        {pattern.type === 'wave' && (
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path
              d="M5,30 Q15,15 30,30 T55,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M5,40 Q15,25 30,40 T55,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>
        )}
      </div>

      {isNearby && !alreadyObserved && (
        <div className="pattern-hint">클릭하여 관찰</div>
      )}

      {isObserved && !alreadyObserved && (
        <div className="pattern-collected">✓ 패턴 기억됨</div>
      )}
    </div>
  );
};

export default Pattern;

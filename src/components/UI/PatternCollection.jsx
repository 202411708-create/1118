import React, { useState } from 'react';
import useGameStore from '../../systems/gameState';
import './PatternCollection.css';

const PatternCollection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const observedPatterns = useGameStore((state) => state.characters.byeol.observedPatterns);
  const viewpoint = useGameStore((state) => state.viewpoint);

  // 별이 시점일 때만 표시
  if (viewpoint !== 'byeol') {
    return null;
  }

  return (
    <div className={`pattern-collection ${isExpanded ? 'expanded' : ''}`}>
      <div
        className="pattern-collection-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="pattern-count">
          패턴 {observedPatterns.length}개
        </span>
        <span className="expand-icon">{isExpanded ? '▼' : '▲'}</span>
      </div>

      {isExpanded && (
        <div className="pattern-collection-list">
          {observedPatterns.length === 0 ? (
            <div className="pattern-empty">
              아직 관찰한 패턴이 없습니다
            </div>
          ) : (
            observedPatterns.map((pattern) => (
              <div key={pattern.id} className="pattern-item">
                <div className={`pattern-icon type-${pattern.type}`}>
                  {pattern.type === 'geometric' && (
                    <svg width="30" height="30" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="30" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="30" cy="30" r="4" fill="currentColor" />
                    </svg>
                  )}
                  {pattern.type === 'star' && (
                    <svg width="30" height="30" viewBox="0 0 60 60">
                      <path
                        d="M30,10 L35,25 L50,25 L38,35 L43,50 L30,40 L17,50 L22,35 L10,25 L25,25 Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {pattern.type === 'wave' && (
                    <svg width="30" height="30" viewBox="0 0 60 60">
                      <path
                        d="M5,30 Q15,15 30,30 T55,30"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                  )}
                </div>
                <div className="pattern-description">
                  {pattern.description}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PatternCollection;

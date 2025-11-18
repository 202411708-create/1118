import React from 'react';
import useGameStore from '../../systems/gameState';
import './Credits.css';

const Credits = ({ finalMessage }) => {
  const resetGame = useGameStore((state) => state.resetGame);

  const handleRestart = () => {
    resetGame();
  };

  return (
    <div className="credits-overlay">
      <div className="credits-content">
        <div className="final-message">
          {finalMessage || "소통은 이해와 같지 않다"}
        </div>

        <div className="credits-list">
          <h2>Project Star</h2>
          <p className="credits-subtitle">프로젝트 별</p>

          <div className="credits-section">
            <h3>Game Design & Development</h3>
            <p>Claude & User</p>
          </div>

          <div className="credits-section">
            <h3>Story & Narrative</h3>
            <p>An exploration of communication,</p>
            <p>understanding, and unconditional love</p>
          </div>

          <div className="credits-section">
            <h3>Inspiration</h3>
            <p>For all the mothers and their children</p>
            <p>who navigate the world differently</p>
          </div>

          <div className="credits-section">
            <h3>Special Thanks</h3>
            <p>To everyone who plays this game</p>
            <p>and seeks to understand</p>
          </div>
        </div>

        <button className="restart-button" onClick={handleRestart}>
          처음부터 다시 시작
        </button>

        <div className="credits-footer">
          <p>Thank you for playing</p>
          <p>게임을 플레이해 주셔서 감사합니다</p>
        </div>
      </div>
    </div>
  );
};

export default Credits;

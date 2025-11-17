import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return (
      <div className="start-screen">
        <div className="title-container">
          <h1 className="game-title">프로젝트 별</h1>
          <h2 className="game-subtitle">Project Star</h2>
          <p className="game-tagline">소통은 이해와 같지 않다</p>

          <button
            className="start-button"
            onClick={() => setGameStarted(true)}
          >
            게임 시작
          </button>

          <div className="game-info">
            <p>장르: 내러티브 어드벤처 / 퍼즐</p>
            <p>예상 플레이 타임: 25-40분</p>
          </div>
        </div>
      </div>
    );
  }

  return <GameCanvas />;
}

export default App;

import React, { useEffect, useRef, useState } from 'react';
import useGameStore from '../systems/gameState';
import { updateStability } from '../systems/stabilitySystem';
import Mother from './Character/Mother';
import Byeol from './Character/Byeol';
import HandHolding from './Character/HandHolding';
import StabilityMeter from './UI/StabilityMeter';
import DialogueBox from './UI/DialogueBox';
import NoiseSource from './Environment/NoiseSource';
import scenesData from '../data/scenes.json';
import './GameCanvas.css';

const GameCanvas = () => {
  const gameState = useGameStore();
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [keys, setKeys] = useState({});
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  const currentSceneData = scenesData[gameState.currentScene];

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys((prev) => ({ ...prev, [e.key]: true }));

      // 스페이스바로 손잡기 토글
      if (e.key === ' ') {
        e.preventDefault();
        gameState.toggleHandHolding();
      }
    };

    const handleKeyUp = (e) => {
      setKeys((prev) => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // 게임 루프
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // 캐릭터 이동
      updateMovement(deltaTime);

      // 안정도 업데이트
      const stabilityUpdate = updateStability(gameState, deltaTime);
      if (stabilityUpdate.stabilityLevel !== gameState.characters.byeol.stabilityLevel) {
        gameState.updateStabilityLevel(stabilityUpdate.stabilityLevel);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, keys]);

  // 씬 로드 시 환경 설정
  useEffect(() => {
    if (currentSceneData) {
      gameState.updateEnvironment({
        floor: currentSceneData.floor,
        noiseLevel: currentSceneData.environment.noiseLevel,
        lightIntensity: currentSceneData.environment.lightIntensity,
        crowdDensity: currentSceneData.environment.crowdDensity,
        noiseSources: currentSceneData.noiseSources || []
      });

      setCurrentDialogueIndex(0);
    }
  }, [gameState.currentScene]);

  const updateMovement = (deltaTime) => {
    const speed = 150; // pixels per second
    const motherPos = { ...gameState.characters.mother.position };
    const byeolPos = { ...gameState.characters.byeol.position };

    let moved = false;

    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      motherPos.x -= speed * deltaTime;
      moved = true;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      motherPos.x += speed * deltaTime;
      moved = true;
    }
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
      motherPos.y -= speed * deltaTime;
      moved = true;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
      motherPos.y += speed * deltaTime;
      moved = true;
    }

    if (moved) {
      gameState.updateMotherPosition(motherPos);

      // 손을 잡고 있으면 별이도 따라옴
      if (gameState.isHoldingHands) {
        byeolPos.x = motherPos.x + 20;
        byeolPos.y = motherPos.y;
        gameState.updateByeolPosition(byeolPos);
      }
    }
  };

  const handleDialogueComplete = () => {
    if (currentSceneData && currentSceneData.dialogues) {
      if (currentDialogueIndex < currentSceneData.dialogues.length - 1) {
        setCurrentDialogueIndex(currentDialogueIndex + 1);
      } else {
        setCurrentDialogueIndex(-1); // 대화 종료
      }
    }
  };

  const handleNoiseDeactivate = (sourceId) => {
    gameState.removeNoiseSource(sourceId);

    // 모든 소음원이 제거되었는지 확인
    const remainingSources = gameState.environment.noiseSources.filter(s => s.active && s.id !== sourceId);
    if (remainingSources.length === 0) {
      // 다음 씬으로 이동
      if (currentSceneData.nextScene) {
        setTimeout(() => {
          gameState.changeScene(currentSceneData.nextScene);
        }, 1000);
      }
    }
  };

  const getBackgroundStyle = () => {
    const floor = currentSceneData?.floor || -5;
    let backgroundColor;

    if (floor < 0) {
      backgroundColor = '#1a1a2e'; // 어두운 지하
    } else if (floor < 50) {
      backgroundColor = '#2d3748'; // 하층
    } else if (floor < 100) {
      backgroundColor = '#4a5568'; // 중층
    } else {
      backgroundColor = '#0f1419'; // 마천루 (밤하늘)
    }

    // 별이 시점에서는 색상 과포화
    if (gameState.viewpoint === 'byeol' && gameState.characters.byeol.sensoryOverload) {
      return {
        backgroundColor,
        filter: 'saturate(150%) contrast(120%)'
      };
    }

    return { backgroundColor };
  };

  return (
    <div className="game-canvas" style={getBackgroundStyle()}>
      {/* 바닥 층수 표시 */}
      <div className="floor-indicator">
        {currentSceneData?.floor}층
      </div>

      {/* 캐릭터들 */}
      <Mother
        position={gameState.characters.mother.position}
        emotion={gameState.characters.mother.emotion}
        isHoldingHands={gameState.isHoldingHands}
      />

      <Byeol
        position={gameState.characters.byeol.position}
        stabilityLevel={gameState.characters.byeol.stabilityLevel}
        isHoldingHands={gameState.isHoldingHands}
        sensoryOverload={gameState.characters.byeol.sensoryOverload}
      />

      {/* 손잡기 시각화 */}
      <HandHolding
        motherPos={gameState.characters.mother.position}
        byeolPos={gameState.characters.byeol.position}
        isHolding={gameState.isHoldingHands}
      />

      {/* 소음원들 */}
      {gameState.environment.noiseSources.map((source) => (
        <NoiseSource
          key={source.id}
          source={source}
          onDeactivate={handleNoiseDeactivate}
          viewpoint={gameState.viewpoint}
        />
      ))}

      {/* UI */}
      <StabilityMeter
        stabilityLevel={gameState.characters.byeol.stabilityLevel}
        visible={true}
      />

      {/* 대화창 */}
      {currentDialogueIndex >= 0 && currentSceneData?.dialogues?.[currentDialogueIndex] && (
        <DialogueBox
          dialogue={currentSceneData.dialogues[currentDialogueIndex]}
          onComplete={handleDialogueComplete}
          viewpoint={gameState.viewpoint}
        />
      )}

      {/* 컨트롤 힌트 */}
      <div className="controls-hint">
        <div>이동: 방향키 또는 WASD</div>
        <div>손잡기/놓기: 스페이스바</div>
      </div>

      {/* 씬 제목 */}
      {currentSceneData && (
        <div className="scene-title">
          {currentSceneData.title}
        </div>
      )}
    </div>
  );
};

export default GameCanvas;

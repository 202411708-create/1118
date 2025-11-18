import React, { useEffect, useRef, useState } from 'react';
import useGameStore from '../systems/gameState';
import { updateStability } from '../systems/stabilitySystem';
import Mother from './Character/Mother';
import Byeol from './Character/Byeol';
import HandHolding from './Character/HandHolding';
import StabilityMeter from './UI/StabilityMeter';
import DialogueBox from './UI/DialogueBox';
import ChoicePanel from './UI/ChoicePanel';
import PatternCollection from './UI/PatternCollection';
import NoiseSource from './Environment/NoiseSource';
import Pattern from './Environment/Pattern';
import scenesData from '../data/scenes.json';
import { debug } from '../utils/debug';
import './GameCanvas.css';

const GameCanvas = () => {
  const currentScene = useGameStore((state) => state.currentScene);
  const gameState = useGameStore();
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const keysRef = useRef({}); // state → ref
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  const currentSceneData = scenesData[currentScene];

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true; // ref 사용

      // 스페이스바로 손잡기 토글
      if (e.key === ' ') {
        e.preventDefault();
        useGameStore.getState().toggleHandHolding(); // getState() 사용
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false; // ref 사용
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // 빈 의존성

  // 게임 루프
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const state = useGameStore.getState(); // 최신 상태
      const keys = keysRef.current; // ref에서 가져오기

      // 캐릭터 이동
      const speed = 150;
      const motherPos = { ...state.characters.mother.position };
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
        state.updateMotherPosition(motherPos);

        // 손을 잡고 있으면 별이도 따라옴
        if (state.isHoldingHands) {
          const byeolPos = {
            x: motherPos.x + 20,
            y: motherPos.y
          };
          state.updateByeolPosition(byeolPos);
        }
      }

      // 안정도 업데이트
      const stabilityUpdate = updateStability(state, deltaTime);
      if (stabilityUpdate.stabilityLevel !== state.characters.byeol.stabilityLevel) {
        state.updateStabilityLevel(stabilityUpdate.stabilityLevel);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // 빈 의존성 - 한 번만 실행

  // 씬 로드 시 환경 설정
  useEffect(() => {
    debug.log('씬 로드:', currentScene);

    if (currentSceneData) {
      const newNoiseSources = currentSceneData.noiseSources || [];
      debug.log(`소음원 ${newNoiseSources.length}개 로드`);

      gameState.updateEnvironment({
        floor: currentSceneData.floor,
        noiseLevel: currentSceneData.environment.noiseLevel,
        lightIntensity: currentSceneData.environment.lightIntensity,
        crowdDensity: currentSceneData.environment.crowdDensity,
        noiseSources: newNoiseSources
      });

      // 씬의 viewpoint 설정 적용
      if (currentSceneData.viewpoint && currentSceneData.viewpoint !== gameState.viewpoint) {
        debug.log(`시점 전환: ${gameState.viewpoint} → ${currentSceneData.viewpoint}`);
        gameState.switchViewpoint(currentSceneData.viewpoint);
      }

      setCurrentDialogueIndex(0);
    }
  }, [currentScene]);

  const handleDialogueComplete = () => {
    if (currentSceneData && currentSceneData.dialogues) {
      if (currentDialogueIndex < currentSceneData.dialogues.length - 1) {
        setCurrentDialogueIndex(currentDialogueIndex + 1);
      } else {
        setCurrentDialogueIndex(-1); // 대화 종료

        // 대화가 끝난 후 시점 전환 처리
        if (currentSceneData.viewpointSwitch && currentSceneData.viewpointSwitch.afterDialogue) {
          const newViewpoint = currentSceneData.viewpointSwitch.to;
          debug.log(`대화 종료 후 시점 전환: ${gameState.viewpoint} → ${newViewpoint}`);
          setTimeout(() => {
            gameState.switchViewpoint(newViewpoint);
          }, 500);
        }

        // 대화가 끝나고 선택지가 없으면 자동으로 다음 씬으로
        if (!currentSceneData.choices && currentSceneData.nextScene) {
          setTimeout(() => {
            gameState.changeScene(currentSceneData.nextScene);
          }, 1000);
        }
      }
    }
  };

  const handleChoice = (choice) => {
    if (choice.nextScene) {
      gameState.changeScene(choice.nextScene);
    }
  };

  const handleNoiseDeactivate = (sourceId) => {
    const remainingAfterRemoval = gameState.environment.noiseSources.filter(s => s.id !== sourceId);
    debug.log(`소음원 제거: ${sourceId}, 남은 개수: ${remainingAfterRemoval.length}`);

    gameState.removeNoiseSource(sourceId);

    if (remainingAfterRemoval.length === 0) {
      debug.log('모든 소음원 제거 완료! 다음 씬으로 이동');
      if (currentSceneData?.nextScene) {
        setTimeout(() => {
          gameState.changeScene(currentSceneData.nextScene);
        }, 1500);
      }
    }
  };

  const getBackgroundStyle = () => {
    const floor = currentSceneData?.floor || -5;
    let backgroundColor;

    if (floor < 0) {
      backgroundColor = '#3a3a52'; // 밝게 조정한 지하
    } else if (floor < 50) {
      backgroundColor = '#4a5568'; // 하층
    } else if (floor < 100) {
      backgroundColor = '#5a6778'; // 중층
    } else {
      backgroundColor = '#1a2332'; // 마천루 (밤하늘)
    }

    // 별이 시점에서는 다른 시각 처리
    if (gameState.viewpoint === 'byeol') {
      if (gameState.characters.byeol.sensoryOverload) {
        // 감각 과부하: 과포화 + 높은 대비
        return {
          backgroundColor,
          filter: 'saturate(150%) contrast(120%) brightness(1.1)',
          transition: 'filter 0.5s ease'
        };
      } else {
        // 평온한 상태: 약간의 색상 강조 (패턴 인식을 위해)
        return {
          backgroundColor,
          filter: 'saturate(120%) brightness(1.05)',
          transition: 'filter 0.5s ease'
        };
      }
    }

    return {
      backgroundColor,
      transition: 'background-color 0.5s ease'
    };
  };

  return (
    <div
      className="game-canvas"
      style={getBackgroundStyle()}
      data-viewpoint={gameState.viewpoint}
      data-special={currentSceneData?.environment?.special}
    >
      {/* 바닥 층수 표시 */}
      <div className="floor-indicator">
        {currentSceneData?.floor}층
      </div>

      {/* 시점 표시 */}
      <div className="viewpoint-indicator">
        {gameState.viewpoint === 'mother' ? '어머니 시점' : '별이 시점'}
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

      {/* 패턴들 */}
      {currentSceneData?.patterns?.map((pattern) => (
        <Pattern
          key={pattern.id}
          pattern={pattern}
        />
      ))}

      {/* UI */}
      <StabilityMeter
        stabilityLevel={gameState.characters.byeol.stabilityLevel}
        visible={true}
      />

      {/* 패턴 수집 목록 */}
      <PatternCollection />

      {/* 대화창 */}
      {currentDialogueIndex >= 0 && currentSceneData?.dialogues?.[currentDialogueIndex] && (
        <DialogueBox
          dialogue={currentSceneData.dialogues[currentDialogueIndex]}
          onComplete={handleDialogueComplete}
          viewpoint={gameState.viewpoint}
        />
      )}

      {/* 선택지 */}
      {currentDialogueIndex === -1 && currentSceneData?.choices && (
        <ChoicePanel
          choices={currentSceneData.choices}
          onChoice={handleChoice}
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

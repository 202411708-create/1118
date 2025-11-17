/**
 * 안정도 시스템 - 별이의 감각 상태를 계산하고 업데이트
 */

export const calculateStabilityChange = (gameState, deltaTime) => {
  const { environment, isHoldingHands, characters } = gameState;
  const { byeol } = characters;

  let stabilityChange = 0;

  // 부정적 요소들
  if (environment.noiseLevel > 50) {
    stabilityChange -= (environment.noiseLevel - 50) * 0.1;
  }

  if (environment.lightIntensity > 70) {
    stabilityChange -= (environment.lightIntensity - 70) * 0.05;
  }

  if (environment.crowdDensity > 30) {
    stabilityChange -= environment.crowdDensity * 0.08;
  }

  // 소음원들의 영향
  environment.noiseSources.forEach(source => {
    if (source.active) {
      const distance = calculateDistance(byeol.position, source);
      const impact = Math.max(0, 50 - distance) * 0.2;
      stabilityChange -= impact;
    }
  });

  // 긍정적 요소들
  if (isHoldingHands) {
    stabilityChange += 5;
  }

  if (byeol.observingPattern) {
    stabilityChange += 3; // 패턴 관찰 시 안정감
  }

  // 자연 회복 (안정적인 환경에서)
  if (environment.noiseLevel < 30 && environment.lightIntensity < 60 && environment.crowdDensity < 20) {
    stabilityChange += 2;
  }

  return stabilityChange * deltaTime;
};

export const updateStability = (gameState, deltaTime) => {
  const change = calculateStabilityChange(gameState, deltaTime);
  const newLevel = Math.max(0, Math.min(100, gameState.characters.byeol.stabilityLevel + change));

  return {
    stabilityLevel: newLevel,
    sensoryOverload: newLevel < 30,
    recovering: newLevel > 60 && change > 0
  };
};

export const getStabilityColor = (stabilityLevel) => {
  if (stabilityLevel > 70) return '#4ade80'; // 초록
  if (stabilityLevel > 40) return '#fbbf24'; // 노랑
  return '#ef4444'; // 빨강
};

export const getStabilityStatus = (stabilityLevel) => {
  if (stabilityLevel > 70) return 'calm';
  if (stabilityLevel > 40) return 'stressed';
  if (stabilityLevel > 20) return 'overwhelmed';
  return 'overload';
};

const calculateDistance = (pos1, pos2) => {
  const dx = pos1.x - (pos2.x || 0);
  const dy = pos1.y - (pos2.y || 0);
  return Math.sqrt(dx * dx + dy * dy);
};

export const getByeolAnimation = (stabilityLevel, isHoldingHands) => {
  if (stabilityLevel < 30) {
    return 'crouching'; // 웅크림
  }
  if (stabilityLevel < 50) {
    return 'covering-ears'; // 귀를 막음
  }
  if (isHoldingHands) {
    return 'walking-held'; // 손잡고 걷기
  }
  return 'walking-free'; // 자유롭게 걷기
};

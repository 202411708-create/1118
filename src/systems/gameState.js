import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    // 현재 진행 상태
    currentChapter: 0,
    currentScene: "0-1",
    viewpoint: "mother", // "mother" | "byeol"

    // 캐릭터 상태
    characters: {
      mother: {
        position: { x: 100, y: 300 },
        emotion: "determined",
        velocity: { x: 0, y: 0 }
      },
      byeol: {
        position: { x: 120, y: 300 },
        stabilityLevel: 100, // 0-100
        sensoryOverload: false,
        observedPatterns: [],
        velocity: { x: 0, y: 0 }
      }
    },

    // 손잡기 상태
    isHoldingHands: true,

    // 환경 상태
    environment: {
      floor: -5,
      noiseLevel: 0,
      lightIntensity: 50,
      crowdDensity: 0,
      noiseSources: []
    },

    // 진행 상태
    progress: {
      completedScenes: [],
      unlockedMechanics: ["handHolding"],
      discoveredPatterns: []
    },

    // 게임 설정
    settings: {
      colorBlindMode: false,
      textSize: "medium",
      highContrast: false,
      subtitles: true,
      visualSoundCues: true,
      audioDescriptions: false,
      autoProgress: false,
      simplifiedControls: false,
      pauseAnytime: true
    },

    // Actions
    toggleHandHolding: () => set((state) => ({
      isHoldingHands: !state.isHoldingHands
    })),

    updateMotherPosition: (position) => set((state) => ({
      characters: {
        ...state.characters,
        mother: {
          ...state.characters.mother,
          position: { ...state.characters.mother.position, ...position }
        }
      }
    })),

    updateByeolPosition: (position) => set((state) => ({
      characters: {
        ...state.characters,
        byeol: {
          ...state.characters.byeol,
          position: { ...state.characters.byeol.position, ...position }
        }
      }
    })),

    updateStabilityLevel: (level) => set((state) => ({
      characters: {
        ...state.characters,
        byeol: {
          ...state.characters.byeol,
          stabilityLevel: Math.max(0, Math.min(100, level)),
          sensoryOverload: level < 30
        }
      }
    })),

    updateEnvironment: (updates) => set((state) => ({
      environment: {
        ...state.environment,
        ...updates
      }
    })),

    switchViewpoint: (newViewpoint) => set({ viewpoint: newViewpoint }),

    changeScene: (scene) => set((state) => ({
      currentScene: scene,
      progress: {
        ...state.progress,
        completedScenes: state.progress.completedScenes.includes(state.currentScene)
          ? state.progress.completedScenes
          : [...state.progress.completedScenes, state.currentScene]
      }
    })),

    addNoiseSource: (source) => set((state) => ({
      environment: {
        ...state.environment,
        noiseSources: [...state.environment.noiseSources, source]
      }
    })),

    removeNoiseSource: (id) => set((state) => ({
      environment: {
        ...state.environment,
        noiseSources: state.environment.noiseSources.filter(s => s.id !== id)
      }
    })),

    addObservedPattern: (pattern) => set((state) => ({
      characters: {
        ...state.characters,
        byeol: {
          ...state.characters.byeol,
          observedPatterns: [...state.characters.byeol.observedPatterns, pattern]
        }
      }
    })),

    updateSettings: (newSettings) => set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings
      }
    })),

    resetGame: () => set({
      currentChapter: 0,
      currentScene: "0-1",
      viewpoint: "mother",
      characters: {
        mother: {
          position: { x: 100, y: 300 },
          emotion: "determined",
          velocity: { x: 0, y: 0 }
        },
        byeol: {
          position: { x: 120, y: 300 },
          stabilityLevel: 100,
          sensoryOverload: false,
          observedPatterns: [],
          velocity: { x: 0, y: 0 }
        }
      },
      isHoldingHands: true,
      environment: {
        floor: -5,
        noiseLevel: 0,
        lightIntensity: 50,
        crowdDensity: 0,
        noiseSources: []
      },
      progress: {
        completedScenes: [],
        unlockedMechanics: ["handHolding"],
        discoveredPatterns: []
      }
    })
  }))
);

export default useGameStore;

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
        emotion: "determined"
      },
      byeol: {
        position: { x: 120, y: 300 },
        stabilityLevel: 100,
        sensoryOverload: false,
        observedPatterns: []
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

    resetGame: () => set({
      currentChapter: 0,
      currentScene: "0-1",
      viewpoint: "mother",
      characters: {
        mother: {
          position: { x: 100, y: 300 },
          emotion: "determined"
        },
        byeol: {
          position: { x: 120, y: 300 },
          stabilityLevel: 100,
          sensoryOverload: false,
          observedPatterns: []
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

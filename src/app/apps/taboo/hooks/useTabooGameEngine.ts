"use client";

import { useReducer, useEffect, useCallback } from 'react';
import { getNewTabooWord, type SelectedCategories } from '@/lib/tabooWords';
import type { Team } from '@/hooks/useGameEngine';

export type Player = Team;

export interface TabooGameSettings {
  roundTime: number;
  skipLimit: number;
  winningScore: number;
  categories: SelectedCategories;
}

export interface TabooGameState {
  status: 'setup' | 'turn_start' | 'playing' | 'round_end' | 'game_over';
  players: Player[];
  settings: TabooGameSettings;
  currentTurn: {
    describerIndex: number;
  };
  currentRound: {
    word: string;
    tabooWords: string[];
    category: string;
    subCategory: string;
    skipsUsed: number;
    wordRevealed: boolean;
    violations: number;
  };
  roundWinner: Player | null;
  usedWords: string[];
}

type GameAction =
  | { type: 'START_GAME'; players: string[]; settings: TabooGameSettings }
  | { type: 'START_ROUND' }
  | { type: 'REVEAL_WORD' }
  | { type: 'CORRECT_GUESS' }
  | { type: 'TABOO_VIOLATION' }
  | { type: 'SKIP_WORD' }
  | { type: 'TIME_UP' }
  | { type: 'FORFEIT_ROUND' }
  | { type: 'RESET_GAME' }
  | { type: 'ADVANCE_TURN' }
  | { type: 'FORCE_GAME_OVER' }
  | { type: 'LOAD_STATE'; state: TabooGameState };

const initialState: TabooGameState = {
  status: 'setup',
  players: [],
  settings: {
    roundTime: 60,
    skipLimit: 3,
    winningScore: 20,
    categories: {},
  },
  currentTurn: {
    describerIndex: 0,
  },
  currentRound: {
    word: '',
    tabooWords: [],
    category: '',
    subCategory: '',
    skipsUsed: 0,
    wordRevealed: false,
    violations: 0,
  },
  roundWinner: null,
  usedWords: [],
};

function gameReducer(state: TabooGameState, action: GameAction): TabooGameState {
  switch (action.type) {
    case 'LOAD_STATE':
        return action.state;

    case 'START_GAME': {
      const { players, settings } = action;
      const newWordData = getNewTabooWord([], settings.categories);

      if (!newWordData) {
        return state;
      }

      return {
        ...initialState,
        status: 'turn_start',
        players: players.map((name, i) => ({ id: i, name, score: 0 })),
        settings,
        currentRound: {
            ...initialState.currentRound,
            word: newWordData.word,
            tabooWords: newWordData.tabooWords,
            category: newWordData.category,
            subCategory: newWordData.subCategory,
        },
        usedWords: [newWordData.word],
      };
    }

    case 'START_ROUND':
        return {
            ...state,
            status: 'playing',
            currentRound: {
                ...state.currentRound,
                wordRevealed: false,
            },
            roundWinner: null,
        }

    case 'REVEAL_WORD':
        return {
            ...state,
            currentRound: {
                ...state.currentRound,
                wordRevealed: true,
            }
        }

    case 'CORRECT_GUESS': {
      const newPlayers = [...state.players];
      const describer = newPlayers[state.currentTurn.describerIndex];
      describer.score += 1;

      const winner = newPlayers.find(p => p.score >= state.settings.winningScore);

      return {
        ...state,
        players: newPlayers,
        status: winner ? 'game_over' : 'round_end',
        roundWinner: describer,
      };
    }

    case 'TABOO_VIOLATION': {
      // Check if we've exceeded skip limit
      if (state.currentRound.skipsUsed >= state.settings.skipLimit) {
        // No more skips available, end round with no points
        return {
          ...state,
          status: 'round_end',
          roundWinner: null,
          currentRound: {
            ...state.currentRound,
            violations: state.currentRound.violations + 1,
          }
        };
      }

      // Get new word (violation counts as a skip)
      const newWordData = getNewTabooWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        currentRound: {
          word: newWordData.word,
          tabooWords: newWordData.tabooWords,
          category: newWordData.category,
          subCategory: newWordData.subCategory,
          skipsUsed: state.currentRound.skipsUsed + 1,
          wordRevealed: true,
          violations: state.currentRound.violations + 1,
        },
        usedWords: [...state.usedWords, newWordData.word],
      };
    }

    case 'SKIP_WORD': {
      if (state.currentRound.skipsUsed >= state.settings.skipLimit) return state;

      const newWordData = getNewTabooWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        currentRound: {
          word: newWordData.word,
          tabooWords: newWordData.tabooWords,
          category: newWordData.category,
          subCategory: newWordData.subCategory,
          skipsUsed: state.currentRound.skipsUsed + 1,
          wordRevealed: true,
          violations: state.currentRound.violations,
        },
        usedWords: [...state.usedWords, newWordData.word],
      };
    }

    case 'TIME_UP': {
      return {
        ...state,
        status: 'round_end',
        roundWinner: null,
      };
    }

    case 'FORFEIT_ROUND': {
      const nextDescriberIndex = (state.currentTurn.describerIndex + 1) % state.players.length;
      const newWordData = getNewTabooWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        status: 'turn_start',
        roundWinner: null,
        currentTurn: {
            describerIndex: nextDescriberIndex,
        },
        currentRound: {
            word: newWordData.word,
            tabooWords: newWordData.tabooWords,
            category: newWordData.category,
            subCategory: newWordData.subCategory,
            skipsUsed: 0,
            wordRevealed: false,
            violations: 0,
        },
        usedWords: [...state.usedWords, newWordData.word],
      };
    }

    case 'ADVANCE_TURN': {
      const nextDescriberIndex = (state.currentTurn.describerIndex + 1) % state.players.length;
      const newWordData = getNewTabooWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        status: 'turn_start',
        roundWinner: null,
        currentTurn: {
            describerIndex: nextDescriberIndex,
        },
        currentRound: {
            word: newWordData.word,
            tabooWords: newWordData.tabooWords,
            category: newWordData.category,
            subCategory: newWordData.subCategory,
            skipsUsed: 0,
            wordRevealed: false,
            violations: 0,
        },
        usedWords: [...state.usedWords, newWordData.word],
      };
    }

    case 'FORCE_GAME_OVER': {
        return {
            ...state,
            status: 'game_over',
        }
    }

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
}

const STORAGE_KEY = 'taboo_game_state';

export function useTabooGameEngine() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.status && parsed.players) {
            dispatch({ type: 'LOAD_STATE', state: parsed });
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (state.status !== 'setup') {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  const gameDispatch = useCallback((action: GameAction) => {
    dispatch(action);
  }, []);

  return { gameState: state, dispatch: gameDispatch };
}

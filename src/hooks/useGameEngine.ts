"use client";

import { useReducer, useEffect, useCallback } from 'react';
import { getNewWord } from '@/lib/words';

export interface Team {
  id: number;
  name: string;
  score: number;
}

export interface GameSettings {
  roundTime: number;
  skipLimit: number;
  winningScore: number;
  categories: string[];
}

export interface GameState {
  status: 'setup' | 'turn_start' | 'playing' | 'round_end' | 'game_over';
  teams: Team[];
  settings: GameSettings;
  currentTurn: {
    teamIndex: number;
  };
  currentRound: {
    word: string;
    category: string;
    skipsUsed: number;
    wordRevealed: boolean;
  };
  roundWinner: Team | null;
  usedWords: string[];
  customWords: string[];
}

type GameAction =
  | { type: 'START_GAME'; teams: string[]; settings: GameSettings, customWords: string[] }
  | { type: 'START_ROUND' }
  | { type: 'REVEAL_WORD' }
  | { type: 'CORRECT_GUESS' }
  | { type: 'SKIP_WORD' }
  | { type: 'TIME_UP' }
  | { type: 'RESET_GAME' }
  | { type: 'ADVANCE_TURN' }
  | { type: 'FORCE_GAME_OVER' }
  | { type: 'LOAD_STATE'; state: GameState };

const initialState: GameState = {
  status: 'setup',
  teams: [],
  settings: {
    roundTime: 60,
    skipLimit: 3,
    winningScore: 50,
    categories: [],
  },
  currentTurn: {
    teamIndex: 0,
  },
  currentRound: {
    word: '',
    category: '',
    skipsUsed: 0,
    wordRevealed: false,
  },
  roundWinner: null,
  usedWords: [],
  customWords: [],
};

function getCustomWord(customWords: string[], usedWords: string[]): { word: string; category: string } | null {
    const availableWords = customWords.filter(word => !usedWords.includes(word));
    if (availableWords.length === 0) return null;
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    return { word, category: 'Custom' };
}


function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_STATE':
        return action.state;

    case 'START_GAME': {
      const { teams, settings, customWords } = action;
      const newWordData = customWords.length > 0 
        ? getCustomWord(customWords, []) 
        : getNewWord([], settings.categories);
        
      if (!newWordData) {
        // This should not happen if categories are selected or custom words are provided
        return state;
      }

      return {
        ...initialState,
        status: 'turn_start',
        teams: teams.map((name, i) => ({ id: i, name, score: 0 })),
        settings,
        customWords,
        currentRound: {
            ...initialState.currentRound,
            word: newWordData.word,
            category: newWordData.category,
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
      const newTeams = [...state.teams];
      newTeams[state.currentTurn.teamIndex].score += 10;
      const winner = newTeams.find(team => team.score >= state.settings.winningScore);
      
      return {
        ...state,
        teams: newTeams,
        status: winner ? 'game_over' : 'round_end',
        roundWinner: state.teams[state.currentTurn.teamIndex],
      };
    }

    case 'SKIP_WORD': {
      if (state.currentRound.skipsUsed >= state.settings.skipLimit) return state;
      
      const newWordData = state.customWords.length > 0
        ? getCustomWord(state.customWords, state.usedWords)
        : getNewWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        // No more words available
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          word: newWordData.word,
          category: newWordData.category,
          skipsUsed: state.currentRound.skipsUsed + 1,
          wordRevealed: true, // Auto-reveal on skip
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

    case 'ADVANCE_TURN': {
      const nextTeamIndex = (state.currentTurn.teamIndex + 1) % state.teams.length;
      const newWordData = state.customWords.length > 0
        ? getCustomWord(state.customWords, state.usedWords)
        : getNewWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        status: 'turn_start',
        roundWinner: null,
        currentTurn: {
            teamIndex: nextTeamIndex,
        },
        currentRound: {
            word: newWordData.word,
            category: newWordData.category,
            skipsUsed: 0,
            wordRevealed: false,
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

const STORAGE_KEY = 'pictogame_master_state';

export function useGameEngine() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        dispatch({ type: 'LOAD_STATE', state: JSON.parse(savedState) });
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

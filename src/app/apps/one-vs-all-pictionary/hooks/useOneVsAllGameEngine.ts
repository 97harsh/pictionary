"use client";

import { useReducer, useEffect, useCallback } from 'react';
import { getNewWord, type SelectedCategories } from '@/lib/words';
import type { Team } from '@/hooks/useGameEngine';

export type Player = Team;

export interface OneVsAllGameSettings {
  roundTime: number;
  skipLimit: number;
  totalRounds: number;
  playUntilWinner: boolean;
  categories: SelectedCategories;
  penalizeDrawer: boolean;
}

export interface OneVsAllGameState {
  status: 'setup' | 'turn_start' | 'playing' | 'guesser_selection' | 'round_end' | 'game_over';
  players: Player[];
  settings: OneVsAllGameSettings;
  currentTurn: {
    drawerIndex: number;
    roundNumber: number;
  };
  currentRound: {
    word: string;
    category: string;
    subCategory: string;
    skipsUsed: number;
    wordRevealed: boolean;
    correctGuesserId: number | null;
    anyoneGuessed: boolean;
  };
  roundWinner: Player | null;
  usedWords: string[];
}

type GameAction =
  | { type: 'START_GAME'; players: string[]; settings: OneVsAllGameSettings }
  | { type: 'START_ROUND' }
  | { type: 'REVEAL_WORD' }
  | { type: 'CORRECT_GUESS' }
  | { type: 'GUESSER_SELECTED'; guesserId: number }
  | { type: 'NO_ONE_GUESSED' }
  | { type: 'SKIP_WORD' }
  | { type: 'TIME_UP' }
  | { type: 'FORFEIT_ROUND' }
  | { type: 'RESET_GAME' }
  | { type: 'ADVANCE_TURN' }
  | { type: 'FORCE_GAME_OVER' }
  | { type: 'LOAD_STATE'; state: OneVsAllGameState };

const initialState: OneVsAllGameState = {
  status: 'setup',
  players: [],
  settings: {
    roundTime: 60,
    skipLimit: 3,
    totalRounds: 5,
    playUntilWinner: false,
    categories: {},
    penalizeDrawer: true,
  },
  currentTurn: {
    drawerIndex: 0,
    roundNumber: 1,
  },
  currentRound: {
    word: '',
    category: '',
    subCategory: '',
    skipsUsed: 0,
    wordRevealed: false,
    correctGuesserId: null,
    anyoneGuessed: false,
  },
  roundWinner: null,
  usedWords: [],
};

function gameReducer(state: OneVsAllGameState, action: GameAction): OneVsAllGameState {
  switch (action.type) {
    case 'LOAD_STATE':
        return action.state;

    case 'START_GAME': {
      const { players, settings } = action;
      const newWordData = getNewWord([], settings.categories);

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
      return {
        ...state,
        status: 'guesser_selection',
      };
    }

    case 'GUESSER_SELECTED': {
      const newPlayers = [...state.players];
      const guesser = newPlayers.find(p => p.id === action.guesserId)!;
      guesser.score += 1;

      return {
        ...state,
        players: newPlayers,
        status: 'round_end',
        roundWinner: guesser,
        currentRound: {
          ...state.currentRound,
          correctGuesserId: action.guesserId,
          anyoneGuessed: true,
        },
      };
    }

    case 'NO_ONE_GUESSED': {
      const newPlayers = [...state.players];

      if (state.settings.penalizeDrawer) {
        const drawer = newPlayers[state.currentTurn.drawerIndex];
        drawer.score = Math.max(0, drawer.score - 0.5);
      }

      return {
        ...state,
        players: newPlayers,
        status: 'round_end',
        roundWinner: null,
        currentRound: {
          ...state.currentRound,
          anyoneGuessed: false,
        },
      };
    }

    case 'SKIP_WORD': {
      if (state.currentRound.skipsUsed >= state.settings.skipLimit) return state;

      const newWordData = getNewWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          word: newWordData.word,
          category: newWordData.category,
          subCategory: newWordData.subCategory,
          skipsUsed: state.currentRound.skipsUsed + 1,
          wordRevealed: true,
        },
        usedWords: [...state.usedWords, newWordData.word],
      };
    }

    case 'TIME_UP': {
      const newPlayers = [...state.players];

      if (!state.currentRound.anyoneGuessed && state.settings.penalizeDrawer) {
        const drawer = newPlayers[state.currentTurn.drawerIndex];
        drawer.score = Math.max(0, drawer.score - 0.5);
      }

      return {
        ...state,
        players: newPlayers,
        status: 'round_end',
        roundWinner: null,
      };
    }

    case 'FORFEIT_ROUND': {
      const nextDrawerIndex = (state.currentTurn.drawerIndex + 1) % state.players.length;
      const isNewRound = nextDrawerIndex === 0;
      const nextRoundNumber = isNewRound ? state.currentTurn.roundNumber + 1 : state.currentTurn.roundNumber;

      // Check if we've completed all rounds
      const roundsComplete = state.settings.totalRounds > 0 && nextRoundNumber > state.settings.totalRounds;

      if (roundsComplete) {
        // Check for tiebreaker logic
        if (state.settings.playUntilWinner) {
          const maxScore = Math.max(...state.players.map(p => p.score));
          const winners = state.players.filter(p => p.score === maxScore);

          // If there's a tie, continue playing
          if (winners.length > 1) {
            const newWordData = getNewWord(state.usedWords, state.settings.categories);

            if (!newWordData) {
              return { ...state, status: 'game_over' };
            }

            return {
              ...state,
              status: 'turn_start',
              roundWinner: null,
              currentTurn: {
                drawerIndex: 0, // Start from first drawer for fair tiebreaker
                roundNumber: nextRoundNumber,
              },
              currentRound: {
                word: newWordData.word,
                category: newWordData.category,
                subCategory: newWordData.subCategory,
                skipsUsed: 0,
                wordRevealed: false,
                correctGuesserId: null,
                anyoneGuessed: false,
              },
              usedWords: [...state.usedWords, newWordData.word],
            };
          }
        }

        // No tiebreaker or clear winner - end game
        return { ...state, status: 'game_over' };
      }

      const newWordData = getNewWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        status: 'turn_start',
        roundWinner: null,
        currentTurn: {
            drawerIndex: nextDrawerIndex,
            roundNumber: nextRoundNumber,
        },
        currentRound: {
            word: newWordData.word,
            category: newWordData.category,
            subCategory: newWordData.subCategory,
            skipsUsed: 0,
            wordRevealed: false,
            correctGuesserId: null,
            anyoneGuessed: false,
        },
        usedWords: [...state.usedWords, newWordData.word],
      };
    }

    case 'ADVANCE_TURN': {
      const nextDrawerIndex = (state.currentTurn.drawerIndex + 1) % state.players.length;
      const isNewRound = nextDrawerIndex === 0;
      const nextRoundNumber = isNewRound ? state.currentTurn.roundNumber + 1 : state.currentTurn.roundNumber;

      // Check if we've completed all rounds
      const roundsComplete = state.settings.totalRounds > 0 && nextRoundNumber > state.settings.totalRounds;

      if (roundsComplete) {
        // Check for tiebreaker logic
        if (state.settings.playUntilWinner) {
          const maxScore = Math.max(...state.players.map(p => p.score));
          const winners = state.players.filter(p => p.score === maxScore);

          // If there's a tie, continue playing
          if (winners.length > 1) {
            const newWordData = getNewWord(state.usedWords, state.settings.categories);

            if (!newWordData) {
              return { ...state, status: 'game_over' };
            }

            return {
              ...state,
              status: 'turn_start',
              roundWinner: null,
              currentTurn: {
                drawerIndex: 0, // Start from first drawer for fair tiebreaker
                roundNumber: nextRoundNumber,
              },
              currentRound: {
                word: newWordData.word,
                category: newWordData.category,
                subCategory: newWordData.subCategory,
                skipsUsed: 0,
                wordRevealed: false,
                correctGuesserId: null,
                anyoneGuessed: false,
              },
              usedWords: [...state.usedWords, newWordData.word],
            };
          }
        }

        // No tiebreaker or clear winner - end game
        return { ...state, status: 'game_over' };
      }

      const newWordData = getNewWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        status: 'turn_start',
        roundWinner: null,
        currentTurn: {
            drawerIndex: nextDrawerIndex,
            roundNumber: nextRoundNumber,
        },
        currentRound: {
            word: newWordData.word,
            category: newWordData.category,
            subCategory: newWordData.subCategory,
            skipsUsed: 0,
            wordRevealed: false,
            correctGuesserId: null,
            anyoneGuessed: false,
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

const STORAGE_KEY = 'one_vs_all_pictionary_state';

export function useOneVsAllGameEngine() {
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

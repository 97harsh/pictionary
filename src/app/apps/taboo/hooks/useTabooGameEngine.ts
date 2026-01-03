"use client";

import { useReducer, useEffect, useCallback } from 'react';
import { getNewTabooWord, type SelectedCategories } from '@/lib/tabooWords';
import type { Team } from '@/hooks/useGameEngine';

export type Team = {
  id: number;
  name: string;
  score: number;
  roundsWon: number;
};

export interface TabooGameSettings {
  roundTime: number;
  skipLimit: number;
  totalRounds: number;
  continueUntilClearWinner: boolean;
  categories: SelectedCategories;
}

export interface TabooGameState {
  status: 'setup' | 'turn_start' | 'playing' | 'round_end' | 'game_over';
  teams: Team[];
  settings: TabooGameSettings;
  currentTurn: {
    teamIndex: number;
    roundNumber: number;
  };
  currentRound: {
    word: string;
    tabooWords: string[];
    category: string;
    subCategory: string;
    skipsUsed: number;
    wordRevealed: boolean;
    violations: number;
    wordsGuessed: number;
  };
  roundWinner: Team | null;
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
  teams: [],
  settings: {
    roundTime: 60,
    skipLimit: 3,
    totalRounds: 5,
    continueUntilClearWinner: false,
    categories: {},
  },
  currentTurn: {
    teamIndex: 0,
    roundNumber: 1,
  },
  currentRound: {
    word: '',
    tabooWords: [],
    category: '',
    subCategory: '',
    skipsUsed: 0,
    wordRevealed: false,
    violations: 0,
    wordsGuessed: 0,
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
        teams: players.map((name, i) => ({ id: i, name, score: 0, roundsWon: 0 })),
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
      const newTeams = [...state.teams];
      const currentTeam = newTeams[state.currentTurn.teamIndex];
      currentTeam.score += 1;

      return {
        ...state,
        teams: newTeams,
        currentRound: {
          ...state.currentRound,
          wordsGuessed: state.currentRound.wordsGuessed + 1,
        },
      };
    }

    case 'TABOO_VIOLATION': {
      // Violation deducts 1 point and ENDS the turn immediately
      const newTeams = [...state.teams];
      const currentTeam = newTeams[state.currentTurn.teamIndex];
      currentTeam.score = Math.max(0, currentTeam.score - 1); // Can't go below 0

      return {
        ...state,
        teams: newTeams,
        status: 'round_end',
        roundWinner: null,
        currentRound: {
          ...state.currentRound,
          violations: state.currentRound.violations + 1,
        },
      };
    }

    case 'SKIP_WORD': {
      if (state.currentRound.skipsUsed >= state.settings.skipLimit) return state;

      const newWordData = getNewTabooWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'round_end' };
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
          wordsGuessed: state.currentRound.wordsGuessed,
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
      const nextTeamIndex = (state.currentTurn.teamIndex + 1) % state.teams.length;
      const newWordData = getNewTabooWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      return {
        ...state,
        status: 'turn_start',
        roundWinner: null,
        currentTurn: {
            teamIndex: nextTeamIndex,
            roundNumber: state.currentTurn.roundNumber,
        },
        currentRound: {
            word: newWordData.word,
            tabooWords: newWordData.tabooWords,
            category: newWordData.category,
            subCategory: newWordData.subCategory,
            skipsUsed: 0,
            wordRevealed: false,
            violations: 0,
            wordsGuessed: 0,
        },
        usedWords: [...state.usedWords, newWordData.word],
      };
    }

    case 'ADVANCE_TURN': {
      const nextTeamIndex = (state.currentTurn.teamIndex + 1) % state.teams.length;
      const newWordData = getNewTabooWord(state.usedWords, state.settings.categories);

      if (!newWordData) {
        return { ...state, status: 'game_over' };
      }

      // Determine the round winner (team with highest score for this round)
      const currentTeam = state.teams[state.currentTurn.teamIndex];
      const newTeams = [...state.teams];
      if (state.currentRound.wordsGuessed > 0) {
        const roundWinnerTeam = newTeams[state.currentTurn.teamIndex];
        roundWinnerTeam.roundsWon += 1;
      }

      // Check if we've completed all rounds for all teams
      const isRoundComplete = nextTeamIndex === 0;
      const nextRoundNumber = isRoundComplete ? state.currentTurn.roundNumber + 1 : state.currentTurn.roundNumber;

      // Check if game should end
      let shouldEndGame = false;
      if (nextRoundNumber > state.settings.totalRounds) {
        if (state.settings.continueUntilClearWinner) {
          // Check for a clear winner (someone with more rounds won than others)
          const sortedTeams = [...newTeams].sort((a, b) => b.roundsWon - a.roundsWon);
          const hasClearWinner = sortedTeams[0].roundsWon > sortedTeams[1].roundsWon;
          shouldEndGame = hasClearWinner;
        } else {
          shouldEndGame = true;
        }
      }

      if (shouldEndGame) {
        return { ...state, status: 'game_over', teams: newTeams };
      }

      return {
        ...state,
        teams: newTeams,
        status: 'turn_start',
        roundWinner: state.currentRound.wordsGuessed > 0 ? currentTeam : null,
        currentTurn: {
            teamIndex: nextTeamIndex,
            roundNumber: nextRoundNumber,
        },
        currentRound: {
            word: newWordData.word,
            tabooWords: newWordData.tabooWords,
            category: newWordData.category,
            subCategory: newWordData.subCategory,
            skipsUsed: 0,
            wordRevealed: false,
            violations: 0,
            wordsGuessed: 0,
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
        if (parsed.status && parsed.teams) {
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

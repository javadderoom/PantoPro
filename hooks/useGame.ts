import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Team, Difficulty, CategoryId, Word } from '../types';
import { SCORING, TIMER_CONFIG } from '../constants';

const INITIAL_STATE: GameState = {
  status: 'HOME',
  teams: [],
  currentTeamIndex: 0,
  currentRound: 1,
  settings: { maxRounds: 5, adultMode: false },
  turn: {
    active: false,
    teamId: '',
    word: null,
    timeLeft: 0,
    totalTime: 0,
    swapsUsed: 0,
    fouls: 0,
    isPaused: false,
  },
  usedWords: [],
};

export const useGame = () => {
  // Initialize state from localStorage if available
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('panto_game_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const timerRef = useRef<number | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('panto_game_state', JSON.stringify(state));
  }, [state]);

  const startGame = (teams: string[], rounds: number, adultMode: boolean) => {
    const newTeams: Team[] = teams.map((name, i) => ({
      id: `team-${i}`,
      name,
      score: 0,
      comboStreak: 0,
      history: [],
    }));

    setState({
      ...INITIAL_STATE,
      status: 'CATEGORY_SELECT', // Skip straight to play for simplicity in this flow
      teams: newTeams,
      settings: { maxRounds: rounds, adultMode },
      currentTeamIndex: 0,
      currentRound: 1,
      usedWords: [], // Reset used words
    });
  };

  const resumeGame = () => {
    // State is already loaded from init, just ensure we aren't in HOME
    if (state.status === 'HOME') {
        // If persisted state was HOME, nothing to resume
        return false;
    }
    return true;
  };

  const resetGame = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem('panto_game_state');
  };

  const startTurn = (word: Word, category: CategoryId, options: { swapsUsed?: number } = {}) => {
    // Calculate Time
    const wordCount = word.text.split(' ').length;
    let baseTime = TIMER_CONFIG.BASE + (wordCount * TIMER_CONFIG.PER_WORD);
    
    if (word.difficulty === Difficulty.LEVEL3) baseTime += TIMER_CONFIG.BONUS_HARD;
    if (word.difficulty === Difficulty.PROVERB) baseTime += TIMER_CONFIG.BONUS_PROVERB;
    // Hard cap or modification? Let's keep it simple.

    setState(prev => ({
      ...prev,
      status: 'PLAYING',
      usedWords: [...(prev.usedWords || []), word.text], // Track used word
      turn: {
        active: true,
        teamId: prev.teams[prev.currentTeamIndex].id,
        word,
        timeLeft: baseTime,
        totalTime: baseTime,
        swapsUsed: options.swapsUsed || 0, // Maintain swaps if passed (e.g. during a swap action)
        fouls: 0,
        isPaused: true, // Start paused so player can read word before timer starts
      }
    }));
  };

  const cancelTurn = () => {
      setState(prev => {
          // Revert used words (remove the one we just added in startTurn)
          const newUsedWords = [...prev.usedWords];
          if (prev.turn.word) {
              const index = newUsedWords.indexOf(prev.turn.word.text);
              if (index > -1) newUsedWords.splice(index, 1);
          }
          
          return {
              ...prev,
              status: 'CATEGORY_SELECT', // Go back to selection status
              turn: { ...INITIAL_STATE.turn },
              usedWords: newUsedWords
          };
      });
  };

  const tick = useCallback(() => {
    setState(prev => {
      if (!prev.turn.active || prev.turn.isPaused) return prev;
      
      if (prev.turn.timeLeft <= 0) {
        // Time over - auto fail? or just stop? Let's stop.
        return {
          ...prev,
          turn: { ...prev.turn, active: false, timeLeft: 0 }
        };
      }
      return {
        ...prev,
        turn: { ...prev.turn, timeLeft: prev.turn.timeLeft - 1 }
      };
    });
  }, []);

  useEffect(() => {
    if (state.status === 'PLAYING' && state.turn.active && !state.turn.isPaused) {
      timerRef.current = window.setInterval(tick, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, state.turn.active, state.turn.isPaused, tick]);

  const recordTurn = (success: boolean) => {
    setState(prev => {
      const currentTeam = prev.teams[prev.currentTeamIndex];
      let newScore = currentTeam.score;
      let newStreak = currentTeam.comboStreak;
      
      // Calculate Score
      if (success) {
        // Base Points
        if (prev.turn.word?.difficulty === Difficulty.LEVEL1) newScore += 1;
        else if (prev.turn.word?.difficulty === Difficulty.LEVEL3) newScore += 3;
        else if (prev.turn.word?.difficulty === Difficulty.PROVERB) newScore += 10;
        
        // Adult Bonus
        if (prev.turn.word?.isAdult) newScore += SCORING.ADULT_BONUS;

        // Time Bonus
        const timeUsedRatio = 1 - (prev.turn.timeLeft / prev.turn.totalTime);
        const categoryUsed = currentTeam.history.includes(prev.turn.word!.category);
        
        if (!categoryUsed) {
            const isEasy = prev.turn.word?.difficulty === Difficulty.LEVEL1;
            
            if (timeUsedRatio < 0.33) {
                 // Fast answer: Level 1 gets 1pt, Level 3+ gets 2pts
                 newScore += isEasy ? 1 : 2; 
            } else if (timeUsedRatio < 0.66) {
                 // Medium answer: Level 1 gets 0.5pt, Level 3+ gets 1pt
                 newScore += isEasy ? 0.5 : 1;
            }
        }

        // Combo
        newStreak += 1;
        if (newStreak === 3) {
            newScore += SCORING.COMBO_BONUS;
            newStreak = 0; // Reset on 4th (or rather, reset after bonus claimed)
        }
      } else {
        newStreak = 0;
      }

      // Penalties
      newScore -= (prev.turn.swapsUsed * SCORING.SWAP_PENALTY);
      newScore -= (prev.turn.fouls * SCORING.FOUL_PENALTY);

      // Update History
      const newHistory = [...currentTeam.history];
      if (prev.turn.word && !newHistory.includes(prev.turn.word.category)) {
          newHistory.push(prev.turn.word.category);
      }

      const updatedTeams = [...prev.teams];
      updatedTeams[prev.currentTeamIndex] = {
        ...currentTeam,
        score: newScore,
        comboStreak: newStreak,
        history: newHistory
      };

      // Next Team/Round Logic
      let nextTeamIndex = prev.currentTeamIndex + 1;
      let nextRound = prev.currentRound;
      let nextStatus: GameState['status'] = 'CATEGORY_SELECT';

      if (nextTeamIndex >= prev.teams.length) {
          nextTeamIndex = 0;
          nextRound += 1;
      }

      if (nextRound > prev.settings.maxRounds) {
          nextStatus = 'GAME_OVER';
      }

      return {
        ...prev,
        status: nextStatus,
        teams: updatedTeams,
        currentTeamIndex: nextTeamIndex,
        currentRound: nextRound,
        turn: { ...INITIAL_STATE.turn } // Reset turn
      };
    });
  };

  const triggerSwap = () => {
    setState(prev => ({
        ...prev,
        turn: { ...prev.turn, swapsUsed: prev.turn.swapsUsed + 1 }
    }));
  };

  const triggerFoul = () => {
    // Vibrate
    if (navigator.vibrate) navigator.vibrate(200);
    setState(prev => ({
        ...prev,
        turn: { ...prev.turn, fouls: prev.turn.fouls + 1 }
    }));
  };

  const toggleAdultMode = () => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, adultMode: !prev.settings.adultMode }
    }));
  };

  return {
    state,
    startGame,
    resumeGame,
    resetGame,
    startTurn,
    cancelTurn,
    recordTurn,
    triggerSwap,
    triggerFoul,
    setTurnPaused: (paused: boolean) => setState(s => ({...s, turn: {...s.turn, isPaused: paused}})),
    toggleAdultMode
  };
};
import React, { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { CATEGORIES } from './constants';
import { CategoryId, Difficulty } from './types';
import { generateWord } from './services/geminiService';

// Import View Components
import { HomeView } from './views/HomeView';
import { SetupView } from './views/SetupView';
import { CategorySelectView } from './views/CategorySelectView';
import { DifficultySelectView } from './views/DifficultySelectView';
import { PlayingView } from './views/PlayingView';
import { GameOverView } from './views/GameOverView';
import { LoadingView } from './components/LoadingView';
import { ConfirmationModal } from './components/ConfirmationModal';

export default function App() {
  const { 
    state, startGame, resumeGame, resetGame, startTurn, cancelTurn, recordTurn, triggerSwap, triggerFoul, toggleAdultMode, setTurnPaused
  } = useGame();

  const [uiView, setUiView] = useState<'HOME' | 'SETUP' | 'GAME'>('HOME');
  const [loadingWord, setLoadingWord] = useState(false);
  const [selectionState, setSelectionState] = useState<{step: 'CATEGORY'|'DIFFICULTY', category?: CategoryId}>({ step: 'CATEGORY' });
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Sync internal UI state with Game Store State
  useEffect(() => {
    if (state.status === 'HOME') setUiView('HOME');
    if (state.status === 'CATEGORY_SELECT') {
        setSelectionState({ step: 'CATEGORY' });
    }
  }, [state.status]);

  const handleStartGame = (teams: string[], rounds: number) => {
    startGame(teams, rounds, false);
    setUiView('GAME'); 
  };

  const handleCategorySelect = (catId: CategoryId) => {
    setSelectionState({ step: 'DIFFICULTY', category: catId });
  };

  const handleDifficultySelect = async (diff: Difficulty) => {
    setLoadingWord(true);
    const cat = selectionState.category!;
    const isAdult = state.settings.adultMode;
    const word = await generateWord(cat, diff, isAdult, state.usedWords);
    setLoadingWord(false);
    startTurn(word, cat);
  };

  const handleSwap = async () => {
    if (!state.turn.word) return;
    if (state.turn.swapsUsed >= 1) return;
    
    const newSwapsCount = state.turn.swapsUsed + 1;

    setLoadingWord(true);
    const newWord = await generateWord(state.turn.word.category, state.turn.word.difficulty, state.turn.word.isAdult, state.usedWords);
    setLoadingWord(false);
    
    startTurn(newWord, state.turn.word.category, { swapsUsed: newSwapsCount });
  };

  // --- Back Navigation Handlers ---

  const handleBackFromSetup = () => {
    setUiView('HOME');
  };

  const handleBackFromCategory = () => {
    // Back from Category Selection -> Quit Game / Home
    // Replace window.confirm with custom modal trigger
    setShowExitConfirm(true);
  };

  const confirmExitGame = () => {
    resetGame();
    setUiView('HOME');
    setShowExitConfirm(false);
  };

  const handleBackFromDifficulty = () => {
    // Back from Difficulty Selection -> Category Selection
    setSelectionState({ step: 'CATEGORY', category: undefined });
  };

  const handleBackFromPlaying = () => {
    // Back from Playing (Paused) -> Difficulty Selection
    // We need to "cancel" the turn we just generated
    cancelTurn();
    setSelectionState({ step: 'DIFFICULTY', category: state.turn.word?.category });
  };


  // --- Render Logic ---

  const renderContent = () => {
    if (loadingWord) {
        return <LoadingView />;
    }
  
    if (state.status === 'GAME_OVER') {
      return <GameOverView teams={state.teams} onHome={resetGame} />;
    }
  
    if (state.status === 'HOME') {
      if (uiView === 'SETUP') {
        return <SetupView onStart={handleStartGame} onBack={handleBackFromSetup} />;
      }
      return <HomeView onNewGame={() => setUiView('SETUP')} onResume={resumeGame} canResume={false} />;
    }
  
    if (state.status === 'PLAYING') {
       return (
          <PlayingView 
              turn={state.turn} 
              onCorrect={() => recordTurn(true)} 
              onFail={() => recordTurn(false)}
              onSwap={handleSwap}
              onFoul={triggerFoul}
              onStart={() => setTurnPaused(false)}
              onBack={handleBackFromPlaying}
          />
       );
    }
  
    // Category/Difficulty Selection Flow
    if (selectionState.step === 'CATEGORY') {
        return (
            <CategorySelectView 
                categories={CATEGORIES.filter(c => state.settings.adultMode || !c.hasAdult || c.levels.length > 0)}
                currentTeam={state.teams[state.currentTeamIndex]}
                round={state.currentRound}
                maxRounds={state.settings.maxRounds}
                onSelect={handleCategorySelect}
                onBack={handleBackFromCategory}
            />
        );
    }
  
    if (selectionState.step === 'DIFFICULTY') {
        const cat = CATEGORIES.find(c => c.id === selectionState.category);
        return (
            <DifficultySelectView 
                levels={cat?.levels || []}
                hasAdult={cat?.hasAdult}
                adultModeEnabled={state.settings.adultMode}
                onToggleAdult={toggleAdultMode}
                onSelect={handleDifficultySelect}
                onBack={handleBackFromDifficulty}
            />
        );
    }
  
    return <div>وضعیت نامشخص</div>;
  };

  return (
    <>
      {renderContent()}
      <ConfirmationModal 
        isOpen={showExitConfirm}
        title="خروج از بازی"
        message="آیا مطمئن هستید که می‌خواهید از بازی خارج شوید؟ تمام پیشرفت فعلی از دست خواهد رفت."
        onConfirm={confirmExitGame}
        onCancel={() => setShowExitConfirm(false)}
      />
    </>
  );
}
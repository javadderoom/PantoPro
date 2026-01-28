import React from 'react';
import { TurnState } from '../types';
import { Button } from '../components/Button';

interface PlayingViewProps {
  turn: TurnState;
  onCorrect: () => void;
  onFail: () => void;
  onSwap: () => void;
  onFoul: () => void;
  onStart: () => void;
  onBack: () => void;
}

export const PlayingView = ({ turn, onCorrect, onFail, onSwap, onFoul, onStart, onBack }: PlayingViewProps) => {
  // Timer Color Logic
  const timePercent = turn.totalTime > 0 ? turn.timeLeft / turn.totalTime : 0;
  const timerColor = timePercent > 0.66 ? 'bg-emerald-500' : timePercent > 0.33 ? 'bg-yellow-500' : 'bg-red-500';

  // Level 1 words (1 point) shouldn't be swappable because the penalty is -1 point.
  const canSwap = turn.word?.difficulty !== 1;

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-900">
      {/* Timer Bar */}
      <div className="h-2 w-full bg-slate-800" style={{ direction: 'ltr' }}>
        <div 
          className={`h-full ${timerColor} transition-all duration-1000 ease-linear`} 
          style={{ width: `${timePercent * 100}%` }}
        />
      </div>

      {turn.isPaused && (
         <div className="absolute top-4 right-4 z-20">
            <button onClick={onBack} className="p-2 text-slate-400 hover:text-white flex items-center gap-2 bg-slate-800/80 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="text-sm font-bold">بازگشت</span>
            </button>
         </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="text-6xl font-black text-slate-700 select-none">
          {turn.timeLeft} <span className="text-2xl">ثانیه</span>
        </div>

        <div className="w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
             {turn.word ? (
                 <h1 className="text-4xl font-black text-white leading-tight break-words animate-pop-in">
                   {turn.word.text}
                 </h1>
             ) : (
                 <div className="animate-pulse text-slate-500">در حال دریافت کلمه...</div>
             )}
             <div className="absolute top-2 left-4 flex gap-2">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest" style={{ direction: 'ltr' }}>
                    LVL {turn.word?.difficulty}
                 </span>
                 {turn.word?.isAdult && (
                     <span className="text-xs font-bold text-rose-500 uppercase tracking-widest" style={{ direction: 'ltr' }}>
                       18+
                     </span>
                 )}
             </div>
        </div>

        {/* Controls based on Paused/Active state */}
        {turn.isPaused ? (
          <div className="flex flex-col w-full max-w-md gap-4 animate-fade-in">
            <Button onClick={onStart} className="bg-emerald-500 hover:bg-emerald-600 text-white text-2xl h-20 shadow-lg shadow-emerald-500/30 animate-pulse">
              شروع بازی ▶️
            </Button>
            {turn.swapsUsed < 1 && canSwap && (
              <Button variant="outline" onClick={onSwap}>
                تعویض کلمه (-۱ امتیاز)
              </Button>
            )}
            <p className="text-slate-500 text-sm mt-2">
              بازیکن می‌تواند کلمه را ببیند. پس از آمادگی دکمه شروع را بزنید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full max-w-md animate-fade-in">
            {canSwap && (
              <Button variant="outline" onClick={onSwap} disabled={turn.swapsUsed >= 1}>
                تعویض (-۱)
              </Button>
            )}
            <Button variant="danger" onClick={onFoul} className={!canSwap ? "col-span-2" : ""}>
              خطا (-۰.۵)
            </Button>
          </div>
        )}
      </div>

      {/* Scoring Buttons (Hidden while Paused) */}
      {!turn.isPaused && (
        <div className="p-6 grid grid-cols-2 gap-4 bg-slate-800/50 backdrop-blur-lg border-t border-slate-800 animate-slide-up">
          <Button variant="danger" onClick={onFail} className="h-20 text-2xl">
            غلط ❌
          </Button>
          <Button variant="primary" onClick={onCorrect} className="h-20 text-2xl">
            درست ✅
          </Button>
        </div>
      )}
    </div>
  );
};
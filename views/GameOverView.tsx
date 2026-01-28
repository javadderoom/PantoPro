import React from 'react';
import { Team } from '../types';
import { Button } from '../components/Button';

interface GameOverViewProps {
  teams: Team[];
  onHome: () => void;
}

export const GameOverView = ({ teams, onHome }: GameOverViewProps) => {
  const winner = [...teams].sort((a, b) => b.score - a.score)[0];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-fade-in">
      <h1 className="text-5xl font-black text-white">پایان بازی</h1>
      
      <div className="bg-slate-800 p-8 rounded-3xl w-full max-w-md border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
        <div className="text-slate-400 mb-2">برنده</div>
        <div className="text-4xl font-bold text-emerald-400 mb-6">{winner.name}</div>
        
        <div className="space-y-4">
          {teams.map((t) => (
            <div key={t.id} className="flex justify-between items-center p-4 bg-slate-900 rounded-xl">
              <span className="font-bold">{t.name}</span>
              <span className="font-mono text-xl" style={{ direction: 'ltr' }}>{t.score} pts</span>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onHome}>بازگشت به خانه</Button>
    </div>
  );
};
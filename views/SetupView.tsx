import React, { useState } from 'react';
import { Button } from '../components/Button';

interface SetupViewProps {
  onStart: (teams: string[], rounds: number) => void;
  onBack: () => void;
}

export const SetupView = ({ onStart, onBack }: SetupViewProps) => {
  const [team1, setTeam1] = useState("تیم الف");
  const [team2, setTeam2] = useState("تیم ب");
  const [rounds, setRounds] = useState(5);

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-md mx-auto animate-fade-in">
      <div className="flex items-center mb-8 relative">
        <button onClick={onBack} className="absolute right-0 p-2 text-slate-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-emerald-400 text-center w-full">تنظیمات بازی</h2>
      </div>
      
      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-slate-400 text-sm">نام تیم اول</label>
          <input 
            value={team1} onChange={(e) => setTeam1(e.target.value)}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none text-right placeholder-slate-600"
            placeholder="نام تیم را وارد کنید"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-slate-400 text-sm">نام تیم دوم</label>
          <input 
            value={team2} onChange={(e) => setTeam2(e.target.value)}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none text-right placeholder-slate-600"
            placeholder="نام تیم را وارد کنید"
          />
        </div>

        <div className="space-y-2">
          <label className="text-slate-400 text-sm">تعداد دور: {rounds}</label>
          <input 
            type="range" min="1" max="10" value={rounds} onChange={(e) => setRounds(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            style={{ direction: 'ltr' }}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button onClick={() => onStart([team1, team2], rounds)} className="flex-1">شروع بازی</Button>
      </div>
    </div>
  );
};
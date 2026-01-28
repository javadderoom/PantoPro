import React from 'react';
import { CategoryId, Team } from '../types';
import { CategoryDef } from '../types';
import { Button } from '../components/Button';

interface CategorySelectViewProps {
  categories: CategoryDef[];
  onSelect: (id: CategoryId) => void;
  currentTeam: Team;
  round: number;
  maxRounds: number;
  onBack: () => void;
}

export const CategorySelectView = ({ categories, onSelect, currentTeam, round, maxRounds, onBack }: CategorySelectViewProps) => (
  <div className="flex flex-col min-h-screen p-6 max-w-md mx-auto animate-fade-in">
    {/* Header */}
    <div className="flex justify-between items-start mb-6">
      <button 
        onClick={onBack}
        className="text-slate-500 hover:text-rose-500 transition-colors p-3 -mr-3 rounded-full hover:bg-slate-800"
        title="خروج از بازی"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
      </button>
      
      <div className="text-left">
        <div className="text-xs text-slate-500">امتیاز</div>
        <div className="text-2xl font-black text-emerald-400">{currentTeam.score}</div>
      </div>
    </div>

    <div className="text-center mb-6">
      <span className="text-slate-400 text-sm">دور {round} از {maxRounds}</span>
      <h2 className="text-3xl font-bold text-white mt-1">نوبت {currentTeam.name}</h2>
    </div>

    {/* Combo Indicator */}
    <div className="flex gap-2 justify-center mb-8" style={{ direction: 'ltr' }}>
       {[...Array(3)].map((_, i) => (
         <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < currentTeam.comboStreak ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' : 'bg-slate-700'}`} />
       ))}
    </div>

    <div className="grid grid-cols-2 gap-3 pb-8">
      {categories.map((cat) => (
        <button 
          key={cat.id} 
          onClick={() => onSelect(cat.id)}
          className="bg-slate-800 hover:bg-slate-750 p-4 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-3 group transition-all h-32 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 duration-300 relative z-10">{cat.icon}</span>
          <span className="text-lg font-bold text-slate-200 group-hover:text-white text-center relative z-10">{cat.name}</span>
        </button>
      ))}
    </div>
  </div>
);
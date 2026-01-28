import React from 'react';
import { Difficulty } from '../types';
import { Button } from '../components/Button';

interface DifficultySelectViewProps {
  levels: Difficulty[];
  hasAdult: boolean;
  onSelect: (diff: Difficulty) => void;
  adultModeEnabled: boolean;
  onToggleAdult: () => void;
  onBack: () => void;
}

export const DifficultySelectView = ({ 
  levels, hasAdult, onSelect, adultModeEnabled, onToggleAdult, onBack 
}: DifficultySelectViewProps) => {
  return (
    <div className="flex flex-col min-h-screen p-6 max-w-md mx-auto animate-fade-in relative">
      <div className="absolute top-6 right-6 z-10">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <span className="text-sm font-bold">بازگشت</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4 pt-12">
        <h2 className="text-center text-3xl font-bold mb-8">انتخاب سختی</h2>
        
        {hasAdult && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-6">
               <span className="text-slate-300 font-bold">حالت بزرگسال (۱۸+)</span>
               <div 
                  onClick={onToggleAdult}
                  className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${adultModeEnabled ? 'bg-rose-500' : 'bg-slate-600'}`}
                  style={{ direction: 'ltr' }}
               >
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${adultModeEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
               </div>
          </div>
        )}

        {levels.includes(1) && (
          <Button onClick={() => onSelect(1 as Difficulty)} className="bg-gradient-to-r from-green-500 to-emerald-600 h-20 text-xl shadow-lg shadow-emerald-900/20">
            سطح ۱ (۱ امتیاز)
          </Button>
        )}
        
        {levels.includes(3) && (
          <Button onClick={() => onSelect(3 as Difficulty)} className="bg-gradient-to-r from-blue-500 to-indigo-600 h-20 text-xl shadow-lg shadow-indigo-900/20">
            سطح ۳ (۳ امتیاز)
          </Button>
        )}
        
        {levels.includes(10) && (
          <Button onClick={() => onSelect(10 as Difficulty)} className="bg-gradient-to-r from-purple-500 to-fuchsia-600 h-20 text-xl shadow-lg shadow-fuchsia-900/20">
            ضرب‌المثل (۱۰ امتیاز)
          </Button>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { Button } from '../components/Button';

interface HomeViewProps {
  onNewGame: () => void;
  onResume: () => void;
  canResume: boolean;
}

export const HomeView = ({ onNewGame, onResume, canResume }: HomeViewProps) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-8 animate-fade-in">
    <div className="text-center space-y-2">
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
        پانتو‌پرو
      </h1>
      <p className="text-slate-400 text-lg">بهترین تجربه پانتومیم</p>
    </div>
    
    <div className="w-full max-w-md space-y-4">
      {canResume && (
        <Button onClick={onResume} variant="secondary">
          ادامه بازی قبلی
        </Button>
      )}
      <Button onClick={onNewGame}>بازی جدید</Button>
      <div className="pt-8 text-center">
         <button className="text-slate-500 text-sm hover:text-emerald-400 transition-colors">نصب اپلیکیشن</button>
      </div>
    </div>
  </div>
);
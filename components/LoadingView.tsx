import React from 'react';

export const LoadingView = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 z-50 p-6 text-center animate-fade-in fixed inset-0">
    <div className="relative mb-8">
      <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
      <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
        🤖
      </div>
    </div>
    <h2 className="text-2xl font-bold text-white mb-3">هوش مصنوعی در حال فکر کردن...</h2>
    <p className="text-slate-400 text-sm animate-pulse">در حال انتخاب بهترین کلمه برای شما</p>
  </div>
);
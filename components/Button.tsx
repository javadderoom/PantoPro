import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  disabled?: boolean;
}

export const Button = ({ onClick, children, className = "", variant = "primary", disabled = false }: ButtonProps) => {
  const baseStyle = "w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-lg",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20",
    outline: "border-2 border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
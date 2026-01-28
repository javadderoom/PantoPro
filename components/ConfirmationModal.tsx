import React from 'react';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6 text-sm leading-relaxed">{message}</p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onCancel} className="py-3 text-base">
            انصراف
          </Button>
          <Button variant="danger" onClick={onConfirm} className="py-3 text-base">
            بله، خروج
          </Button>
        </div>
      </div>
    </div>
  );
};
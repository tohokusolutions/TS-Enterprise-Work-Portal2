import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'check_circle';
    }
  };

  const getBg = () => {
    switch (type) {
      case 'error':
        return 'bg-[#b7102a] text-white';
      case 'info':
        return 'bg-[#0b3b7b] text-white';
      default:
        return 'bg-[#002556] text-white';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border border-white/20 ${getBg()}`}>
        <span className="material-symbols-outlined text-[20px] text-[#ffdad8]">
          {getIcon()}
        </span>
        <span className="text-xs font-semibold">{message}</span>
      </div>
    </div>
  );
};

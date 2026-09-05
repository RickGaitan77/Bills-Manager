import React from 'react';
import { CheckCircle2, AlertCircle, Info, Undo2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  onUndo?: () => void;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  isDark: boolean;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, isDark }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:w-80 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-3.5 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-2.5 transition-all animate-in fade-in slide-in-from-bottom-3 ${
            t.type === 'error'
              ? isDark
                ? 'bg-red-950/80 border-red-500/40 text-red-200 shadow-red-950/40'
                : 'bg-red-50/90 border-red-200 text-red-900 shadow-red-100'
              : isDark
              ? 'bg-slate-900/80 border-white/15 text-slate-100 shadow-black/40'
              : 'bg-white/90 border-white/80 text-slate-900 shadow-slate-200/60'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {t.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{t.title}</p>
              {t.message && <p className="text-[11px] opacity-80 truncate">{t.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {t.onUndo && (
              <button
                onClick={() => {
                  t.onUndo?.();
                  onDismiss(t.id);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-bold flex items-center gap-1 backdrop-blur-md transition-colors"
              >
                <Undo2 className="w-3 h-3" />
                Undo
              </button>
            )}
            <button
              onClick={() => onDismiss(t.id)}
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

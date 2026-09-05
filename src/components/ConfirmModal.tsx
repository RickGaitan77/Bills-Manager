import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDark: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  isDark,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-backdrop"
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        id="confirm-modal-content"
        className={`w-full max-w-sm rounded-3xl border p-5 space-y-4 shadow-2xl backdrop-blur-2xl transition-all ${
          isDark
            ? 'bg-slate-900/80 border-white/15 text-slate-100 shadow-black/40'
            : 'bg-white/90 border-white/80 text-slate-900 shadow-slate-300/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0 backdrop-blur-md">
            <Trash2 className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-base">{title}</h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {message}
            </p>
          </div>
        </div>

        <div className={`flex items-center justify-end gap-2 pt-3 border-t ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            Cancel
          </button>
          <button
            id="btn-modal-confirm-delete"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white transition-all shadow-lg shadow-red-500/25 border border-red-400/40"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

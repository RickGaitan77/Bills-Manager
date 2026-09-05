import React, { useRef, useState } from 'react';
import { DownloadCloud, UploadCloud, X, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Bill } from '../types';
import { exportBillsBackup, validateAndImportBills, getSampleBills } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: Bill[];
  onImportSuccess: (importedBills: Bill[]) => void;
  onResetDemo: () => void;
  isDark: boolean;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  bills,
  onImportSuccess,
  onResetDemo,
  isDark,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportBillsBackup(bills);
    setSuccessMsg('Backup JSON downloaded successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const validated = validateAndImportBills(parsed);
        onImportSuccess(validated);
        setSuccessMsg(`Successfully restored ${validated.length} bills.`);
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="backup-modal-backdrop"
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="backup-modal-content"
        className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-2xl transition-all ${
          isDark
            ? 'bg-slate-900/80 border-white/15 text-slate-100 shadow-black/40'
            : 'bg-white/90 border-white/80 text-slate-900 shadow-slate-300/60'
        }`}
      >
        <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 flex items-center justify-center backdrop-blur-md">
              <DownloadCloud className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold">Data Backup & Restore</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                100% offline & local data management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 backdrop-blur-md">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Export button */}
          <div className={`p-4 rounded-2xl border backdrop-blur-md ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-slate-200/80'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">
              Export Backup (JSON)
            </h3>
            <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Download a complete snapshot of your {bills.length} bills to store securely.
            </p>
            <button
              onClick={handleExport}
              className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <DownloadCloud className="w-4 h-4 text-amber-400" />
              Download Backup File (.json)
            </button>
          </div>

          {/* Import button */}
          <div className={`p-4 rounded-2xl border backdrop-blur-md ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-slate-200/80'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">
              Restore from Backup
            </h3>
            <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Upload a previously exported JSON backup to replace or restore data.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 border border-cyan-300/30 transition-all active:scale-[0.98]"
            >
              <UploadCloud className="w-4 h-4" />
              Select JSON File to Restore
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Want to see sample data again?
            </span>
            <button
              onClick={() => {
                if (confirm('Load sample starter bills?')) {
                  onResetDemo();
                  onClose();
                }
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Sample Bills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

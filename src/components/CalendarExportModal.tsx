import React, { useState } from 'react';
import { Calendar, Download, X, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { Bill } from '../types';
import { downloadBulkICS, generateBillICS, triggerICSDownload } from '../utils/calendar';
import { formatDisplayDate } from '../utils/dateUtils';

interface CalendarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: Bill[];
  isDark: boolean;
}

export const CalendarExportModal: React.FC<CalendarExportModalProps> = ({
  isOpen,
  onClose,
  bills,
  isDark,
}) => {
  const [selectedRange, setSelectedRange] = useState<'upcoming' | 'thisMonth' | 'all'>('upcoming');

  if (!isOpen) return null;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const getFilteredBillsToExport = () => {
    if (selectedRange === 'upcoming') {
      return bills.filter((b) => !b.paid && b.dueDate);
    }
    if (selectedRange === 'thisMonth') {
      return bills.filter((b) => {
        if (!b.dueDate) return false;
        const [y, m] = b.dueDate.split('-').map(Number);
        return y === currentYear && m === currentMonth + 1;
      });
    }
    return bills.filter((b) => b.dueDate);
  };

  const exportList = getFilteredBillsToExport();

  const handleExport = () => {
    if (exportList.length === 0) return;
    const filename = `Bills_Export_${selectedRange}_${now.toISOString().split('T')[0]}.ics`;
    downloadBulkICS(exportList, filename);
    onClose();
  };

  return (
    <div
      id="cal-export-modal-backdrop"
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="cal-export-modal-content"
        className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-2xl transition-all ${
          isDark
            ? 'bg-slate-900/80 border-white/15 text-slate-100 shadow-black/40'
            : 'bg-white/90 border-white/80 text-slate-900 shadow-slate-300/60'
        }`}
      >
        <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center backdrop-blur-md">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold">Calendar Export (.ics)</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Sync due dates & 1-day alarms to Apple / Google / Outlook
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

        {/* Range Selection */}
        <div className="space-y-2">
          <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Select Bills to Include
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'upcoming', label: 'All Unpaid' },
              { id: 'thisMonth', label: 'This Month' },
              { id: 'all', label: 'All Bills' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedRange(option.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all text-center ${
                  selectedRange === option.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 border-amber-300/40 shadow-md shadow-amber-500/20'
                    : isDark
                    ? 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview List */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Preview ({exportList.length} events)
            </span>
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              VALARM 1-day reminders enabled
            </span>
          </div>

          <div className={`rounded-2xl border p-3 max-h-40 overflow-y-auto space-y-1.5 text-xs backdrop-blur-md ${
            isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-slate-200/80'
          }`}>
            {exportList.length === 0 ? (
              <p className={`text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                No bills match the selected range.
              </p>
            ) : (
              exportList.map((bill, i) => (
                <div key={bill.id || i} className={`flex items-center justify-between py-1.5 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                  <span className="font-medium truncate max-w-[200px]">{bill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">${bill.amount}</span>
                    <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatDisplayDate(bill.dueDate)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          id="btn-confirm-export-cal"
          disabled={exportList.length === 0}
          onClick={handleExport}
          className="w-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 font-extrabold py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/25 border border-amber-300/40 active:scale-[0.98] flex items-center justify-center gap-2 backdrop-blur-md"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          Download .ICS Calendar File
        </button>
      </div>
    </div>
  );
};

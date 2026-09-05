import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, AlertTriangle, Repeat, Tag, FileText, Check } from 'lucide-react';
import { Bill, BillCategory } from '../types';
import { CATEGORY_LIST, inferCategoryFromName } from '../utils/categories';
import { CategoryIcon } from './CategoryIcon';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (billData: Omit<Bill, 'id'>, generateCalendar: boolean) => void;
  initialBill?: Bill | null;
  isDark: boolean;
}

export const BillModal: React.FC<BillModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBill,
  isDark,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [disconnectDate, setDisconnectDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(true);
  const [category, setCategory] = useState<BillCategory>('utilities');
  const [notes, setNotes] = useState('');
  const [autoDownloadICS, setAutoDownloadICS] = useState(false);
  const [userPickedCategoryManually, setUserPickedCategoryManually] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialBill) {
        setName(initialBill.name);
        setAmount(initialBill.amount);
        setDueDate(initialBill.dueDate);
        setDisconnectDate(initialBill.disconnectDate || '');
        setIsRecurring(initialBill.isRecurring ?? true);
        setCategory(initialBill.category || inferCategoryFromName(initialBill.name));
        setNotes(initialBill.notes || '');
        setUserPickedCategoryManually(true);
      } else {
        // Reset to default new bill
        const todayStr = new Date().toISOString().split('T')[0];
        setName('');
        setAmount('');
        setDueDate(todayStr);
        setDisconnectDate('');
        setIsRecurring(true);
        setCategory('utilities');
        setNotes('');
        setAutoDownloadICS(false);
        setUserPickedCategoryManually(false);
      }
    }
  }, [isOpen, initialBill]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!userPickedCategoryManually) {
      const inferred = inferCategoryFromName(val);
      setCategory(inferred);
    }
  };

  const handleSelectCategory = (catId: BillCategory) => {
    setCategory(catId);
    setUserPickedCategoryManually(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount || !dueDate) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) return;

    onSave(
      {
        name: name.trim(),
        amount: parsedAmount.toFixed(2),
        dueDate,
        disconnectDate: disconnectDate.trim() || undefined,
        isRecurring,
        paid: initialBill ? initialBill.paid : false,
        category,
        notes: notes.trim() || undefined,
      },
      autoDownloadICS
    );
  };

  return (
    <div
      id="bill-modal-backdrop"
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="bill-modal-content"
        className={`w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl backdrop-blur-2xl transition-all ${
          isDark
            ? 'bg-slate-900/80 border-white/15 text-slate-100 shadow-black/40'
            : 'bg-white/90 border-white/80 text-slate-900 shadow-slate-300/60'
        }`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
          <div>
            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              {initialBill ? 'Edit Bill Details' : 'Add New Bill'}
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {initialBill
                ? 'Update amount, due dates, or recurrence'
                : 'Schedule a new payment or monthly recurring bill'}
            </p>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bill Name */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Bill Name *
            </label>
            <input
              id="input-bill-name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Electric Utility, Rent, Netflix"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-amber-400/60 focus:bg-white/[0.07]'
                  : 'bg-white/80 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white'
              }`}
            />
          </div>

          {/* Amount & Due Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Amount ($) *
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  $
                </span>
                <input
                  id="input-bill-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm font-bold outline-none backdrop-blur-md transition-all ${
                    isDark
                      ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-amber-400/60 focus:bg-white/[0.07]'
                      : 'bg-white/80 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Due Date *
              </label>
              <input
                id="input-bill-duedate"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none backdrop-blur-md transition-all ${
                  isDark
                    ? 'bg-white/[0.04] border-white/10 text-white focus:border-amber-400/60 focus:bg-white/[0.07] [color-scheme:dark]'
                    : 'bg-white/80 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Disconnect / Late Notice Date (Optional) */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Disconnect / Final Notice Date (Optional)
              </span>
              <span className={`text-[10px] font-normal lowercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                optional
              </span>
            </label>
            <input
              id="input-bill-disconnect"
              type="date"
              value={disconnectDate}
              onChange={(e) => setDisconnectDate(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-white/[0.04] border-white/10 text-white focus:border-amber-400/60 focus:bg-white/[0.07] [color-scheme:dark]'
                  : 'bg-white/80 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white'
              }`}
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {CATEGORY_LIST.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border backdrop-blur-md transition-all text-left truncate ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 border-amber-300/50 shadow-md shadow-amber-500/20 font-bold'
                        : isDark
                        ? 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/[0.08]'
                        : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <CategoryIcon category={cat.id} className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{cat.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Notes / Account # (Optional)
            </label>
            <input
              id="input-bill-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Autopay with Amex ending 4012"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:border-amber-400/60 focus:bg-white/[0.07]'
                  : 'bg-white/80 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white'
              }`}
            />
          </div>

          {/* Toggle Switches: Recurring & Auto-Cal */}
          <div className={`p-3 rounded-xl border space-y-2.5 backdrop-blur-md ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50/80 border-slate-200'}`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                id="checkbox-bill-recurring"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-purple-400" />
                  Make this a recurring monthly bill
                </span>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  When marked paid, automatically generates next month's payment schedule.
                </p>
              </div>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer pt-1 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <input
                id="checkbox-bill-autocal"
                type="checkbox"
                checked={autoDownloadICS}
                onChange={(e) => setAutoDownloadICS(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-semibold">
                  Download .ics calendar event immediately
                </span>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="modal-submit-btn"
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/25 border border-amber-300/40 active:scale-[0.98] flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            {initialBill ? 'Update Bill' : 'Save Bill & Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
};

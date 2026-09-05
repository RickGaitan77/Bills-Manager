import React from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Repeat, 
  Trash2, 
  Edit3, 
  CalendarPlus, 
  Info, 
  Flame,
  Check,
  RotateCcw
} from 'lucide-react';
import { Bill } from '../types';
import { getStatusInfo, formatDisplayDate } from '../utils/dateUtils';
import { CategoryBadge } from './CategoryIcon';

interface BillCardProps {
  bill: Bill;
  index: number;
  isDark: boolean;
  onTogglePaid: (bill: Bill, index: number) => void;
  onDownloadICS: (bill: Bill) => void;
  onEdit: (bill: Bill, index: number) => void;
  onDelete: (bill: Bill, index: number) => void;
}

export const BillCard: React.FC<BillCardProps> = ({
  bill,
  index,
  isDark,
  onTogglePaid,
  onDownloadICS,
  onEdit,
  onDelete,
}) => {
  const statusInfo = getStatusInfo(bill);
  const formattedDueDate = formatDisplayDate(bill.dueDate, true);
  const formattedDisconnectDate = bill.disconnectDate ? formatDisplayDate(bill.disconnectDate, true) : null;
  const numAmount = parseFloat(bill.amount) || 0;

  return (
    <article
      id={`bill-card-${bill.id || index}`}
      className={`rounded-2xl p-4 transition-all duration-200 border backdrop-blur-xl relative overflow-hidden flex flex-col justify-between gap-3 ${
        statusInfo.cardBorderClass
      } ${
        isDark
          ? bill.paid
            ? 'bg-white/[0.02] border-white/5 opacity-60'
            : 'bg-white/[0.04] border-white/10 shadow-lg shadow-black/20 hover:border-white/20 hover:bg-white/[0.06]'
          : bill.paid
          ? 'bg-white/40 border-white/60 opacity-60'
          : 'bg-white/70 border-white/80 shadow-md shadow-slate-200/50 hover:bg-white/90 hover:border-white'
      }`}
    >
      {/* Top row: Category, Urgency Status & Amount */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryBadge category={bill.category} isDark={isDark} />

            {/* Status Pill */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold backdrop-blur-md border ${statusInfo.badgeClass}`}>
              {statusInfo.status === 'overdue' && <AlertTriangle className="w-3 h-3 shrink-0" />}
              {statusInfo.status === 'dueToday' && <Flame className="w-3 h-3 shrink-0" />}
              {statusInfo.status === 'dueSoon' && <Clock className="w-3 h-3 shrink-0" />}
              {statusInfo.status === 'paid' && <CheckCircle2 className="w-3 h-3 shrink-0" />}
              <span>{statusInfo.badgeLabel}</span>
            </span>

            {/* Recurring Indicator */}
            {bill.isRecurring && (
              <span
                title="Recurring Monthly Bill - Next cycle automatically rolls over upon payment"
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border backdrop-blur-md ${
                  isDark ? 'bg-purple-500/15 text-purple-300 border-purple-500/25' : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}
              >
                <Repeat className="w-3 h-3" />
                <span>Monthly</span>
              </span>
            )}
          </div>

          {/* Bill Name */}
          <h3
            className={`text-base font-bold tracking-tight truncate ${
              bill.paid
                ? isDark
                  ? 'line-through text-slate-500'
                  : 'line-through text-slate-400'
                : isDark
                ? 'text-white'
                : 'text-slate-900'
            }`}
          >
            {bill.name}
          </h3>

          {/* Due date info */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className={`flex items-center gap-1 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Due: <strong className={statusInfo.status === 'overdue' ? 'text-red-400' : ''}>{formattedDueDate}</strong>
            </span>

            {/* Disconnect/Late Warning Notice */}
            {formattedDisconnectDate && (
              <span className="flex items-center gap-1 text-red-400 dark:text-red-400 font-semibold text-[11px] bg-red-500/15 px-2 py-0.5 rounded-md border border-red-500/30 backdrop-blur-md">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                Late/Shutoff: {formattedDisconnectDate}
              </span>
            )}
          </div>

          {/* Optional Notes */}
          {bill.notes && (
            <p className={`text-[11px] line-clamp-1 italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Note: {bill.notes}
            </p>
          )}
        </div>

        {/* Amount Display */}
        <div className="text-right shrink-0">
          <div className={`text-xl font-extrabold tracking-tight ${
            bill.paid 
              ? isDark ? 'text-slate-500' : 'text-slate-400' 
              : isDark ? 'text-white' : 'text-slate-950'
          }`}>
            ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className={`text-[10px] font-medium block uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {bill.paid ? 'Settled' : 'Amount Due'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div
        className={`pt-2.5 mt-1 border-t flex flex-wrap items-center justify-between gap-2 ${
          isDark ? 'border-white/10' : 'border-slate-200/80'
        }`}
      >
        {/* Left Primary Actions: Mark Paid & Calendar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id={`btn-toggle-paid-${bill.id || index}`}
            onClick={() => onTogglePaid(bill, index)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 backdrop-blur-md ${
              bill.paid
                ? isDark
                  ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-md shadow-emerald-500/20 border border-emerald-300/40'
            }`}
          >
            {bill.paid ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mark Unpaid</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Mark Paid</span>
              </>
            )}
          </button>

          <button
            id={`btn-cal-${bill.id || index}`}
            onClick={() => onDownloadICS(bill)}
            title="Download iCal (.ics) with reminder alert for Apple Calendar, Google Calendar, or Outlook"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border backdrop-blur-md ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20'
                : 'bg-white/80 border-slate-200/80 text-slate-700 hover:text-slate-950 hover:bg-white shadow-sm'
            }`}
          >
            <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Add to Cal</span>
          </button>
        </div>

        {/* Right Secondary Actions: Edit & Delete */}
        <div className="flex items-center gap-1">
          <button
            id={`btn-edit-${bill.id || index}`}
            onClick={() => onEdit(bill, index)}
            title="Edit bill details"
            className={`p-1.5 rounded-lg text-xs transition-colors backdrop-blur-md ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            id={`btn-delete-${bill.id || index}`}
            onClick={() => onDelete(bill, index)}
            title="Delete bill"
            className={`p-1.5 rounded-lg text-xs transition-colors backdrop-blur-md ${
              isDark ? 'text-red-400/80 hover:text-red-400 hover:bg-red-500/20' : 'text-red-500 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};

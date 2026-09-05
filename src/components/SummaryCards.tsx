import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  CalendarClock, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { SummaryStats } from '../types';

interface SummaryCardsProps {
  stats: SummaryStats;
  isDark: boolean;
  onFilterClick?: (filter: 'currentMonth' | 'upcoming' | 'overdue' | 'paid') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats, isDark, onFilterClick }) => {
  return (
    <section id="summary-section" className="space-y-3">
      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Card 1: Due This Month */}
        <div
          id="stat-card-due"
          onClick={() => onFilterClick?.('currentMonth')}
          className={`cursor-pointer transition-all duration-200 p-3.5 rounded-2xl border backdrop-blur-xl relative overflow-hidden group ${
            isDark
              ? 'bg-white/[0.04] border-white/10 hover:border-amber-500/50 hover:bg-white/[0.07] shadow-lg shadow-black/20'
              : 'bg-white/70 border-white/80 hover:border-amber-400 hover:bg-white/90 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Due This Month
            </span>
            <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center backdrop-blur-md">
              <CalendarClock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
            ${stats.totalDueThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {stats.upcomingCount} pending
            </span>
            <span className="text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Paid This Month */}
        <div
          id="stat-card-paid"
          onClick={() => onFilterClick?.('paid')}
          className={`cursor-pointer transition-all duration-200 p-3.5 rounded-2xl border backdrop-blur-xl relative overflow-hidden group ${
            isDark
              ? 'bg-white/[0.04] border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.07] shadow-lg shadow-black/20'
              : 'bg-white/70 border-white/80 hover:border-emerald-400 hover:bg-white/90 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Paid So Far
            </span>
            <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center backdrop-blur-md">
              <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
            ${stats.totalPaidThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {stats.paidBillsCount} completed
            </span>
            <span className="text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Overdue (Highlighted if > 0) */}
        <div
          id="stat-card-overdue"
          onClick={() => onFilterClick?.('overdue')}
          className={`cursor-pointer transition-all duration-200 p-3.5 rounded-2xl border backdrop-blur-xl relative overflow-hidden group ${
            stats.totalOverdue > 0
              ? isDark
                ? 'bg-red-950/30 border-red-500/40 card-overdue-glow'
                : 'bg-red-50/80 border-red-300/80 shadow-md shadow-red-100'
              : isDark
              ? 'bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.07] shadow-lg shadow-black/20'
              : 'bg-white/70 border-white/80 hover:border-slate-300 hover:bg-white/90 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${
              stats.totalOverdue > 0 ? 'text-red-400' : isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Overdue
            </span>
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center backdrop-blur-md border ${
              stats.totalOverdue > 0 ? 'bg-red-500/20 text-red-400 border-red-500/30' : isDark ? 'bg-white/5 text-slate-500 border-white/5' : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className={`text-xl sm:text-2xl font-black tracking-tight ${
            stats.totalOverdue > 0 ? 'text-red-400' : isDark ? 'text-slate-200' : 'text-slate-700'
          }`}>
            ${stats.totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className={stats.totalOverdue > 0 ? 'text-red-400 font-semibold' : isDark ? 'text-slate-400' : 'text-slate-500'}>
              {stats.overdueBillsCount > 0 ? `${stats.overdueBillsCount} action needed` : 'All caught up'}
            </span>
            {stats.overdueBillsCount > 0 && (
              <span className="text-red-400 font-medium flex items-center gap-0.5">
                Resolve <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Next Month Pipeline */}
        <div
          id="stat-card-next-month"
          onClick={() => onFilterClick?.('upcoming')}
          className={`cursor-pointer transition-all duration-200 p-3.5 rounded-2xl border backdrop-blur-xl relative overflow-hidden group ${
            isDark
              ? 'bg-white/[0.04] border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.07] shadow-lg shadow-black/20'
              : 'bg-white/70 border-white/80 hover:border-cyan-400 hover:bg-white/90 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Next Month
            </span>
            <span className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 flex items-center justify-center backdrop-blur-md">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 tracking-tight">
            ${stats.totalNextMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Upcoming cycle
            </span>
            <span className="text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Plan <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Monthly Budget Bar */}
      {stats.monthlyBudgetTotal > 0 && (
        <div
          id="monthly-progress-card"
          className={`p-3.5 rounded-2xl border backdrop-blur-xl transition-all ${
            isDark
              ? 'bg-white/[0.04] border-white/10 shadow-lg shadow-black/20'
              : 'bg-white/70 border-white/80 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Monthly Budget Fulfillment
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md border ${
                stats.percentagePaid === 100 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
              }`}>
                {stats.percentagePaid.toFixed(0)}% Settled
              </span>
            </div>
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Commitment: <strong className={isDark ? 'text-white' : 'text-slate-900'}>${stats.monthlyBudgetTotal.toFixed(2)}</strong>
            </span>
          </div>

          <div className={`h-2.5 w-full rounded-full overflow-hidden flex ${isDark ? 'bg-white/10' : 'bg-slate-200/80'}`}>
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${stats.percentagePaid}%` }}
              title={`Paid: $${stats.totalPaidThisMonth.toFixed(2)}`}
            />
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
              style={{ width: `${Math.max(0, 100 - stats.percentagePaid)}%` }}
              title={`Remaining Due: $${stats.totalDueThisMonth.toFixed(2)}`}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50" />
              <span>Paid (${stats.totalPaidThisMonth.toFixed(2)})</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400/50" />
              <span>Unpaid Due (${stats.totalDueThisMonth.toFixed(2)})</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

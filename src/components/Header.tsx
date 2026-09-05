import React from 'react';
import { 
  Calendar, 
  Moon, 
  Sun, 
  PieChart, 
  CalendarDays, 
  DownloadCloud,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { getTodayDisplay } from '../utils/dateUtils';
import { SummaryStats } from '../types';

interface HeaderProps {
  stats: SummaryStats;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAnalytics: () => void;
  onOpenBulkCalendar: () => void;
  onOpenBackup: () => void;
  activeView: 'bills' | 'analytics';
  onToggleView: (view: 'bills' | 'analytics') => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  isDark,
  onToggleTheme,
  onOpenAnalytics,
  onOpenBulkCalendar,
  onOpenBackup,
  activeView,
  onToggleView,
}) => {
  const todayFormatted = getTodayDisplay();

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-30 transition-colors duration-200 border-b backdrop-blur-xl ${
        isDark
          ? 'bg-slate-950/70 border-white/10 text-slate-100 shadow-lg shadow-black/20'
          : 'bg-white/70 border-white/80 text-slate-900 shadow-sm shadow-slate-200/50'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2.5">
          {/* Brand & Companion info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 text-slate-950 font-black text-lg border border-white/20">
              $
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight truncate">
                  Bills Manager
                </h1>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                  v2.0
                </span>
              </div>
              <p className={`text-[11px] font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {stats.monthTotalBillsCount} bills tracked &bull; {todayFormatted}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Switcher: Bills vs Analytics */}
            <div
              className={`p-0.5 rounded-xl border backdrop-blur-md flex items-center ${
                isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-100/80 border-slate-200/80'
              }`}
            >
              <button
                id="header-view-bills"
                onClick={() => onToggleView('bills')}
                aria-label="View bills list"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeView === 'bills'
                    ? isDark
                      ? 'bg-white/10 text-amber-400 border border-white/10 shadow-sm backdrop-blur-md'
                      : 'bg-white text-amber-600 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Bills</span>
              </button>
              <button
                id="header-view-analytics"
                onClick={() => onToggleView('analytics')}
                aria-label="View analytics breakdown"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeView === 'analytics'
                    ? isDark
                      ? 'bg-white/10 text-amber-400 border border-white/10 shadow-sm backdrop-blur-md'
                      : 'bg-white text-amber-600 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Insights</span>
              </button>
            </div>

            {/* Calendar Sync Menu Button */}
            <button
              id="header-bulk-cal-btn"
              onClick={onOpenBulkCalendar}
              title="Sync upcoming bills to Apple/Google Calendar"
              className={`p-2 rounded-xl border text-xs font-medium backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20'
                  : 'bg-white/80 border-slate-200/80 text-slate-700 hover:text-slate-950 hover:bg-white shadow-sm'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>

            {/* Backup & Import Button */}
            <button
              id="header-backup-btn"
              onClick={onOpenBackup}
              title="Backup & Restore Data"
              className={`p-2 rounded-xl border text-xs font-medium backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20'
                  : 'bg-white/80 border-slate-200/80 text-slate-700 hover:text-slate-950 hover:bg-white shadow-sm'
              }`}
            >
              <DownloadCloud className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              id="header-theme-toggle"
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 rounded-xl border text-xs font-medium backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-white/[0.04] border-white/10 text-amber-400 hover:bg-white/[0.08] hover:border-white/20'
                  : 'bg-white/80 border-slate-200/80 text-amber-600 hover:bg-white shadow-sm'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

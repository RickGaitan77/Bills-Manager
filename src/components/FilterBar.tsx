import React from 'react';
import { 
  Search, 
  ArrowUpDown, 
  X, 
  AlertCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ListFilter
} from 'lucide-react';
import { FilterType, SortType } from '../types';

interface FilterBarProps {
  currentFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
  overdueCount: number;
  unpaidMonthCount: number;
  paidCount: number;
  totalCount: number;
  isDark: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  currentSort,
  onSortChange,
  overdueCount,
  unpaidMonthCount,
  paidCount,
  totalCount,
  isDark,
}) => {
  const tabs: Array<{ id: FilterType; label: string; count?: number; highlightBadge?: boolean }> = [
    { id: 'currentMonth', label: 'This Month', count: unpaidMonthCount },
    { id: 'upcoming', label: 'Unpaid' },
    { id: 'nextMonth', label: 'Next Month' },
    { id: 'paid', label: 'Paid', count: paidCount },
    { id: 'all', label: 'All Bills', count: totalCount },
  ];

  return (
    <div id="filter-control-panel" className="space-y-2.5">
      {/* Scrollable Horizontal Pill Tabs (Mobile-first) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              id={`filter-${tab.id}`}
              onClick={() => onSelectFilter(tab.id)}
              className={`shrink-0 py-2 px-3 text-xs font-semibold rounded-xl border backdrop-blur-xl transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 border-amber-300/50 shadow-lg shadow-amber-500/20 font-bold'
                  : isDark
                  ? 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/[0.08]'
                  : 'bg-white/70 border-white/80 text-slate-700 hover:text-slate-950 hover:bg-white shadow-sm'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold backdrop-blur-md ${
                    tab.highlightBadge && !isActive
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : isActive
                      ? 'bg-slate-950/20 text-slate-950'
                      : isDark
                      ? 'bg-white/10 text-slate-300 border border-white/10'
                      : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`}
          />
          <input
            id="bill-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search bills by name, category, notes..."
            className={`w-full text-xs rounded-xl pl-8 pr-8 py-2.5 border backdrop-blur-xl transition-all outline-none ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-400 focus:border-amber-400/60 focus:bg-white/[0.07]'
                : 'bg-white/70 border-white/80 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white shadow-sm'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="relative shrink-0">
          <select
            id="bill-sort-select"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className={`text-xs rounded-xl pl-2.5 pr-7 py-2.5 border backdrop-blur-xl font-medium appearance-none cursor-pointer outline-none transition-all ${
              isDark
                ? 'bg-slate-900/80 border-white/10 text-slate-300 focus:border-amber-400/60 focus:bg-slate-900'
                : 'bg-white/80 border-white/80 text-slate-700 focus:border-amber-500 shadow-sm'
            }`}
          >
            <option value="dueDateAsc">Due Date (Earliest)</option>
            <option value="dueDateDesc">Due Date (Latest)</option>
            <option value="amountDesc">Amount (Highest)</option>
            <option value="amountAsc">Amount (Lowest)</option>
            <option value="nameAsc">Name (A-Z)</option>
          </select>
          <ArrowUpDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
            isDark ? 'text-slate-400' : 'text-slate-400'
          }`} />
        </div>
      </div>
    </div>
  );
};

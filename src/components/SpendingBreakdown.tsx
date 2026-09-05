import React, { useMemo } from 'react';
import { 
  PieChart, 
  TrendingUp, 
  Layers, 
  DollarSign, 
  Repeat, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { Bill, BillCategory } from '../types';
import { CATEGORIES, CATEGORY_LIST } from '../utils/categories';
import { CategoryIcon } from './CategoryIcon';

interface SpendingBreakdownProps {
  bills: Bill[];
  isDark: boolean;
}

export const SpendingBreakdown: React.FC<SpendingBreakdownProps> = ({ bills, isDark }) => {
  // Category Breakdown Data
  const categoryStats = useMemo(() => {
    const map: Record<BillCategory, { total: number; count: number; paidTotal: number }> = {
      utilities: { total: 0, count: 0, paidTotal: 0 },
      housing: { total: 0, count: 0, paidTotal: 0 },
      subscriptions: { total: 0, count: 0, paidTotal: 0 },
      telecom: { total: 0, count: 0, paidTotal: 0 },
      credit_loan: { total: 0, count: 0, paidTotal: 0 },
      insurance: { total: 0, count: 0, paidTotal: 0 },
      health: { total: 0, count: 0, paidTotal: 0 },
      transport: { total: 0, count: 0, paidTotal: 0 },
      other: { total: 0, count: 0, paidTotal: 0 },
    };

    let grandTotal = 0;

    bills.forEach((bill) => {
      const cat = bill.category || 'other';
      const amt = parseFloat(bill.amount) || 0;
      grandTotal += amt;
      if (map[cat]) {
        map[cat].total += amt;
        map[cat].count += 1;
        if (bill.paid) {
          map[cat].paidTotal += amt;
        }
      }
    });

    const list = Object.entries(map)
      .map(([key, data]) => {
        const catKey = key as BillCategory;
        const meta = CATEGORIES[catKey] || CATEGORIES.other;
        const percentage = grandTotal > 0 ? (data.total / grandTotal) * 100 : 0;
        return {
          category: catKey,
          meta,
          ...data,
          percentage,
        };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.total - a.total);

    return { list, grandTotal };
  }, [bills]);

  // Recurring vs Single Payment Breakdown
  const recurringStats = useMemo(() => {
    let recurringTotal = 0;
    let oneTimeTotal = 0;
    let recurringCount = 0;
    let oneTimeCount = 0;

    bills.forEach((b) => {
      const amt = parseFloat(b.amount) || 0;
      if (b.isRecurring) {
        recurringTotal += amt;
        recurringCount++;
      } else {
        oneTimeTotal += amt;
        oneTimeCount++;
      }
    });

    const total = recurringTotal + oneTimeTotal;
    return {
      recurringTotal,
      oneTimeTotal,
      recurringCount,
      oneTimeCount,
      recurringPercent: total > 0 ? (recurringTotal / total) * 100 : 0,
      oneTimePercent: total > 0 ? (oneTimeTotal / total) * 100 : 0,
    };
  }, [bills]);

  // Top Highest Expense Bills
  const topBills = useMemo(() => {
    return [...bills]
      .sort((a, b) => (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0))
      .slice(0, 5);
  }, [bills]);

  return (
    <div id="analytics-view" className="space-y-4">
      {/* Category Spending Breakdown Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-xl transition-all ${
          isDark ? 'bg-white/[0.04] border-white/10 shadow-lg shadow-black/20' : 'bg-white/70 border-white/80 shadow-md shadow-slate-200/50'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-400" />
              Category Spending Distribution
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Allocation across {categoryStats.list.length} active spending categories
            </p>
          </div>
          <span className="text-sm font-bold text-amber-400">
            Total ${categoryStats.grandTotal.toFixed(2)}
          </span>
        </div>

        {/* Stacked Multi-Color Segment Bar */}
        {categoryStats.grandTotal > 0 && (
          <div className="mb-5">
            <div className={`h-3.5 w-full rounded-full overflow-hidden flex ${isDark ? 'bg-white/10' : 'bg-slate-200/70'}`}>
              {categoryStats.list.map((item) => (
                <div
                  key={item.category}
                  style={{
                    width: `${Math.max(item.percentage, 2)}%`,
                    backgroundColor: item.meta.color,
                  }}
                  className="h-full transition-all duration-300 relative group cursor-pointer"
                  title={`${item.meta.label}: $${item.total.toFixed(2)} (${item.percentage.toFixed(1)}%)`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category List with Visual Progress Meters */}
        <div className="space-y-3">
          {categoryStats.list.length === 0 ? (
            <p className={`text-xs py-4 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No bills available to analyze yet.
            </p>
          ) : (
            categoryStats.list.map((item) => (
              <div
                key={item.category}
                id={`analytics-cat-${item.category}`}
                className={`p-3 rounded-xl border backdrop-blur-md transition-all ${
                  isDark ? 'bg-white/[0.03] border-white/5 hover:border-white/15' : 'bg-white/80 border-slate-200/80 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      style={{ backgroundColor: `${item.meta.color}25`, color: item.meta.color }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 backdrop-blur-md border border-white/10"
                    >
                      <CategoryIcon category={item.category} className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span>{item.meta.label}</span>
                        <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          ({item.count} bill{item.count === 1 ? '' : 's'})
                        </span>
                      </div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        ${item.paidTotal.toFixed(2)} paid &bull; ${(item.total - item.paidTotal).toFixed(2)} pending
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-100 dark:text-slate-100">
                      ${item.total.toFixed(2)}
                    </div>
                    <span className="text-[11px] font-semibold text-amber-400">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.meta.color,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Grid for Recurring Dynamics and Top Expenses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Recurring vs Fixed Card */}
        <div
          className={`p-4 rounded-2xl border backdrop-blur-xl ${
            isDark ? 'bg-white/[0.04] border-white/10 shadow-lg shadow-black/20' : 'bg-white/70 border-white/80 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Repeat className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs uppercase tracking-wider font-bold">
              Payment Structure
            </h3>
          </div>

          <div className="space-y-3">
            <div className={`p-3 rounded-xl border backdrop-blur-md ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white/80 border-slate-200/80'}`}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/50" />
                  Monthly Recurring
                </span>
                <span className="font-bold text-purple-400">
                  ${recurringStats.recurringTotal.toFixed(2)} ({recurringStats.recurringPercent.toFixed(0)}%)
                </span>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {recurringStats.recurringCount} recurring subscription / utility bills
              </p>
            </div>

            <div className={`p-3 rounded-xl border backdrop-blur-md ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white/80 border-slate-200/80'}`}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-sm shadow-cyan-400/50" />
                  One-time / Variable
                </span>
                <span className="font-bold text-cyan-400">
                  ${recurringStats.oneTimeTotal.toFixed(2)} ({recurringStats.oneTimePercent.toFixed(0)}%)
                </span>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {recurringStats.oneTimeCount} non-recurring bills
              </p>
            </div>
          </div>
        </div>

        {/* Top 5 Expenses Card */}
        <div
          className={`p-4 rounded-2xl border backdrop-blur-xl ${
            isDark ? 'bg-white/[0.04] border-white/10 shadow-lg shadow-black/20' : 'bg-white/70 border-white/80 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs uppercase tracking-wider font-bold">
              Top Expenses Ranking
            </h3>
          </div>

          <div className="space-y-2">
            {topBills.length === 0 ? (
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No bills recorded.</p>
            ) : (
              topBills.map((bill, i) => (
                <div
                  key={bill.id || i}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs border backdrop-blur-md ${
                    isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white/80 border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0 border border-white/10">
                      #{i + 1}
                    </span>
                    <span className="font-medium truncate max-w-[140px] sm:max-w-[180px]">
                      {bill.name}
                    </span>
                  </div>
                  <span className="font-bold text-amber-400 shrink-0">
                    ${parseFloat(bill.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

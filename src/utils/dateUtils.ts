import { Bill, BillStatusInfo } from '../types';

/**
 * Given a date string YYYY-MM-DD, calculates the next month date
 * accurately preserving day of month (or clamping if month has fewer days).
 * This faithfully preserves the original business rule of advancing recurring bills by 1 month.
 */
export function getNextMonthDate(dateString?: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return '';

  const [year, month, day] = parts; // Note: month is 1-indexed (1..12)
  
  // Target next month:
  let nextYear = year;
  let nextMonth = month + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }

  // Handle day overflow (e.g., Jan 31 -> Feb 28/29)
  const daysInNextMonth = new Date(nextYear, nextMonth, 0).getDate();
  const clampedDay = Math.min(day, daysInNextMonth);

  const nextY = String(nextYear);
  const nextM = String(nextMonth).padStart(2, '0');
  const nextD = String(clampedDay).padStart(2, '0');
  return `${nextY}-${nextM}-${nextD}`;
}

/**
 * Calculates day difference from today.
 * Negative = overdue
 * 0 = due today
 * Positive = due in N days
 */
export function getDiffDays(dueDateStr: string): number {
  if (!dueDateStr) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = dueDateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats a YYYY-MM-DD date into friendly readable string (e.g. "Oct 15, 2026")
 */
export function formatDisplayDate(dateStr?: string, includeYear = false): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: includeYear ? 'numeric' : undefined,
  });
}

/**
 * Format today's date for display
 */
export function getTodayDisplay(): string {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Checks if a bill's due date is within current calendar month and year
 */
export function isCurrentMonth(dateStr?: string): boolean {
  if (!dateStr) return false;
  const [y, m] = dateStr.split('-').map(Number);
  const now = new Date();
  return y === now.getFullYear() && m === now.getMonth() + 1;
}

/**
 * Checks if a bill's due date is in next calendar month and year
 */
export function isNextMonth(dateStr?: string): boolean {
  if (!dateStr) return false;
  const [y, m] = dateStr.split('-').map(Number);
  const now = new Date();
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return y === nextMonthDate.getFullYear() && m === nextMonthDate.getMonth() + 1;
}

/**
 * Computes status information, labels, and badges for a bill.
 */
export function getStatusInfo(bill: Bill): BillStatusInfo {
  if (bill.paid) {
    return {
      status: 'paid',
      diffDays: 0,
      badgeLabel: 'Paid',
      cardBorderClass: 'border-zinc-800 dark:border-zinc-800 opacity-65',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      indicatorColor: '#10b981',
    };
  }

  const diffDays = getDiffDays(bill.dueDate);

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      status: 'overdue',
      diffDays,
      badgeLabel: overdueDays === 1 ? '1 day overdue' : `${overdueDays} days overdue`,
      cardBorderClass: 'border-red-500/60 card-overdue-glow',
      badgeClass: 'bg-red-500/15 text-red-400 font-semibold border border-red-500/30 animate-pulse',
      indicatorColor: '#ef4444',
    };
  }

  if (diffDays === 0) {
    return {
      status: 'dueToday',
      diffDays,
      badgeLabel: 'Due Today',
      cardBorderClass: 'border-amber-500/80 card-due-soon-glow',
      badgeClass: 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40',
      indicatorColor: '#f59e0b',
    };
  }

  if (diffDays <= 3) {
    return {
      status: 'dueSoon',
      diffDays,
      badgeLabel: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
      cardBorderClass: 'border-amber-500/50 card-due-soon-glow',
      badgeClass: 'bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20',
      indicatorColor: '#f59e0b',
    };
  }

  return {
    status: 'safe',
    diffDays,
    badgeLabel: `Due in ${diffDays} days`,
    cardBorderClass: 'border-emerald-500/30 hover:border-emerald-500/50',
    badgeClass: 'bg-zinc-800 text-zinc-300 border border-zinc-700/60',
    indicatorColor: '#10b981',
  };
}

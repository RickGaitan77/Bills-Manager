export type BillCategory = 
  | 'utilities'
  | 'housing'
  | 'subscriptions'
  | 'telecom'
  | 'credit_loan'
  | 'insurance'
  | 'health'
  | 'transport'
  | 'other';

export interface Bill {
  id?: string;
  name: string;
  amount: string; // e.g. "120.50"
  dueDate: string; // "YYYY-MM-DD"
  disconnectDate?: string; // "YYYY-MM-DD" or ""
  isRecurring?: boolean;
  paid: boolean;
  category?: BillCategory;
  notes?: string;
  paidAt?: string; // ISO date string when marked paid
}

export type FilterType = 'currentMonth' | 'upcoming' | 'nextMonth' | 'paid' | 'overdue' | 'all';

export type SortType = 
  | 'dueDateAsc' 
  | 'dueDateDesc' 
  | 'amountDesc' 
  | 'amountAsc' 
  | 'nameAsc';

export interface CategoryMeta {
  id: BillCategory;
  label: string;
  iconName: string;
  color: string;
  bgDark: string;
  bgLight: string;
  textDark: string;
  textLight: string;
}

export interface BillStatusInfo {
  status: 'paid' | 'overdue' | 'dueToday' | 'dueSoon' | 'safe';
  diffDays: number;
  badgeLabel: string;
  cardBorderClass: string;
  badgeClass: string;
  indicatorColor: string;
}

export interface SummaryStats {
  totalDueThisMonth: number;
  totalPaidThisMonth: number;
  totalOverdue: number;
  totalNextMonth: number;
  monthTotalBillsCount: number;
  paidBillsCount: number;
  overdueBillsCount: number;
  upcomingCount: number;
  monthlyBudgetTotal: number;
  percentagePaid: number;
}

import { BillCategory, CategoryMeta } from '../types';

export const CATEGORIES: Record<BillCategory, CategoryMeta> = {
  utilities: {
    id: 'utilities',
    label: 'Utilities & Power',
    iconName: 'Zap',
    color: '#eab308', // amber/yellow
    bgDark: 'bg-amber-500/15',
    bgLight: 'bg-amber-50',
    textDark: 'text-amber-400',
    textLight: 'text-amber-700',
  },
  housing: {
    id: 'housing',
    label: 'Housing / Rent',
    iconName: 'Home',
    color: '#3b82f6', // blue
    bgDark: 'bg-blue-500/15',
    bgLight: 'bg-blue-50',
    textDark: 'text-blue-400',
    textLight: 'text-blue-700',
  },
  subscriptions: {
    id: 'subscriptions',
    label: 'Subscriptions',
    iconName: 'Film',
    color: '#a855f7', // purple
    bgDark: 'bg-purple-500/15',
    bgLight: 'bg-purple-50',
    textDark: 'text-purple-400',
    textLight: 'text-purple-700',
  },
  telecom: {
    id: 'telecom',
    label: 'Internet & Phone',
    iconName: 'Wifi',
    color: '#06b6d4', // cyan
    bgDark: 'bg-cyan-500/15',
    bgLight: 'bg-cyan-50',
    textDark: 'text-cyan-400',
    textLight: 'text-cyan-700',
  },
  credit_loan: {
    id: 'credit_loan',
    label: 'Credit & Loans',
    iconName: 'CreditCard',
    color: '#f43f5e', // rose
    bgDark: 'bg-rose-500/15',
    bgLight: 'bg-rose-50',
    textDark: 'text-rose-400',
    textLight: 'text-rose-700',
  },
  insurance: {
    id: 'insurance',
    label: 'Insurance',
    iconName: 'ShieldCheck',
    color: '#10b981', // emerald
    bgDark: 'bg-emerald-500/15',
    bgLight: 'bg-emerald-50',
    textDark: 'text-emerald-400',
    textLight: 'text-emerald-700',
  },
  health: {
    id: 'health',
    label: 'Medical & Health',
    iconName: 'HeartPulse',
    color: '#ec4899', // pink
    bgDark: 'bg-pink-500/15',
    bgLight: 'bg-pink-50',
    textDark: 'text-pink-400',
    textLight: 'text-pink-700',
  },
  transport: {
    id: 'transport',
    label: 'Transport & Auto',
    iconName: 'Car',
    color: '#f97316', // orange
    bgDark: 'bg-orange-500/15',
    bgLight: 'bg-orange-50',
    textDark: 'text-orange-400',
    textLight: 'text-orange-700',
  },
  other: {
    id: 'other',
    label: 'Other & General',
    iconName: 'Receipt',
    color: '#94a3b8', // slate
    bgDark: 'bg-zinc-800',
    bgLight: 'bg-zinc-100',
    textDark: 'text-zinc-300',
    textLight: 'text-zinc-700',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export function inferCategoryFromName(name: string): BillCategory {
  const lower = name.toLowerCase();
  if (lower.includes('electric') || lower.includes('power') || lower.includes('water') || lower.includes('gas') || lower.includes('utility') || lower.includes('trash') || lower.includes('sewer') || lower.includes('energy')) {
    return 'utilities';
  }
  if (lower.includes('rent') || lower.includes('mortgage') || lower.includes('lease') || lower.includes('hoa') || lower.includes('condo')) {
    return 'housing';
  }
  if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('apple') || lower.includes('youtube') || lower.includes('prime') || lower.includes('disney') || lower.includes('hulu') || lower.includes('sub') || lower.includes('gym') || lower.includes('chatgpt') || lower.includes('cloud')) {
    return 'subscriptions';
  }
  if (lower.includes('internet') || lower.includes('wifi') || lower.includes('phone') || lower.includes('verizon') || lower.includes('at&t') || lower.includes('t-mobile') || lower.includes('comcast') || lower.includes('spectrum')) {
    return 'telecom';
  }
  if (lower.includes('credit') || lower.includes('card') || lower.includes('loan') || lower.includes('chase') || lower.includes('citi') || lower.includes('amex') || lower.includes('capital one') || lower.includes('discover') || lower.includes('student') || lower.includes('bank')) {
    return 'credit_loan';
  }
  if (lower.includes('insurance') || lower.includes('geico') || lower.includes('progressive') || lower.includes('state farm') || lower.includes('allstate')) {
    return 'insurance';
  }
  if (lower.includes('health') || lower.includes('doctor') || lower.includes('dental') || lower.includes('medical') || lower.includes('vision') || lower.includes('pharmacy') || lower.includes('hospital')) {
    return 'health';
  }
  if (lower.includes('car') || lower.includes('auto') || lower.includes('gasoline') || lower.includes('toll') || lower.includes('parking') || lower.includes('transit')) {
    return 'transport';
  }
  return 'other';
}

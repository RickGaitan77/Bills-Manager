import React from 'react';
import {
  Zap,
  Home,
  Film,
  Wifi,
  CreditCard,
  ShieldCheck,
  HeartPulse,
  Car,
  Receipt,
  LucideProps,
} from 'lucide-react';
import { BillCategory } from '../types';
import { CATEGORIES } from '../utils/categories';

interface CategoryIconProps extends LucideProps {
  category?: BillCategory;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category = 'other', ...props }) => {
  switch (category) {
    case 'utilities':
      return <Zap {...props} />;
    case 'housing':
      return <Home {...props} />;
    case 'subscriptions':
      return <Film {...props} />;
    case 'telecom':
      return <Wifi {...props} />;
    case 'credit_loan':
      return <CreditCard {...props} />;
    case 'insurance':
      return <ShieldCheck {...props} />;
    case 'health':
      return <HeartPulse {...props} />;
    case 'transport':
      return <Car {...props} />;
    case 'other':
    default:
      return <Receipt {...props} />;
  }
};

export const CategoryBadge: React.FC<{ category?: BillCategory; isDark?: boolean }> = ({
  category = 'other',
  isDark = true,
}) => {
  const meta = CATEGORIES[category] || CATEGORIES.other;

  return (
    <span
      id={`cat-badge-${category}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
        isDark ? `${meta.bgDark} ${meta.textDark}` : `${meta.bgLight} ${meta.textLight}`
      }`}
    >
      <CategoryIcon category={category} className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{meta.label}</span>
    </span>
  );
};

import { Bill } from '../types';
import { inferCategoryFromName } from './categories';

const STORAGE_KEY = 'bills';

/**
 * Default sample bills for new users to demonstrate all states
 * (overdue, due soon, upcoming, recurring, and paid)
 */
export function getSampleBills(): Bill[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  // Helper to make date in current month
  const makeDate = (dayOffset: number) => {
    const target = new Date(now);
    target.setDate(d + dayOffset);
    const ty = target.getFullYear();
    const tm = String(target.getMonth() + 1).padStart(2, '0');
    const td = String(target.getDate()).padStart(2, '0');
    return `${ty}-${tm}-${td}`;
  };

  return [
    {
      id: 'sample-1',
      name: 'Electric & Gas Utility',
      amount: '142.50',
      dueDate: makeDate(-2), // 2 days overdue
      disconnectDate: makeDate(5),
      isRecurring: true,
      paid: false,
      category: 'utilities',
      notes: 'Account #482910',
    },
    {
      id: 'sample-2',
      name: 'High-Speed Fiber Internet',
      amount: '79.99',
      dueDate: makeDate(1), // due tomorrow / soon
      isRecurring: true,
      paid: false,
      category: 'telecom',
      notes: 'Autopay failed last cycle',
    },
    {
      id: 'sample-3',
      name: 'Apartment Rent',
      amount: '1450.00',
      dueDate: makeDate(8),
      isRecurring: true,
      paid: false,
      category: 'housing',
      notes: 'Pay via tenant portal',
    },
    {
      id: 'sample-4',
      name: 'Car & Auto Insurance',
      amount: '115.00',
      dueDate: makeDate(14),
      isRecurring: true,
      paid: false,
      category: 'insurance',
    },
    {
      id: 'sample-5',
      name: 'Streaming Bundle (Netflix & Spotify)',
      amount: '32.98',
      dueDate: makeDate(-6),
      isRecurring: true,
      paid: true,
      category: 'subscriptions',
    },
  ];
}

/**
 * Loads bills from localStorage, preserving raw schemas and ensuring integrity.
 */
export function loadBillsFromStorage(): Bill[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const samples = getSampleBills();
      saveBillsToStorage(samples);
      return samples;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Sanitize and ensure backwards compatibility
    return parsed.map((bill, index) => {
      const name = String(bill.name || 'Untitled Bill');
      const amount = String(bill.amount || '0.00');
      const dueDate = String(bill.dueDate || '');
      const disconnectDate = bill.disconnectDate ? String(bill.disconnectDate) : '';
      const isRecurring = Boolean(bill.isRecurring);
      const paid = Boolean(bill.paid);
      const category = bill.category || inferCategoryFromName(name);
      const notes = bill.notes ? String(bill.notes) : '';
      const id = bill.id || `bill-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`;

      return {
        id,
        name,
        amount,
        dueDate,
        disconnectDate,
        isRecurring,
        paid,
        category,
        notes,
      };
    });
  } catch (err) {
    console.error('Failed to load bills from localStorage', err);
    return [];
  }
}

/**
 * Persists bills to localStorage in the exact structure expected.
 */
export function saveBillsToStorage(bills: Bill[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
  } catch (err) {
    console.error('Failed to save bills to localStorage', err);
  }
}

/**
 * Exports all bills as a JSON file backup.
 */
export function exportBillsBackup(bills: Bill[]): void {
  const jsonStr = JSON.stringify(bills, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `Bills_Backup_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Imports bills from a parsed JSON array, validating properties.
 */
export function validateAndImportBills(raw: unknown): Bill[] {
  if (!Array.isArray(raw)) {
    throw new Error('Invalid file format: JSON root must be an array of bills');
  }

  return raw.map((item, index) => {
    if (!item.name || !item.dueDate) {
      throw new Error(`Bill at index ${index} is missing required fields (name, dueDate)`);
    }
    const name = String(item.name);
    return {
      id: item.id || `imported-${Date.now()}-${index}`,
      name,
      amount: String(item.amount || '0.00'),
      dueDate: String(item.dueDate),
      disconnectDate: item.disconnectDate ? String(item.disconnectDate) : '',
      isRecurring: Boolean(item.isRecurring),
      paid: Boolean(item.paid),
      category: item.category || inferCategoryFromName(name),
      notes: item.notes ? String(item.notes) : '',
    };
  });
}

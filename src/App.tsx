import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  CalendarDays, 
  PieChart, 
  RotateCcw, 
  FileText, 
  Sparkles, 
  Calendar,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';

import { Bill, FilterType, SortType, SummaryStats } from './types';
import { 
  loadBillsFromStorage, 
  saveBillsToStorage, 
  getSampleBills 
} from './utils/storage';
import { 
  getNextMonthDate, 
  getDiffDays, 
  isCurrentMonth, 
  isNextMonth 
} from './utils/dateUtils';
import { downloadBillICS } from './utils/calendar';

import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { SpendingBreakdown } from './components/SpendingBreakdown';
import { FilterBar } from './components/FilterBar';
import { BillCard } from './components/BillCard';
import { BillModal } from './components/BillModal';
import { CalendarExportModal } from './components/CalendarExportModal';
import { BackupModal } from './components/BackupModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Application State
  const [bills, setBills] = useState<Bill[]>(() => loadBillsFromStorage());
  const [currentFilter, setCurrentFilter] = useState<FilterType>('currentMonth');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentSort, setCurrentSort] = useState<SortType>('dueDateAsc');
  const [activeView, setActiveView] = useState<'bills' | 'analytics'>('bills');

  // Dark/Light Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved ? saved === 'dark' : true; // default dark as per original companion design
  });

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{ bill: Bill; index: number } | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save to storage on bill state changes
  useEffect(() => {
    saveBillsToStorage(bills);
  }, [bills]);

  // Persist theme
  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('theme_mode', next ? 'dark' : 'light');
      return next;
    });
  };

  // Compute Summary KPI Stats
  const summaryStats: SummaryStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalDueThisMonth = 0;
    let totalPaidThisMonth = 0;
    let totalOverdue = 0;
    let totalNextMonth = 0;
    let monthTotalBillsCount = 0;
    let paidBillsCount = 0;
    let overdueBillsCount = 0;
    let upcomingCount = 0;

    bills.forEach((bill) => {
      if (!bill.dueDate) return;
      const amt = parseFloat(bill.amount) || 0;
      const [y, m] = bill.dueDate.split('-').map(Number);
      const isThisMonth = y === currentYear && m === currentMonth + 1;
      const isTargetNextMonth = isNextMonth(bill.dueDate);
      const diff = getDiffDays(bill.dueDate);

      if (isThisMonth) {
        monthTotalBillsCount++;
        if (bill.paid) {
          totalPaidThisMonth += amt;
          paidBillsCount++;
        } else {
          totalDueThisMonth += amt;
          upcomingCount++;
        }
      }

      if (!bill.paid) {
        if (diff < 0) {
          totalOverdue += amt;
          overdueBillsCount++;
        }
        if (isTargetNextMonth) {
          totalNextMonth += amt;
        }
      }
    });

    const monthlyBudgetTotal = totalDueThisMonth + totalPaidThisMonth;
    const percentagePaid = monthlyBudgetTotal > 0 ? (totalPaidThisMonth / monthlyBudgetTotal) * 100 : 0;

    return {
      totalDueThisMonth,
      totalPaidThisMonth,
      totalOverdue,
      totalNextMonth,
      monthTotalBillsCount,
      paidBillsCount,
      overdueBillsCount,
      upcomingCount,
      monthlyBudgetTotal,
      percentagePaid,
    };
  }, [bills]);

  // Filter and Sort Bills
  const filteredAndSortedBills = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
    const targetNextMonth = nextMonthDate.getMonth();
    const targetNextYear = nextMonthDate.getFullYear();

    let result = bills.filter((bill) => {
      if (!bill.dueDate) return false;
      const [y, m] = bill.dueDate.split('-').map(Number);
      const billMonth = m - 1; // 0-indexed
      const billYear = y;
      const diffDays = getDiffDays(bill.dueDate);

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = bill.name.toLowerCase().includes(q);
        const matchesNotes = bill.notes ? bill.notes.toLowerCase().includes(q) : false;
        const matchesCategory = bill.category ? bill.category.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesNotes && !matchesCategory) return false;
      }

      // Tab filter
      switch (currentFilter) {
        case 'currentMonth':
          return billMonth === currentMonth && billYear === currentYear;
        case 'upcoming':
          return !bill.paid;
        case 'nextMonth':
          return billMonth === targetNextMonth && billYear === targetNextYear;
        case 'overdue':
          return !bill.paid && diffDays < 0;
        case 'paid':
          return bill.paid;
        case 'all':
        default:
          return true;
      }
    });

    // Sorting
    return result.sort((a, b) => {
      const amtA = parseFloat(a.amount) || 0;
      const amtB = parseFloat(b.amount) || 0;
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();

      switch (currentSort) {
        case 'dueDateAsc':
          return dateA - dateB;
        case 'dueDateDesc':
          return dateB - dateA;
        case 'amountDesc':
          return amtB - amtA;
        case 'amountAsc':
          return amtA - amtB;
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        default:
          return dateA - dateB;
      }
    });
  }, [bills, currentFilter, searchQuery, currentSort]);

  // Toggle Paid & Next-Month Recurrence logic (Exact preservation of original business rules)
  const handleTogglePaid = (targetBill: Bill, indexInFiltered: number) => {
    const actualIndex = bills.findIndex(
      (b) => (b.id && b.id === targetBill.id) || (b.name === targetBill.name && b.dueDate === targetBill.dueDate && b.amount === targetBill.amount)
    );
    if (actualIndex === -1) return;

    const previousState = [...bills];
    const bill = { ...bills[actualIndex] };
    const wasPaid = bill.paid;
    bill.paid = !wasPaid;

    let updatedBills = [...bills];
    let createdRecurringBill: Bill | null = null;

    if (bill.paid && !wasPaid) {
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
        });
      } catch (_) {}

      // Handle Recurring generation: advance by 1 month and mark current recurring to false
      if (bill.isRecurring) {
        const nextDueDate = getNextMonthDate(bill.dueDate);
        const nextDisconnectDate = bill.disconnectDate ? getNextMonthDate(bill.disconnectDate) : undefined;

        createdRecurringBill = {
          id: `bill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: bill.name,
          amount: bill.amount,
          dueDate: nextDueDate,
          disconnectDate: nextDisconnectDate,
          isRecurring: true,
          paid: false,
          category: bill.category,
          notes: bill.notes,
        };

        bill.isRecurring = false;
        updatedBills[actualIndex] = bill;
        updatedBills.push(createdRecurringBill);
      } else {
        updatedBills[actualIndex] = bill;
      }

      addToast({
        type: 'success',
        title: `Marked "${bill.name}" as Paid!`,
        message: createdRecurringBill ? `Created next cycle due on ${createdRecurringBill.dueDate}` : 'Settled successfully',
        onUndo: () => setBills(previousState),
      });
    } else {
      updatedBills[actualIndex] = bill;
      addToast({
        type: 'info',
        title: `Marked "${bill.name}" as Unpaid`,
        onUndo: () => setBills(previousState),
      });
    }

    setBills(updatedBills);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingBill(null);
    setEditingIndex(null);
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (bill: Bill, indexInFiltered: number) => {
    const actualIndex = bills.findIndex(
      (b) => (b.id && b.id === bill.id) || (b.name === bill.name && b.dueDate === bill.dueDate && b.amount === bill.amount)
    );
    setEditingBill(bill);
    setEditingIndex(actualIndex);
    setIsAddEditModalOpen(true);
  };

  // Save / Update Bill
  const handleSaveBill = (billData: Omit<Bill, 'id'>, generateCalendar: boolean) => {
    let updatedBills = [...bills];
    let savedBill: Bill;

    if (editingIndex !== null && editingIndex >= 0 && editingIndex < bills.length) {
      // Edit existing
      savedBill = {
        ...bills[editingIndex],
        ...billData,
      };
      updatedBills[editingIndex] = savedBill;
      addToast({
        type: 'success',
        title: 'Bill Updated',
        message: `Changes to "${savedBill.name}" saved.`,
      });
    } else {
      // Add new
      savedBill = {
        id: `bill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...billData,
      };
      updatedBills.push(savedBill);
      addToast({
        type: 'success',
        title: 'Bill Added',
        message: `Scheduled "${savedBill.name}" for $${savedBill.amount}`,
      });
    }

    setBills(updatedBills);
    setIsAddEditModalOpen(false);

    if (generateCalendar) {
      downloadBillICS(savedBill);
    }
  };

  // Delete Bill
  const handleDeleteBill = (bill: Bill, indexInFiltered: number) => {
    const actualIndex = bills.findIndex(
      (b) => (b.id && b.id === bill.id) || (b.name === bill.name && b.dueDate === bill.dueDate && b.amount === bill.amount)
    );
    if (actualIndex === -1) return;
    setDeleteConfirm({ bill, index: actualIndex });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const previous = [...bills];
    const deleted = deleteConfirm.bill;
    const nextBills = bills.filter((_, idx) => idx !== deleteConfirm.index);
    setBills(nextBills);
    setDeleteConfirm(null);

    addToast({
      type: 'info',
      title: 'Bill Deleted',
      message: `"${deleted.name}" removed`,
      onUndo: () => setBills(previous),
    });
  };

  // Reset to Demo Sample
  const handleResetDemo = () => {
    const samples = getSampleBills();
    setBills(samples);
    addToast({
      type: 'success',
      title: 'Sample Data Loaded',
      message: 'Restored 5 sample bills across various states.',
    });
  };

  // Import Backup
  const handleImportSuccess = (importedBills: Bill[]) => {
    setBills(importedBills);
    addToast({
      type: 'success',
      title: 'Backup Restored',
      message: `${importedBills.length} bills loaded from backup file.`,
    });
  };

  return (
    <div className={`min-h-screen pb-32 relative overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Frosted Glass Ambient Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl transition-opacity duration-500 ${
          isDark ? 'bg-indigo-600/20' : 'bg-indigo-300/30'
        }`} />
        <div className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl transition-opacity duration-500 ${
          isDark ? 'bg-cyan-500/15' : 'bg-cyan-300/25'
        }`} />
        <div className={`absolute -bottom-20 left-1/3 w-96 h-96 rounded-full blur-3xl transition-opacity duration-500 ${
          isDark ? 'bg-amber-500/15' : 'bg-amber-300/20'
        }`} />
      </div>

      {/* Top Header */}
      <Header
        stats={summaryStats}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenAnalytics={() => setActiveView('analytics')}
        onOpenBulkCalendar={() => setIsCalendarModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        activeView={activeView}
        onToggleView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4 relative z-10">
        {/* KPI Summary Cards */}
        <SummaryCards
          stats={summaryStats}
          isDark={isDark}
          onFilterClick={(f) => {
            setActiveView('bills');
            setCurrentFilter(f);
          }}
        />

        {/* View Content: Bills List vs Insights Breakdown */}
        {activeView === 'analytics' ? (
          <SpendingBreakdown bills={bills} isDark={isDark} />
        ) : (
          <div className="space-y-4">
            {/* Filter Tabs & Search/Sort */}
            <FilterBar
              currentFilter={currentFilter}
              onSelectFilter={setCurrentFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              currentSort={currentSort}
              onSortChange={setCurrentSort}
              overdueCount={summaryStats.overdueBillsCount}
              unpaidMonthCount={summaryStats.upcomingCount}
              paidCount={summaryStats.paidBillsCount}
              totalCount={bills.length}
              isDark={isDark}
            />

            {/* Bills List */}
            {filteredAndSortedBills.length === 0 ? (
              <div
                id="emptyState"
                className={`text-center py-16 px-4 rounded-2xl border backdrop-blur-xl transition-all ${
                  isDark
                    ? 'bg-white/[0.03] border-white/10 text-slate-300'
                    : 'bg-white/70 border-white/80 shadow-lg shadow-slate-200/50 text-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-amber-500/20">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No bills found for this view</h3>
                <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {searchQuery
                    ? `No bills matching "${searchQuery}". Try clearing your search.`
                    : 'Tap the button below to add your first bill or switch filter tabs.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`mt-3 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all ${
                      isDark
                        ? 'bg-white/10 border-white/10 text-amber-400 hover:bg-white/15'
                        : 'bg-slate-900 text-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div id="billList" className="space-y-3">
                {filteredAndSortedBills.map((bill, index) => (
                  <BillCard
                    key={bill.id || `bill-${index}-${bill.name}`}
                    bill={bill}
                    index={index}
                    isDark={isDark}
                    onTogglePaid={handleTogglePaid}
                    onDownloadICS={downloadBillICS}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteBill}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Sticky Bottom Add Action Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-3.5 sm:p-4 border-t backdrop-blur-2xl z-40 transition-colors ${
          isDark
            ? 'bg-slate-950/75 border-white/10'
            : 'bg-white/80 border-slate-200/80 shadow-lg'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <button
            id="btn-add-bill-primary"
            onClick={handleOpenAddModal}
            className="w-full max-w-md bg-gradient-to-r from-amber-500 via-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-amber-500/25 border border-amber-300/40 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 backdrop-blur-md"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add New Bill</span>
          </button>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <BillModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveBill}
        initialBill={editingBill}
        isDark={isDark}
      />

      <CalendarExportModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        bills={bills}
        isDark={isDark}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        bills={bills}
        onImportSuccess={handleImportSuccess}
        onResetDemo={handleResetDemo}
        isDark={isDark}
      />

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Delete Bill"
        message={`Are you sure you want to permanently delete "${deleteConfirm?.bill.name}"?`}
        confirmLabel="Delete Bill"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        isDark={isDark}
      />

      {/* Floating Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} isDark={isDark} />
    </div>
  );
}

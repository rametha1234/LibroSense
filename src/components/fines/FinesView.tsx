import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { FineRecord } from '../../types';
import {
  Receipt,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  ShieldCheck,
  FileText,
  X,
  CreditCard,
} from 'lucide-react';

export const FinesView: React.FC = () => {
  const { fines, payFine, waiveFine } = useLibrary();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Paid' | 'Waived'>('All');
  const [selectedReceipt, setSelectedReceipt] = useState<FineRecord | null>(null);

  // Calculations
  const totalPending = useMemo(
    () => fines.filter((f) => f.status === 'Pending').reduce((sum, f) => sum + f.fineAmount, 0),
    [fines]
  );

  const totalCollected = useMemo(
    () => fines.filter((f) => f.status === 'Paid').reduce((sum, f) => sum + f.fineAmount, 0),
    [fines]
  );

  const totalInfractions = fines.length;

  const filteredFines = useMemo(() => {
    return fines.filter((f) => (activeFilter === 'All' ? true : f.status === activeFilter));
  }, [fines, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fine & Penalty Accounting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated ₹5 per overdue day calculation and student fee collection
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span>Active Fine Rate: <strong>₹5.00 / Day</strong></span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Total Pending Dues
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">
            ₹{totalPending}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Across {fines.filter((f) => f.status === 'Pending').length} unpaid overdue infractions
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
              Total Collected Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{totalCollected}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deposited into library upkeep fund
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Recorded Infractions
            </span>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {totalInfractions}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {Math.round(((totalInfractions - fines.filter((f) => f.status === 'Pending').length) / (totalInfractions || 1)) * 100)}% resolution rate
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {(['All', 'Pending', 'Paid', 'Waived'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {filter} {filter === 'Pending' && totalPending > 0 ? `(₹${totalPending})` : ''}
          </button>
        ))}
      </div>

      {/* Fines Table */}
      <div className="overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Student Name & ID</th>
              <th className="py-3.5 px-4">Book Title</th>
              <th className="py-3.5 px-4 font-mono">Due Date</th>
              <th className="py-3.5 px-4 font-mono">Return Date</th>
              <th className="py-3.5 px-4 text-center">Overdue Days</th>
              <th className="py-3.5 px-4 font-bold">Fine (₹5/day)</th>
              <th className="py-3.5 px-4">Payment Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredFines.map((fine) => (
              <tr key={fine.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {fine.memberName}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{fine.studentId}</span>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate block" title={fine.bookTitle}>
                    {fine.bookTitle}
                  </span>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap font-mono">{fine.dueDate}</td>
                <td className="py-3.5 px-4 whitespace-nowrap font-mono">{fine.returnDate}</td>

                <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono font-bold text-rose-600 dark:text-rose-400">
                  {fine.overdueDays} days
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                  ₹{fine.fineAmount}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {fine.status === 'Paid' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300">
                      <Check className="w-3 h-3" /> Paid on {fine.datePaid}
                    </span>
                  ) : fine.status === 'Pending' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 animate-pulse">
                      <Clock className="w-3 h-3" /> Pending Payment
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Waived by Admin
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedReceipt(fine)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="View Receipt"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    {fine.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => payFine(fine.id)}
                          className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                        >
                          Mark as Paid
                        </button>
                        <button
                          onClick={() => waiveFine(fine.id)}
                          className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                          Waive
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Receipt / Invoice Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Library Fine Receipt
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedReceipt.memberName} ({selectedReceipt.studentId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Book Title:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                  {selectedReceipt.bookTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Overdue Days:</span>
                <span className="font-mono font-bold text-rose-600">
                  {selectedReceipt.overdueDays} days @ ₹5/day
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold text-sm">
                <span className="text-slate-800 dark:text-slate-200">Total Penalty:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                  ₹{selectedReceipt.fineAmount}.00
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Status:</span>
                <span className={`font-bold ${selectedReceipt.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {selectedReceipt.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {selectedReceipt.status === 'Pending' && (
                <button
                  onClick={() => {
                    payFine(selectedReceipt.id);
                    setSelectedReceipt(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Pay Now
                </button>
              )}
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

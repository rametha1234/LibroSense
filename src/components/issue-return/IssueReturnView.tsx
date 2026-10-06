import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  ArrowLeftRight,
  BookOpen,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  IndianRupee,
  Search,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const IssueReturnView: React.FC = () => {
  const {
    books,
    members,
    issueRecords,
    issueBook,
    returnBook,
    calculateReturnFine,
  } = useLibrary();

  const [activeSubTab, setActiveSubTab] = useState<'issue' | 'return'>('issue');

  // Issue Form State
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [selectedBookId, setSelectedBookId] = useState<string>(
    books.find((b) => b.availableQuantity > 0)?.id || ''
  );
  const [issueDate, setIssueDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  // Return Form State
  const activeLoans = useMemo(
    () => issueRecords.filter((r) => r.status === 'Issued' || r.status === 'Overdue'),
    [issueRecords]
  );

  const [selectedLoanId, setSelectedLoanId] = useState<string>(activeLoans[0]?.id || '');
  const [returnDate, setReturnDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Live fine calculation for currently selected return
  const fineSummary = useMemo(() => {
    if (!selectedLoanId) return { overdueDays: 0, fineAmount: 0 };
    return calculateReturnFine(selectedLoanId, returnDate);
  }, [selectedLoanId, returnDate, calculateReturnFine]);

  const selectedLoanRecord = useMemo(
    () => issueRecords.find((r) => r.id === selectedLoanId),
    [issueRecords, selectedLoanId]
  );

  // Available books for issue
  const availableBooks = books.filter((b) => b.availableQuantity > 0);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedBookId) return;

    const success = issueBook(selectedMemberId, selectedBookId, issueDate, dueDate);
    if (success) {
      // Pick next available book if current was depleted
      const nextAvailable = books.find((b) => b.id !== selectedBookId && b.availableQuantity > 0);
      if (nextAvailable) setSelectedBookId(nextAvailable.id);
    }
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanId) return;

    returnBook(selectedLoanId, returnDate);

    // Update selected loan to next remaining active
    const remaining = activeLoans.filter((r) => r.id !== selectedLoanId);
    if (remaining.length > 0) {
      setSelectedLoanId(remaining[0].id);
    } else {
      setSelectedLoanId('');
    }
  };

  const handleQuickReturnClick = (loanId: string) => {
    setSelectedLoanId(loanId);
    setActiveSubTab('return');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Circulation: Issue & Return
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automatic ₹5/day overdue penalty calculation and loan tracking
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveSubTab('issue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'issue'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Issue Book
          </button>
          <button
            onClick={() => setActiveSubTab('return')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'return'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Return Book & Fine Check
          </button>
        </div>
      </div>

      {/* Main Action Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container (7 cols) */}
        <div className="lg:col-span-7">
          {activeSubTab === 'issue' ? (
            /* Issue Book Form */
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Issue Book to Member
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Creates an active loan record and decrements catalog stock
                  </p>
                </div>
              </div>

              <form onSubmit={handleIssueSubmit} className="space-y-4">
                {/* Select Student / Member */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Student / Member *
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.studentId}) &bull; {m.department} [{m.booksIssued} books currently issued]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Book */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Available Book *
                  </label>
                  {availableBooks.length === 0 ? (
                    <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
                      No books currently in stock for issue.
                    </div>
                  ) : (
                    <select
                      value={selectedBookId}
                      onChange={(e) => setSelectedBookId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {availableBooks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title} &bull; Shelf {b.shelfNumber} ({b.availableQuantity} available)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Due Date (Return Deadline) *
                    </label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {/* Policy note */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      14-Day Lending Policy:
                    </span>{' '}
                    Books returned after the due date incur an automated late penalty of{' '}
                    <strong className="text-indigo-600 dark:text-indigo-400">₹5 per day</strong>.
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={availableBooks.length === 0}
                    className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-500/25 transition-all transform active:scale-98"
                  >
                    Confirm & Issue Book
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Return Book Form with Live Fine Calculation */
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Return Issued Book & Calculate Fine
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Checks return date against loan deadline and computes ₹5/day penalty
                  </p>
                </div>
              </div>

              {activeLoans.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No Books Currently Issued Out
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    All library inventory is returned and accounted for.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReturnSubmit} className="space-y-4">
                  {/* Select Issued Book */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Select Active Loan to Return *
                    </label>
                    <select
                      value={selectedLoanId}
                      onChange={(e) => setSelectedLoanId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {activeLoans.map((loan) => (
                        <option key={loan.id} value={loan.id}>
                          &quot;{loan.bookTitle}&quot; &bull; {loan.memberName} ({loan.studentId}) &bull; Due: {loan.dueDate} {loan.status === 'Overdue' ? '⚠️ [OVERDUE]' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Return Date Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Return Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  {/* Clear Fine Summary Before Return */}
                  {selectedLoanRecord && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span>Return Summary & Fine Assessment</span>
                        <span className="font-mono text-slate-400">Rule: ₹5 / Day</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">Due Date</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                            {selectedLoanRecord.dueDate}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">Return Date</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                            {returnDate}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">Overdue Days</span>
                          <span
                            className={`font-bold font-mono ${
                              fineSummary.overdueDays > 0
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {fineSummary.overdueDays} days
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">Fine Amount</span>
                          <span
                            className={`font-extrabold text-sm ${
                              fineSummary.fineAmount > 0
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            ₹{fineSummary.fineAmount}
                          </span>
                        </div>
                      </div>

                      {fineSummary.fineAmount > 0 ? (
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          <span>
                            <strong>Notice:</strong> Returning will record a fine of{' '}
                            <strong>₹{fineSummary.fineAmount}</strong> to member{' '}
                            {selectedLoanRecord.memberName}.
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                          <span>Book is returned on schedule. Zero penalty incurred.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Return */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/25 transition-all transform active:scale-98"
                    >
                      Confirm Return of Book
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Live Loan Summary & Active Overdues Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Loans Overview
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {activeLoans.length} Checked Out
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {activeLoans.map((loan) => {
                const isOverdue = loan.status === 'Overdue';
                return (
                  <div
                    key={loan.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isOverdue
                        ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <img
                          src={loan.bookCover}
                          alt={loan.bookTitle}
                          className="w-9 h-12 object-cover rounded-md shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={loan.bookTitle}>
                            {loan.bookTitle}
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                            {loan.memberName} &bull; <span className="font-mono text-[10px]">{loan.studentId}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                            <span>Due: {loan.dueDate}</span>
                            {isOverdue && (
                              <span className="text-rose-600 dark:text-rose-400 font-bold">
                                Fine: ₹{loan.fineAmount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleQuickReturnClick(loan.id)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors shrink-0"
                      >
                        Return
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Borrowing & Circulation Records Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Circulation History & Records
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit log of issued, overdue, and returned books
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Total records: {issueRecords.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Student Name & ID</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Return Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Fine Incurred</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {issueRecords.map((rec) => {
                const isActive = rec.status === 'Issued' || rec.status === 'Overdue';
                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <img
                          src={rec.bookCover}
                          alt={rec.bookTitle}
                          className="w-7 h-9 object-cover rounded shadow-xs shrink-0"
                        />
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {rec.bookTitle}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {rec.memberName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{rec.studentId}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono">{rec.issueDate}</td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono">{rec.dueDate}</td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      {rec.returnDate || <span className="text-slate-400 italic">Active Loan</span>}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {rec.status === 'Returned' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          Returned
                        </span>
                      ) : rec.status === 'Overdue' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse">
                          Overdue
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          Issued
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-bold">
                      {rec.fineAmount > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400">
                          ₹{rec.fineAmount} {rec.finePaid ? '(Paid)' : '(Unpaid)'}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">₹0</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isActive && (
                        <button
                          onClick={() => handleQuickReturnClick(rec.id)}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                        >
                          Process Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

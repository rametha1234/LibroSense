import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { StatCards } from './StatCards';
import { DashboardCharts } from './DashboardCharts';
import { BookOfMonth } from './BookOfMonth';
import { BookDetailModal } from '../books/BookDetailModal';
import { Book } from '../../types';
import {
  ArrowLeftRight,
  BookPlus,
  BookmarkCheck,
  Receipt,
  Sparkles,
  Search,
  Users,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { setActiveTab, setIsSearchOpen, currentUser } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Central Campus Terminal
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 font-mono">Academic Year 2026–2027</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Welcome back, {currentUser?.name || 'Academic Scholar'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            LibroSense Central Stacks are open. You have {currentUser?.readingStreak || 12} continuous days on your reading streak!
          </p>
        </div>

        {/* Quick Operations Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('issue-return')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-indigo-500/25 transition-all"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Circulation & Fines</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
          >
            <BookPlus className="w-3.5 h-3.5 text-indigo-500" />
            <span>Browse Catalog</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 transition-colors"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6 Metric Statistics Cards */}
      <StatCards />

      {/* Book of the Month, New Arrivals, and Trending Books */}
      <BookOfMonth onSelectBook={(book) => setSelectedBook(book)} />

      {/* 4 Interactive Recharts Charts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
            Circulation Statistics & Intelligence
          </h2>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Detailed Analytics View &rarr;
          </button>
        </div>
        <DashboardCharts />
      </div>

      {/* Book Details Inspector Modal */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onEdit={() => {}}
      />
    </div>
  );
};

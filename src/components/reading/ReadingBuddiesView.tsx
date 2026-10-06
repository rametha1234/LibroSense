import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  UserCheck,
  UserPlus,
  BookOpen,
  Search,
  MessageSquare,
  Sparkles,
  Flame,
  Check,
} from 'lucide-react';

export const ReadingBuddiesView: React.FC = () => {
  const { buddies, toggleBuddyConnect } = useLibrary();
  const [searchFilter, setSearchFilter] = useState('');

  const filteredBuddies = buddies.filter(
    (b) =>
      b.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.favoriteCategory.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-500" />
            Reading Buddies & Study Circles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Connect with peers reading similar literature, textbooks, and research fields
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          Connected with{' '}
          <strong className="text-indigo-600 dark:text-indigo-400">
            {buddies.filter((b) => b.isConnected).length}
          </strong>{' '}
          reading buddies
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, major, or favorite reading category..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Buddies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBuddies.map((buddy) => (
          <div
            key={buddy.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Profile Card Header */}
              <div className="flex items-center gap-3.5">
                <img
                  src={buddy.avatar}
                  alt={buddy.name}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {buddy.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {buddy.department}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-500" />
                      {buddy.readingStreak}d streak
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                    <span className="text-[10px] text-slate-400">
                      {buddy.booksRead} books read
                    </span>
                  </div>
                </div>
              </div>

              {/* Interests & Favorite Category */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Primary Study Domain
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {buddy.favoriteCategory}
                </span>
              </div>

              {/* Common Books Shared */}
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Shared Reading Intersections ({buddy.commonBooks.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {buddy.commonBooks.map((bookTitle, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-[240px]"
                      title={bookTitle}
                    >
                      {bookTitle}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => toggleBuddyConnect(buddy.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  buddy.isConnected
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-indigo-500/20'
                }`}
              >
                {buddy.isConnected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Connected Buddy</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect as Buddy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => alert(`Starting peer study chat with ${buddy.name}...`)}
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Send Message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

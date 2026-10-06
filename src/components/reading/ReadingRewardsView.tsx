import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  Flame,
  Award,
  Crown,
  Trophy,
  BookOpen,
  Calendar,
  CheckCircle,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReadingRewardsView: React.FC = () => {
  const { badges, currentUser, members, updateProfile, addToast } = useLibrary();
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const streak = currentUser?.readingStreak || 12;
  const booksRead = currentUser?.booksRead || 14;
  const yearlyGoal = 20;
  const progressPercent = Math.min(100, Math.round((booksRead / yearlyGoal) * 100));

  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) {
      addToast('Already Checked In', 'You already logged your reading session for today!', 'info');
      return;
    }

    const nextStreak = streak + 1;
    updateProfile({ readingStreak: nextStreak });
    setHasCheckedInToday(true);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    addToast('Streak Extended! 🔥', `You reached a ${nextStreak}-day reading streak!`, 'success');
  };

  // Leaderboard: sorted by booksRead
  const leaderboard = [...members]
    .sort((a, b) => b.booksRead - a.booksRead)
    .slice(0, 8);

  const daysOfWeek = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: true },
    { day: 'Sun', completed: hasCheckedInToday },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Reading Milestones & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track daily reading streaks, unlock scholarly achievements, and view campus leaderboard
          </p>
        </div>
      </div>

      {/* Top Banner: Reading Streak + Annual Reading Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Streak Tracker (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/80 dark:border-amber-900/40 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 animate-bounce" />
                Active Reading Streak
              </div>
              <span className="text-xs font-mono text-slate-400">Semester 2026</span>
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {streak}
              </span>
              <span className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                Consecutive Days
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top 5% of readers across the central engineering library.
            </p>

            {/* Weekly activity dots */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              {daysOfWeek.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      d.completed
                        ? 'bg-amber-500 text-white shadow-xs scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {d.completed ? '✓' : ''}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleDailyCheckIn}
              disabled={hasCheckedInToday}
              className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                hasCheckedInToday
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/25 active:scale-98'
              }`}
            >
              <Zap className="w-4 h-4" />
              {hasCheckedInToday ? 'Today’s Reading Logged (Streak Maintained)' : 'Log 30-Min Reading Session Today'}
            </button>
          </div>
        </div>

        {/* Reading Goal Progress (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/80 dark:border-indigo-900/40 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                2026 Academic Reading Goal
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {progressPercent}% Complete
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {booksRead}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {yearlyGoal} Books Read this Academic Year
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Only {yearlyGoal - booksRead} more titles needed to unlock the prestigious{' '}
              <strong>Library Legend</strong> badge.
            </p>

            {/* Progress Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0 Books</span>
                <span>Target: 20 Books</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Next Milestone: <strong>Scholar Tier II</strong></span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">+1 Book needed</span>
          </div>
        </div>
      </div>

      {/* Reading Badges Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Earned Badges & Scholarly Honors
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition-all ${
                  badge.unlocked
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
                    : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/50 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${badge.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <Award className="w-6 h-6" />
                  </div>

                  {badge.unlocked ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center gap-1 border border-emerald-300">
                      <CheckCircle className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked ({badge.threshold} Books)
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                  {badge.unlockedDate && (
                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                      Awarded: {badge.unlockedDate}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campus Leaderboard */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Campus Reading Leaderboard
              </h3>
              <p className="text-xs text-slate-500">
                Top student readers ranked by completed volumes & active reading streaks
              </p>
            </div>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            Spring 2026 Term
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Student Name & ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Books Read</th>
                <th className="py-3 px-4 text-center">Active Streak</th>
                <th className="py-3 px-4 text-right">Badge Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((member, index) => {
                const rankIcons = ['🥇', '🥈', '🥉'];
                const isUser = currentUser && currentUser.studentId === member.studentId;

                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                      isUser ? 'bg-indigo-50/50 dark:bg-indigo-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {index < 3 ? (
                        <span className="text-lg">{rankIcons[index]}</span>
                      ) : (
                        <span className="font-bold text-slate-400">#{index + 1}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {member.name}
                            {isUser && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {member.studentId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {member.department}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap font-extrabold text-sm text-slate-900 dark:text-white">
                      {member.booksRead}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap font-bold text-amber-600 dark:text-amber-400">
                      🔥 {member.readingStreak} days
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {member.booksRead >= 15
                          ? 'Library Legend'
                          : member.booksRead >= 10
                          ? 'Scholar'
                          : member.booksRead >= 5
                          ? 'Bookworm'
                          : 'Reader'}
                      </span>
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

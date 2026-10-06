import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  BookOpen,
  CheckCircle2,
  ArrowUpRight,
  Users,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
} from 'lucide-react';

export const StatCards: React.FC = () => {
  const { books, members, issueRecords, fines, setActiveTab } = useLibrary();

  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);
  const availableCopies = books.reduce((sum, b) => sum + b.availableQuantity, 0);
  const issuedLoans = issueRecords.filter((r) => r.status === 'Issued' || r.status === 'Overdue').length;
  const overdueCount = issueRecords.filter((r) => r.status === 'Overdue').length;
  const pendingFinesTotal = fines
    .filter((f) => f.status === 'Pending')
    .reduce((sum, f) => sum + f.fineAmount, 0);

  const stats = [
    {
      title: 'Total Books',
      value: totalCopies,
      subtext: `${books.length} unique titles`,
      icon: <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      iconBg: 'bg-blue-100 dark:bg-blue-950/70',
      onClick: () => setActiveTab('books'),
    },
    {
      title: 'Available Books',
      value: availableCopies,
      subtext: `${Math.round((availableCopies / (totalCopies || 1)) * 100)}% available now`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-emerald-200 dark:border-emerald-900/40',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/70',
      onClick: () => setActiveTab('books'),
    },
    {
      title: 'Issued Books',
      value: issuedLoans,
      subtext: 'Active reader loans',
      icon: <ArrowUpRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      bgGradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-indigo-200 dark:border-indigo-900/40',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/70',
      onClick: () => setActiveTab('issue-return'),
    },
    {
      title: 'Total Members',
      value: members.length,
      subtext: 'Students & Faculty',
      icon: <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
      borderColor: 'border-purple-200 dark:border-purple-900/40',
      iconBg: 'bg-purple-100 dark:bg-purple-950/70',
      onClick: () => setActiveTab('members'),
    },
    {
      title: 'Overdue Books',
      value: overdueCount,
      subtext: overdueCount > 0 ? 'Requires follow-up' : 'All returned on time',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      borderColor: 'border-amber-200 dark:border-amber-900/40',
      iconBg: 'bg-amber-100 dark:bg-amber-950/70',
      badge: overdueCount > 0 ? 'Urgent' : undefined,
      onClick: () => setActiveTab('issue-return'),
    },
    {
      title: 'Pending Fines',
      value: `₹${pendingFinesTotal}`,
      subtext: '₹5 per day overdue',
      icon: <IndianRupee className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      bgGradient: 'from-rose-500/10 via-red-500/5 to-transparent',
      borderColor: 'border-rose-200 dark:border-rose-900/40',
      iconBg: 'bg-rose-100 dark:bg-rose-950/70',
      onClick: () => setActiveTab('fines'),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          onClick={stat.onClick}
          className={`relative p-4 rounded-2xl bg-white dark:bg-slate-900 border ${stat.borderColor} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-0.5`}
        >
          {/* Subtle gradient wash */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-60 pointer-events-none`} />

          <div className="relative flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {stat.title}
            </span>
            <div className={`p-2 rounded-xl ${stat.iconBg} shrink-0 transition-transform group-hover:scale-110 duration-200`}>
              {stat.icon}
            </div>
          </div>

          <div className="relative">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stat.value}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="truncate">{stat.subtext}</span>
              {stat.badge && (
                <span className="ml-1 px-1.5 py-0.2 rounded font-semibold text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {stat.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

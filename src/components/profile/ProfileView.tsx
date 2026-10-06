import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  User,
  Mail,
  Award,
  BookOpen,
  Flame,
  IndianRupee,
  Edit,
  Save,
  ShieldCheck,
  CreditCard,
  CheckCircle,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, issueRecords, badges, setActiveTab } = useLibrary();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    studentId: currentUser?.studentId || '',
    department: currentUser?.department || '',
    avatarUrl: currentUser?.avatarUrl || '',
  });

  const activeLoans = issueRecords.filter(
    (r) =>
      (r.studentId === currentUser?.studentId || r.memberId === currentUser?.id) &&
      (r.status === 'Issued' || r.status === 'Overdue')
  );

  const unlockedBadges = badges.filter((b) => b.unlocked);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatarUrl}
              alt={currentUser?.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/30 shadow-md"
            />
            <span className="absolute bottom-1 right-1 p-1.5 rounded-xl bg-emerald-500 text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {currentUser?.name}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  {currentUser?.department} &bull; {currentUser?.role}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>

                <button
                  onClick={() => setActiveTab('digital-card')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                  View Digital Card
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-semibold">
                ID: {currentUser?.studentId}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {currentUser?.email}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30">
            <span className="text-[11px] text-slate-400 block font-medium">Books Read</span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {currentUser?.booksRead || 14}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30">
            <span className="text-[11px] text-slate-400 block font-medium">Current Loans</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">
              {activeLoans.length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30">
            <span className="text-[11px] text-slate-400 block font-medium">Reading Streak</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500" />
              {currentUser?.readingStreak || 12}d
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30">
            <span className="text-[11px] text-slate-400 block font-medium">Fine Balance</span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400">
              ₹{currentUser?.fineBalance || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Edit Personal Profile Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Current Active Loans */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Currently Checked-Out Books ({activeLoans.length})
          </h3>
          <button
            onClick={() => setActiveTab('issue-return')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Manage Loans &rarr;
          </button>
        </div>

        {activeLoans.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            You do not currently have any active library volumes checked out.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeLoans.map((loan) => (
              <div
                key={loan.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3"
              >
                <img
                  src={loan.bookCover}
                  alt={loan.bookTitle}
                  className="w-10 h-14 object-cover rounded-lg shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {loan.bookTitle}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Due Date: {loan.dueDate}
                  </div>
                  <div className="mt-1">
                    {loan.status === 'Overdue' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                        Overdue (Fine: ₹{loan.fineAmount})
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        Active on Schedule
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unlocked Badges Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Your Unlocked Honors ({unlockedBadges.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${badge.color} text-white flex items-center justify-center shadow-xs mb-2`}
              >
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {badge.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">{badge.unlockedDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

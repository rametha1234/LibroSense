import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  Settings,
  Sun,
  Moon,
  ShieldCheck,
  RotateCcw,
  Bell,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { isDarkMode, toggleDarkMode, resetToDefaultData, addToast } = useLibrary();

  const [confirmReset, setConfirmReset] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoRenew, setAutoRenew] = useState(false);

  const handleSavePreferences = () => {
    addToast('Preferences Saved', 'Your system and notification settings have been updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-500" />
            System & Circulation Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure system appearance, automated lending rules, and demo data state
          </p>
        </div>
      </div>

      {/* Appearance Setting */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Appearance & Theme
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white block">
              Color Theme
            </span>
            <span className="text-[11px] text-slate-500">
              Toggle between modern SaaS light mode and high-contrast dark mode
            </span>
          </div>

          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Official Circulation Rules & Fine Policy */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Library Circulation & Fine Policies
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              <IndianRupee className="w-4 h-4" />
              <span>Overdue Fine Rate</span>
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
              ₹5.00 / Overdue Day
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Accumulates daily after the 14-day return deadline until the physical copy is checked in.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
              <Clock className="w-4 h-4" />
              <span>Standard Loan Period</span>
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
              14 Calendar Days
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Standard borrowing duration for enrolled undergraduate & postgraduate students.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Concurrent Loan Limit</span>
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
              4 Books Max / Student
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Maximum concurrent physical copies checked out simultaneously.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
              <Bell className="w-4 h-4" />
              <span>Hold Pickup Window</span>
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
              48 Hours
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Held reservations are automatically cancelled if not claimed from shelf within 2 days.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Automated Alerts & Dispatch
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                Email Notifications
              </span>
              <span className="text-[11px] text-slate-500">
                Receive email alerts for due date approaching (2 days prior) and reservation arrivals
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                Fine & Overdue Notices
              </span>
              <span className="text-[11px] text-slate-500">
                Send daily penalty statements if borrowed materials exceed return deadline
              </span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Data Management & Reset Demo Database */}
      <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-rose-100 dark:border-rose-900/40">
          <RotateCcw className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Reset Demo Database to Initial State
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Need to test the website from a fresh slate? Clicking this will restore the full initial
          catalog of 22 books, 11 members, overdue loan records (to test ₹5/day fine calculation),
          reservations, reviews, badges, and reading buddies.
        </p>

        <div>
          {confirmReset ? (
            <div className="flex items-center gap-3 animate-in fade-in">
              <span className="text-xs text-rose-600 font-bold">Are you sure?</span>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setConfirmReset(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Yes, Reset All Data
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white dark:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 transition-colors"
            >
              Reset to Factory Initial Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  BookmarkCheck,
  Info,
  Check,
  Trash2,
  Filter,
} from 'lucide-react';
import { NotificationType } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setActiveTab,
  } = useLibrary();

  const [filterType, setFilterType] = useState<string>('all');

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filterType === 'all') return true;
      if (filterType === 'unread') return !n.isRead;
      if (filterType === 'fines_overdue') return n.type === 'overdue' || n.type === 'fine';
      if (filterType === 'circulation') return n.type === 'issued' || n.type === 'returned' || n.type === 'due_soon';
      if (filterType === 'reservations') return n.type === 'reservation';
      return true;
    });
  }, [notifications, filterType]);

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'issued':
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'returned':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'due_soon':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'fine':
        return <Receipt className="w-5 h-5 text-rose-500" />;
      case 'reservation':
        return <BookmarkCheck className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-500" />
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            System notices, due date reminders, reservation arrivals, and fine alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotificationCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}

          <button
            onClick={clearNotifications}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Inbox
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Notices' },
          { id: 'unread', label: `Unread (${unreadNotificationCount})` },
          { id: 'fines_overdue', label: 'Overdue & Fines' },
          { id: 'circulation', label: 'Loans & Returns' },
          { id: 'reservations', label: 'Reservations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No notifications matching this filter
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              You are all caught up on campus library communications.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationRead(item.id);
                if (item.linkTab) setActiveTab(item.linkTab as any);
              }}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                !item.isRead
                  ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-xs hover:border-indigo-400'
                  : 'bg-white/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                {getIconForType(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                      {item.timestamp}
                    </span>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.message}
                </p>

                {item.linkTab && (
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-2 inline-block hover:underline">
                    Take action in {item.linkTab.replace('-', ' ')} &rarr;
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

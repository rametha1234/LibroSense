import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  ArrowLeftRight,
  Users,
  BookmarkCheck,
  Receipt,
  Star,
  Sparkles,
  UserCheck,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  CreditCard,
  Award,
  X,
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    reservations,
    fines,
    issueRecords,
    logout,
  } = useLibrary();

  const pendingFinesCount = fines.filter((f) => f.status === 'Pending').length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'Pending').length;
  const overdueLoansCount = issueRecords.filter((r) => r.status === 'Overdue').length;

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }

  const mainNavigation: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'books',
      label: 'Books Catalog',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'issue-return',
      label: 'Issue / Return',
      icon: <ArrowLeftRight className="w-4 h-4" />,
      badge: overdueLoansCount > 0 ? `${overdueLoansCount} late` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'members',
      label: 'Members',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: <BookmarkCheck className="w-4 h-4" />,
      badge: pendingReservationsCount > 0 ? pendingReservationsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'fines',
      label: 'Fines & Dues',
      icon: <Receipt className="w-4 h-4" />,
      badge: pendingFinesCount > 0 ? `₹${pendingFinesCount}` : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'reviews',
      label: 'Reviews & Ratings',
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const studentAndSocialNav: NavItem[] = [
    {
      id: 'reading-rewards',
      label: 'Reading & Badges',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'reading-buddies',
      label: 'Reading Buddies',
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      id: 'digital-card',
      label: 'Digital Library Card',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Trends',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
      badgeColor: 'bg-indigo-600 text-white',
    },
  ];

  const bottomNav: NavItem[] = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      {/* Sidebar Header with Logo */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <Logo size="md" />
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Campus Info Sub-banner */}
      <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          LibroSense Central Library
        </span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Operations & Catalog
          </div>
          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Discovery & Community */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Reading & Insights
          </div>
          <nav className="space-y-1">
            {studentAndSocialNav.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Preferences */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Account
          </div>
          <nav className="space-y-1">
            {bottomNav.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Fine Rule & Logout Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-2">
        <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
          <span className="font-medium">Overdue Policy</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">₹5 / Day</span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen shrink-0 sticky top-0 z-40">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        >
          <div
            className="w-72 h-full max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

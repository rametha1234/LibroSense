import React, { useState } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { BooksView } from './components/books/BooksView';
import { IssueReturnView } from './components/issue-return/IssueReturnView';
import { MembersView } from './components/members/MembersView';
import { ReservationsView } from './components/reservations/ReservationsView';
import { FinesView } from './components/fines/FinesView';
import { ReviewsView } from './components/reviews/ReviewsView';
import { RecommendationsView } from './components/recommendations/RecommendationsView';
import { ReadingRewardsView } from './components/reading/ReadingRewardsView';
import { ReadingBuddiesView } from './components/reading/ReadingBuddiesView';
import { DigitalCardView } from './components/digital-card/DigitalCardView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';

// Auth Views
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activeTab } = useLibrary();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // If not authenticated, render login or register views
  if (!isAuthenticated) {
    if (authMode === 'register') {
      return (
        <>
          <RegisterView onSwitchToLogin={() => setAuthMode('login')} />
          <ToastContainer />
        </>
      );
    }
    return (
      <>
        <LoginView onSwitchToRegister={() => setAuthMode('register')} />
        <ToastContainer />
      </>
    );
  }

  // Render active tab view
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'books':
        return <BooksView />;
      case 'issue-return':
        return <IssueReturnView />;
      case 'members':
        return <MembersView />;
      case 'reservations':
        return <ReservationsView />;
      case 'fines':
        return <FinesView />;
      case 'reviews':
        return <ReviewsView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'reading-rewards':
        return <ReadingRewardsView />;
      case 'reading-buddies':
        return <ReadingBuddiesView />;
      case 'digital-card':
        return <DigitalCardView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <MainAppContent />
    </LibraryProvider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Book,
  Member,
  IssueRecord,
  Reservation,
  FineRecord,
  Review,
  NotificationItem,
  ReadingBuddy,
  ReadingBadge,
  CurrentUser,
  NavigationTab,
  UserRole,
} from '../types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_BOOKS,
  INITIAL_MEMBERS,
  INITIAL_ISSUE_RECORDS,
  INITIAL_RESERVATIONS,
  INITIAL_FINES,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_READING_BUDDIES,
  INITIAL_BADGES,
} from '../data/initialData';
import confetti from 'canvas-confetti';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface LibraryContextType {
  // Navigation & Theme
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Auth & User
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, role?: UserRole) => boolean;
  register: (data: { studentId: string; name: string; email: string; role: UserRole; department?: string }) => void;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  updateProfile: (data: Partial<CurrentUser>) => void;

  // Core Data Collections
  books: Book[];
  members: Member[];
  issueRecords: IssueRecord[];
  reservations: Reservation[];
  fines: FineRecord[];
  reviews: Review[];
  notifications: NotificationItem[];
  buddies: ReadingBuddy[];
  badges: ReadingBadge[];

  // CRUD & Transactions
  addBook: (book: Omit<Book, 'id' | 'borrowCount' | 'rating' | 'reviewCount' | 'addedDate'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;

  addMember: (member: Omit<Member, 'id' | 'booksIssued' | 'booksReturned' | 'overdueBooks' | 'fineAmount' | 'readingStreak' | 'booksRead' | 'joinDate'>) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  // Issue & Return (with ₹5/day fine rule)
  issueBook: (memberId: string, bookId: string, issueDate?: string, dueDate?: string) => boolean;
  calculateReturnFine: (recordId: string, returnDateStr?: string) => { overdueDays: number; fineAmount: number };
  returnBook: (recordId: string, returnDate?: string) => { fineAmount: number; overdueDays: number };

  // Fines
  payFine: (fineId: string) => void;
  waiveFine: (fineId: string) => void;

  // Reservations
  reserveBook: (bookId: string, memberId?: string) => boolean;
  cancelReservation: (reservationId: string) => void;
  fulfillReservation: (reservationId: string) => void;

  // Reviews
  addReview: (bookId: string, rating: number, comment: string) => void;

  // Buddies
  toggleBuddyConnect: (buddyId: string) => void;

  // Notifications
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Reset
  resetToDefaultData: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('librosense_theme');
    return saved ? saved === 'dark' : false;
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem('librosense_user');
    return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
  });

  // Collections with LocalStorage caching
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('librosense_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('librosense_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [issueRecords, setIssueRecords] = useState<IssueRecord[]>(() => {
    const saved = localStorage.getItem('librosense_issue_records');
    return saved ? JSON.parse(saved) : INITIAL_ISSUE_RECORDS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('librosense_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [fines, setFines] = useState<FineRecord[]>(() => {
    const saved = localStorage.getItem('librosense_fines');
    return saved ? JSON.parse(saved) : INITIAL_FINES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('librosense_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('librosense_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [buddies, setBuddies] = useState<ReadingBuddy[]>(() => {
    const saved = localStorage.getItem('librosense_buddies');
    return saved ? JSON.parse(saved) : INITIAL_READING_BUDDIES;
  });

  const [badges, setBadges] = useState<ReadingBadge[]>(() => {
    const saved = localStorage.getItem('librosense_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  // Toast system
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync dark mode to DOM & storage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('librosense_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('librosense_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('librosense_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('librosense_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('librosense_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('librosense_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('librosense_issue_records', JSON.stringify(issueRecords));
  }, [issueRecords]);

  useEffect(() => {
    localStorage.setItem('librosense_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('librosense_fines', JSON.stringify(fines));
  }, [fines]);

  useEffect(() => {
    localStorage.setItem('librosense_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('librosense_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('librosense_buddies', JSON.stringify(buddies));
  }, [buddies]);

  // Auth actions
  const login = (email: string, _password?: string, role?: UserRole) => {
    const existingMember = members.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (existingMember) {
      const user: CurrentUser = {
        id: existingMember.id,
        studentId: existingMember.studentId,
        name: existingMember.name,
        email: existingMember.email,
        role: role || existingMember.role,
        department: existingMember.department,
        avatarUrl: existingMember.avatarUrl,
        booksRead: existingMember.booksRead,
        readingStreak: existingMember.readingStreak,
        fineBalance: existingMember.fineAmount,
      };
      setCurrentUser(user);
      addToast('Welcome back!', `Logged in as ${user.name} (${user.role})`, 'success');
      return true;
    }

    // Default student or librarian demo
    const defaultRole = role || (email.includes('admin') || email.includes('librarian') ? 'Librarian' : 'Student');
    const demoUser: CurrentUser = {
      id: 'usr-demo',
      studentId: defaultRole === 'Librarian' ? 'LIB-2026' : 'ST-2026-99',
      name: defaultRole === 'Librarian' ? 'Dr. Meera Nambiar' : 'Aarav Sharma',
      email: email || 'aarav.sharma@librosense.edu',
      role: defaultRole,
      department: defaultRole === 'Librarian' ? 'Library Services' : 'Computer Science',
      avatarUrl: defaultRole === 'Librarian'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      booksRead: 14,
      readingStreak: 12,
      fineBalance: 0,
    };
    setCurrentUser(demoUser);
    addToast('Welcome to LibroSense', `Signed in as ${demoUser.name}`, 'success');
    return true;
  };

  const register = (data: { studentId: string; name: string; email: string; role: UserRole; department?: string }) => {
    const newMember: Member = {
      id: `mem-${Date.now()}`,
      studentId: data.studentId,
      name: data.name,
      email: data.email,
      phone: '+91 98000 00000',
      role: data.role,
      department: data.department || 'General Studies',
      booksIssued: 0,
      booksReturned: 0,
      overdueBooks: 0,
      fineAmount: 0,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      readingStreak: 1,
      booksRead: 0,
    };

    setMembers((prev) => [newMember, ...prev]);

    const newUser: CurrentUser = {
      id: newMember.id,
      studentId: newMember.studentId,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      department: newMember.department,
      avatarUrl: newMember.avatarUrl,
      booksRead: 0,
      readingStreak: 1,
      fineBalance: 0,
    };

    setCurrentUser(newUser);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }
    addToast('Account created!', `Welcome to LibroSense, ${newUser.name}`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Logged out', 'You have been safely signed out.', 'info');
  };

  const switchUserRole = (role: UserRole) => {
    if (!currentUser) return;
    setCurrentUser((prev) => (prev ? { ...prev, role } : null));
    addToast('Role Switched', `Switched active role to ${role}`, 'info');
  };

  const updateProfile = (data: Partial<CurrentUser>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    if (currentUser) {
      setMembers((prev) =>
        prev.map((m) => (m.id === currentUser.id ? { ...m, ...data } : m))
      );
    }
    addToast('Profile updated', 'Your profile details have been saved.', 'success');
  };

  // Book operations
  const addBook = (bookData: Omit<Book, 'id' | 'borrowCount' | 'rating' | 'reviewCount' | 'addedDate'>) => {
    const newBook: Book = {
      ...bookData,
      id: `bk-${Date.now()}`,
      rating: 4.5,
      reviewCount: 0,
      borrowCount: 0,
      addedDate: new Date().toISOString().split('T')[0],
    };
    setBooks((prev) => [newBook, ...prev]);

    // Create notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Book Added',
      message: `"${newBook.title}" was added to shelf ${newBook.shelfNumber}.`,
      type: 'system',
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'books',
    };
    setNotifications((prev) => [notif, ...prev]);
    addToast('Book added successfully', `"${newBook.title}" is now cataloged.`, 'success');
  };

  const updateBook = (id: string, updatedFields: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
    addToast('Book updated', 'Book information has been saved.', 'success');
  };

  const deleteBook = (id: string) => {
    const book = books.find((b) => b.id === id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    addToast('Book deleted', `"${book?.title || 'Book'}" has been removed from library.`, 'warning');
  };

  // Member operations
  const addMember = (data: Omit<Member, 'id' | 'booksIssued' | 'booksReturned' | 'overdueBooks' | 'fineAmount' | 'readingStreak' | 'booksRead' | 'joinDate'>) => {
    const newMember: Member = {
      ...data,
      id: `mem-${Date.now()}`,
      booksIssued: 0,
      booksReturned: 0,
      overdueBooks: 0,
      fineAmount: 0,
      readingStreak: 1,
      booksRead: 0,
      joinDate: new Date().toISOString().split('T')[0],
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    };
    setMembers((prev) => [newMember, ...prev]);
    addToast('Member registered', `${newMember.name} has been enrolled.`, 'success');
  };

  const updateMember = (id: string, data: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    addToast('Member updated', 'Member profile details saved.', 'success');
  };

  const deleteMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    addToast('Member deleted', `${member?.name || 'Member'} has been deleted.`, 'warning');
  };

  // Issue & Return
  const issueBook = (memberId: string, bookId: string, issueDateStr?: string, dueDateStr?: string): boolean => {
    const book = books.find((b) => b.id === bookId);
    const member = members.find((m) => m.id === memberId);

    if (!book || !member) {
      addToast('Error', 'Invalid book or member selected.', 'error');
      return false;
    }

    if (book.availableQuantity <= 0) {
      addToast('Unavailable', `All copies of "${book.title}" are currently issued. You can reserve it.`, 'warning');
      return false;
    }

    const today = issueDateStr || new Date().toISOString().split('T')[0];
    let due = dueDateStr;
    if (!due) {
      const d = new Date();
      d.setDate(d.getDate() + 14); // 14 days loan period
      due = d.toISOString().split('T')[0];
    }

    const newRecord: IssueRecord = {
      id: `iss-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.coverUrl,
      memberId: member.id,
      memberName: member.name,
      studentId: member.studentId,
      issueDate: today,
      dueDate: due,
      status: 'Issued',
      fineAmount: 0,
      finePaid: false,
    };

    setIssueRecords((prev) => [newRecord, ...prev]);

    // Update book inventory
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id
          ? {
              ...b,
              availableQuantity: Math.max(0, b.availableQuantity - 1),
              borrowCount: b.borrowCount + 1,
            }
          : b
      )
    );

    // Update member count
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? {
              ...m,
              booksIssued: m.booksIssued + 1,
            }
          : m
      )
    );

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Book Issued',
      message: `"${book.title}" issued to ${member.name}. Due on ${due}.`,
      type: 'issued',
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'issue-return',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('Book Issued', `"${book.title}" issued to ${member.name} (Due: ${due})`, 'success');
    return true;
  };

  const calculateReturnFine = (recordId: string, returnDateStr?: string) => {
    const record = issueRecords.find((r) => r.id === recordId);
    if (!record) return { overdueDays: 0, fineAmount: 0 };

    const returnDate = returnDateStr ? new Date(returnDateStr) : new Date();
    const dueDate = new Date(record.dueDate);

    // Zero out time
    returnDate.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = returnDate.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const overdueDays = Math.max(0, diffDays);
    const fineAmount = overdueDays * 5; // Fine rule: ₹5 per overdue day

    return { overdueDays, fineAmount };
  };

  const returnBook = (recordId: string, returnDateStr?: string) => {
    const record = issueRecords.find((r) => r.id === recordId);
    if (!record) return { fineAmount: 0, overdueDays: 0 };

    const returnDate = returnDateStr || new Date().toISOString().split('T')[0];
    const { overdueDays, fineAmount } = calculateReturnFine(recordId, returnDate);

    // Update issue record
    setIssueRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              returnDate,
              status: 'Returned',
              fineAmount,
              finePaid: fineAmount === 0,
            }
          : r
      )
    );

    // Restore book availability
    setBooks((prev) =>
      prev.map((b) =>
        b.id === record.bookId
          ? {
              ...b,
              availableQuantity: Math.min(b.quantity, b.availableQuantity + 1),
            }
          : b
      )
    );

    // Update member record
    setMembers((prev) =>
      prev.map((m) =>
        m.id === record.memberId
          ? {
              ...m,
              booksIssued: Math.max(0, m.booksIssued - 1),
              booksReturned: m.booksReturned + 1,
              booksRead: m.booksRead + 1,
              overdueBooks: overdueDays > 0 ? Math.max(0, m.overdueBooks - 1) : m.overdueBooks,
              fineAmount: m.fineAmount + fineAmount,
            }
          : m
      )
    );

    // If current logged-in user returned
    if (currentUser && currentUser.id === record.memberId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              booksRead: prev.booksRead + 1,
              fineBalance: prev.fineBalance + fineAmount,
            }
          : null
      );
    }

    // If fine occurred, create fine record
    if (fineAmount > 0) {
      const newFine: FineRecord = {
        id: `fn-${Date.now()}`,
        issueRecordId: record.id,
        memberId: record.memberId,
        memberName: record.memberName,
        studentId: record.studentId,
        bookTitle: record.bookTitle,
        dueDate: record.dueDate,
        returnDate,
        overdueDays,
        fineAmount,
        status: 'Pending',
        dateCreated: returnDate,
      };
      setFines((prev) => [newFine, ...prev]);

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Overdue Fine Assessed',
        message: `${record.memberName} accrued a ₹${fineAmount} fine (${overdueDays} days overdue @ ₹5/day) on "${record.bookTitle}".`,
        type: 'fine',
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'fines',
      };
      setNotifications((prev) => [notif, ...prev]);

      addToast(
        'Book Returned with Fine',
        `"${record.bookTitle}" returned. ${overdueDays} days overdue. Fine: ₹${fineAmount}`,
        'warning'
      );
    } else {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Book Returned on Time',
        message: `"${record.bookTitle}" returned safely by ${record.memberName}. No fine incurred.`,
        type: 'returned',
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'issue-return',
      };
      setNotifications((prev) => [notif, ...prev]);

      addToast('Book Returned', `"${record.bookTitle}" returned in good condition.`, 'success');
    }

    return { fineAmount, overdueDays };
  };

  // Fine management
  const payFine = (fineId: string) => {
    const fine = fines.find((f) => f.id === fineId);
    if (!fine) return;

    setFines((prev) =>
      prev.map((f) =>
        f.id === fineId
          ? { ...f, status: 'Paid', datePaid: new Date().toISOString().split('T')[0] }
          : f
      )
    );

    // Update IssueRecord if exists
    if (fine.issueRecordId) {
      setIssueRecords((prev) =>
        prev.map((r) => (r.id === fine.issueRecordId ? { ...r, finePaid: true } : r))
      );
    }

    // Update member fine balance
    setMembers((prev) =>
      prev.map((m) =>
        m.id === fine.memberId
          ? { ...m, fineAmount: Math.max(0, m.fineAmount - fine.fineAmount) }
          : m
      )
    );

    // Update current user balance if matching
    if (currentUser && currentUser.id === fine.memberId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, fineBalance: Math.max(0, prev.fineBalance - fine.fineAmount) } : null
      );
    }

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {
      // safe fallback
    }

    addToast('Fine Paid Successfully', `Payment of ₹${fine.fineAmount} received for ${fine.memberName}.`, 'success');
  };

  const waiveFine = (fineId: string) => {
    const fine = fines.find((f) => f.id === fineId);
    if (!fine) return;

    setFines((prev) =>
      prev.map((f) =>
        f.id === fineId ? { ...f, status: 'Waived', datePaid: new Date().toISOString().split('T')[0] } : f
      )
    );

    setMembers((prev) =>
      prev.map((m) =>
        m.id === fine.memberId
          ? { ...m, fineAmount: Math.max(0, m.fineAmount - fine.fineAmount) }
          : m
      )
    );

    addToast('Fine Waived', `Fine of ₹${fine.fineAmount} waived for ${fine.memberName}.`, 'info');
  };

  // Reservations
  const reserveBook = (bookId: string, memberId?: string): boolean => {
    const book = books.find((b) => b.id === bookId);
    const targetMemberId = memberId || currentUser?.id || 'mem-1';
    const member = members.find((m) => m.id === targetMemberId) || members[0];

    if (!book) return false;

    // Check if already reserved
    const existing = reservations.find(
      (r) => r.bookId === bookId && r.memberId === targetMemberId && r.status === 'Pending'
    );
    if (existing) {
      addToast('Already Reserved', `You already have an active reservation for "${book.title}".`, 'info');
      return false;
    }

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.coverUrl,
      memberId: member.id,
      memberName: member.name,
      studentId: member.studentId,
      reservationDate: new Date().toISOString().split('T')[0],
      status: book.availableQuantity > 0 ? 'Ready' : 'Pending',
      shelfNumber: book.shelfNumber,
      priority: 1,
    };

    setReservations((prev) => [newRes, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Book Reserved',
      message: `"${book.title}" reservation confirmed. Shelf: ${book.shelfNumber}.`,
      type: 'reservation',
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'reservations',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'Reservation Placed',
      `"${book.title}" is reserved for ${member.name}. Status: ${newRes.status}`,
      'success'
    );
    return true;
  };

  const cancelReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'Cancelled' } : r))
    );
    addToast('Reservation Cancelled', 'Your book reservation has been cancelled.', 'info');
  };

  const fulfillReservation = (reservationId: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'Fulfilled' } : r))
    );

    // Automatically issue the book
    issueBook(res.memberId, res.bookId);
    addToast('Reservation Fulfilled', `Book issued for reservation ${res.id}`, 'success');
  };

  // Reviews
  const addReview = (bookId: string, rating: number, comment: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const reviewerName = currentUser?.name || 'Aarav Sharma';
    const reviewerAvatar = currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookId,
      bookTitle: book.title,
      memberId: currentUser?.id || 'mem-1',
      memberName: reviewerName,
      memberAvatar: reviewerAvatar,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Calculate new average rating for this book
    const bookReviews = updatedReviews.filter((r) => r.bookId === bookId);
    const avgRating = Number(
      (bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length).toFixed(1)
    );

    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              rating: avgRating,
              reviewCount: bookReviews.length,
            }
          : b
      )
    );

    addToast('Review Submitted', `Thank you for reviewing "${book.title}"!`, 'success');
  };

  // Reading Buddies
  const toggleBuddyConnect = (buddyId: string) => {
    setBuddies((prev) =>
      prev.map((b) => {
        if (b.id === buddyId) {
          const nextState = !b.isConnected;
          addToast(
            nextState ? 'Connected with Buddy!' : 'Disconnected',
            nextState ? `You are now reading buddies with ${b.name}.` : `Removed connection with ${b.name}.`,
            'info'
          );
          return { ...b, isConnected: nextState };
        }
        return b;
      })
    );
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('Notifications Marked', 'All notifications marked as read.', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('Cleared', 'Notification inbox cleared.', 'info');
  };

  // Reset to default
  const resetToDefaultData = () => {
    localStorage.clear();
    setBooks(INITIAL_BOOKS);
    setMembers(INITIAL_MEMBERS);
    setIssueRecords(INITIAL_ISSUE_RECORDS);
    setReservations(INITIAL_RESERVATIONS);
    setFines(INITIAL_FINES);
    setReviews(INITIAL_REVIEWS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBuddies(INITIAL_READING_BUDDIES);
    setBadges(INITIAL_BADGES);
    setCurrentUser(INITIAL_CURRENT_USER);
    setIsDarkMode(false);
    addToast('Demo Data Reset', 'LibroSense database has been reset to default initial state.', 'success');
  };

  return (
    <LibraryContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleDarkMode,
        isSearchOpen,
        setIsSearchOpen,
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchUserRole,
        updateProfile,
        books,
        members,
        issueRecords,
        reservations,
        fines,
        reviews,
        notifications,
        buddies,
        badges,
        addBook,
        updateBook,
        deleteBook,
        addMember,
        updateMember,
        deleteMember,
        issueBook,
        calculateReturnFine,
        returnBook,
        payFine,
        waiveFine,
        reserveBook,
        cancelReservation,
        fulfillReservation,
        addReview,
        toggleBuddyConnect,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        toasts,
        addToast,
        removeToast,
        resetToDefaultData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

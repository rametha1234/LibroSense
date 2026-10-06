export type UserRole = 'Student' | 'Librarian' | 'Faculty';

export type BookAvailability = 'Available' | 'Issued' | 'Reserved';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  year: number;
  shelfNumber: string;
  quantity: number;
  availableQuantity: number;
  rating: number;
  reviewCount: number;
  coverUrl: string;
  description: string;
  addedDate: string;
  borrowCount: number;
  isFeatured?: boolean;
}

export interface Member {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  booksIssued: number;
  booksReturned: number;
  overdueBooks: number;
  fineAmount: number;
  status: 'Active' | 'Suspended' | 'Expired';
  joinDate: string;
  avatarUrl: string;
  readingStreak: number;
  booksRead: number;
}

export interface IssueRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  memberId: string;
  memberName: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  fineAmount: number;
  finePaid: boolean;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  memberId: string;
  memberName: string;
  studentId: string;
  reservationDate: string;
  status: 'Pending' | 'Ready' | 'Fulfilled' | 'Cancelled';
  shelfNumber: string;
  priority?: number;
}

export interface FineRecord {
  id: string;
  issueRecordId: string;
  memberId: string;
  memberName: string;
  studentId: string;
  bookTitle: string;
  dueDate: string;
  returnDate: string;
  overdueDays: number;
  fineAmount: number;
  status: 'Pending' | 'Paid' | 'Waived';
  dateCreated: string;
  datePaid?: string;
}

export interface Review {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export type NotificationType = 'issued' | 'returned' | 'due_soon' | 'overdue' | 'reservation' | 'fine' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface ReadingBuddy {
  id: string;
  name: string;
  avatar: string;
  department: string;
  favoriteCategory: string;
  booksRead: number;
  commonBooks: string[];
  isConnected: boolean;
  readingStreak: number;
}

export interface ReadingBadge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
  threshold: number;
}

export interface CurrentUser {
  id: string;
  studentId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl: string;
  booksRead: number;
  readingStreak: number;
  fineBalance: number;
}

export type NavigationTab =
  | 'dashboard'
  | 'books'
  | 'issue-return'
  | 'members'
  | 'reservations'
  | 'fines'
  | 'reviews'
  | 'recommendations'
  | 'reading-rewards'
  | 'reading-buddies'
  | 'digital-card'
  | 'analytics'
  | 'notifications'
  | 'profile'
  | 'settings';

# LibroSense – Smart Library Management System

> **Read Smarter. Manage Better.**  
> Central Campus Library Management Platform built with React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, and Recharts.

---

## 🌟 Overview

**LibroSense** is a comprehensive, production-grade SaaS-style web application engineered for modern university and institutional libraries. It replaces traditional manual registers with automated lending workflows, real-time catalog search, instant overdue penalty calculations (₹5/day policy), interactive student reading rewards, and digital library passes.

---

## 🚀 Key Modules & Capabilities

### 1. 🔐 Authentication & Role Management
- **Universal Login**: Institutional email and password authentication with show/hide password toggle and "Remember Me".
- **1-Click Demo Personas**:
  - **Student Persona**: Pre-loaded as *Aarav Sharma* (`CS2026-084`, 14 books read, 12-day streak).
  - **Librarian Persona**: Pre-loaded as *Dr. Meera Nambiar* (`LIB-001`, Library Services administrator).
- **Create Account**: Register new students and staff with custom Student ID, major, and role selection.
- **Forgot Password Modal**: Integrated reset link dispatcher.

### 2. 📊 Executive Dashboard
- **6 Real-time Stat Cards**: Total Books, Available Copies, Active Loans, Total Members, Overdue Loans, and Pending Fines (in ₹).
- **Featured Book of the Month**: Highlighting *Clean Code* and *Designing Data-Intensive Applications* with ratings, synopsis, and quick-issue.
- **New Arrivals & Trending Books**: Fast-moving volumes across engineering, AI, science, and humanities.
- **4 Interactive Charts (Recharts)**:
  1. *Monthly Borrowing & Return Trends* (Line chart)
  2. *Books by Category* (Donut chart)
  3. *Most Borrowed Books* (Horizontal bar chart)
  4. *Fine Collection vs Dues* (Area chart)

### 3. 📚 Book Catalog Management
- **Dual View Modes**: Switch between rich card grid and high-density tabular view.
- **Search & Filters**: Instant multi-attribute search (title, author, ISBN, shelf location), category dropdown, and in-stock vs checked-out filters.
- **Sorting**: By most borrowed, highest rated, title A-Z, or publication year.
- **Book Details Inspector**: View availability percentage bars, shelf locations, and peer reviews.
- **CRUD Operations**: Add new books, edit existing volumes, or delete books with confirmation dialogs.

### 4. 🔄 Circulation: Issue & Return (Automated ₹5/day Fine Calculation)
- **Book Issuance**: Select student, pick an in-stock book, configure issue and return deadlines (14-day default).
- **Return Processing & Fine Preview**:
  - Live overdue days calculator: $\max(0, \text{Return Date} - \text{Due Date})$.
  - Automated penalty computation: $\text{Fine} = \text{Overdue Days} \times ₹5$.
  - Clear itemized summary preview displayed before finalizing any check-in.
  - Automatically restores catalog stock and marks overdue records.
- **Circulation History**: Complete audit table of all current and historical loans.

### 5. 💰 Fine & Revenue Accounting
- **Live Metrics**: Total pending fines (₹), collected library revenue (₹), and resolution rate.
- **Actions**: "Mark as Paid" with celebratory confetti animation, fine waiving, and printable receipt modals.
- **Policy Display**: Strict ₹5.00/day overdue penalty schedule prominently highlighted.

### 6. 👥 Membership Directory
- Track student and faculty enrollment, department, active loans, returned books, overdue count, and fine balance.
- Add, edit, and delete members.
- Member profile inspector with reading history and digital card preview.

### 7. 🔖 Hold & Reservation System
- Place holds on books currently checked out.
- Automated hold queue tracking (`Ready for Pickup`, `Pending`, `Fulfilled`, `Cancelled`).
- One-click fulfillment that converts ready reservations into active loans.

### 8. ⭐ Reviews & Community Ratings
- 1 to 5 star interactive rating system.
- Campus review feed with verified student avatars and reviews.
- Dynamic recalculation of overall book scores.
- "Top Rated Books" showcase banner.

### 9. 🧠 Smart Recommendations
- Categorized suggestion engines:
  - *Curriculum & Major-specific* (CS & AI)
  - *Highest Academic Ratings* (4.8+ stars)
  - *Campus Favorites* (Most borrowed)
  - *Cross-Disciplinary Horizons* (Physics, Psychology, Literature, Business)
- Distinct "Why Recommended" badge for every book.

### 10. 🏆 Reading Streaks & Honors
- **Streak Tracker**: Flame counter with 7-day weekly activity dots and daily check-in button.
- **Academic Reading Goal**: Progress bar tracking progress toward a 20-book annual target.
- **Badges Showcase**: *New Reader*, *Beginner Reader*, *Bookworm*, *Scholar*, *Library Legend*, and *Streak Master*.
- **Campus Leaderboard**: Ranked table of top students with gold, silver, and bronze badges.

### 11. 🤝 Reading Buddies
- Discover peers reading within the same academic discipline.
- View common shared books and reading streaks.
- Interactive "Connect as Buddy" state toggling.

### 12. 🪪 Digital Library Pass
- Holographic smart card design with RFID chip visual, QR code, and barcode.
- **Export / Download Pass**: High-resolution PNG card generation via HTML5 canvas.
- Print pass capability.

### 13. 🔔 Notification Center & Global Search
- Notification dropdown & full center for due date warnings, overdue notices, and hold arrivals.
- Spotlight Smart Search (`⌘K` / `Ctrl+K`) for instantaneous discovery across books and students.

### 14. ⚙️ System Settings & Dark Mode
- Full light / dark theme toggle with persistence.
- Library circulation policy reference.
- Factory reset button to restore default demo state.

---

## 💻 Tech Stack

- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 with custom responsive utilities
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Celebration Effects**: Canvas Confetti
- **State Management**: React Context + LocalStorage Persistence

---

## 🏃 Running the Project Locally

```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

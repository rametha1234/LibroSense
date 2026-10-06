import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Award,
  IndianRupee,
  BookOpen,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const CATEGORY_COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#64748b'];

export const AnalyticsView: React.FC = () => {
  const { books, members, issueRecords, fines, isDarkMode } = useLibrary();

  // Metrics
  const totalBooks = books.reduce((sum, b) => sum + b.quantity, 0);
  const totalAvailable = books.reduce((sum, b) => sum + b.availableQuantity, 0);
  const totalMembers = members.length;
  const activeLoans = issueRecords.filter((r) => r.status === 'Issued' || r.status === 'Overdue').length;
  const overdueLoans = issueRecords.filter((r) => r.status === 'Overdue').length;
  const totalFinesCollected = fines.filter((f) => f.status === 'Paid').reduce((sum, f) => sum + f.fineAmount, 0);
  const totalFinesPending = fines.filter((f) => f.status === 'Pending').reduce((sum, f) => sum + f.fineAmount, 0);

  // Category breakdown
  const categoryCountMap: { [cat: string]: number } = {};
  books.forEach((b) => {
    categoryCountMap[b.category] = (categoryCountMap[b.category] || 0) + b.quantity;
  });
  const categoryData = Object.keys(categoryCountMap).map((cat) => ({
    name: cat,
    value: categoryCountMap[cat],
  }));

  // Top borrowed books
  const topBorrowed = [...books]
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 6)
    .map((b) => ({
      name: b.title.length > 22 ? b.title.substring(0, 20) + '...' : b.title,
      fullTitle: b.title,
      borrows: b.borrowCount,
    }));

  // Monthly trends
  const monthlyData = [
    { month: 'Jan', borrows: 42, returns: 38 },
    { month: 'Feb', borrows: 56, returns: 51 },
    { month: 'Mar', borrows: 68, returns: 60 },
    { month: 'Apr', borrows: 80, returns: 74 },
    { month: 'May', borrows: 65, returns: 68 },
    { month: 'Jun', borrows: 45, returns: 43 },
    { month: 'Jul', borrows: 52, returns: 49 },
    { month: 'Aug', borrows: 92, returns: 85 },
    { month: 'Sep', borrows: 118, returns: 104 },
    { month: 'Oct', borrows: 84, returns: 72 },
  ];

  // Fine trend
  const fineTrend = [
    { month: 'May', assessed: 240, collected: 210 },
    { month: 'Jun', assessed: 180, collected: 170 },
    { month: 'Jul', assessed: 150, collected: 150 },
    { month: 'Aug', assessed: 320, collected: 295 },
    { month: 'Sep', assessed: 450, collected: 390 },
    { month: 'Oct', assessed: 280, collected: 180 },
  ];

  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#334155' : '#e2e8f0';
  const textColor = isDarkMode ? '#e2e8f0' : '#1e293b';
  const gridColor = isDarkMode ? '#334155' : '#f1f5f9';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            Library Analytics & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Holistic circulation statistics, inventory metrics, and fine recovery performance
          </p>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Catalog Volume</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalBooks}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {totalAvailable} available ({Math.round((totalAvailable / (totalBooks || 1)) * 100)}%)
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Enrolled Members</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalMembers}
          </div>
          <span className="text-[11px] text-slate-400">Students & Faculty</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Overdue Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {Math.round((overdueLoans / (activeLoans || 1)) * 100)}%
          </div>
          <span className="text-[11px] text-slate-400">
            {overdueLoans} of {activeLoans} loans overdue
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Fine Revenue (₹)</span>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{totalFinesCollected}
          </div>
          <span className="text-[11px] text-rose-500">
            ₹{totalFinesPending} pending
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Borrowing Trend */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Monthly Borrowing & Circulation Curve
          </h3>
          <p className="text-xs text-slate-500 mb-4">Volume velocity throughout 2026</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '12px',
                    color: textColor,
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="borrows"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="returns"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Stock Distribution by Category
          </h3>
          <p className="text-xs text-slate-500 mb-2">Subject share across the library</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '12px',
                    color: textColor,
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Borrowed Books */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Top 6 Most Borrowed Titles
          </h3>
          <p className="text-xs text-slate-500 mb-4">Historical demand index</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBorrowed} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={90} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '12px',
                    color: textColor,
                    fontSize: '12px',
                  }}
                  formatter={(val, _name, item: any) => [`${val} Borrows`, item.payload.fullTitle]}
                />
                <Bar dataKey="borrows" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fine Recovery Curve */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Fine Assessment & Recovery (₹)
          </h3>
          <p className="text-xs text-slate-500 mb-4">₹5/day penalty compliance</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fineTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '12px',
                    color: textColor,
                    fontSize: '12px',
                  }}
                  formatter={(v, n) => [`₹${v}`, n === 'collected' ? 'Collected' : 'Assessed']}
                />
                <Area type="monotone" dataKey="assessed" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                <Area type="monotone" dataKey="collected" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
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
import { useLibrary } from '../../context/LibraryContext';
import { TrendingUp, PieChart as PieIcon, Award, DollarSign, IndianRupee } from 'lucide-react';

const CATEGORY_COLORS = [
  '#4f46e5', // Indigo
  '#06b6d4', // Cyan
  '#8b5cf6', // Purple
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#64748b', // Slate
];

export const DashboardCharts: React.FC = () => {
  const { books, isDarkMode } = useLibrary();

  // 1. Books Borrowed Per Month (Jan - Oct 2026)
  const monthlyBorrowData = [
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

  // 2. Books by Category
  const categoryCountMap: { [cat: string]: number } = {};
  books.forEach((b) => {
    categoryCountMap[b.category] = (categoryCountMap[b.category] || 0) + b.quantity;
  });

  const categoryData = Object.keys(categoryCountMap).map((cat) => ({
    name: cat,
    value: categoryCountMap[cat],
  }));

  // 3. Most Borrowed Books
  const topBorrowedData = [...books]
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5)
    .map((b) => ({
      name: b.title.length > 20 ? b.title.substring(0, 18) + '...' : b.title,
      fullTitle: b.title,
      borrows: b.borrowCount,
    }));

  // 4. Fine Collection (Revenue & Assessed)
  const fineTrendData = [
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1: Monthly Borrowing & Return Trends */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Borrowing Trends
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Issued vs Returned volumes (2026)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Issued
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Returned
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyBorrowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  color: textColor,
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="borrows"
                name="Books Borrowed"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#4f46e5' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="returns"
                name="Books Returned"
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#06b6d4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Category Distribution Donut */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Books by Category
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inventory breakdown across fields
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {categoryData.length} Subjects
          </span>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
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
                formatter={(val, name) => [`${val} copies`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-1 text-[11px] text-slate-600 dark:text-slate-400">
          {categoryData.slice(0, 6).map((item, idx) => (
            <span key={item.name} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
              />
              {item.name} ({item.value})
            </span>
          ))}
        </div>
      </div>

      {/* Chart 3: Most Borrowed Books Bar Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Most Borrowed Books
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top requested campus titles
              </p>
            </div>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            Semester stats
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topBorrowedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                width={90}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  color: textColor,
                  fontSize: '12px',
                }}
                formatter={(val, _name, item: any) => [`${val} times borrowed`, item.payload.fullTitle]}
              />
              <Bar dataKey="borrows" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={18}>
                {topBorrowedData.map((_, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={index === 0 ? '#4f46e5' : index === 1 ? '#6366f1' : index === 2 ? '#818cf8' : '#a5b4fc'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Fine Collection vs Assessment Area Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Fine Collection (₹5/day policy)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Assessed vs Collected amounts in ₹
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Assessed
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Collected
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fineTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAssessed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  color: textColor,
                  fontSize: '12px',
                }}
                formatter={(val, name) => [`₹${val}`, name === 'collected' ? 'Collected Fines' : 'Assessed Dues']}
              />
              <Area
                type="monotone"
                dataKey="assessed"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAssessed)"
              />
              <Area
                type="monotone"
                dataKey="collected"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCollected)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

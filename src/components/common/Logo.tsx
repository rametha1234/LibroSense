import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  lightText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  lightText = false,
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizeClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl font-extrabold tracking-tight',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Smart Book Logo Icon */}
      <div className={`relative flex items-center justify-center ${iconSizeClasses[size]} rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-md shadow-indigo-500/25 text-white flex-shrink-0`}>
        {/* SVG Smart Book with Digital Circuit Node */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5"
        >
          {/* Open Book spine & pages */}
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h9" />
          <path d="M6 10h6" />
          {/* Smart digital connection node */}
          <circle cx="17.5" cy="16.5" r="2.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M12 16.5h3" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="1 1" />
        </svg>

        {/* Small cyan pulse highlight */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
      </div>

      <div className="flex flex-col text-left">
        <div className={`flex items-center gap-1.5 leading-none ${titleSizeClasses[size]}`}>
          <span className={lightText ? 'text-white' : 'text-slate-900 dark:text-white'}>
            Libro<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Sense</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
            PRO
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
            Read Smarter. Manage Better.
          </span>
        )}
      </div>
    </div>
  );
};

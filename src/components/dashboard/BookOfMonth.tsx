import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Book } from '../../types';
import { Star, Sparkles, BookOpen, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface BookOfMonthProps {
  onSelectBook: (book: Book) => void;
}

export const BookOfMonth: React.FC<BookOfMonthProps> = ({ onSelectBook }) => {
  const { books, setActiveTab, reserveBook, issueBook, currentUser } = useLibrary();

  // Book of the Month: Clean Code or Designing Data-Intensive Applications
  const featuredBook = books.find((b) => b.isFeatured) || books[0];

  // New Arrivals: latest added
  const newArrivals = [...books]
    .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
    .slice(0, 4);

  // Trending Books: highest borrow count
  const trendingBooks = [...books]
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Featured Book of the Month Hero Card */}
      {featuredBook && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/20">
          {/* Background decorative glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
            {/* Book Cover Image with 3D drop shadow */}
            <div className="relative shrink-0 group cursor-pointer" onClick={() => onSelectBook(featuredBook)}>
              <div className="relative w-36 sm:w-44 h-52 sm:h-64 rounded-xl overflow-hidden shadow-2xl shadow-indigo-950/60 ring-1 ring-white/20 transform transition-transform duration-300 group-hover:scale-105">
                <img
                  src={featuredBook.coverUrl}
                  alt={featuredBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                ★ 4.9 Staff Pick
              </div>
            </div>

            {/* Book Info & Description */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Book of the Month &bull; October 2026
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {featuredBook.title}
              </h2>
              <p className="text-sm sm:text-base text-indigo-200 mt-1 font-medium">
                By {featuredBook.author} &bull; <span className="text-indigo-300/80">{featuredBook.publisher}, {featuredBook.year}</span>
              </p>

              {/* Star Rating & Shelf Badge */}
              <div className="flex items-center justify-center md:justify-start gap-4 my-3 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{featuredBook.rating}</span>
                  <span className="text-slate-400 font-normal">({featuredBook.reviewCount} student reviews)</span>
                </div>
                <span className="text-slate-400">&bull;</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-[11px]">
                  Shelf: {featuredBook.shelfNumber}
                </span>
                <span className="text-slate-400 hidden sm:inline">&bull;</span>
                <span className="hidden sm:inline text-emerald-400 font-semibold">
                  {featuredBook.availableQuantity} copies available
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 max-w-2xl mb-5">
                {featuredBook.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => onSelectBook(featuredBook)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
                >
                  View Details & Reviews
                </button>

                {featuredBook.availableQuantity > 0 ? (
                  <button
                    onClick={() => {
                      if (currentUser) {
                        issueBook(currentUser.id, featuredBook.id);
                      } else {
                        setActiveTab('issue-return');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all backdrop-blur-xs"
                  >
                    Quick Issue
                  </button>
                ) : (
                  <button
                    onClick={() => reserveBook(featuredBook.id)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-amber-500/20 transition-all"
                  >
                    Reserve Copy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Arrivals & Trending Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Arrivals */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  New Arrivals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recently added to the catalog
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('books')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {newArrivals.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:shadow-md transition-all">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-600 text-white shadow-xs">
                    NEW
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-2 group-hover:text-indigo-600 transition-colors">
                  {book.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {book.author}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{book.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Books */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Trending on Campus
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Most sought-after titles this week
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trendingBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:shadow-md transition-all">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500 text-white shadow-xs">
                    {book.borrowCount} borrows
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-2 group-hover:text-indigo-600 transition-colors">
                  {book.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {book.author}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{book.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

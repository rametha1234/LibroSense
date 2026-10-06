import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Book } from '../../types';
import {
  Sparkles,
  Star,
  BookOpen,
  TrendingUp,
  Award,
  Compass,
  ArrowRight,
  BookmarkCheck,
  CheckCircle2,
} from 'lucide-react';
import { BookDetailModal } from '../books/BookDetailModal';

export const RecommendationsView: React.FC = () => {
  const { books, issueBook, reserveBook, currentUser } = useLibrary();

  const [activeEngine, setActiveEngine] = useState<'major' | 'rated' | 'popular' | 'cross'>('major');
  const [inspectingBook, setInspectingBook] = useState<Book | null>(null);

  // 1. Based on Major / History (Computer Science & AI)
  const historyBased = books
    .filter((b) => b.category === 'Computer Science' || b.category === 'Artificial Intelligence')
    .slice(0, 6);

  // 2. Highest Rated
  const highestRated = [...books].sort((a, b) => b.rating - a.rating).slice(0, 6);

  // 3. Most Popular / Trending
  const mostPopular = [...books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 6);

  // 4. Cross-Disciplinary (Physics, Business, Psychology, Literature)
  const crossDisciplinary = books
    .filter((b) => ['Physics', 'Business', 'Psychology', 'Literature'].includes(b.category))
    .slice(0, 6);

  const getActiveList = () => {
    switch (activeEngine) {
      case 'major':
        return historyBased;
      case 'rated':
        return highestRated;
      case 'popular':
        return mostPopular;
      case 'cross':
        return crossDisciplinary;
      default:
        return books.slice(0, 6);
    }
  };

  const getReasonBadge = (book: Book, engine: string) => {
    if (engine === 'major') return `Recommended for ${currentUser?.department || 'Engineering'}`;
    if (engine === 'rated') return `★ Top ${book.rating} Academic Rating`;
    if (engine === 'popular') return `Borrowed ${book.borrowCount}+ times on campus`;
    return `Broaden your horizons in ${book.category}`;
  };

  const currentList = getActiveList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            Curated Academic Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Personalized reading suggestions tailored to your curriculum, interests, and peer ratings
          </p>
        </div>
      </div>

      {/* Recommendation Category Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveEngine('major')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeEngine === 'major'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 border-transparent'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-bold">Your Curriculum</span>
          </div>
          <p className={`text-[11px] ${activeEngine === 'major' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
            Based on CS & AI coursework
          </p>
        </button>

        <button
          onClick={() => setActiveEngine('rated')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeEngine === 'rated'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 border-transparent'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold">Highest Rated</span>
          </div>
          <p className={`text-[11px] ${activeEngine === 'rated' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
            Titles scoring 4.8+ stars
          </p>
        </button>

        <button
          onClick={() => setActiveEngine('popular')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeEngine === 'popular'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 border-transparent'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold">Campus Favorites</span>
          </div>
          <p className={`text-[11px] ${activeEngine === 'popular' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
            Most borrowed this term
          </p>
        </button>

        <button
          onClick={() => setActiveEngine('cross')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeEngine === 'cross'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 border-transparent'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-bold">Cross-Disciplinary</span>
          </div>
          <p className={`text-[11px] ${activeEngine === 'cross' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
            Science, Business & Humanities
          </p>
        </button>
      </div>

      {/* Recommended Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentList.map((book) => {
          const isAvailable = book.availableQuantity > 0;
          return (
            <div
              key={book.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Recommendation Reason Pill */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900">
                    <Sparkles className="w-3 h-3 text-cyan-500" />
                    {getReasonBadge(book, activeEngine)}
                  </span>
                </div>

                <div className="flex gap-4">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-xl shadow-xs shrink-0 cursor-pointer hover:opacity-90"
                    onClick={() => setInspectingBook(book)}
                  />
                  <div className="min-w-0">
                    <h3
                      onClick={() => setInspectingBook(book)}
                      className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {book.author}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{book.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({book.reviewCount} reviews)</span>
                    </div>

                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Shelf: {book.shelfNumber}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-3 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {isAvailable ? (
                  <button
                    onClick={() => {
                      if (currentUser) issueBook(currentUser.id, book.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all"
                  >
                    Quick Issue
                  </button>
                ) : (
                  <button
                    onClick={() => reserveBook(book.id)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 transition-all"
                  >
                    Reserve Copy
                  </button>
                )}

                <button
                  onClick={() => setInspectingBook(book)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Book Details Modal */}
      <BookDetailModal
        book={inspectingBook}
        onClose={() => setInspectingBook(null)}
        onEdit={() => {}}
      />
    </div>
  );
};

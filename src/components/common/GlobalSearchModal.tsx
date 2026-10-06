import React, { useState, useEffect, useRef } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Search, X, BookOpen, User, Hash, Tag, ArrowRight } from 'lucide-react';
import { Book } from '../../types';

interface GlobalSearchModalProps {
  onSelectBook?: (book: Book) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ onSelectBook }) => {
  const { isSearchOpen, setIsSearchOpen, books, members, setActiveTab } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchTerm.trim().toLowerCase();

  // Search books by Title, Author, Category, ISBN
  const filteredBooks = query
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query) ||
          b.isbn.toLowerCase().includes(query) ||
          b.shelfNumber.toLowerCase().includes(query)
      )
    : books.slice(0, 5); // Show top 5 recommended if empty query

  // Search members by Name, Student ID, Email
  const filteredMembers = query
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.studentId.toLowerCase().includes(query) ||
          m.department.toLowerCase().includes(query)
      ).slice(0, 3)
    : [];

  const handleBookClick = (book: Book) => {
    setIsSearchOpen(false);
    if (onSelectBook) {
      onSelectBook(book);
    } else {
      setActiveTab('books');
    }
  };

  const handleMemberClick = () => {
    setIsSearchOpen(false);
    setActiveTab('members');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search books by title, author, category, ISBN, shelf..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Books Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {query ? `Books (${filteredBooks.length})` : 'Popular & Featured Books'}
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400">
                {filteredBooks.length > 0 ? 'Click to inspect' : ''}
              </span>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No books matched &quot;{searchTerm}&quot;. Try searching another keyword or author.
              </div>
            ) : (
              <div className="grid gap-2">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded-md shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {book.title}
                          </h4>
                          {book.availableQuantity > 0 ? (
                            <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                              Available ({book.availableQuantity})
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                              Issued Out
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {book.author} &bull; <span className="text-slate-400">{book.year}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-indigo-400" />
                            {book.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {book.shelfNumber}
                          </span>
                          <span className="hidden sm:inline">ISBN: {book.isbn}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-indigo-600 transition-all shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members Matching Query (if any) */}
          {filteredMembers.length > 0 && (
            <div>
              <div className="px-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Members & Students ({filteredMembers.length})
                </span>
              </div>
              <div className="grid gap-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={handleMemberClick}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {member.name}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                            {member.studentId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {member.department} &bull; {member.role}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      View Member &rarr;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">Enter</kbd> to select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">ESC</kbd> to close
            </span>
          </div>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setActiveTab('books');
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Browse All Books &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

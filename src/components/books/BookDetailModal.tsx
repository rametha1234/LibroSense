import React, { useState } from 'react';
import { Book } from '../../types';
import { useLibrary } from '../../context/LibraryContext';
import {
  X,
  Star,
  MapPin,
  BookmarkCheck,
  CheckCircle,
  AlertCircle,
  Calendar,
  Layers,
  Edit,
  Send,
  User,
  Shield,
  BookOpen,
} from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onEdit,
}) => {
  const {
    currentUser,
    reserveBook,
    issueBook,
    addReview,
    reviews,
    setActiveTab,
  } = useLibrary();

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!book) return null;

  const bookReviews = reviews.filter((r) => r.bookId === book.id);
  const isAvailable = book.availableQuantity > 0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(book.id, newRating, newComment);
    setNewComment('');
    setShowReviewForm(false);
  };

  const handleQuickIssue = () => {
    if (currentUser) {
      issueBook(currentUser.id, book.id);
    } else {
      setActiveTab('issue-return');
      onClose();
    }
  };

  const handleQuickReserve = () => {
    reserveBook(book.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {book.category}
            </span>
            <span className="text-xs font-mono text-slate-400">ISBN: {book.isbn}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(book);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Book"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Main Book Overview */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Book Cover */}
            <div className="w-40 sm:w-48 shrink-0 mx-auto sm:mx-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 bg-slate-100 dark:bg-slate-800">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Availability Status Card */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {isAvailable ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        In Stock ({book.availableQuantity} of {book.quantity})
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        Currently Checked Out
                      </span>
                    </>
                  )}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${(book.availableQuantity / (book.quantity || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {book.title}
                </h2>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                  By {book.author}
                </p>
              </div>

              {/* Rating & Borrow Count */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{book.rating}</span>
                  <span className="text-slate-400 font-normal">({bookReviews.length || book.reviewCount} reviews)</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Borrowed {book.borrowCount} times
                </span>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400">Publisher:</span>{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{book.publisher || 'Academic Press'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Year:</span>{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{book.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-slate-400">Shelf:</span>{' '}
                  <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {book.shelfNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Catalog Date:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{book.addedDate}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap gap-2.5">
                {isAvailable ? (
                  <button
                    onClick={handleQuickIssue}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    Issue This Book
                  </button>
                ) : (
                  <button
                    onClick={handleQuickReserve}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-all"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    Place Reservation
                  </button>
                )}

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </button>
              </div>
            </div>
          </div>

          {/* Add Review Inline Form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Add Your Review for this Book
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-0.5 focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-1 text-xs font-bold text-amber-500">{newRating} / 5</span>
                </div>
              </div>

              <textarea
                rows={2}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What did you think of the explanations, syllabus depth, or writing style?"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Review
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Student & Faculty Reviews ({bookReviews.length})
              </h3>
            </div>

            {bookReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No reviews yet for this title. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="space-y-2.5">
                {bookReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {rev.memberAvatar ? (
                          <img
                            src={rev.memberAvatar}
                            alt={rev.memberName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                            {rev.memberName.charAt(0)}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {rev.memberName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 ml-1.5">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

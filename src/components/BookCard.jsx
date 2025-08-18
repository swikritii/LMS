import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ title, author, isbn, available, quantity, onBorrow, onViewDetails, isBorrowed, borrowDate, dueDate, bookId }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="book-card">
      <div className="book-info">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">by {author}</p>
        <p className="book-isbn">ISBN: {isbn}</p>
        <p className="book-availability">
          Available: {available} of {quantity}
        </p>
        
        {isBorrowed && (
          <div className="borrowed-info">
            <p className="borrow-date">
              Borrowed: {formatDate(borrowDate)}
            </p>
            <p className={`due-date ${isOverdue(dueDate) ? 'overdue' : ''}`}>
              Due: {formatDate(dueDate)}
              {isOverdue(dueDate) && ' (Overdue)'}
            </p>
          </div>
        )}
      </div>
      
      <div className="book-actions">
        <Link to={`/book/${bookId || isbn}`} className="view-details-btn">
          View Details
        </Link>
        
        {!isBorrowed ? (
          <button
            onClick={onBorrow}
            disabled={available <= 0}
            className={`borrow-btn ${available <= 0 ? 'disabled' : ''}`}
          >
            {available <= 0 ? 'Not Available' : 'Borrow Book'}
          </button>
        ) : (
          <button
            onClick={onBorrow}
            className="return-btn"
          >
            Return Book
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;

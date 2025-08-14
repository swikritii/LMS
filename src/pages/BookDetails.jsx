import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './BookDetails.css';

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [borrowedBook, setBorrowedBook] = useState(null);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookDetails();
    if (user) {
      checkBorrowStatus();
    }
  }, [id, user]);

  const fetchBookDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/books/${id}`, {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {}
      });
      setBook(response.data.book);
    } catch (error) {
      console.error('Error fetching book details:', error);
      showMessage('Error loading book details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkBorrowStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/borrow/my-books', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const borrowed = response.data.borrows.find(
        borrow => borrow.book._id === id && borrow.status === 'borrowed'
      );
      
      setIsBorrowed(!!borrowed);
      setBorrowedBook(borrowed);
    } catch (error) {
      console.error('Error checking borrow status:', error);
    }
  };

  const handleBorrow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/borrow', { bookId: id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      showMessage('Book borrowed successfully!', 'success');
      setIsBorrowed(true);
      fetchBookDetails(); // Refresh book details to update availability
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error borrowing book';
      showMessage(errorMessage, 'error');
    }
  };

  const handleReturn = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/borrow/return', { bookId: id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      showMessage('Book returned successfully!', 'success');
      setIsBorrowed(false);
      setBorrowedBook(null);
      fetchBookDetails(); // Refresh book details to update availability
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error returning book';
      showMessage(errorMessage, 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="book-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-container">
        <div className="error-container">
          <h2>Book Not Found</h2>
          <p>The book you're looking for doesn't exist.</p>
          <Link to="/borrower-dashboard" className="back-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details-container">
      <div className="book-details-card">
        <div className="book-header">
          <Link to="/borrower-dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="book-content">
          <div className="book-info">
            <div className="info-section">
              <h3>Book Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>ISBN:</label>
                  <span>{book.isbn}</span>
                </div>
                {book.genre && (
                  <div className="info-item">
                    <label>Genre:</label>
                    <span>{book.genre}</span>
                  </div>
                )}
                {book.publishedYear && (
                  <div className="info-item">
                    <label>Published:</label>
                    <span>{book.publishedYear}</span>
                  </div>
                )}
                <div className="info-item">
                  <label>Total Copies:</label>
                  <span>{book.quantity}</span>
                </div>
                <div className="info-item">
                  <label>Available:</label>
                  <span className={book.available <= 0 ? 'unavailable' : 'available'}>
                    {book.available} copies
                  </span>
                </div>
              </div>
            </div>

            {book.description && (
              <div className="description-section">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            {isBorrowed && borrowedBook && (
              <div className="borrowed-info">
                <h3>Your Borrow Information</h3>
                <div className="borrow-details">
                  <p><strong>Borrowed on:</strong> {formatDate(borrowedBook.borrowDate)}</p>
                  <p><strong>Due date:</strong> 
                    <span className={isOverdue(borrowedBook.dueDate) ? 'overdue' : ''}>
                      {formatDate(borrowedBook.dueDate)}
                      {isOverdue(borrowedBook.dueDate) && ' (Overdue)'}
                    </span>
                  </p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${borrowedBook.status}`}>
                      {borrowedBook.status}
                      {isOverdue(borrowedBook.dueDate) && ' (Overdue)'}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="book-actions">
            {user ? (
              isBorrowed ? (
                <div className="action-buttons">
                  <button 
                    onClick={handleReturn}
                    className="return-btn"
                  >
                    Return Book
                  </button>
                  <p className="action-note">
                    You can return this book early if you're finished with it.
                  </p>
                </div>
              ) : (
                <div className="action-buttons">
                  <button 
                    onClick={handleBorrow}
                    disabled={book.available <= 0}
                    className={`borrow-btn ${book.available <= 0 ? 'disabled' : ''}`}
                  >
                    {book.available <= 0 ? 'Not Available' : 'Borrow This Book'}
                  </button>
                  {book.available <= 0 ? (
                    <p className="action-note">
                      This book is currently not available for borrowing.
                    </p>
                  ) : (
                    <p className="action-note">
                      You can borrow this book for 14 days.
                    </p>
                  )}
                </div>
              )
            ) : (
              <div className="action-buttons">
                <p className="login-prompt">
                  Please <Link to="/login" className="login-link">log in</Link> to borrow this book.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './BorrowerDashboard.css';

const BorrowerDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/books', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
      showMessage('Error loading books', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/borrow/my-books', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBorrowedBooks(response.data.borrows);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterGenre) params.genre = filterGenre;

      const response = await axios.get('/api/books', {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error searching books:', error);
      showMessage('Error searching books', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/borrow', { bookId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      showMessage('Book borrowed successfully!', 'success');
      fetchBooks(); // Refresh books list
      fetchBorrowedBooks(); // Refresh borrowed books
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error borrowing book';
      showMessage(errorMessage, 'error');
    }
  };

  const handleReturn = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/borrow/return', { bookId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      showMessage('Book returned successfully!', 'success');
      fetchBooks(); // Refresh books list
      fetchBorrowedBooks(); // Refresh borrowed books
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

  const isBookBorrowed = (bookId) => {
    return borrowedBooks.some(borrow => 
      borrow.book._id === bookId && borrow.status === 'borrowed'
    );
  };

  const getBorrowedBook = (bookId) => {
    return borrowedBooks.find(borrow => 
      borrow.book._id === bookId && borrow.status === 'borrowed'
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Browse and borrow books from our library</p>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="search-section">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="genre-filter"
          >
            <option value="">All Genres</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="science">Science</option>
            <option value="history">History</option>
            <option value="biography">Biography</option>
            <option value="technology">Technology</option>
          </select>
          <button onClick={handleSearch} className="search-btn">
            Search
          </button>
        </div>
      </div>

      {/* Borrowed Books Section */}
      {borrowedBooks.length > 0 && (
        <div className="borrowed-books-section">
          <h2>My Borrowed Books</h2>
          <div className="books-grid">
            {borrowedBooks
              .filter(borrow => borrow.status === 'borrowed')
              .map(borrow => (
                <div key={borrow.id} className="book-card borrowed">
                  <div className="book-info">
                    <h3>{borrow.book.title}</h3>
                    <p className="author">by {borrow.book.author}</p>
                    <p className="isbn">ISBN: {borrow.book.isbn}</p>
                    <p className="borrow-date">
                      Borrowed: {formatDate(borrow.borrowDate)}
                    </p>
                    <p className={`due-date ${isOverdue(borrow.dueDate) ? 'overdue' : ''}`}>
                      Due: {formatDate(borrow.dueDate)}
                      {isOverdue(borrow.dueDate) && ' (Overdue)'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReturn(borrow.book._id)}
                    className="return-btn"
                  >
                    Return Book
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Available Books Section */}
      <div className="available-books-section">
        <h2>Available Books</h2>
        {books.length === 0 ? (
          <p className="no-books">No books found.</p>
        ) : (
          <div className="books-grid">
            {books.map(book => {
              const isBorrowed = isBookBorrowed(book._id);
              const borrowedBook = getBorrowedBook(book._id);
              
              return (
                <div key={book._id} className="book-card">
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="author">by {book.author}</p>
                    <p className="isbn">ISBN: {book.isbn}</p>
                    {book.genre && <p className="genre">{book.genre}</p>}
                    {book.publishedYear && (
                      <p className="year">Published: {book.publishedYear}</p>
                    )}
                    <p className="availability">
                      Available: {book.available} of {book.quantity}
                    </p>
                    {book.description && (
                      <p className="description">{book.description}</p>
                    )}
                  </div>
                  
                  <div className="book-actions">
                    <Link to={`/book/${book._id}`} className="view-details-btn">
                      View Details
                    </Link>
                    
                    {isBorrowed ? (
                      <div className="borrowed-status">
                        <p>Borrowed until: {formatDate(borrowedBook.dueDate)}</p>
                        <button
                          onClick={() => handleReturn(book._id)}
                          className="return-btn"
                        >
                          Return Early
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBorrow(book._id)}
                        disabled={book.available <= 0}
                        className={`borrow-btn ${book.available <= 0 ? 'disabled' : ''}`}
                      >
                        {book.available <= 0 ? 'Not Available' : 'Borrow Book'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowerDashboard;

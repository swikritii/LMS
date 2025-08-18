import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import BookCard from '../components/BookCard';
import './BorrowerDashboard.css';

const BorrowerDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { user } = useAuth();

  const fetchBooks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/books', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBooks(response.data.books);
      setFilteredBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
      showMessage('Error loading books', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBorrowedBooks = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
  }, [fetchBooks, fetchBorrowedBooks]);

  // Real-time search filtering and sorting
  useEffect(() => {
    let filtered = books;
    
    if (searchTerm.trim()) {
      filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'isbn':
          return a.isbn.localeCompare(b.isbn);
        default:
          return a.title.localeCompare(b.title);
      }
    });
    
    setFilteredBooks(filtered);
  }, [searchTerm, books, sortBy]);

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
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <span className="book-icon">📖</span>
          <h1>My Library</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* My Borrowed Books Section */}
      {borrowedBooks.length > 0 && (
        <div className="borrowed-books-section">
          <div className="section-header">
            <span className="section-icon">📚</span>
            <h2>My Borrowed Books</h2>
          </div>
          <div className="borrowed-books-grid">
            {borrowedBooks
              .filter(borrow => borrow.status === 'borrowed')
              .map(borrow => (
                <div key={borrow.id} className="borrowed-book-card">
                  <div className="book-info">
                    <h3 className="book-title">{borrow.book.title}</h3>
                    <p className="borrow-date">
                      Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}
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
        <div className="section-header">
          <span className="section-icon">🔍</span>
          <h2>Available Books</h2>
        </div>
        
        {/* Search and Sort Controls */}
        <div className="search-sort-controls">
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="isbn">Sort by ISBN</option>
          </select>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="no-books-message">
            {searchTerm ? (
              <p>No books found matching "{searchTerm}". Try a different search term.</p>
            ) : (
              <p>No books available at the moment.</p>
            )}
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map(book => {
              const isBorrowed = isBookBorrowed(book._id);
              const borrowedBook = getBorrowedBook(book._id);
              
              return (
                <BookCard
                  key={book._id}
                  title={book.title}
                  author={book.author}
                  isbn={book.isbn}
                  available={book.available}
                  quantity={book.quantity}
                  onBorrow={() => isBorrowed ? handleReturn(book._id) : handleBorrow(book._id)}
                  isBorrowed={isBorrowed}
                  borrowDate={isBorrowed ? borrowedBook.borrowDate : null}
                  dueDate={isBorrowed ? borrowedBook.dueDate : null}
                  bookId={book._id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowerDashboard;

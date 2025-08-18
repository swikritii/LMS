import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './LibrarianDashboard.css';

const LibrarianDashboard = () => {
  const { user, token } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Book form state
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: '',
    genre: '',
    publishedYear: '',
    description: ''
  });

  // Fetch books from API
  const fetchBooks = useCallback(async () => {
    console.log('Fetching books...');
    try {
      const response = await axios.get('/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = response?.data;
      const booksArray = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.books)
          ? payload.books
          : [];
      console.log('Books fetched successfully:', booksArray.length, 'books');
      setBooks(booksArray);
    } catch (error) {
      console.error('Error fetching books:', error);
      setMessage({ text: 'Failed to fetch books', type: 'error' });
      // Do not rethrow to avoid blocking other loads
    }
  }, [token]);

  // Fetch borrow records from API
  const fetchBorrowRecords = useCallback(async () => {
    console.log('Fetching borrow records...');
    try {
      // Attempt librarian endpoint first
      const response = await axios.get('/api/borrow/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = response?.data;
      const records = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.borrows)
          ? payload.borrows
          : Array.isArray(payload?.records)
            ? payload.records
            : [];
      console.log('Borrow records fetched successfully:', records.length, 'records');
      setBorrowRecords(records);
    } catch (error) {
      console.warn('Borrow records fetch via /all failed, trying /my-books...', error?.response?.status);
      try {
        const fallback = await axios.get('/api/borrow/my-books', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const payload = fallback?.data;
        const records = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.borrows)
            ? payload.borrows
            : [];
        setBorrowRecords(records);
      } catch (innerError) {
        console.error('Error fetching borrow records:', innerError);
        setBorrowRecords([]);
        setMessage({ text: 'Failed to fetch borrow records', type: 'error' });
      }
    }
  }, [token]);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchBooks(), fetchBorrowRecords()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ text: 'Failed to fetch data', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [fetchBooks, fetchBorrowRecords]);

  useEffect(() => {
    console.log('useEffect triggered, token:', token ? 'exists' : 'missing');
    if (token) {
      fetchData();
    } else {
      console.log('No token available, setting loading to false');
      setLoading(false);
    }
  }, [token, fetchData]);

  // Filter and sort books
  const getFilteredAndSortedBooks = () => {
    const safeBooks = Array.isArray(books) ? books : [];
    let filtered = safeBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'isbn':
          return a.isbn.localeCompare(b.isbn);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Reset book form
  const resetBookForm = () => {
    setBookForm({
      title: '',
      author: '',
      isbn: '',
      quantity: '',
      genre: '',
      publishedYear: '',
      description: ''
    });
  };

  // Handle book form submission
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await axios.put(`/api/books/${editingBook._id}`, bookForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ text: 'Book updated successfully!', type: 'success' });
      } else {
        await axios.post('/api/books', bookForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ text: 'Book added successfully!', type: 'success' });
      }

      setShowAddBookForm(false);
      setEditingBook(null);
      resetBookForm();
      fetchBooks();

      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error saving book:', error);
      setMessage({ text: 'Failed to save book', type: 'error' });
    }
  };

  // Handle edit book
  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      quantity: book.quantity.toString(),
      genre: book.genre || '',
      publishedYear: book.publishedYear || '',
      description: book.description || ''
    });
    setShowAddBookForm(true);
  };

  // Handle delete book
  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ text: 'Book deleted successfully!', type: 'success' });
        fetchBooks();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        console.error('Error deleting book:', error);
        setMessage({ text: 'Failed to delete book', type: 'error' });
      }
    }
  };

  // Handle mark as returned
  const handleMarkReturned = async (borrowId) => {
    try {
      await axios.post('/api/borrow/return', { borrowId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Book marked as returned!', type: 'success' });
      fetchBorrowRecords();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error marking book as returned:', error);
      setMessage({ text: 'Failed to mark book as returned', type: 'error' });
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const filteredBooks = getFilteredAndSortedBooks();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Librarian Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Manage Books Section */}
      <div className="manage-books-section">
        <div className="section-header">
          <div className="section-title">
            <h2>Manage Books</h2>
            <span className="book-icon">📚</span>
          </div>
          <div className="section-controls">
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
            <button
              className="add-book-btn"
              onClick={() => {
                setShowAddBookForm(true);
                setEditingBook(null);
                resetBookForm();
              }}
            >
              <span className="plus-icon">+</span> Add New Book
            </button>
          </div>
        </div>

        {/* Book Cards Grid */}
        <div className="books-grid">
          {filteredBooks.map(book => (
            <div key={book._id} className="book-card">
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-isbn">{book.isbn}</p>
                <p className="book-availability">
                  Available: {book.available}/{book.quantity}
                </p>
              </div>
              <div className="book-actions">
                <button
                  className="view-details-btn"
                  onClick={() => window.open(`/book/${book._id}`, '_blank')}
                >
                  View Details
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEditBook(book)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteBook(book._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Borrow Records Section */}
      <div className="borrow-records-section">
        <div className="section-header">
          <div className="section-title">
            <h2>Borrow Records</h2>
            <span className="chart-icon">📊</span>
          </div>
        </div>

        <div className="borrow-records-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowRecords.map(record => (
                <tr key={record._id}>
                  <td>{record.user?.name || 'Unknown'}</td>
                  <td>{record.book?.title || 'Unknown Book'}</td>
                  <td>{new Date(record.borrowDate).toLocaleDateString()}</td>
                  <td>
                    {record.returnDate
                      ? new Date(record.returnDate).toLocaleDateString()
                      : 'Not returned'
                    }
                  </td>
                  <td>
                    <span className={`status-badge ${record.status}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    {!record.returnDate && (
                      <button
                        className="mark-returned-btn"
                        onClick={() => handleMarkReturned(record._id)}
                      >
                        Mark as Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Book Form Modal */}
      {showAddBookForm && (
        <div className="book-form-overlay">
          <div className="book-form-modal">
            <div className="modal-header">
              <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddBookForm(false);
                  setEditingBook(null);
                  resetBookForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="book-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={bookForm.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="author">Author *</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={bookForm.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="isbn">ISBN *</label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={bookForm.isbn}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={bookForm.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={bookForm.genre}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="publishedYear">Published Year</label>
                  <input
                    type="number"
                    id="publishedYear"
                    name="publishedYear"
                    value={bookForm.publishedYear}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={bookForm.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowAddBookForm(false);
                  setEditingBook(null);
                  resetBookForm();
                }}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianDashboard;

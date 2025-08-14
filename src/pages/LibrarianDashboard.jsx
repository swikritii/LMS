import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './LibrarianDashboard.css';

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const { user } = useAuth();

  // Form state for adding/editing books
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: '',
    available: '',
    description: '',
    genre: '',
    publishedYear: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchBooks(),
        fetchBorrowRecords(),
        fetchOverdueBooks()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const fetchBorrowRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/borrow/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBorrowRecords(response.data.borrows);
    } catch (error) {
      console.error('Error fetching borrow records:', error);
    }
  };

  const fetchOverdueBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/borrow/overdue', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOverdueBooks(response.data.overdueBooks);
    } catch (error) {
      console.error('Error fetching overdue books:', error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/books', bookForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      showMessage('Book added successfully!', 'success');
      setShowAddBookForm(false);
      resetBookForm();
      fetchBooks();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding book';
      showMessage(errorMessage, 'error');
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/books/${editingBook._id}`, bookForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      showMessage('Book updated successfully!', 'success');
      setEditingBook(null);
      resetBookForm();
      fetchBooks();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating book';
      showMessage(errorMessage, 'error');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      showMessage('Book deleted successfully!', 'success');
      fetchBooks();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting book';
      showMessage(errorMessage, 'error');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      quantity: book.quantity.toString(),
      available: book.available.toString(),
      description: book.description || '',
      genre: book.genre || '',
      publishedYear: book.publishedYear ? book.publishedYear.toString() : ''
    });
    setShowAddBookForm(true);
  };

  const resetBookForm = () => {
    setBookForm({
      title: '',
      author: '',
      isbn: '',
      quantity: '',
      available: '',
      description: '',
      genre: '',
      publishedYear: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookForm(prev => ({
      ...prev,
      [name]: value
    }));
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Librarian Dashboard</h1>
        <p>Welcome, {user?.name}! Manage your library collection and monitor borrowings.</p>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          Books ({books.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'borrowings' ? 'active' : ''}`}
          onClick={() => setActiveTab('borrowings')}
        >
          Borrow Records ({borrowRecords.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          Overdue ({overdueBooks.length})
        </button>
      </div>

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Book Management</h2>
            <button 
              className="add-book-btn"
              onClick={() => {
                setShowAddBookForm(true);
                setEditingBook(null);
                resetBookForm();
              }}
            >
              Add New Book
            </button>
          </div>

          {/* Add/Edit Book Form */}
          {showAddBookForm && (
            <div className="book-form-overlay">
              <div className="book-form-modal">
                <div className="form-header">
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
                
                <form onSubmit={editingBook ? handleUpdateBook : handleAddBook}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={bookForm.title}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Author *</label>
                      <input
                        type="text"
                        name="author"
                        value={bookForm.author}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>ISBN *</label>
                      <input
                        type="text"
                        name="isbn"
                        value={bookForm.isbn}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Genre</label>
                      <input
                        type="text"
                        name="genre"
                        value={bookForm.genre}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Total Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={bookForm.quantity}
                        onChange={handleFormChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Available Quantity *</label>
                      <input
                        type="number"
                        name="available"
                        value={bookForm.available}
                        onChange={handleFormChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Published Year</label>
                      <input
                        type="number"
                        name="publishedYear"
                        value={bookForm.publishedYear}
                        onChange={handleFormChange}
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={bookForm.description}
                      onChange={handleFormChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      {editingBook ? 'Update Book' : 'Add Book'}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setShowAddBookForm(false);
                        setEditingBook(null);
                        resetBookForm();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Books List */}
          <div className="books-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Genre</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>{book.genre || '-'}</td>
                    <td>{book.available} / {book.quantity}</td>
                    <td>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Borrow Records Tab */}
      {activeTab === 'borrowings' && (
        <div className="tab-content">
          <h2>Borrow Records</h2>
          <div className="borrow-records-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowRecords.map(record => (
                  <tr key={record.id} className={record.isOverdue ? 'overdue' : ''}>
                    <td>{record.user.name}</td>
                    <td>{record.book.title}</td>
                    <td>{formatDate(record.borrowDate)}</td>
                    <td>{formatDate(record.dueDate)}</td>
                    <td>{record.returnDate ? formatDate(record.returnDate) : '-'}</td>
                    <td>
                      <span className={`status ${record.status}`}>
                        {record.status}
                        {record.isOverdue && ' (Overdue)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Overdue Books Tab */}
      {activeTab === 'overdue' && (
        <div className="tab-content">
          <h2>Overdue Books</h2>
          {overdueBooks.length === 0 ? (
            <p className="no-overdue">No overdue books!</p>
          ) : (
            <div className="overdue-books-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueBooks.map(record => (
                    <tr key={record.id} className="overdue">
                      <td>{record.user.name}</td>
                      <td>{record.book.title}</td>
                      <td>{formatDate(record.borrowDate)}</td>
                      <td>{formatDate(record.dueDate)}</td>
                      <td>{record.daysOverdue} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibrarianDashboard;

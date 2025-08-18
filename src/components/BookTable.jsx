import React from 'react';
import { Link } from 'react-router-dom';
import './BookTable.css';

const BookTable = ({ books, onEdit, onDelete }) => {
  return (
    <div className="book-table-container">
      <div className="table-responsive">
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Available Copies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book._id}>
                <td className="book-title-cell">
                  <span className="book-title">{book.title}</span>
                  {book.genre && <span className="book-genre">{book.genre}</span>}
                </td>
                <td className="book-author-cell">{book.author}</td>
                <td className="book-isbn-cell">{book.isbn}</td>
                <td className="book-quantity-cell">{book.quantity}</td>
                <td className="book-available-cell">
                  <span className={`available-count ${book.available > 0 ? 'available' : 'unavailable'}`}>
                    {book.available}
                  </span>
                  <span className="total-count">/ {book.quantity}</span>
                </td>
                <td className="book-actions-cell">
                  <div className="action-buttons">
                    <Link 
                      to={`/book/${book._id}`} 
                      className="view-details-btn"
                    >
                      View Details
                    </Link>
                    <button 
                      className="edit-btn"
                      onClick={() => onEdit(book)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => onDelete(book._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {books.length === 0 && (
        <div className="no-books-message">
          <p>No books found. Add your first book to get started!</p>
        </div>
      )}
    </div>
  );
};

export default BookTable;

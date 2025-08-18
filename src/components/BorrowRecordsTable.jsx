import React from 'react';
import './BorrowRecordsTable.css';

const BorrowRecordsTable = ({ borrowRecords, onMarkReturned }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="borrow-records-container">
      <div className="table-responsive">
        <table className="borrow-records-table">
          <thead>
            <tr>
              <th>Borrower Name</th>
              <th>Book Title</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrowRecords.map(record => {
              const overdue = isOverdue(record.dueDate);
              const daysOverdue = overdue ? getDaysOverdue(record.dueDate) : 0;
              
              return (
                <tr key={record.id} className={overdue ? 'overdue-row' : ''}>
                  <td className="borrower-name">
                    <span className="user-name">{record.user.name}</span>
                    <span className="user-email">{record.user.email}</span>
                  </td>
                  <td className="book-title">
                    <span className="title">{record.book.title}</span>
                    <span className="author">by {record.book.author}</span>
                  </td>
                  <td className="borrow-date">{formatDate(record.borrowDate)}</td>
                  <td className="due-date">
                    <span className={overdue ? 'overdue' : ''}>
                      {formatDate(record.dueDate)}
                    </span>
                    {overdue && (
                      <span className="overdue-badge">
                        {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                      </span>
                    )}
                  </td>
                  <td className="return-date">
                    {record.returnDate ? formatDate(record.returnDate) : '-'}
                  </td>
                  <td className="status-cell">
                    <span className={`status ${record.status}`}>
                      {record.status}
                      {overdue && <span className="overdue-indicator"> (Overdue)</span>}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {!record.returnDate && (
                      <button
                        className="mark-returned-btn"
                        onClick={() => onMarkReturned(record.id)}
                      >
                        Mark as Returned
                      </button>
                    )}
                    {record.returnDate && (
                      <span className="returned-status">Returned</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {borrowRecords.length === 0 && (
        <div className="no-records-message">
          <p>No borrow records found.</p>
        </div>
      )}
    </div>
  );
};

export default BorrowRecordsTable;

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-container">
        <div className="hero-section">
          <h1 className="hero-title">Welcome to Pustak Point</h1>
          <p className="hero-subtitle">
            A comprehensive solution for managing books, borrowers, and library operations
          </p>
          
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>

        <div className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>For Borrowers</h3>
              <ul>
                <li>Browse and search books</li>
                <li>Borrow and return books</li>
                <li>View your borrowing history</li>
                <li>Manage your profile</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <h3>For Librarians</h3>
              <ul>
                <li>Add, edit, and delete books</li>
                <li>Manage borrowing records</li>
                <li>Track overdue books</li>
                <li>Monitor library inventory</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>About Our Library</h2>
          <p>
            Our Library Management System provides a modern, efficient way to manage library operations. 
            Built with React and Node.js, it offers a seamless experience for both librarians and borrowers.
          </p>
          <Link to="/about" className="btn btn-outline">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

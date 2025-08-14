import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <h1>📚 Pustak Point</h1>
        </Link>

        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            {/* Public links */}
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Contact
            </Link>

            {/* Authenticated user links */}
            {user ? (
              <>
                {user.role === 'borrower' && (
                  <Link 
                    to="/borrower-dashboard" 
                    className={`nav-link ${isActive('/borrower-dashboard') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'librarian' && (
                  <Link 
                    to="/librarian-dashboard" 
                    className={`nav-link ${isActive('/librarian-dashboard') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <button 
                  className="nav-link logout-btn"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* User info */}
          {user && (
            <div className="user-info">
              <span className="user-name">Welcome, {user.name}</span>
              <span className="user-role">({user.role})</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

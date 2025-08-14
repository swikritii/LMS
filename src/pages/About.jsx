import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-header">
          <h1>About Our Library</h1>
          <p>Welcome to our modern library management system</p>
        </div>

        <div className="about-sections">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              We are dedicated to providing easy access to knowledge and literature 
              through our comprehensive library management system. Our goal is to 
              connect readers with books and foster a love for learning in our community.
            </p>
          </section>

          <section className="about-section">
            <h2>Library Management System</h2>
            <p>
              Our system is built with modern web technologies to provide a seamless 
              experience for both library staff and patrons. We offer:
            </p>
            <ul>
              <li>Easy book browsing and searching</li>
              <li>Simple borrowing and returning process</li>
              <li>Real-time availability tracking</li>
              <li>Comprehensive management tools for librarians</li>
              <li>User-friendly interface for all devices</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>For Borrowers</h2>
            <p>
              As a borrower, you can:
            </p>
            <ul>
              <li>Browse our complete book collection</li>
              <li>Search for books by title, author, or ISBN</li>
              <li>Filter books by genre</li>
              <li>Borrow books for 14 days</li>
              <li>Return books early if needed</li>
              <li>View your borrowing history</li>
              <li>Track due dates and overdue items</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>For Librarians</h2>
            <p>
              Our system provides librarians with powerful tools to:
            </p>
            <ul>
              <li>Add new books to the collection</li>
              <li>Update book information and quantities</li>
              <li>Remove books from the system</li>
              <li>Monitor all borrowing activities</li>
              <li>Track overdue books and users</li>
              <li>Manage user accounts</li>
              <li>Generate reports on library usage</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Technology Stack</h2>
            <p>
              Our library management system is built using:
            </p>
            <div className="tech-stack">
              <div className="tech-category">
                <h3>Frontend</h3>
                <ul>
                  <li>React.js - Modern UI framework</li>
                  <li>React Router - Navigation</li>
                  <li>Context API - State management</li>
                  <li>Pure CSS - Responsive styling</li>
                </ul>
              </div>
              <div className="tech-category">
                <h3>Backend</h3>
                <ul>
                  <li>Node.js - Server runtime</li>
                  <li>Express.js - Web framework</li>
                  <li>MongoDB - Database</li>
                  <li>Mongoose - ODM</li>
                </ul>
              </div>
              <div className="tech-category">
                <h3>Authentication</h3>
                <ul>
                  <li>JWT - Secure tokens</li>
                  <li>bcrypt - Password hashing</li>
                  <li>Role-based access control</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature">
                <h3>🔍 Smart Search</h3>
                <p>Find books quickly with our advanced search functionality</p>
              </div>
              <div className="feature">
                <h3>📱 Responsive Design</h3>
                <p>Access the library from any device - desktop, tablet, or mobile</p>
              </div>
              <div className="feature">
                <h3>🔐 Secure Authentication</h3>
                <p>Your account is protected with industry-standard security</p>
              </div>
              <div className="feature">
                <h3>📊 Real-time Updates</h3>
                <p>See book availability and your borrowing status instantly</p>
              </div>
              <div className="feature">
                <h3>📅 Due Date Tracking</h3>
                <p>Never miss a due date with our reminder system</p>
              </div>
              <div className="feature">
                <h3>👥 Role Management</h3>
                <p>Different interfaces for borrowers and librarians</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Contact Information</h2>
            <p>
              Have questions or need assistance? We're here to help!
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> library@example.com</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p><strong>Address:</strong> 123 Library Street, City, State 12345</p>
            </div>
          </section>
        </div>

        <div className="about-footer">
          <p>
            Thank you for choosing our library management system. 
            We're committed to providing the best possible experience 
            for our community of readers and learners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

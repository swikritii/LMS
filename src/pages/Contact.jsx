import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission (in a real app, this would send to backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form submitted:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setSubmitStatus('');
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have questions about our library management system? 
              Need help with your account? We're here to help!
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <h3>📧 Email</h3>
                <p>library@example.com</p>
              </div>
              
              <div className="contact-item">
                <h3>📞 Phone</h3>
                <p>(+977) 980000000</p>
              </div>
              
              <div className="contact-item">
                <h3>📍 Address</h3>
                <p>Bhadrapur Road<br />Jhapa, Nepal.</p>
              </div>
              
              <div className="contact-item">
                <h3>🕒 Hours</h3>
                <p>Monday - Friday: 9:00 AM - 8:00 PM<br />
                Saturday: 10:00 AM - 6:00 PM<br />
                Sunday: 12:00 PM - 5:00 PM</p>
              </div>
            </div>

            <div className="contact-features">
              <h3>How can we help?</h3>
              <ul>
                <li>Account and login issues</li>
                <li>Book borrowing questions</li>
                <li>Technical support</li>
                <li>Feature requests</li>
                <li>General inquiries</li>
              </ul>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="contact-form-card">
              <h2>Send us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="success-message">
                  <h3>Thank you!</h3>
                  <p>Your message has been sent successfully. We'll get back to you soon!</p>
                  <button onClick={resetForm} className="new-message-btn">
                    Send Another Message
                  </button>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  <h3>Oops!</h3>
                  <p>Something went wrong. Please try again.</p>
                  <button onClick={resetForm} className="try-again-btn">
                    Try Again
                  </button>
                </div>
              )}

              {!submitStatus && (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Your full name"
                      disabled={isSubmitting}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={errors.message ? 'error' : ''}
                      placeholder="Tell us how we can help you..."
                      rows="5"
                      disabled={isSubmitting}
                    />
                    {errors.message && <span className="error-text">{errors.message}</span>}
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="contact-footer">
          <p>
            <strong>Note:</strong> This is a demo application. In a real implementation, 
            the contact form would send emails to the library staff or create support tickets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

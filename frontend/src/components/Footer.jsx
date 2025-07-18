import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © {currentYear} Admin Panel. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="/admin/help" className="footer-link">Help</a>
            <span className="footer-separator">|</span>
            <a href="/admin/docs" className="footer-link">Documentation</a>
            <span className="footer-separator">|</span>
            <a href="/admin/support" className="footer-link">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
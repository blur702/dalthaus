import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ setIsAuthenticated }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowContentMenu(false);
  };

  const toggleContentMenu = () => {
    setShowContentMenu(!showContentMenu);
    setShowUserMenu(false);
  };

  return (
    <header className="admin-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="header-title">Admin Panel</h1>
        </div>
        
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/admin" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle"
                onClick={toggleUserMenu}
              >
                Users
              </button>
              {showUserMenu && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/admin/users/create" className="dropdown-link">
                      Create New User
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/users" className="dropdown-link">
                      Manage Users
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle"
                onClick={toggleContentMenu}
              >
                Content
              </button>
              {showContentMenu && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/admin/content/articles" className="dropdown-link">
                      Articles
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/content/pages" className="dropdown-link">
                      Pages
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/content/photo-books" className="dropdown-link">
                      Photo Books
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const AdminLayout = ({ children, setIsAuthenticated }) => {
  return (
    <div className="admin-layout">
      <Header setIsAuthenticated={setIsAuthenticated} />
      <main className="admin-main">
        <div className="main-container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
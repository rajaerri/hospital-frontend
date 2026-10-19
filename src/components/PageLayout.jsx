import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Reusable PageLayout Component
 * Wraps pages in standard Navbar, main content container, and Footer.
 * 
 * Props:
 * - children: The page content
 * - title: (Optional) Page header heading
 * - subtitle: (Optional) Page header description
 * - action: (Optional) React element for right-aligned header action button
 */
function PageLayout({ children, title, subtitle, action }) {
  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        {(title || subtitle) && (
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              {title && <h1>{title}</h1>}
              {subtitle && <p>{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default PageLayout;

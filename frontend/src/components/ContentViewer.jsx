import React, { useState, useEffect } from 'react';

const ContentViewer = ({ content, showPagination = true }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (content) {
      // Split content by pagebreak marker
      const pageBreakMarker = '<!-- pagebreak -->';
      const contentPages = content.split(pageBreakMarker);
      
      // Filter out empty pages but keep pages with content
      const filteredPages = contentPages.filter(page => page && page.trim() !== '');
      
      // If no pages after split or filter, use original content
      if (filteredPages.length === 0) {
        setPages([content]);
      } else {
        setPages(filteredPages);
      }
      
      setCurrentPage(0);
      
      // Debug logging
      console.log('Content:', content);
      console.log('Pages found:', filteredPages.length);
      console.log('Pages:', filteredPages);
    }
  }, [content]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSelect = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  if (!content) {
    return <div className="content-viewer empty">No content available</div>;
  }

  if (pages.length === 0) {
    return <div className="content-viewer empty">Loading content...</div>;
  }

  const hasPagination = showPagination && pages.length > 1;
  
  // Add debug info
  console.log('Rendering ContentViewer:', {
    pagesLength: pages.length,
    currentPage,
    hasPagination,
    showPagination
  });

  return (
    <div className="content-viewer">
      <div 
        className="content-display"
        dangerouslySetInnerHTML={{ __html: pages[currentPage] || '' }}
      />
      
      {hasPagination && (
        <div className="content-pagination">
          <button 
            className="pagination-btn prev"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            ← Previous
          </button>
          
          <div className="pagination-pages">
            <span className="page-info">
              Page {currentPage + 1} of {pages.length}
            </span>
            <div className="page-dots">
              {pages.map((_, index) => (
                <button
                  key={index}
                  className={`page-dot ${index === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageSelect(index)}
                  title={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <button 
            className="pagination-btn next"
            onClick={handleNextPage}
            disabled={currentPage === pages.length - 1}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentViewer;
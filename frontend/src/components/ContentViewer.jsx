import React, { useState, useEffect } from 'react';

const ContentViewer = ({ content, showPagination = true }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (content) {
      // Normalize content to handle all pagebreak formats
      let normalizedContent = content;
      
      // Debug: log original content
      console.log('Original content:', content.substring(0, 500) + '...');
      
      // Replace all known pagebreak formats with our standard marker
      // 1. TinyMCE pagebreak plugin format - img tags with mce-pagebreak class
      normalizedContent = normalizedContent.replace(/<img[^>]*class=["'][^"']*mce-pagebreak[^"']*["'][^>]*\/?>/gi, '<!-- pagebreak -->');
      
      // 2. Custom pagebreak divs (from old implementation)
      normalizedContent = normalizedContent.replace(/<div[^>]*class=["'][^"']*custom-pagebreak[^"']*["'][^>]*>[\s\S]*?<\/div>(?:\s*<!-- pagebreak -->)?/gi, '<!-- pagebreak -->');
      
      // 3. Other formats
      normalizedContent = normalizedContent.replace(/<hr[^>]*class=["'][^"']*mce-pagebreak[^"']*["'][^>]*\/?>/gi, '<!-- pagebreak -->');
      normalizedContent = normalizedContent.replace(/<hr[^>]*data-mce-pagebreak[^>]*\/?>/gi, '<!-- pagebreak -->');
      normalizedContent = normalizedContent.replace(/<div[^>]*class=["'][^"']*mce-pagebreak[^"']*["'][^>]*>.*?<\/div>/gi, '<!-- pagebreak -->');
      normalizedContent = normalizedContent.replace(/<div[^>]*data-mce-pagebreak[^>]*>.*?<\/div>/gi, '<!-- pagebreak -->');
      
      // Clean up any duplicate pagebreak markers
      normalizedContent = normalizedContent.replace(/<!-- pagebreak -->(\s*<!-- pagebreak -->)+/g, '<!-- pagebreak -->');
      
      // Split content by pagebreak marker
      const pageBreakMarker = '<!-- pagebreak -->';
      const contentPages = normalizedContent.split(pageBreakMarker);
      
      // Filter out empty pages but keep pages with content
      const filteredPages = contentPages
        .map(page => page.trim())
        .filter(page => page.length > 0);
      
      // If no pages after split, use original content as single page
      if (filteredPages.length === 0) {
        setPages([content]);
      } else {
        setPages(filteredPages);
      }
      
      setCurrentPage(0);
      
      // Debug logging
      console.log('=== ContentViewer Debug ===');
      console.log('Pagebreak markers found:', (normalizedContent.match(/<!-- pagebreak -->/g) || []).length);
      console.log('Pages after split:', contentPages.length);
      console.log('Pages after filter:', filteredPages.length);
      if (filteredPages.length > 0) {
        console.log('First page preview:', filteredPages[0].substring(0, 100) + '...');
      }
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
import { useState, useEffect } from 'react';

export const usePagination = (content) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!content) return;

    // Split content by pagebreak
    let pageArray = [];
    if (content.includes('<!-- pagebreak -->')) {
      pageArray = content.split('<!-- pagebreak -->');
    } else {
      pageArray = [content];
    }

    setPages(pageArray);
    setTotalPages(pageArray.length);
    setCurrentPage(1);
  }, [content]);

  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    pages,
    totalPages,
    currentContent: pages[currentPage - 1] || '',
    hasPagination: totalPages > 1,
    goToPage,
    nextPage,
    prevPage,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
  };
};

export default usePagination;
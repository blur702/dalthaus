import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleRouteChange = async () => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Start fade out
      setIsTransitioning(true);
      
      // Quick fade out and scroll
      timeoutRef.current = setTimeout(() => {
        // Smooth scroll to top
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        
        // Quick fade in
        setTimeout(() => {
          setIsTransitioning(false);
        }, 200);
      }, 150);
    };

    handleRouteChange();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  // Don't render overlay if not transitioning
  if (!isTransitioning) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        opacity: isTransitioning ? 1 : 0,
        transition: 'opacity 150ms ease-in-out',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
}

export default ScrollToTop;
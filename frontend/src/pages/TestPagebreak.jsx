import React from 'react';
import ContentViewer from '../components/ContentViewer';

const TestPagebreak = () => {
  // Test content with pagebreaks
  const testContent = `
    <h1>Page 1: Introduction</h1>
    <p>This is the first page of our test content. You should see pagination controls below if pagebreaks are working correctly.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    
    <!-- pagebreak -->
    
    <h2>Page 2: Main Content</h2>
    <p>Great! You've reached page 2. This means the pagebreak functionality is working.</p>
    <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    
    <!-- pagebreak -->
    
    <h2>Page 3: Conclusion</h2>
    <p>This is the final page. You can navigate back to previous pages using the pagination controls.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
  `;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Pagebreak Functionality Test</h1>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
        <p><strong>Test Instructions:</strong></p>
        <ul>
          <li>This page contains 3 pages separated by pagebreaks</li>
          <li>You should see pagination controls at the bottom</li>
          <li>Use the Previous/Next buttons or page dots to navigate</li>
          <li>Check the browser console for debug information</li>
        </ul>
      </div>

      <ContentViewer 
        content={testContent} 
        showPagination={true}
      />
    </div>
  );
};

export default TestPagebreak;
import React, { useState } from 'react';

const SimplePagebreakTest = () => {
  const testContent1 = '<p>Page 1</p><!-- pagebreak --><p>Page 2</p><!-- pagebreak --><p>Page 3</p>';
  
  const testContent2 = `<p>Page 1</p>
<div class="custom-pagebreak" contenteditable="false" style="display: block; width: 100%; height: 40px; margin: 20px 0; position: relative; user-select: none;">
<div style="position: absolute; left: 0; right: 0; top: 50%; height: 2px; background: repeating-linear-gradient(90deg, #999 0, #999 10px, transparent 10px, transparent 20px);"></div>
<div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: white; padding: 4px 16px; border: 2px solid #999; border-radius: 4px; color: #666; font-size: 11px; font-weight: bold; font-family: sans-serif;">PAGE BREAK</div>
</div><!-- pagebreak -->
<p>Page 2</p>`;

  const [pages, setPages] = useState([]);

  const testSplit = (content, name) => {
    console.log(`\n=== Testing ${name} ===`);
    console.log('Original:', content);
    
    // Test different splitting approaches
    const parts1 = content.split('<!-- pagebreak -->');
    console.log('Simple split result:', parts1);
    
    // Test with regex
    const parts2 = content.split(/<!-- pagebreak -->/);
    console.log('Regex split result:', parts2);
    
    // Test normalization then split
    let normalized = content;
    normalized = normalized.replace(/<div[^>]*class="custom-pagebreak"[^>]*>[\s\S]*?<\/div>/gi, '');
    console.log('After removing divs:', normalized);
    const parts3 = normalized.split('<!-- pagebreak -->');
    console.log('Split after normalization:', parts3);
    
    setPages(parts3.filter(p => p.trim()));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Pagebreak Test</h1>
      
      <button onClick={() => testSplit(testContent1, 'Simple HTML')}>
        Test Simple HTML
      </button>
      
      <button onClick={() => testSplit(testContent2, 'With Visual Pagebreak')} style={{ marginLeft: '10px' }}>
        Test With Visual Pagebreak
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Split Pages:</h3>
        {pages.map((page, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h4>Page {idx + 1}</h4>
            <div dangerouslySetInnerHTML={{ __html: page }} />
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5' }}>
        <p>Check browser console for detailed debug output</p>
      </div>
    </div>
  );
};

export default SimplePagebreakTest;
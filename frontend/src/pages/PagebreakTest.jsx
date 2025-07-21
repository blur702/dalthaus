import React, { useState } from 'react';
import ContentViewer from '../components/ContentViewer';
import RichTextEditor from '../components/RichTextEditor';

const PagebreakTest = () => {
  const [editorContent, setEditorContent] = useState('');
  const [viewerContent, setViewerContent] = useState('');
  const [showViewer, setShowViewer] = useState(false);

  const handleEditorChange = (content) => {
    setEditorContent(content);
    console.log('Editor content changed:', content);
  };

  const handleTest = () => {
    console.log('=== PAGEBREAK TEST START ===');
    console.log('1. Raw editor content:');
    console.log(editorContent);
    
    console.log('2. Checking for pagebreak markers:');
    const hasVisualPagebreak = editorContent.includes('custom-pagebreak');
    const hasCommentPagebreak = editorContent.includes('<!-- pagebreak -->');
    console.log('- Has visual pagebreak div:', hasVisualPagebreak);
    console.log('- Has comment pagebreak:', hasCommentPagebreak);
    
    console.log('3. Number of pagebreak comments:', (editorContent.match(/<!-- pagebreak -->/g) || []).length);
    
    setViewerContent(editorContent);
    setShowViewer(true);
    console.log('=== PAGEBREAK TEST END ===');
  };

  const sampleContentWithPagebreaks = `
    <h1>Page 1</h1>
    <p>This is the first page content.</p>
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="mce-pagebreak" data-mce-resize="false" data-mce-placeholder />
    <h2>Page 2</h2>
    <p>This is the second page content.</p>
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="mce-pagebreak" data-mce-resize="false" data-mce-placeholder />
    <h2>Page 3</h2>
    <p>This is the third page content.</p>
  `;

  const loadSampleContent = () => {
    setEditorContent(sampleContentWithPagebreaks);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Pagebreak Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={loadSampleContent} style={{ marginRight: '10px' }}>
          Load Sample Content
        </button>
        <button onClick={handleTest} style={{ marginRight: '10px' }}>
          Test Content in Viewer
        </button>
        <button onClick={() => setShowViewer(false)}>
          Hide Viewer
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h2>Editor</h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            <RichTextEditor
              value={editorContent}
              onChange={handleEditorChange}
              height={400}
            />
          </div>
          <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}>
            <strong>Raw HTML:</strong>
            <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
              {editorContent}
            </pre>
          </div>
        </div>

        <div>
          <h2>Content Viewer</h2>
          {showViewer ? (
            <ContentViewer content={viewerContent} showPagination={true} />
          ) : (
            <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '4px', textAlign: 'center' }}>
              Click "Test Content in Viewer" to see pagination
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#e3f2fd', borderRadius: '4px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Click "Load Sample Content" to load content with pagebreaks</li>
          <li>Or create your own content and insert pagebreaks using the editor button</li>
          <li>Click "Test Content in Viewer" to see if pagination works</li>
          <li>Check the browser console for debug information</li>
        </ol>
      </div>
    </div>
  );
};

export default PagebreakTest;
import React, { useState } from 'react';
import RichTextEditor from '../components/RichTextEditor';
import TinymceProfileSelector from '../components/TinymceProfileSelector';
import useTinymceConfig from '../hooks/useTinymceConfig';

const TestTinymceIntegration = () => {
  const [content, setContent] = useState('<p>Test content with <strong>bold</strong> and <em>italic</em> text.</p>');
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [testResults, setTestResults] = useState([]);

  // Test the hook
  const { config, loading, error, refreshConfig, clearCache, isUsingFallback } = useTinymceConfig(selectedProfileId);

  const runTests = () => {
    const results = [];

    // Test 1: Check if config is loaded
    results.push({
      name: 'Configuration Loading',
      passed: config !== null,
      message: config ? 'Configuration loaded successfully' : 'Configuration not loaded'
    });

    // Test 2: Check if pagebreak plugin is included
    if (config) {
      const hasPagebreak = config.plugins && config.plugins.includes('pagebreak');
      results.push({
        name: 'Pagebreak Plugin',
        passed: hasPagebreak,
        message: hasPagebreak ? 'Pagebreak plugin is included' : 'Pagebreak plugin is missing'
      });

      // Test 3: Check if pagebreak is in toolbar
      const hasPagebreakInToolbar = config.toolbar && config.toolbar.includes('pagebreak');
      results.push({
        name: 'Pagebreak in Toolbar',
        passed: hasPagebreakInToolbar,
        message: hasPagebreakInToolbar ? 'Pagebreak button is in toolbar' : 'Pagebreak button is missing from toolbar'
      });
    }

    // Test 4: Check TinyMCE instance
    if (window.tinymce) {
      const editors = window.tinymce.get();
      results.push({
        name: 'TinyMCE Instance',
        passed: editors.length > 0,
        message: `Found ${editors.length} TinyMCE instance(s)`
      });

      if (editors.length > 0) {
        const editor = editors[0];
        const hasPagebreakPlugin = editor.plugins.pagebreak !== undefined;
        results.push({
          name: 'Pagebreak Plugin Active',
          passed: hasPagebreakPlugin,
          message: hasPagebreakPlugin ? 'Pagebreak plugin is active in editor' : 'Pagebreak plugin is not active'
        });
      }
    } else {
      results.push({
        name: 'TinyMCE Instance',
        passed: false,
        message: 'TinyMCE not found'
      });
    }

    setTestResults(results);
  };

  const insertPagebreak = () => {
    if (window.tinymce) {
      const editor = window.tinymce.get()[0];
      if (editor) {
        editor.execCommand('mcePageBreak');
      }
    }
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '14px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white',
    border: '1px solid #007bff'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ ...cardStyle, padding: '30px' }}>
        <h1 style={{ marginTop: 0 }}>TinyMCE Integration Test</h1>
        
        <div style={{ 
          padding: '12px 16px',
          marginBottom: '24px',
          backgroundColor: '#e3f2fd',
          border: '1px solid #90caf9',
          borderRadius: '4px',
          color: '#1565c0'
        }}>
          This page tests the integration of the TinyMCE configuration system with the editor.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Configuration Status</h3>
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: loading ? '#e0e0e0' : '#4caf50',
                color: loading ? '#666' : 'white'
              }}>
                {loading ? 'Loading...' : 'Loaded'}
              </span>
              {error && (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: '#f44336',
                  color: 'white',
                  marginLeft: '8px'
                }}>
                  Error
                </span>
              )}
              {isUsingFallback && (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  marginLeft: '8px'
                }}>
                  Using Fallback
                </span>
              )}
            </div>
            {error && (
              <div style={{ 
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '4px',
                color: '#c00',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            <div>
              <button style={buttonStyle} onClick={refreshConfig}>
                Refresh Config
              </button>
              <button style={buttonStyle} onClick={clearCache}>
                Clear Cache
              </button>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Test Results</h3>
            {testResults.length === 0 ? (
              <p style={{ color: '#666' }}>No tests run yet</p>
            ) : (
              <div>
                {testResults.map((result, index) => (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <div>
                      {result.name}:{' '}
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: result.passed ? '#4caf50' : '#f44336',
                        color: 'white'
                      }}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <small style={{ color: '#666' }}>{result.message}</small>
                  </div>
                ))}
              </div>
            )}
            <button style={primaryButtonStyle} onClick={runTests}>
              Run Tests
            </button>
          </div>
        </div>

        <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />

        <div style={{ marginBottom: '20px' }}>
          <h3>Editor Test</h3>
          <TinymceProfileSelector
            value={selectedProfileId}
            onChange={setSelectedProfileId}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <button style={buttonStyle} onClick={insertPagebreak}>
            Insert Pagebreak
          </button>
        </div>

        <RichTextEditor
          value={content}
          onChange={setContent}
          height={400}
          profileId={selectedProfileId}
        />

        <div style={{ marginTop: '30px' }}>
          <h3>Editor Output</h3>
          <div style={{ 
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTinymceIntegration;
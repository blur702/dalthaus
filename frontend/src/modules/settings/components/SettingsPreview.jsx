import React, { useState } from 'react';
import RichTextEditor from '../../../components/RichTextEditor';
import './SettingsPreview.css';

const SettingsPreview = ({ setting, onClose }) => {
  const [content, setContent] = useState(`
    <h1>Preview Your Editor Configuration</h1>
    <p>This is a preview of the <strong>${setting.name}</strong> configuration. Try out all the features to see how they work.</p>
    
    <h2>Text Formatting</h2>
    <p>You can make text <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>. You can also change the <span style="color: #e74c3c;">text color</span> and <span style="background-color: #f1c40f;">highlight text</span>.</p>
    
    <h2>Lists</h2>
    <p>Create ordered lists:</p>
    <ol>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </ol>
    
    <p>Or unordered lists:</p>
    <ul>
      <li>Bullet point one</li>
      <li>Bullet point two</li>
      <li>Bullet point three</li>
    </ul>
    
    <h2>Links and Media</h2>
    <p>Add <a href="https://example.com">links to websites</a> or embed images and media content.</p>
    
    <h2>Tables</h2>
    <table border="1">
      <tr>
        <th>Feature</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>Text Formatting</td>
        <td>✓ Enabled</td>
      </tr>
      <tr>
        <td>Image Upload</td>
        <td>✓ Enabled</td>
      </tr>
    </table>
    
    <blockquote>
      <p>This is a blockquote. It's great for highlighting important information or quotes.</p>
    </blockquote>
    
    <p>Feel free to edit this content to test all the features of your configuration!</p>
  `);

  const mergedSettings = {
    ...setting.settings,
    height: 500,
    setup: (editor) => {
      if (setting.settings.setup) {
        setting.settings.setup(editor);
      }
    }
  };

  return (
    <div className="settings-preview">
      <div className="preview-header">
        <h3>Preview: {setting.name}</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      
      <div className="preview-info">
        <p>{setting.description}</p>
        <div className="preview-details">
          <span>Height: {setting.settings.height || 400}px</span>
          <span>Menu Bar: {setting.settings.menubar !== false ? 'Yes' : 'No'}</span>
          <span>Plugins: {setting.settings.plugins?.length || 0}</span>
        </div>
      </div>

      <div className="preview-editor">
        <h4>Live Editor Preview</h4>
        <div className="editor-wrapper">
          <RichTextEditor
            value={content}
            onChange={setContent}
            editorConfig={mergedSettings}
          />
        </div>
      </div>

      <div className="preview-output">
        <h4>HTML Output</h4>
        <pre className="html-output">{content}</pre>
      </div>
    </div>
  );
};

export default SettingsPreview;
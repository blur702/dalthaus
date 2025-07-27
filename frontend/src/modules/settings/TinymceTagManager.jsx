import React, { useState, useEffect } from 'react';
import { TAG_PRESETS } from './tinymceService';

const TinymceTagManager = ({ tags, onChange }) => {
  const [allowedTags, setAllowedTags] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [newTag, setNewTag] = useState({
    tag_name: '',
    attributes: {},
    is_void: false
  });
  const [editingTag, setEditingTag] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [attributeForm, setAttributeForm] = useState({
    name: '',
    type: 'string',
    required: false
  });

  useEffect(() => {
    setAllowedTags(tags || []);
  }, [tags]);

  const handlePresetChange = (presetName) => {
    if (!presetName) return;
    
    const preset = TAG_PRESETS[presetName];
    if (preset) {
      setAllowedTags(preset);
      onChange(preset);
      setSelectedPreset('');
    }
  };

  const handleAddTag = () => {
    if (!newTag.tag_name.trim()) return;

    const tagExists = allowedTags.some(tag => tag.tag_name === newTag.tag_name);
    if (tagExists) {
      alert('This tag already exists');
      return;
    }

    const updatedTags = [...allowedTags, { ...newTag }];
    setAllowedTags(updatedTags);
    onChange(updatedTags);
    
    // Reset form
    setNewTag({
      tag_name: '',
      attributes: {},
      is_void: false
    });
    setShowAddForm(false);
  };

  const handleRemoveTag = (tagName) => {
    const updatedTags = allowedTags.filter(tag => tag.tag_name !== tagName);
    setAllowedTags(updatedTags);
    onChange(updatedTags);
  };

  const handleEditTag = (tag) => {
    setEditingTag({ ...tag });
  };

  const handleUpdateTag = () => {
    if (!editingTag) return;

    const updatedTags = allowedTags.map(tag => 
      tag.tag_name === editingTag.tag_name ? editingTag : tag
    );
    setAllowedTags(updatedTags);
    onChange(updatedTags);
    setEditingTag(null);
  };

  const handleAddAttribute = (targetTag) => {
    if (!attributeForm.name.trim()) return;

    const tag = targetTag || newTag;
    const updatedAttributes = {
      ...tag.attributes,
      [attributeForm.name]: {
        type: attributeForm.type,
        required: attributeForm.required
      }
    };

    if (targetTag) {
      // Editing existing tag
      setEditingTag({
        ...editingTag,
        attributes: updatedAttributes
      });
    } else {
      // Adding to new tag
      setNewTag({
        ...newTag,
        attributes: updatedAttributes
      });
    }

    // Reset attribute form
    setAttributeForm({
      name: '',
      type: 'string',
      required: false
    });
  };

  const handleRemoveAttribute = (attributeName, targetTag) => {
    const tag = targetTag || newTag;
    const { [attributeName]: removed, ...remainingAttributes } = tag.attributes;

    if (targetTag) {
      setEditingTag({
        ...editingTag,
        attributes: remainingAttributes
      });
    } else {
      setNewTag({
        ...newTag,
        attributes: remainingAttributes
      });
    }
  };

  const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

  // Tag information for examples and descriptions
  const tagInfoMap = {
    'p': {
      description: 'Defines a paragraph of text',
      example: '<p>This is a paragraph of text.</p>'
    },
    'h1': {
      description: 'Largest heading, typically for page titles',
      example: '<h1>Main Title</h1>'
    },
    'h2': {
      description: 'Second-level heading for sections',
      example: '<h2>Section Title</h2>'
    },
    'h3': {
      description: 'Third-level heading for subsections',
      example: '<h3>Subsection</h3>'
    },
    'h4': {
      description: 'Fourth-level heading',
      example: '<h4>Sub-subsection</h4>'
    },
    'h5': {
      description: 'Fifth-level heading',
      example: '<h5>Minor Heading</h5>'
    },
    'h6': {
      description: 'Smallest heading level',
      example: '<h6>Smallest Heading</h6>'
    },
    'div': {
      description: 'Generic container for content blocks',
      example: '<div>Content block</div>'
    },
    'span': {
      description: 'Inline container for styling text',
      example: '<span>Inline text</span>'
    },
    'strong': {
      description: 'Makes text bold with semantic importance',
      example: '<strong>Important text</strong>'
    },
    'b': {
      description: 'Makes text bold (visual only)',
      example: '<b>Bold text</b>'
    },
    'em': {
      description: 'Makes text italic with emphasis',
      example: '<em>Emphasized text</em>'
    },
    'i': {
      description: 'Makes text italic (visual only)',
      example: '<i>Italic text</i>'
    },
    'u': {
      description: 'Underlines text',
      example: '<u>Underlined text</u>'
    },
    's': {
      description: 'Shows text with a line through it',
      example: '<s>Crossed out</s>'
    },
    'strike': {
      description: 'Shows text with a line through it (deprecated)',
      example: '<strike>Crossed out</strike>'
    },
    'a': {
      description: 'Creates a hyperlink',
      example: '<a href="url">Link text</a>'
    },
    'img': {
      description: 'Embeds an image',
      example: '<img src="image.jpg" alt="Description">'
    },
    'ul': {
      description: 'Creates a bulleted list',
      example: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    },
    'ol': {
      description: 'Creates a numbered list',
      example: '<ol><li>First</li><li>Second</li></ol>'
    },
    'li': {
      description: 'Defines an item in a list',
      example: '<li>List item</li>'
    },
    'blockquote': {
      description: 'Displays a quoted section',
      example: '<blockquote>A famous quote</blockquote>'
    },
    'pre': {
      description: 'Preserves formatting and whitespace',
      example: '<pre>  Preserves   spacing</pre>'
    },
    'code': {
      description: 'Displays code snippets',
      example: '<code>console.log("Hello");</code>'
    },
    'table': {
      description: 'Creates a data table',
      example: '<table><tr><td>Cell</td></tr></table>'
    },
    'thead': {
      description: 'Groups header content in a table',
      example: '<thead><tr><th>Header</th></tr></thead>'
    },
    'tbody': {
      description: 'Groups body content in a table',
      example: '<tbody><tr><td>Data</td></tr></tbody>'
    },
    'tfoot': {
      description: 'Groups footer content in a table',
      example: '<tfoot><tr><td>Footer</td></tr></tfoot>'
    },
    'tr': {
      description: 'Defines a row in a table',
      example: '<tr><td>Cell 1</td><td>Cell 2</td></tr>'
    },
    'td': {
      description: 'Defines a data cell in a table',
      example: '<td>Cell content</td>'
    },
    'th': {
      description: 'Defines a header cell in a table',
      example: '<th>Column Header</th>'
    },
    'hr': {
      description: 'Creates a horizontal line separator',
      example: '<hr>'
    },
    'br': {
      description: 'Inserts a line break',
      example: 'Line 1<br>Line 2'
    },
    'sub': {
      description: 'Displays text as subscript',
      example: 'H<sub>2</sub>O'
    },
    'sup': {
      description: 'Displays text as superscript',
      example: 'x<sup>2</sup>'
    },
    'dl': {
      description: 'Creates a description list',
      example: '<dl><dt>Term</dt><dd>Definition</dd></dl>'
    },
    'dt': {
      description: 'Defines a term in a description list',
      example: '<dt>Term</dt>'
    },
    'dd': {
      description: 'Defines a description for a term',
      example: '<dd>Definition</dd>'
    },
    'section': {
      description: 'Defines a section in a document',
      example: '<section>Content section</section>'
    },
    'article': {
      description: 'Defines independent, self-contained content',
      example: '<article>Article content</article>'
    },
    'header': {
      description: 'Defines a header for a document or section',
      example: '<header>Page header</header>'
    },
    'footer': {
      description: 'Defines a footer for a document or section',
      example: '<footer>Page footer</footer>'
    },
    'nav': {
      description: 'Defines navigation links',
      example: '<nav><a href="#">Home</a></nav>'
    },
    'aside': {
      description: 'Defines content aside from the main content',
      example: '<aside>Sidebar content</aside>'
    },
    'figure': {
      description: 'Specifies self-contained content like images',
      example: '<figure><img src="pic.jpg"><figcaption>Caption</figcaption></figure>'
    },
    'figcaption': {
      description: 'Defines a caption for a figure',
      example: '<figcaption>Image caption</figcaption>'
    }
  };

  const getTagInfo = (tagName) => {
    return tagInfoMap[tagName] || null;
  };

  return (
    <div className="tag-manager">
      <div className="tag-header">
        <h3>Allowed HTML Tags</h3>
        <p className="help-text">Manage which HTML tags and attributes are allowed in the editor.</p>
      </div>

      <div className="preset-selector">
        <label htmlFor="tag-preset">Load from preset:</label>
        <select
          id="tag-preset"
          value={selectedPreset}
          onChange={(e) => {
            setSelectedPreset(e.target.value);
            handlePresetChange(e.target.value);
          }}
        >
          <option value="">Select a preset...</option>
          <option value="basic">Basic (minimal tags)</option>
          <option value="standard">Standard (common tags)</option>
          <option value="full">Full (all safe tags)</option>
        </select>
      </div>

      <div className="tags-list">
        <div className="tags-header">
          <h4>Current Tags ({allowedTags.length})</h4>
          <button
            type="button"
            className="btn-add"
            onClick={() => setShowAddForm(true)}
          >
            + Add Tag
          </button>
        </div>

        {/* Quick add common tags */}
        <div className="quick-add-section">
          <p className="quick-add-label">Quick add common tags:</p>
          <div className="quick-add-tags">
            {['p', 'h1', 'h2', 'h3', 'strong', 'em', 'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'code', 'table', 'br', 'hr'].map(tagName => {
              const isAdded = allowedTags.some(tag => tag.tag_name === tagName);
              const tagInfo = getTagInfo(tagName);
              return (
                <button
                  key={tagName}
                  type="button"
                  className={`quick-add-tag ${isAdded ? 'added' : ''}`}
                  onClick={() => {
                    if (!isAdded) {
                      const newTagData = {
                        tag_name: tagName,
                        attributes: {},
                        is_void: voidTags.includes(tagName)
                      };
                      // Add default attributes for common tags
                      if (tagName === 'a') {
                        newTagData.attributes = { href: { type: 'url', required: true }, target: { type: 'string' } };
                      } else if (tagName === 'img') {
                        newTagData.attributes = { src: { type: 'url', required: true }, alt: { type: 'string' } };
                      }
                      const updatedTags = [...allowedTags, newTagData];
                      setAllowedTags(updatedTags);
                      onChange(updatedTags);
                    }
                  }}
                  disabled={isAdded}
                  title={tagInfo ? tagInfo.description : ''}
                >
                  &lt;{tagName}&gt;
                </button>
              );
            })}
          </div>
        </div>

        {allowedTags.length === 0 ? (
          <div className="no-tags">
            <p>No tags configured. Add tags or load a preset to get started.</p>
          </div>
        ) : (
          <div className="tags-grid">
            {allowedTags.map((tag, index) => {
              // Find tag info for examples
              const tagInfo = getTagInfo(tag.tag_name);
              
              return (
                <div key={index} className="tag-card">
                  <div className="tag-header">
                    <h5>&lt;{tag.tag_name}&gt;</h5>
                    {tag.is_void && <span className="void-badge">void</span>}
                  </div>
                  
                  {tagInfo && (
                    <div className="tag-info">
                      <div className="tag-description">{tagInfo.description}</div>
                      <div className="tag-example">
                        <strong>Example:</strong>
                        <code>{tagInfo.example}</code>
                      </div>
                    </div>
                  )}
                  
                  {Object.keys(tag.attributes || {}).length > 0 && (
                    <div className="tag-attributes">
                      <strong>Attributes:</strong>
                      <div className="attributes-grid">
                        {Object.entries(tag.attributes).map(([attrName, attrConfig]) => (
                          <div key={attrName} className="attribute-chip">
                            <span className="attr-name">{attrName}</span>
                            <span className="attr-type">{attrConfig.type}</span>
                            {attrConfig.required && <span className="required">*</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="tag-actions">
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => handleEditTag(tag)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveTag(tag.tag_name)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Tag Form */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Tag</h3>
            
            <div className="form-group">
              <label htmlFor="tag-name">Tag Name</label>
              <input
                type="text"
                id="tag-name"
                value={newTag.tag_name}
                onChange={(e) => setNewTag({ ...newTag, tag_name: e.target.value.toLowerCase() })}
                placeholder="e.g., div, span, article"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={newTag.is_void}
                  onChange={(e) => setNewTag({ ...newTag, is_void: e.target.checked })}
                  disabled={voidTags.includes(newTag.tag_name)}
                />
                Void element (self-closing)
              </label>
            </div>

            <div className="attributes-section">
              <h4>Attributes</h4>
              
              {Object.entries(newTag.attributes).map(([attrName, attrConfig]) => (
                <div key={attrName} className="attribute-item">
                  <span>{attrName} ({attrConfig.type})</span>
                  {attrConfig.required && <span className="required">*</span>}
                  <button
                    type="button"
                    className="btn-remove-small"
                    onClick={() => handleRemoveAttribute(attrName)}
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="add-attribute">
                <input
                  type="text"
                  placeholder="Attribute name"
                  value={attributeForm.name}
                  onChange={(e) => setAttributeForm({ ...attributeForm, name: e.target.value })}
                />
                <select
                  value={attributeForm.type}
                  onChange={(e) => setAttributeForm({ ...attributeForm, type: e.target.value })}
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="url">URL</option>
                  <option value="email">Email</option>
                </select>
                <label>
                  <input
                    type="checkbox"
                    checked={attributeForm.required}
                    onChange={(e) => setAttributeForm({ ...attributeForm, required: e.target.checked })}
                  />
                  Required
                </label>
                <button
                  type="button"
                  className="btn-add-small"
                  onClick={() => handleAddAttribute()}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleAddTag}
                disabled={!newTag.tag_name.trim()}
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Form */}
      {editingTag && (
        <div className="modal-overlay" onClick={() => setEditingTag(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Tag: &lt;{editingTag.tag_name}&gt;</h3>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={editingTag.is_void}
                  onChange={(e) => setEditingTag({ ...editingTag, is_void: e.target.checked })}
                  disabled={voidTags.includes(editingTag.tag_name)}
                />
                Void element (self-closing)
              </label>
            </div>

            <div className="attributes-section">
              <h4>Attributes</h4>
              
              {Object.entries(editingTag.attributes || {}).map(([attrName, attrConfig]) => (
                <div key={attrName} className="attribute-item">
                  <span>{attrName} ({attrConfig.type})</span>
                  {attrConfig.required && <span className="required">*</span>}
                  <button
                    type="button"
                    className="btn-remove-small"
                    onClick={() => handleRemoveAttribute(attrName, editingTag)}
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="add-attribute">
                <input
                  type="text"
                  placeholder="Attribute name"
                  value={attributeForm.name}
                  onChange={(e) => setAttributeForm({ ...attributeForm, name: e.target.value })}
                />
                <select
                  value={attributeForm.type}
                  onChange={(e) => setAttributeForm({ ...attributeForm, type: e.target.value })}
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="url">URL</option>
                  <option value="email">Email</option>
                </select>
                <label>
                  <input
                    type="checkbox"
                    checked={attributeForm.required}
                    onChange={(e) => setAttributeForm({ ...attributeForm, required: e.target.checked })}
                  />
                  Required
                </label>
                <button
                  type="button"
                  className="btn-add-small"
                  onClick={() => handleAddAttribute(editingTag)}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEditingTag(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleUpdateTag}
              >
                Update Tag
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tag-manager {
          padding: 20px;
        }

        .tag-header {
          margin-bottom: 20px;
        }

        .tag-header h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .help-text {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .preset-selector {
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .preset-selector label {
          font-weight: 500;
          color: #333;
        }

        .preset-selector select {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          min-width: 200px;
        }

        .tags-list {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
        }

        .tags-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .tags-header h4 {
          margin: 0;
          color: #333;
        }

        .btn-add {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .btn-add:hover {
          background: #218838;
        }

        .no-tags {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .tags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 15px;
        }

        .tag-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 15px;
          transition: box-shadow 0.2s;
        }

        .tag-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tag-card .tag-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
        }

        .tag-card h5 {
          margin: 0;
          color: #007bff;
          font-family: monospace;
          font-size: 16px;
        }

        .tag-info {
          margin-bottom: 12px;
        }

        .tag-description {
          font-size: 13px;
          color: #555;
          margin-bottom: 8px;
        }

        .tag-example {
          background: #f8f9fa;
          padding: 8px 10px;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .tag-example strong {
          display: block;
          color: #666;
          margin-bottom: 4px;
          font-size: 11px;
          text-transform: uppercase;
        }

        .tag-example code {
          display: block;
          font-family: monospace;
          color: #333;
          word-break: break-all;
        }

        .void-badge {
          background: #6c757d;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          text-transform: uppercase;
        }

        .tag-attributes {
          margin-bottom: 10px;
          font-size: 13px;
        }

        .tag-attributes strong {
          display: block;
          margin-bottom: 8px;
          color: #333;
        }

        .attributes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px;
          margin-top: 8px;
        }

        .attribute-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          background: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 4px;
          font-size: 12px;
        }

        .attr-name {
          color: #1565c0;
          font-weight: 500;
          font-family: monospace;
        }

        .attr-type {
          color: #5e92f3;
          font-size: 11px;
          font-style: italic;
        }

        .required {
          color: #dc3545;
          font-weight: bold;
          margin-left: 3px;
        }

        .tag-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .btn-edit,
        .btn-remove {
          padding: 5px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: background-color 0.2s;
        }

        .btn-edit {
          background: #6c757d;
          color: white;
        }

        .btn-edit:hover {
          background: #5a6268;
        }

        .btn-remove {
          background: #dc3545;
          color: white;
        }

        .btn-remove:hover {
          background: #c82333;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 25px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-content h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-group input[type="text"] {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group input[type="checkbox"] {
          margin-right: 8px;
        }

        .attributes-section {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .attributes-section h4 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
        }

        .attribute-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .attribute-item span {
          flex: 1;
          font-size: 14px;
        }

        .btn-remove-small {
          padding: 2px 8px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        }

        .btn-remove-small:hover {
          background: #c82333;
        }

        .add-attribute {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 10px;
        }

        .add-attribute input[type="text"] {
          flex: 1;
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 13px;
        }

        .add-attribute select {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 13px;
        }

        .add-attribute label {
          display: flex;
          align-items: center;
          font-size: 13px;
        }

        .btn-add-small {
          padding: 6px 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        }

        .btn-add-small:hover {
          background: #218838;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        /* Quick add section */
        .quick-add-section {
          margin: 20px 0;
          padding: 15px;
          background: #f0f7ff;
          border: 1px solid #cce4ff;
          border-radius: 6px;
        }

        .quick-add-label {
          margin: 0 0 10px 0;
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .quick-add-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .quick-add-tag {
          padding: 5px 12px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: monospace;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          color: #007bff;
        }

        .quick-add-tag:hover:not(:disabled) {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .quick-add-tag.added {
          background: #e8f5e9;
          border-color: #4caf50;
          color: #2e7d32;
          cursor: default;
        }

        .quick-add-tag:disabled {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default TinymceTagManager;
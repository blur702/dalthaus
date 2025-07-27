import React, { useState, useEffect } from 'react';
import { TOOLBAR_BUTTONS, toolbarPresetService } from './tinymceService';

const TinymceToolbarConfig = ({ toolbar, onChange }) => {
  const [toolbarRows, setToolbarRows] = useState([]);
  const [availableButtons, setAvailableButtons] = useState([]);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [draggedButton, setDraggedButton] = useState(null);
  const [dragOverInfo, setDragOverInfo] = useState(null);

  useEffect(() => {
    // Parse toolbar string into rows
    const rows = toolbar ? toolbar.split('|').map(row => row.trim().split(' ').filter(btn => btn)) : [[]];
    setToolbarRows(rows);

    // Determine which buttons are available (not already in toolbar)
    const usedButtons = rows.flat();
    const available = TOOLBAR_BUTTONS.filter(btn => !usedButtons.includes(btn.id) || btn.id === '|');
    setAvailableButtons(available);

    // Load presets
    loadPresets();
  }, [toolbar]);

  const loadPresets = async () => {
    try {
      const data = await toolbarPresetService.getAll();
      setPresets(data || []);
    } catch (error) {
      console.error('Failed to load toolbar presets:', error);
    }
  };

  const updateToolbar = (rows) => {
    const toolbarString = rows
      .map(row => row.join(' '))
      .filter(row => row)
      .join(' | ');
    onChange(toolbarString);
  };

  const handleDragStart = (e, button, source, rowIndex = null, buttonIndex = null) => {
    setDraggedButton({ button, source, rowIndex, buttonIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, rowIndex, buttonIndex = null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverInfo({ rowIndex, buttonIndex });
  };

  const handleDragLeave = () => {
    setDragOverInfo(null);
  };

  const handleDrop = (e, targetRowIndex, targetButtonIndex = null) => {
    e.preventDefault();
    
    if (!draggedButton) return;

    const newRows = [...toolbarRows];
    const { button, source, rowIndex: sourceRowIndex, buttonIndex: sourceButtonIndex } = draggedButton;

    // Remove button from source if it's from toolbar
    if (source === 'toolbar' && sourceRowIndex !== null && sourceButtonIndex !== null) {
      newRows[sourceRowIndex].splice(sourceButtonIndex, 1);
      
      // Remove empty rows
      if (newRows[sourceRowIndex].length === 0 && newRows.length > 1) {
        newRows.splice(sourceRowIndex, 1);
        // Adjust target row index if necessary
        if (targetRowIndex > sourceRowIndex) {
          targetRowIndex--;
        }
      }
    }

    // Add button to target position
    if (targetButtonIndex !== null) {
      newRows[targetRowIndex].splice(targetButtonIndex, 0, button.id);
    } else {
      newRows[targetRowIndex].push(button.id);
    }

    setToolbarRows(newRows);
    updateToolbar(newRows);
    setDraggedButton(null);
    setDragOverInfo(null);
  };

  const handleDropToAvailable = (e) => {
    e.preventDefault();
    
    if (!draggedButton || draggedButton.source !== 'toolbar') return;

    const { rowIndex, buttonIndex } = draggedButton;
    const newRows = [...toolbarRows];
    
    // Remove button from toolbar
    newRows[rowIndex].splice(buttonIndex, 1);
    
    // Remove empty rows
    if (newRows[rowIndex].length === 0 && newRows.length > 1) {
      newRows.splice(rowIndex, 1);
    }

    setToolbarRows(newRows);
    updateToolbar(newRows);
    setDraggedButton(null);
  };

  const addNewRow = () => {
    const newRows = [...toolbarRows, []];
    setToolbarRows(newRows);
  };

  const removeRow = (rowIndex) => {
    if (toolbarRows.length > 1) {
      const newRows = toolbarRows.filter((_, index) => index !== rowIndex);
      setToolbarRows(newRows);
      updateToolbar(newRows);
    }
  };

  const loadPreset = (preset) => {
    if (!preset) return;

    const presetConfig = presets.find(p => p.id === preset);
    if (presetConfig && presetConfig.toolbar_config) {
      const rows = [];
      
      // Convert preset toolbar config to rows array
      Object.keys(presetConfig.toolbar_config)
        .sort()
        .forEach(key => {
          rows.push(presetConfig.toolbar_config[key]);
        });

      setToolbarRows(rows);
      updateToolbar(rows);
      setSelectedPreset('');
    }
  };

  const getButtonInfo = (buttonId) => {
    return TOOLBAR_BUTTONS.find(btn => btn.id === buttonId) || { id: buttonId, label: buttonId };
  };

  return (
    <div className="toolbar-config">
      <div className="toolbar-header">
        <h3>Toolbar Configuration</h3>
        <p className="help-text">Drag and drop buttons to configure your toolbar. Use the separator (|) to group buttons.</p>
      </div>

      <div className="preset-selector">
        <label htmlFor="preset">Load from preset:</label>
        <select
          id="preset"
          value={selectedPreset}
          onChange={(e) => {
            setSelectedPreset(e.target.value);
            loadPreset(e.target.value);
          }}
        >
          <option value="">Select a preset...</option>
          {presets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name} {preset.is_system && '(System)'}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-preview">
        <h4>Toolbar Preview</h4>
        <div className="toolbar-rows">
          {toolbarRows.map((row, rowIndex) => (
            <div key={rowIndex} className="toolbar-row">
              <div
                className={`row-buttons ${dragOverInfo?.rowIndex === rowIndex && dragOverInfo?.buttonIndex === null ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, rowIndex)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, rowIndex)}
              >
                {row.length === 0 ? (
                  <div className="empty-row">Drop buttons here</div>
                ) : (
                  row.map((buttonId, buttonIndex) => {
                    const buttonInfo = getButtonInfo(buttonId);
                    return (
                      <React.Fragment key={`${rowIndex}-${buttonIndex}`}>
                        {dragOverInfo?.rowIndex === rowIndex && dragOverInfo?.buttonIndex === buttonIndex && (
                          <div className="drop-indicator" />
                        )}
                        <div
                          className={`toolbar-button ${buttonId === '|' ? 'separator' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, buttonInfo, 'toolbar', rowIndex, buttonIndex)}
                          onDragOver={(e) => handleDragOver(e, rowIndex, buttonIndex)}
                          title={buttonInfo.label}
                        >
                          {buttonId === '|' ? '|' : buttonInfo.label}
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                {dragOverInfo?.rowIndex === rowIndex && dragOverInfo?.buttonIndex === row.length && (
                  <div className="drop-indicator" />
                )}
              </div>
              <button
                type="button"
                className="remove-row-btn"
                onClick={() => removeRow(rowIndex)}
                disabled={toolbarRows.length === 1}
                title="Remove row"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="add-row-btn" onClick={addNewRow}>
          + Add New Row
        </button>
      </div>

      <div className="available-buttons">
        <h4>Available Buttons</h4>
        <div
          className="buttons-grid"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropToAvailable}
        >
          {availableButtons.map(button => (
            <div
              key={button.id}
              className={`available-button ${button.special ? 'special' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, button, 'available')}
              title={button.label}
            >
              {button.label}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .toolbar-config {
          padding: 20px;
        }

        .toolbar-header {
          margin-bottom: 20px;
        }

        .toolbar-header h3 {
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

        .toolbar-preview {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .toolbar-preview h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .toolbar-rows {
          margin-bottom: 15px;
        }

        .toolbar-row {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          gap: 10px;
        }

        .row-buttons {
          flex: 1;
          min-height: 45px;
          background: white;
          border: 2px dashed #ddd;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          align-items: center;
          position: relative;
        }

        .row-buttons.drag-over {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .empty-row {
          color: #999;
          font-style: italic;
          padding: 5px;
        }

        .toolbar-button,
        .available-button {
          padding: 5px 12px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: move;
          font-size: 13px;
          transition: all 0.2s;
          user-select: none;
        }

        .toolbar-button:hover,
        .available-button:hover {
          background: #f0f0f0;
          border-color: #999;
        }

        .toolbar-button.separator {
          padding: 5px 8px;
          background: #e0e0e0;
          border-color: #ccc;
          font-weight: bold;
        }

        .available-button.special {
          background: #f0f0f0;
        }

        .drop-indicator {
          width: 2px;
          height: 30px;
          background: #007bff;
          margin: 0 2px;
        }

        .remove-row-btn {
          padding: 5px 10px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          transition: background-color 0.2s;
        }

        .remove-row-btn:hover:not(:disabled) {
          background: #c82333;
        }

        .remove-row-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .add-row-btn {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .add-row-btn:hover {
          background: #218838;
        }

        .available-buttons {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
        }

        .available-buttons h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .buttons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px;
          min-height: 100px;
          background: white;
          border: 2px dashed #ddd;
          border-radius: 4px;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default TinymceToolbarConfig;
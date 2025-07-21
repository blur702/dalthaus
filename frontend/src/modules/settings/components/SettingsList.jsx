import React, { useState } from 'react';
import './SettingsList.css';

const SettingsList = ({ settings, selectedSetting, onSelectSetting, onCreateNew, onImport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const allTags = [...new Set(settings.flatMap(s => s.tags || []))];
  
  const filteredSettings = settings.filter(setting => {
    const matchesSearch = setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || setting.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const groupedSettings = {
    presets: filteredSettings.filter(s => s.isPreset),
    custom: filteredSettings.filter(s => !s.isPreset)
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onImport(file);
      }
    };
    input.click();
  };

  return (
    <div className="settings-list">
      <div className="list-header">
        <h3>Settings</h3>
        <div className="list-actions">
          <button onClick={onCreateNew} className="btn btn-primary btn-sm">
            + New
          </button>
          <button onClick={handleImportClick} className="btn btn-secondary btn-sm">
            Import
          </button>
        </div>
      </div>

      <div className="list-search">
        <input
          type="text"
          placeholder="Search settings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {allTags.length > 0 && (
        <div className="list-filters">
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="filter-select"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      )}

      <div className="list-content">
        {groupedSettings.presets.length > 0 && (
          <div className="list-group">
            <h4 className="group-title">Presets</h4>
            {groupedSettings.presets.map(setting => (
              <div
                key={setting.id}
                className={`list-item ${selectedSetting?.id === setting.id ? 'active' : ''}`}
                onClick={() => onSelectSetting(setting)}
              >
                <div className="item-name">
                  {setting.name}
                  {setting.isDefault && <span className="default-badge">Default</span>}
                </div>
                <div className="item-description">{setting.description}</div>
              </div>
            ))}
          </div>
        )}

        {groupedSettings.custom.length > 0 && (
          <div className="list-group">
            <h4 className="group-title">Custom Settings</h4>
            {groupedSettings.custom.map(setting => (
              <div
                key={setting.id}
                className={`list-item ${selectedSetting?.id === setting.id ? 'active' : ''}`}
                onClick={() => onSelectSetting(setting)}
              >
                <div className="item-name">
                  {setting.name}
                  {setting.isDefault && <span className="default-badge">Default</span>}
                </div>
                <div className="item-description">{setting.description}</div>
              </div>
            ))}
          </div>
        )}

        {filteredSettings.length === 0 && (
          <div className="no-results">
            No settings found
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsList;
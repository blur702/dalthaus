import React, { useState, useEffect } from 'react';
import { DEFAULT_FEATURES } from './tinymceService';

const TinymceFeatureManager = ({ features, onChange }) => {
  const [featuresList, setFeaturesList] = useState([]);

  useEffect(() => {
    // Merge provided features with defaults
    const mergedFeatures = DEFAULT_FEATURES.map(defaultFeature => {
      const existingFeature = features?.find(f => f.feature_name === defaultFeature.feature_name);
      return existingFeature || defaultFeature;
    });
    setFeaturesList(mergedFeatures);
  }, [features]);

  const handleToggleFeature = (featureName) => {
    // Don't allow disabling pagebreak
    if (featureName === 'pagebreak') {
      return;
    }

    const updatedFeatures = featuresList.map(feature => {
      if (feature.feature_name === featureName) {
        return {
          ...feature,
          enabled: !feature.enabled
        };
      }
      return feature;
    });

    setFeaturesList(updatedFeatures);
    onChange(updatedFeatures);
  };

  const handleConfigChange = (featureName, configKey, value) => {
    const updatedFeatures = featuresList.map(feature => {
      if (feature.feature_name === featureName) {
        return {
          ...feature,
          config: {
            ...feature.config,
            [configKey]: value
          }
        };
      }
      return feature;
    });

    setFeaturesList(updatedFeatures);
    onChange(updatedFeatures);
  };

  const renderFeatureConfig = (feature) => {
    switch (feature.feature_name) {
      case 'wordcount':
        return (
          <div className="feature-config">
            <label>
              <input
                type="checkbox"
                checked={feature.config?.countSpaces || false}
                onChange={(e) => handleConfigChange('wordcount', 'countSpaces', e.target.checked)}
              />
              Count spaces
            </label>
            <label>
              <input
                type="checkbox"
                checked={feature.config?.countHTML || false}
                onChange={(e) => handleConfigChange('wordcount', 'countHTML', e.target.checked)}
              />
              Count HTML markup
            </label>
          </div>
        );

      case 'autosave':
        return (
          <div className="feature-config">
            <div className="config-item">
              <label htmlFor="autosave-interval">Save interval (seconds):</label>
              <input
                type="number"
                id="autosave-interval"
                min="10"
                max="300"
                value={feature.config?.interval || 30}
                onChange={(e) => handleConfigChange('autosave', 'interval', parseInt(e.target.value))}
              />
            </div>
            <div className="config-item">
              <label htmlFor="autosave-retention">Retention (minutes):</label>
              <input
                type="number"
                id="autosave-retention"
                min="1"
                max="60"
                value={feature.config?.retention || 10}
                onChange={(e) => handleConfigChange('autosave', 'retention', parseInt(e.target.value))}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="feature-manager">
      <div className="feature-header">
        <h3>Feature Flags</h3>
        <p className="help-text">Enable or disable TinyMCE features and configure their settings.</p>
      </div>

      <div className="features-list">
        {featuresList.map(feature => (
          <div key={feature.feature_name} className={`feature-card ${feature.required ? 'required' : ''}`}>
            <div className="feature-main">
              <div className="feature-info">
                <h4>{feature.feature_name}</h4>
                <p className="feature-description">{feature.description}</p>
              </div>
              <div className="feature-toggle">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={feature.enabled}
                    onChange={() => handleToggleFeature(feature.feature_name)}
                    disabled={feature.required}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {feature.enabled && renderFeatureConfig(feature) && (
              <div className="feature-config-section">
                {renderFeatureConfig(feature)}
              </div>
            )}

            {feature.required && (
              <div className="required-note">
                This feature is required and cannot be disabled.
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .feature-manager {
          padding: 20px;
        }

        .feature-header {
          margin-bottom: 20px;
        }

        .feature-header h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .help-text {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .feature-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          transition: box-shadow 0.2s;
        }

        .feature-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .feature-card.required {
          background: #f8f9fa;
        }

        .feature-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .feature-info {
          flex: 1;
        }

        .feature-info h4 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 16px;
          text-transform: capitalize;
        }

        .feature-description {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .feature-toggle {
          margin-left: 20px;
        }

        /* Toggle Switch Styles */
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #28a745;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #28a745;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        input:disabled + .slider {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .feature-config-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .feature-config {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .feature-config label {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #333;
          cursor: pointer;
        }

        .feature-config input[type="checkbox"] {
          margin-right: 8px;
        }

        .config-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .config-item label {
          font-weight: 500;
          color: #333;
          font-size: 14px;
          min-width: 150px;
        }

        .config-item input[type="number"] {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 80px;
        }

        .required-note {
          margin-top: 10px;
          padding: 8px 12px;
          background: #d1ecf1;
          border: 1px solid #bee5eb;
          border-radius: 4px;
          color: #0c5460;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default TinymceFeatureManager;
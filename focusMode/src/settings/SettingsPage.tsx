import React, { useState, useEffect } from 'react';
import { FocusModeProvider, useFocusMode } from '@/contexts/FocusModeContext';
import Bulb from '@/components/bulb';
import './settings.css';

interface SettingsContentProps {}

const SettingsContent: React.FC<SettingsContentProps> = () => {
  const { isFocusMode, toggleFocusMode } = useFocusMode();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure smooth transition on load
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  const handleToggleChange = () => {
    toggleFocusMode();
  };

  const handleCloseSettings = () => {
    window.close();
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`settings-container ${isFocusMode ? 'focus-mode' : ''}`}>
      <div className="left-panel">
        <div className="header">
          <h1>Settings</h1>
          <p>Configure your YouTube Focus Mode experience</p>
        </div>
        
        <div className="content">
          <div className="settings-section">
            <h2>Focus Settings</h2>
            
            <div className="setting-item">
              <div className="setting-header">
                <div className="setting-title">Focus Mode</div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={isFocusMode}
                    onChange={handleToggleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-description">
                When enabled, focus mode reduces distractions and creates a more productive browsing experience on YouTube.
              </div>
              <div className={`status-indicator ${isFocusMode ? 'status-on' : 'status-off'}`}>
                {isFocusMode ? 'Focus mode is ON' : 'Focus mode is OFF'}
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h2>About</h2>
            
            <div className="setting-item">
              <div className="setting-title">Extension Information</div>
              <div className="setting-description">
                YouTube Focus Mode is designed to help you stay focused by minimizing distractions while watching videos or browsing content. This extension creates a cleaner, more productive environment for your YouTube experience.
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer">
          <button className="back-link" onClick={handleCloseSettings}>
            ← Close Settings
          </button>
        </div>
      </div>
      
      <div className="right-panel">
        <div className="bulb-container">
          <div className="bulb-glow"></div>
          <Bulb 
            style={{ 
              width: '200px', 
              height: '200px',
              position: 'relative',
              zIndex: 10
            }} 
          />
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  return (
    <FocusModeProvider>
      <SettingsContent />
    </FocusModeProvider>
  );
};

export default SettingsPage;

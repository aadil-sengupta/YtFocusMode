// Settings page functionality with React bulb component
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FocusModeProvider } from '../contexts/FocusModeContext.tsx';
import Bulb from '../components/bulb.tsx';

// React component for the bulb with context
const BulbWithContext = () => {
  return React.createElement(FocusModeProvider, {}, 
    React.createElement(Bulb, { 
      style: { 
        width: '200px', 
        height: '200px' 
      } 
    })
  );
};

document.addEventListener('DOMContentLoaded', function() {
    const focusModeToggle = document.getElementById('focusModeToggle');
    const focusStatus = document.getElementById('focusStatus');
    const body = document.body;
    
    // Render React bulb component
    const bulbContainer = document.getElementById('react-bulb');
    if (bulbContainer) {
        const root = createRoot(bulbContainer);
        root.render(React.createElement(BulbWithContext));
    }
    
    // Load current focus mode state and apply theme
    chrome.storage.sync.get(['isFocusMode'], function(result) {
        const isFocusMode = result.isFocusMode || false;
        focusModeToggle.checked = isFocusMode;
        updateStatusIndicator(isFocusMode);
        updateTheme(isFocusMode);
    });
    
    // Handle focus mode toggle
    focusModeToggle.addEventListener('change', function() {
        const isFocusMode = this.checked;
        
        // Save to Chrome storage
        chrome.storage.sync.set({ isFocusMode: isFocusMode }, function() {
            console.log('Focus mode saved:', isFocusMode);
            updateStatusIndicator(isFocusMode);
            updateTheme(isFocusMode);
            
            // Send message to content script if needed
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0] && tabs[0].url.includes('youtube.com')) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'toggleFocusMode',
                        isFocusMode: isFocusMode
                    });
                }
            });
        });
    });
    
    function updateStatusIndicator(isFocusMode) {
        if (isFocusMode) {
            focusStatus.textContent = 'Focus mode is ON';
            focusStatus.className = 'status-indicator status-on';
        } else {
            focusStatus.textContent = 'Focus mode is OFF';
            focusStatus.className = 'status-indicator status-off';
        }
    }
    
    function updateTheme(isFocusMode) {
        if (isFocusMode) {
            body.classList.add('focus-mode');
        } else {
            body.classList.remove('focus-mode');
        }
    }
});

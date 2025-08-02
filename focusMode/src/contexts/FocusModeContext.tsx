import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  openSettings: () => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export const useFocusMode = () => {
  const context = useContext(FocusModeContext);
  if (context === undefined) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context; 
};

interface FocusModeProviderProps {
  children: ReactNode;
}

export const FocusModeProvider: React.FC<FocusModeProviderProps> = ({ children }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Load focus mode state from Chrome storage on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['isFocusMode'], (result) => {
        if (result.isFocusMode !== undefined) {
          setIsFocusMode(result.isFocusMode);
        }
      });
    }
  }, []);

  const toggleFocusMode = () => {
    setIsFocusMode(prev => {
      const newValue = !prev;
      console.log('Focus mode toggled:', newValue);

      // Save to Chrome storage asynchronously
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ isFocusMode: newValue }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error saving focus mode state:', chrome.runtime.lastError);
          }
        });
      }

      return newValue;
    });
  };

  const openSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({
        url: chrome.runtime.getURL('src/settings/index.html')
      });
    }
  };

  return (
    <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode, openSettings }}>
      {children}
    </FocusModeContext.Provider>
  );
};

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
        setIsFocusMode(result.isFocusMode || false);
      });
    }
  }, []);

  const toggleFocusMode = () => {
    const newValue = !isFocusMode;
    setIsFocusMode(newValue);
    
    // Save to Chrome storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ isFocusMode: newValue });
    }
  };

  const openSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({
        url: chrome.runtime.getURL('src/settings/settings.html')
      });
    }
  };

  return (
    <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode, openSettings }}>
      {children}
    </FocusModeContext.Provider>
  );
};

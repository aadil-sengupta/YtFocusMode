import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface KeywordsContextType {
  blacklistedKeywords: string[];
  focusKeywords: string[];
  allowedWebsites: string[];
  setBlacklistedKeywords: (keywords: string[]) => void;
  setFocusKeywords: (keywords: string[]) => void;
  setAllowedWebsites: (websites: string[]) => void;
  updateBlacklistedKeywords: (keywords: string[]) => void;
  updateFocusKeywords: (keywords: string[]) => void;
  updateAllowedWebsites: (websites: string[]) => void;
}

const KeywordsContext = createContext<KeywordsContextType | undefined>(undefined);

export const useKeywords = () => {
  const context = useContext(KeywordsContext);
  if (context === undefined) {
    throw new Error('useKeywords must be used within a KeywordsProvider');
  }
  return context;
};

interface KeywordsProviderProps {
  children: ReactNode;
}

export const KeywordsProvider: React.FC<KeywordsProviderProps> = ({ children }) => {
  const [blacklistedKeywords, setBlacklistedKeywords] = useState<string[]>(['clickbait', 'drama', 'reaction']);
  const [focusKeywords, setFocusKeywords] = useState<string[]>(['entertainment', 'funny', 'memes']);
  const [allowedWebsites, setAllowedWebsites] = useState<string[]>(['youtube.com']);

  // Load keywords and websites from Chrome storage on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['blacklistedKeywords', 'focusKeywords', 'allowedWebsites'], (result) => {
        if (result.blacklistedKeywords) {
          setBlacklistedKeywords(result.blacklistedKeywords);
        }
        if (result.focusKeywords) {
          setFocusKeywords(result.focusKeywords);
        }
        if (result.allowedWebsites) {
          setAllowedWebsites(result.allowedWebsites);
        }
      });
    }
  }, []);

  // Save to Chrome storage when keywords change
  const saveToStorage = (key: string, value: string[]) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          console.error(`Error saving ${key}:`, chrome.runtime.lastError);
        } else {
          console.log(`${key} saved successfully:`, value);
        }
      });
    }
  };

  const updateBlacklistedKeywords = (keywords: string[]) => {
    setBlacklistedKeywords(keywords);
    saveToStorage('blacklistedKeywords', keywords);
  };

  const updateFocusKeywords = (keywords: string[]) => {
    setFocusKeywords(keywords);
    saveToStorage('focusKeywords', keywords);
  };

  const updateAllowedWebsites = (websites: string[]) => {
    setAllowedWebsites(websites);
    saveToStorage('allowedWebsites', websites);
  };

  return (
    <KeywordsContext.Provider value={{
      blacklistedKeywords,
      focusKeywords,
      allowedWebsites,
      setBlacklistedKeywords,
      setFocusKeywords,
      setAllowedWebsites,
      updateBlacklistedKeywords,
      updateFocusKeywords,
      updateAllowedWebsites,
    }}>
      {children}
    </KeywordsContext.Provider>
  );
};

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface KeywordsContextType {
  focusKeywords: string[];
  blackListedKeywords: string[];
  setFocusKeywords: (keywords: string[]) => void;
  setBlackListedKeywords: (keywords: string[]) => void;
  addFocusKeyword: (keyword: string) => void;
  removeFocusKeyword: (keyword: string) => void;
  addBlackListedKeyword: (keyword: string) => void;
  removeBlackListedKeyword: (keyword: string) => void;
}

const KeywordsContext = createContext<KeywordsContextType | undefined>(undefined);

interface KeywordsProviderProps {
  children: ReactNode;
}

export const KeywordsProvider: React.FC<KeywordsProviderProps> = ({ children }) => {
  const [focusKeywords, setFocusKeywords] = useState<string[]>([]);
  const [blackListedKeywords, setBlackListedKeywords] = useState<string[]>([]);

  const addFocusKeyword = (keyword: string) => {
    setFocusKeywords(prev => [...prev, keyword]);
  };

  const removeFocusKeyword = (keyword: string) => {
    setFocusKeywords(prev => prev.filter(k => k !== keyword));
  };

  const addBlackListedKeyword = (keyword: string) => {
    setBlackListedKeywords(prev => [...prev, keyword]);
  };

  const removeBlackListedKeyword = (keyword: string) => {
    setBlackListedKeywords(prev => prev.filter(k => k !== keyword));
  };

  const value: KeywordsContextType = {
    focusKeywords,
    blackListedKeywords,
    setFocusKeywords,
    setBlackListedKeywords,
    addFocusKeyword,
    removeFocusKeyword,
    addBlackListedKeyword,
    removeBlackListedKeyword,
  };

  return (
    <KeywordsContext.Provider value={value}>
      {children}
    </KeywordsContext.Provider>
  );
};

export const useKeywords = (): KeywordsContextType => {
  const context = useContext(KeywordsContext);
  if (context === undefined) {
    throw new Error('useKeywords must be used within a KeywordsProvider');
  }
  return context;
};
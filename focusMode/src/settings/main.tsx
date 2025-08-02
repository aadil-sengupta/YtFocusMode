import { createRoot } from 'react-dom/client'
import { FocusModeProvider, useFocusMode } from '@/contexts/FocusModeContext'
import { KeywordsProvider, useKeywords } from '@/contexts/KeywordsContext'
import Bulb from '@/components/bulb'
import { useState, KeyboardEvent } from 'react'

// Custom TagInput Component
interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  isFocusMode: boolean;
}

function TagInput({ value, onChange, placeholder, isFocusMode }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    const trimmedValue = inputValue.trim();

    // Handle Enter, Comma, or Space
    if ((key === 'Enter' || key === ',' || key === ' ') && trimmedValue) {
      e.preventDefault();
      if (!value.includes(trimmedValue)) {
        onChange([...value, trimmedValue]);
      }
      setInputValue('');
    }
    // Handle Backspace to remove last tag when input is empty
    else if (key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={{
      width: '100%',
      padding: '0.5rem 0.75rem 0',
      fontSize: '1rem',
      lineHeight: 1.25,
      border: `2px solid ${isFocused 
        ? (isFocusMode ? 'hsla(43, 100%, 14%, 0.6)' : 'hsla(220, 24%, 60%, 1.00)')
        : (isFocusMode ? 'hsla(43, 100%, 14%, 0.2)' : 'hsla(220, 24%, 30%, 1.00)')
      }`,
      borderRadius: '6px',
      backgroundColor: isFocusMode 
        ? 'hsla(45, 30%, 98%, 1.00)' 
        : 'hsla(220, 30%, 18%, 1.00)',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      boxShadow: isFocused 
        ? `0 0 0 2px ${isFocusMode 
          ? 'hsla(43, 100%, 14%, 0.1)' 
          : 'hsla(220, 24%, 60%, 0.1)'
        }`
        : 'none',
      minHeight: '50px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: '0.25rem',
    }}>
      {/* Render Tags */}
      {value.map((tag, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            backgroundColor: isFocusMode 
              ? 'hsla(43, 100%, 14%, 0.1)' 
              : 'hsla(220, 24%, 30%, 1.00)',
            color: isFocusMode 
              ? 'hsla(43, 100%, 14%, 1.00)' 
              : 'hsla(220, 24%, 85%, 1.00)',
            padding: '0.2em 0.4em 0.3em',
            borderRadius: '0.25rem',
            marginBottom: '0.4em',
            marginRight: '0.25em',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: `1px solid ${isFocusMode 
              ? 'hsla(43, 100%, 14%, 0.2)' 
              : 'hsla(220, 24%, 40%, 1.00)'
            }`,
            transition: 'all 0.2s ease',
          }}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              marginLeft: '0.5em',
              cursor: 'pointer',
              fontSize: '1.2em',
              lineHeight: 1,
              padding: 0,
              opacity: 0.7,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.color = isFocusMode 
                ? 'hsla(0, 70%, 50%, 1.00)' 
                : 'hsla(0, 70%, 60%, 1.00)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.color = 'inherit';
            }}
          >
            ×
          </button>
        </span>
      ))}
      
      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={value.length === 0 ? placeholder : ''}
        style={{
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: isFocusMode 
            ? 'hsla(43, 100%, 14%, 1.00)' 
            : 'hsla(220, 24%, 85%, 1.00)',
          fontSize: '1rem',
          flex: 1,
          minWidth: '120px',
          marginBottom: '0.5em',
          padding: '0.25em 0',
        }}
      />
    </div>
  );
}

function SettingsContent() {
  const { isFocusMode } = useFocusMode();
  const { blacklistedKeywords, focusKeywords, allowedWebsites, updateBlacklistedKeywords, updateFocusKeywords, updateAllowedWebsites } = useKeywords();
  
  // Tab management state
  const [activeTab, setActiveTab] = useState<'content' | 'websites' | 'about'>('content');

  const handleBlacklistedKeywordsChange = (value: string[]) => {
    updateBlacklistedKeywords(value);
  };

  const handleFocusKeywordsChange = (value: string[]) => {
    updateFocusKeywords(value);
  };

  const handleAllowedWebsitesChange = (value: string[]) => {
    updateAllowedWebsites(value);
  };

  // Recommended websites with full support
  const recommendedWebsites = ['youtube.com', 'youtu.be'];
  
  // Check if a website is recommended
  const isRecommended = (website: string) => {
    return recommendedWebsites.some(recommended => 
      website.toLowerCase().includes(recommended.toLowerCase()) || 
      recommended.toLowerCase().includes(website.toLowerCase())
    );
  };

  return (
    <>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        background: isFocusMode 
          ? 'hsl(45, 30%, 92%)' 
          : 'hsl(220, 30%, 15%)',
        transition: 'background 0.4s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }}>
        {/* Left Panel - Settings */}
        <div style={{
          flex: 1,
          maxWidth: '600px',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '40px', position: 'relative' }}>
            {/* Close Button - Top Right */}
            <button
              onClick={() => window.close()}
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: 'none',
                border: 'none',
                color: isFocusMode 
                  ? 'hsla(43, 100%, 14%, 0.7)' 
                  : 'hsla(220, 24%, 70%, 1.00)',
                fontSize: '2rem',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isFocusMode 
                  ? 'hsla(43, 100%, 14%, 1.00)' 
                  : 'hsla(220, 24%, 90%, 1.00)';
                e.currentTarget.style.backgroundColor = isFocusMode 
                  ? 'hsla(43, 100%, 14%, 0.1)' 
                  : 'hsla(220, 24%, 80%, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isFocusMode 
                  ? 'hsla(43, 100%, 14%, 0.7)' 
                  : 'hsla(220, 24%, 70%, 1.00)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
            
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              margin: '0 0 12px 0',
              color: isFocusMode 
                ? 'hsla(43, 100%, 14%, 1.00)' 
                : 'hsla(220, 24%, 90%, 1.00)',
              transition: 'color 0.4s ease',
            }}>
              Settings
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.7)' 
                : 'hsla(220, 24%, 70%, 1.00)',
              margin: 0,
              transition: 'color 0.4s ease',
            }}>
              Configure your YouTube Focus Mode experience
            </p>
            
            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '24px',
              borderBottom: `2px solid ${isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.1)' 
                : 'hsla(220, 24%, 25%, 1.00)'}`,
              paddingBottom: '0',
            }}>
              <button
                onClick={() => setActiveTab('content')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 20px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: activeTab === 'content' 
                    ? (isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 90%, 1.00)')
                    : (isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.6)' 
                      : 'hsla(220, 24%, 60%, 1.00)'),
                  borderBottom: activeTab === 'content' 
                    ? `3px solid ${isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 90%, 1.00)'}`
                    : '3px solid transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '-2px',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'content') {
                    e.currentTarget.style.color = isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.8)' 
                      : 'hsla(220, 24%, 75%, 1.00)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'content') {
                    e.currentTarget.style.color = isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.6)' 
                      : 'hsla(220, 24%, 60%, 1.00)';
                  }
                }}
              >
                Content Filtering
              </button>
              <button
                onClick={() => setActiveTab('websites')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 20px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: activeTab === 'websites' 
                    ? (isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 90%, 1.00)')
                    : (isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.6)' 
                      : 'hsla(220, 24%, 60%, 1.00)'),
                  borderBottom: activeTab === 'websites' 
                    ? `3px solid ${isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 90%, 1.00)'}`
                    : '3px solid transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '-2px',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'websites') {
                    e.currentTarget.style.color = isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.8)' 
                      : 'hsla(220, 24%, 75%, 1.00)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'websites') {
                    e.currentTarget.style.color = isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.6)' 
                      : 'hsla(220, 24%, 60%, 1.00)';
                  }
                }}
              >
                Websites
              </button>
              <button
                onClick={() => setActiveTab('about')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 20px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: activeTab === 'about' 
                    ? (isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 90%, 1.00)')
                    : (isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.6)' 
                      : 'hsla(220, 24%, 60%, 1.00)'),
                  borderBottom: activeTab === 'about' 
                    ? `3px solid ${isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 90%, 1.00)'}`
                    : '3px solid transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '-2px',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'about') {
                    e.currentTarget.style.color = isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.8)' 
                      : 'hsla(220, 24%, 75%, 1.00)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'about') {
                    e.currentTarget.style.color = isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.6)' 
                      : 'hsla(220, 24%, 60%, 1.00)';
                  }
                }}
              >
                About
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div style={{ flex: 1 }}>
            {activeTab === 'content' ? (
              <>
                {/* Keyword Management Section */}
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    margin: '0 0 20px 0',
                    color: isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 85%, 1.00)',
                    transition: 'color 0.4s ease',
                  }}>
                    
                  </h2>              {/* Focus Keywords */}
              <div style={{
                background: isFocusMode 
                  ? 'hsla(45, 30%, 96%, 1.00)' 
                  : 'hsla(220, 30%, 20%, 1.00)',
                border: `2px solid ${isFocusMode 
                  ? 'hsla(43, 100%, 14%, 0.15)' 
                  : 'hsla(220, 24%, 25%, 1.00)'}`,
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: isFocusMode 
                    ? 'hsla(43, 100%, 14%, 1.00)' 
                    : 'hsla(220, 24%, 85%, 1.00)',
                  marginBottom: '12px',
                  transition: 'color 0.4s ease',
                }}>
                  Distraction Keywords
                </div>
                <div style={{
                  color: isFocusMode 
                    ? 'hsla(43, 100%, 14%, 0.7)' 
                    : 'hsla(220, 24%, 70%, 1.00)',
                  fontSize: '0.95rem',
                  marginBottom: '16px',
                  transition: 'color 0.4s ease',
                }}>
                  Content containing these keywords will be hidden only when focus mode is enabled.
                </div>
                <TagInput
                  value={focusKeywords}
                  onChange={handleFocusKeywordsChange}
                  placeholder="Add distraction keywords (e.g., entertainment, funny, viral)"
                  isFocusMode={isFocusMode}
                />
                <div style={{
                  fontSize: '0.85rem',
                  color: isFocusMode 
                    ? 'hsla(43, 100%, 14%, 0.6)' 
                    : 'hsla(220, 24%, 60%, 1.00)',
                  marginTop: '8px',
                  fontStyle: 'italic',
                }}>
                  Separate keywords with a comma, space bar, or enter key
                </div>
              </div>
            </div>

              {/* Blacklisted Keywords */}
              <div style={{
                background: isFocusMode 
                  ? 'hsla(45, 30%, 96%, 1.00)' 
                  : 'hsla(220, 30%, 20%, 1.00)',
                border: `2px solid ${isFocusMode 
                  ? 'hsla(43, 100%, 14%, 0.15)' 
                  : 'hsla(220, 24%, 25%, 1.00)'}`,
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '16px',
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: isFocusMode 
                    ? 'hsla(43, 100%, 14%, 1.00)' 
                    : 'hsla(220, 24%, 85%, 1.00)',
                  marginBottom: '12px',
                  transition: 'color 0.4s ease',
                }}>
                  Blacklisted Keywords
                </div>
                <div style={{
                  color: isFocusMode 
                    ? 'hsla(43, 100%, 14%, 0.7)' 
                    : 'hsla(220, 24%, 70%, 1.00)',
                  fontSize: '0.95rem',
                  marginBottom: '16px',
                  transition: 'color 0.4s ease',
                }}>
                  Content containing these keywords will always be hidden, regardless of focus mode status.
                </div>
                <TagInput
                  value={blacklistedKeywords}
                  onChange={handleBlacklistedKeywordsChange}
                  placeholder="Add keywords to blacklist (e.g., clickbait, drama)"
                  isFocusMode={isFocusMode}
                />
                <div style={{
                  fontSize: '0.85rem',
                  color: isFocusMode 
                    ? 'hsla(43, 100%, 14%, 0.6)' 
                    : 'hsla(220, 24%, 60%, 1.00)',
                  marginTop: '8px',
                  fontStyle: 'italic',
                }}>
                  Separate keywords with a comma, space bar, or enter key
                </div>
              </div>
              </>
            ) : activeTab === 'websites' ? (
              // Websites Tab Content
              <>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    margin: '0 0 20px 0',
                    color: isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 85%, 1.00)',
                    transition: 'color 0.4s ease',
                  }}>
                    Website Management
                  </h2>
                  
                  {/* Recommended Websites Table */}
                  <div style={{
                    background: isFocusMode 
                      ? 'hsla(45, 30%, 96%, 1.00)' 
                      : 'hsla(220, 30%, 20%, 1.00)',
                    border: `2px solid ${isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.15)' 
                      : 'hsla(220, 24%, 25%, 1.00)'}`,
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    transition: 'all 0.3s ease',
                  }}>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: isFocusMode 
                        ? 'hsla(43, 100%, 14%, 1.00)' 
                        : 'hsla(220, 24%, 85%, 1.00)',
                      marginBottom: '8px',
                      transition: 'color 0.4s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{ color: 'hsla(120, 50%, 50%, 1.00)' }}>✓</span>
                      Recommended Websites (Full Support)
                    </div>
                    <div style={{
                      color: isFocusMode 
                        ? 'hsla(43, 100%, 14%, 0.7)' 
                        : 'hsla(220, 24%, 70%, 1.00)',
                      fontSize: '0.9rem',
                      marginBottom: '16px',
                      transition: 'color 0.4s ease',
                    }}>
                      These websites have been fully tested and optimized for the best focus mode experience.
                    </div>
                    
                    {/* Recommended Websites Table */}
                    {(() => {
                      const availableRecommended = recommendedWebsites.filter(website => !allowedWebsites.includes(website));
                      
                      if (availableRecommended.length === 0) {
                        return (
                          <div style={{
                            textAlign: 'center',
                            padding: '32px',
                            color: isFocusMode 
                              ? 'hsla(43, 100%, 14%, 0.5)' 
                              : 'hsla(220, 24%, 50%, 1.00)',
                            fontStyle: 'italic',
                            transition: 'color 0.4s ease',
                            border: `1px solid ${isFocusMode 
                              ? 'hsla(43, 100%, 14%, 0.2)' 
                              : 'hsla(220, 24%, 30%, 1.00)'}`,
                            borderRadius: '8px',
                          }}>
                            All recommended websites have been added to your active list!
                          </div>
                        );
                      }
                      
                      return (
                        <div style={{
                          border: `1px solid ${isFocusMode 
                            ? 'hsla(43, 100%, 14%, 0.2)' 
                            : 'hsla(220, 24%, 30%, 1.00)'}`,
                          borderRadius: '8px',
                          overflow: 'hidden',
                        }}>
                          {availableRecommended.map((website, index) => (
                            <div
                              key={website}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                backgroundColor: index % 2 === 0 
                                  ? (isFocusMode 
                                    ? 'hsla(45, 30%, 98%, 1.00)' 
                                    : 'hsla(220, 30%, 18%, 1.00)')
                                  : 'transparent',
                                borderBottom: index < availableRecommended.length - 1 
                                  ? `1px solid ${isFocusMode 
                                    ? 'hsla(43, 100%, 14%, 0.1)' 
                                    : 'hsla(220, 24%, 25%, 1.00)'}`
                                  : 'none',
                                transition: 'background-color 0.2s ease',
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}>
                                <span style={{
                                  color: 'hsla(120, 50%, 50%, 1.00)',
                                  fontSize: '0.9em',
                                }}>
                                  ✓
                                </span>
                                <span style={{
                                  color: isFocusMode 
                                    ? 'hsla(43, 100%, 14%, 1.00)' 
                                    : 'hsla(220, 24%, 85%, 1.00)',
                                  fontWeight: 500,
                                  fontSize: '1.1rem',
                                  transition: 'color 0.4s ease',
                                }}>
                                  {website}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  // Add to active list
                                  handleAllowedWebsitesChange([...allowedWebsites, website]);
                                }}
                                style={{
                                  background: isFocusMode 
                                    ? 'hsla(120, 50%, 90%, 1.00)' 
                                    : 'hsla(120, 50%, 25%, 1.00)',
                                  color: isFocusMode 
                                    ? 'hsla(120, 50%, 30%, 1.00)' 
                                    : 'hsla(120, 50%, 85%, 1.00)',
                                  border: `1px solid ${isFocusMode 
                                    ? 'hsla(120, 50%, 70%, 0.5)' 
                                    : 'hsla(120, 50%, 40%, 1.00)'}`,
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '0.85rem',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                  e.currentTarget.style.boxShadow = '0 2px 4px hsla(120, 50%, 50%, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0px)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Active Websites Table */}
                  <div style={{
                    background: isFocusMode 
                      ? 'hsla(45, 30%, 96%, 1.00)' 
                      : 'hsla(220, 30%, 20%, 1.00)',
                    border: `2px solid ${isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.15)' 
                      : 'hsla(220, 24%, 25%, 1.00)'}`,
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    transition: 'all 0.3s ease',
                  }}>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: isFocusMode 
                        ? 'hsla(43, 100%, 14%, 1.00)' 
                        : 'hsla(220, 24%, 85%, 1.00)',
                      marginBottom: '8px',
                      transition: 'color 0.4s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{ color: 'hsla(220, 50%, 50%, 1.00)' }}>⚡</span>
                      Active Websites ({allowedWebsites.length})
                    </div>
                    <div style={{
                      color: isFocusMode 
                        ? 'hsla(43, 100%, 14%, 0.7)' 
                        : 'hsla(220, 24%, 70%, 1.00)',
                      fontSize: '0.9rem',
                      marginBottom: '16px',
                      transition: 'color 0.4s ease',
                    }}>
                      Websites where focus mode is currently enabled and active.
                    </div>
                    
                    {/* Active Websites Table */}
                    {allowedWebsites.length > 0 ? (
                      <div style={{
                        border: `1px solid ${isFocusMode 
                          ? 'hsla(43, 100%, 14%, 0.2)' 
                          : 'hsla(220, 24%, 30%, 1.00)'}`,
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}>
                        {allowedWebsites.map((website, index) => {
                          const recommended = isRecommended(website);
                          return (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                backgroundColor: index % 2 === 0 
                                  ? (isFocusMode 
                                    ? 'hsla(45, 30%, 98%, 1.00)' 
                                    : 'hsla(220, 30%, 18%, 1.00)')
                                  : 'transparent',
                                borderBottom: index < allowedWebsites.length - 1 
                                  ? `1px solid ${isFocusMode 
                                    ? 'hsla(43, 100%, 14%, 0.1)' 
                                    : 'hsla(220, 24%, 25%, 1.00)'}`
                                  : 'none',
                                transition: 'background-color 0.2s ease',
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}>
                                <span style={{
                                  color: recommended 
                                    ? 'hsla(120, 50%, 50%, 1.00)' 
                                    : 'hsla(45, 80%, 45%, 1.00)',
                                  fontSize: '0.9em',
                                }}>
                                  {recommended ? '✓' : '⚠️'}
                                </span>
                                <span style={{
                                  color: isFocusMode 
                                    ? 'hsla(43, 100%, 14%, 1.00)' 
                                    : 'hsla(220, 24%, 85%, 1.00)',
                                  fontWeight: 500,
                                  fontSize: '1.1rem',
                                  transition: 'color 0.4s ease',
                                }}>
                                  {website}
                                </span>
                                {!recommended && (
                                  <span style={{
                                    color: isFocusMode 
                                      ? 'hsla(43, 100%, 14%, 0.6)' 
                                      : 'hsla(220, 24%, 60%, 1.00)',
                                    fontSize: '0.8rem',
                                    fontStyle: 'italic',
                                    transition: 'color 0.4s ease',
                                  }}>
                                    (experimental)
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  const newWebsites = allowedWebsites.filter(w => w !== website);
                                  handleAllowedWebsitesChange(newWebsites);
                                }}
                                style={{
                                  background: isFocusMode 
                                    ? 'hsla(0, 50%, 90%, 1.00)' 
                                    : 'hsla(0, 50%, 25%, 1.00)',
                                  color: isFocusMode 
                                    ? 'hsla(0, 50%, 30%, 1.00)' 
                                    : 'hsla(0, 50%, 85%, 1.00)',
                                  border: `1px solid ${isFocusMode 
                                    ? 'hsla(0, 50%, 70%, 0.5)' 
                                    : 'hsla(0, 50%, 40%, 1.00)'}`,
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '0.85rem',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                  e.currentTarget.style.boxShadow = '0 2px 4px hsla(0, 50%, 50%, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0px)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '32px',
                        color: isFocusMode 
                          ? 'hsla(43, 100%, 14%, 0.5)' 
                          : 'hsla(220, 24%, 50%, 1.00)',
                        fontStyle: 'italic',
                        transition: 'color 0.4s ease',
                      }}>
                        No websites enabled yet. Add recommended websites above or add custom websites below.
                      </div>
                    )}
                    
                    {/* Add Custom Website Section - Integrated */}
                    <div style={{
                      borderTop: `1px solid ${isFocusMode 
                        ? 'hsla(43, 100%, 14%, 0.2)' 
                        : 'hsla(220, 24%, 30%, 1.00)'}`,
                      padding: '20px 24px 0',
                      marginTop: '16px',
                    }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: isFocusMode 
                          ? 'hsla(43, 100%, 14%, 1.00)' 
                          : 'hsla(220, 24%, 85%, 1.00)',
                        marginBottom: '8px',
                        transition: 'color 0.4s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span style={{ color: 'hsla(45, 80%, 45%, 1.00)' }}>⚠️</span>
                        Add Custom Website
                      </div>
                      <div style={{
                        color: isFocusMode 
                          ? 'hsla(43, 100%, 14%, 0.7)' 
                          : 'hsla(220, 24%, 70%, 1.00)',
                        fontSize: '0.9rem',
                        marginBottom: '16px',
                        transition: 'color 0.4s ease',
                      }}>
                        Add any website with experimental support. These may have limited functionality.
                      </div>
                      
                      <TagInput
                        value={[]}
                        onChange={(newWebsites) => {
                          if (newWebsites.length > 0) {
                            const websiteToAdd = newWebsites[0].toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
                            if (!allowedWebsites.includes(websiteToAdd)) {
                              handleAllowedWebsitesChange([...allowedWebsites, websiteToAdd]);
                            }
                          }
                        }}
                        placeholder="Enter domain name (e.g., example.com)"
                        isFocusMode={isFocusMode}
                      />
                      
                      <div style={{
                        fontSize: '0.8rem',
                        color: isFocusMode 
                          ? 'hsla(43, 100%, 14%, 0.6)' 
                          : 'hsla(220, 24%, 60%, 1.00)',
                        marginTop: '8px',
                        fontStyle: 'italic',
                        transition: 'color 0.4s ease',
                      }}>
                        Enter just the domain name (e.g., "example.com" not "https://www.example.com"). 
                        Custom websites have experimental support and may not work perfectly.
                      </div>
                    </div>
                  </div>
                </div>


              </>
            ) : (
              // About Tab Content
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  margin: '0 0 20px 0',
                  color: isFocusMode 
                    ? 'hsla(43, 100%, 14%, 1.00)' 
                    : 'hsla(220, 24%, 85%, 1.00)',
                  transition: 'color 0.4s ease',
                }}>
                  About YouTube Focus Mode
                </h2>
                
                <div style={{
                  background: isFocusMode 
                    ? 'hsla(45, 30%, 96%, 1.00)' 
                    : 'hsla(220, 30%, 20%, 1.00)',
                  border: `2px solid ${isFocusMode 
                    ? 'hsla(43, 100%, 14%, 0.15)' 
                    : 'hsla(220, 24%, 25%, 1.00)'}`,
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '20px',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 85%, 1.00)',
                    marginBottom: '12px',
                    transition: 'color 0.4s ease',
                  }}>
                    Extension Information
                  </div>
                  <div style={{
                    color: isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.7)' 
                      : 'hsla(220, 24%, 70%, 1.00)',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    transition: 'color 0.4s ease',
                    marginBottom: '16px',
                  }}>
                    YouTube Focus Mode is designed to help you stay focused by minimizing distractions while watching videos or browsing content. This extension creates a cleaner, more productive environment for your YouTube experience.
                  </div>
                  <div style={{
                    color: isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.7)' 
                      : 'hsla(220, 24%, 70%, 1.00)',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    transition: 'color 0.4s ease',
                  }}>
                    <strong>Key Features:</strong>
                    <br />• Toggle focus mode on/off with a simple click
                    <br />• Hide distracting content based on keywords
                    <br />• Customize blacklisted and distraction keywords
                    <br />• Beautiful, adaptive interface that changes with focus mode
                    <br />• Persistent settings across browser sessions
                  </div>
                </div>

                <div style={{
                  background: isFocusMode 
                    ? 'hsla(45, 30%, 96%, 1.00)' 
                    : 'hsla(220, 30%, 20%, 1.00)',
                  border: `2px solid ${isFocusMode 
                    ? 'hsla(43, 100%, 14%, 0.15)' 
                    : 'hsla(220, 24%, 25%, 1.00)'}`,
                  borderRadius: '16px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 85%, 1.00)',
                    marginBottom: '12px',
                    transition: 'color 0.4s ease',
                  }}>
                    How It Works
                  </div>
                  <div style={{
                    color: isFocusMode 
                      ? 'hsla(43, 100%, 14%, 0.7)' 
                      : 'hsla(220, 24%, 70%, 1.00)',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    transition: 'color 0.4s ease',
                  }}>
                    <strong>Blacklisted Keywords:</strong> Content containing these keywords will always be hidden, regardless of focus mode status.
                    <br /><br />
                    <strong>Distraction Keywords:</strong> Content containing these keywords will only be hidden when focus mode is enabled, allowing you to choose when to filter out entertainment content.
                    <br /><br />
                    <strong>Focus Mode Toggle:</strong> When enabled, the extension filters content and provides visual cues to help maintain your focus and productivity.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
            {/* This space is intentionally left empty */}
          </div>
        </div>

        {/* Right Panel - Bulb */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
        }}>
          {/* Bulb Container with Glow Effect */}
          <div style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Glow Effect */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: isFocusMode 
                ? 'radial-gradient(circle, hsla(45, 80%, 80%, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, hsla(220, 30%, 50%, 0.2) 0%, transparent 70%)',
              filter: 'blur(20px)',
              opacity: isFocusMode ? 0.6 : 0.4,
              transition: 'all 0.4s ease',
              zIndex: 1,
            }} />
            
            {/* Bulb Component */}
            <div style={{
              position: 'relative',
              zIndex: 10,
            }}>
              <Bulb 
                style={{ 
                  width: '250px', 
                  height: '250px'
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Focus Mode Status - Bottom Right */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '12px 20px',
        borderRadius: '25px',
        fontSize: '0.9rem',
        fontWeight: 600,
        background: isFocusMode 
          ? 'hsla(120, 50%, 90%, 0.95)' 
          : 'hsla(0, 50%, 90%, 0.95)',
        color: isFocusMode 
          ? 'hsla(120, 50%, 30%, 1.00)' 
          : 'hsla(0, 50%, 30%, 1.00)',
        border: `2px solid ${isFocusMode 
          ? 'hsla(120, 50%, 70%, 0.7)' 
          : 'hsla(0, 50%, 70%, 0.7)'}`,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.4s ease',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          fontSize: '0.8em',
          opacity: 0.8,
        }}>
          {isFocusMode ? '●' : '○'}
        </span>
        {isFocusMode ? 'Focus Mode ON' : 'Focus Mode OFF'}
      </div>
    </>
  );
}

function SettingsApp() {
  return (
    <FocusModeProvider>
      <KeywordsProvider>
        <SettingsContent />
      </KeywordsProvider>
    </FocusModeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<SettingsApp />)

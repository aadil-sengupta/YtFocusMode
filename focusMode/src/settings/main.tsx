import { createRoot } from 'react-dom/client'
import { FocusModeProvider, useFocusMode } from '@/contexts/FocusModeContext'
import Bulb from '@/components/bulb'

function SettingsContent() {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  const handleToggleChange = () => {
    toggleFocusMode();
  };

  return (
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
        maxWidth: '500px',
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
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
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1 }}>
          {/* Focus Settings Section */}
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
              Focus Settings
            </h2>
            
            {/* Focus Mode Toggle */}
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: isFocusMode 
                    ? 'hsla(43, 100%, 14%, 1.00)' 
                    : 'hsla(220, 24%, 85%, 1.00)',
                  transition: 'color 0.4s ease',
                }}>
                  Focus Mode
                </div>
                
                {/* Custom Toggle Switch */}
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '56px',
                  height: '32px',
                }}>
                  <input 
                    type="checkbox" 
                    checked={isFocusMode}
                    onChange={handleToggleChange}
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: isFocusMode 
                      ? 'hsla(43, 100%, 14%, 1.00)' 
                      : 'hsla(220, 24%, 35%, 1.00)',
                    transition: '0.4s',
                    borderRadius: '32px',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '24px',
                      width: '24px',
                      left: isFocusMode ? '28px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      display: 'block',
                    }} />
                  </span>
                </label>
              </div>
              
              <div style={{
                color: isFocusMode 
                  ? 'hsla(43, 100%, 14%, 0.7)' 
                  : 'hsla(220, 24%, 70%, 1.00)',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                transition: 'color 0.4s ease',
                marginBottom: '10px',
              }}>
                When enabled, focus mode reduces distractions and creates a more productive browsing experience on YouTube.
              </div>
              
              {/* Status Indicator */}
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: isFocusMode 
                  ? 'hsla(120, 50%, 90%, 1.00)' 
                  : 'hsla(0, 50%, 90%, 1.00)',
                color: isFocusMode 
                  ? 'hsla(120, 50%, 30%, 1.00)' 
                  : 'hsla(0, 50%, 30%, 1.00)',
                transition: 'all 0.4s ease',
              }}>
                {isFocusMode ? 'Focus mode is ON' : 'Focus mode is OFF'}
              </div>
            </div>
          </div>

          {/* About Section */}
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
              About
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
              }}>
                YouTube Focus Mode is designed to help you stay focused by minimizing distractions while watching videos or browsing content. This extension creates a cleaner, more productive environment for your YouTube experience.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
          <button 
            onClick={() => window.close()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: isFocusMode 
                ? 'hsla(43, 100%, 14%, 1.00)' 
                : 'hsla(220, 24%, 85%, 1.00)',
              textDecoration: 'none',
              fontWeight: 500,
              padding: '12px 20px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              background: isFocusMode 
                ? 'hsla(45, 30%, 96%, 1.00)' 
                : 'hsla(220, 30%, 20%, 1.00)',
              border: `2px solid ${isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.15)' 
                : 'hsla(220, 24%, 25%, 1.00)'}`,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.borderColor = isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.25)' 
                : 'hsla(220, 24%, 35%, 1.00)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.borderColor = isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.15)' 
                : 'hsla(220, 24%, 25%, 1.00)';
            }}
          >
            ← Close Settings
          </button>
        </div>
      </div>

      {/* Right Panel - Bulb */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: '100vh',
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
  );
}

function SettingsApp() {
  return (
    <FocusModeProvider>
      <SettingsContent />
    </FocusModeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<SettingsApp />)

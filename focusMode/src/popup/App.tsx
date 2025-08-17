import Bulb from "@/components/bulb"
import { FocusModeProvider, useFocusMode } from "@/contexts/FocusModeContext"
import SettingsCog from "@/assets/icons/SettingsCog.tsx"


function AppContent() {
  const { isFocusMode, toggleFocusMode, openSettings } = useFocusMode();
  
  return (
    <div style={{
        width: 350,
        height: 440,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: isFocusMode 
          ? 'linear-gradient(135deg, hsl(45, 35%, 95%) 0%, hsl(45, 25%, 88%) 100%)' 
          : 'linear-gradient(135deg, hsl(220, 25%, 18%) 0%, hsl(220, 30%, 12%) 100%)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }} >
        
        {/* Subtle Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: isFocusMode ? 0.03 : 0.05,
          backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)',
          backgroundSize: '50px 50px',
          color: isFocusMode 
            ? 'hsla(43, 100%, 14%, 1.00)' 
            : 'hsla(220, 24%, 90%, 1.00)',
          transition: 'all 0.5s ease',
          zIndex: 1,
        }} />
        
        {/* Header */}
        <div style={{
          position: "relative",
          padding: "24px 24px 20px",
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: 800,
              color: isFocusMode 
                ? 'hsla(43, 100%, 14%, 1.00)' 
                : 'hsla(220, 24%, 95%, 1.00)',
              transition: 'color 0.5s ease',
              marginBottom: '2px',
              letterSpacing: '-0.02em',
            }}>
              Filament Focus
            </h1>
            
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.65)' 
                : 'hsla(220, 24%, 70%, 1.00)',
              transition: 'color 0.5s ease',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}>
              The Internet, distraction free.
            </p>
          </div>
          
          {/* Settings Button */}
          <button
            onClick={openSettings}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.08)' 
                : 'hsla(220, 24%, 90%, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.15)' 
                : 'hsla(220, 24%, 90%, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.08)' 
                : 'hsla(220, 24%, 90%, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <SettingsCog style={{
              '--icon-color': isFocusMode 
                ? 'hsla(43, 100%, 14%, 0.7)' 
                : 'hsla(220, 24%, 70%, 1.00)',
              transition: 'all 0.3s ease',
              width: 20,
              height: 20,
            }} />
          </button>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 32px',
          position: 'relative',
          zIndex: 10,
        }}>
          
          {/* Bulb Container */}
          <div style={{
            position: 'relative',
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '140px',
            height: '140px',
          }}>
            {/* Outer Glow Ring */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: isFocusMode 
                ? 'conic-gradient(from 0deg, hsla(45, 80%, 60%, 0.3), hsla(45, 90%, 70%, 0.1), hsla(45, 80%, 60%, 0.3))'
                : 'conic-gradient(from 0deg, hsla(220, 30%, 40%, 0.2), hsla(220, 40%, 50%, 0.05), hsla(220, 30%, 40%, 0.2))',
              opacity: isFocusMode ? 1 : 0.7,
              transition: 'all 0.5s ease',
              animation: isFocusMode ? 'rotate 8s linear infinite' : 'none',
              zIndex: 1,
            }} />
            
            {/* Inner Glow */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: isFocusMode 
                ? 'radial-gradient(circle, hsla(45, 80%, 70%, 0.4) 0%, transparent 70%)'
                : 'radial-gradient(circle, hsla(220, 30%, 50%, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
              opacity: isFocusMode ? 0.8 : 0.4,
              transition: 'all 0.5s ease',
              zIndex: 2,
            }} />
            
            {/* Bulb */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
            }}
            onClick={toggleFocusMode}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
            >
              <Bulb style={{ 
                width: "80px", 
                height: "80px",
                filter: isFocusMode ? 'drop-shadow(0 0 20px hsla(45, 80%, 60%, 0.5))' : 'none',
                transition: 'filter 0.5s ease',
              }} />
            </div>
          </div>

          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '24px',
            backgroundColor: isFocusMode 
              ? 'hsla(120, 50%, 96%, 1.00)' 
              : 'hsla(220, 24%, 88%, 0.1)',
            border: `1px solid ${isFocusMode 
              ? 'hsla(120, 50%, 85%, 1.00)' 
              : 'hsla(220, 24%, 70%, 0.2)'}`,
            backdropFilter: 'blur(10px)',
            transition: 'all 0.5s ease',
            marginTop: '20px',
            transform: 'translateY(42px)',
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isFocusMode 
                ? 'hsla(120, 60%, 50%, 1.00)' 
                : 'hsla(0, 60%, 55%, 1.00)',
              transition: 'all 0.5s ease',
              boxShadow: isFocusMode 
                ? '0 0 12px hsla(120, 60%, 50%, 0.5)'
                : '0 0 12px hsla(0, 60%, 55%, 0.3)',
            }} />
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isFocusMode 
                ? 'hsla(120, 50%, 30%, 1.00)' 
                : 'hsla(220, 24%, 80%, 1.00)',
              transition: 'color 0.5s ease',
            }}>
              {isFocusMode ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Bottom Info */}
        <div style={{
          padding: '20px 24px 24px',
          textAlign: 'center',
          zIndex: 10,
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: isFocusMode 
              ? 'hsla(43, 100%, 14%, 0.6)' 
              : 'hsla(220, 24%, 60%, 1.00)',
            transition: 'color 0.5s ease',
            fontStyle: 'italic',
            transform: 'translateY(18px)',
          }}>
            💡 Tip: Drag the cord to toggle focus mode
          </div>
        </div>

        {/* CSS Animation for rotating glow */}
        <style>
          {`
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>

    </div>
  )
}

export default function App() {
  return (
    <FocusModeProvider>
      <AppContent />
    </FocusModeProvider>
  )
}

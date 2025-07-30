import Bulb from "@/components/bulb"
//import shelf1 from "@/assets/bgElements/shelf1.svg"
import Shelf1 from "@/assets/bgElements/shelf1.tsx"
import { FocusModeProvider, useFocusMode } from "@/contexts/FocusModeContext"

function AppContent() {
  const { isFocusMode } = useFocusMode();
  
  return (
    <div style={{
        width: 350,
        height: 440,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: isFocusMode 
          ? 'hsl(45, 30%, 92%)' 
          : 'hsl(220, 30%, 15%)',
        transition: 'background 0.4s ease',
      }} >
      <Bulb />
      <Shelf1 style={{
        position: "absolute",
        top: 25,
        left: 0,
        width: "54%",
        height: "auto",
        zIndex: 40,
        '--icon-color': isFocusMode 
          ? 'hsla(43, 100%, 14%, 1.00)' 
          : 'hsla(220, 24%, 57%, 1.00)',
        transition: 'fill 0.4s ease',
      }}
      isFocusMode={isFocusMode} />
       
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

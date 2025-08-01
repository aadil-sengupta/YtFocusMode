import { useState } from "react"
import Bulb from "src/components/bulb"

function IndexPopup() {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false)
  const [currentURL, setCurrentURL] = useState(window.location.href)

  const handleToggle = () => {
    setFocusModeEnabled(prev => !prev)
  }

  const openSettings = () => {
    // TODO: Open settings page
    console.log("Opening settings page")
  }
  return (
    <div
      style={{
        backgroundColor: "#FFE0A2",
        width: 350,
        minHeight: 440,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Bulb />
    </div>
  )
}

export default IndexPopup

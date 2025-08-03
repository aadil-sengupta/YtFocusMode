# Focus Mode 🎯

A Chrome extension that helps you stay focused while browsing by filtering distracting content based on customizable keywords.

![Focus Mode](./focusMode/public/logo.png)

## 🚀 How It Works

- **Blacklisted Keywords**: Content containing these keywords will **always** be hidden
- **Distraction Keywords**: Content containing these keywords will only be hidden when **focus mode is enabled**

## 📦 Installation

### Option 1: Use Pre-built Release

1. Download from release or :
   ```bash
   wget https://github.com/aadil-sengupta/YtFocusMode/releases/download/release/crx-focus-mode-1.0.0.zip
   ```
2. Unzip the folder

3. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" 
   - Click "Load unpacked" and select the unzipped folder

### Option 2: Build from Source

1. Clone this repository:
   ```bash
   git clone https://github.com/aadil-sengupta/YtFocusMode.git
   cd YtFocusMode/focusMode
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" 
   - Click "Load unpacked" and select the `dist` folder



## 📝 License

This project is licensed under the MIT License.

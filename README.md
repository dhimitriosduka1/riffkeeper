# riffkeeper# Songsterr Auto-Clicker Chrome Extension

## 🎵 What it does
This Chrome extension automatically clicks the "continue with interruptions" popup on Songsterr.com, allowing you to enjoy uninterrupted music browsing and playback.

## 📁 Files you need
Create these files in a folder on your computer:

1. **manifest.json** - Extension configuration
2. **content.js** - Main auto-clicking logic
3. **popup.html** - Extension popup interface
4. **popup.js** - Popup functionality
5. **icon16.png, icon48.png, icon128.png** - Extension icons (optional)

## 🚀 Installation Steps

### Step 1: Create the Extension Folder
1. Create a new folder on your desktop called `songsterr-auto-clicker`
2. Save all the provided files into this folder

### Step 2: Add Icons (Optional)
Create simple icon files or download any 16x16, 48x48, and 128x128 pixel PNG images and rename them to:
- `icon16.png`
- `icon48.png` 
- `icon128.png`

If you skip this step, Chrome will use default icons.

### Step 3: Load the Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select your `songsterr-auto-clicker` folder
5. The extension should now appear in your extensions list

### Step 4: Pin the Extension (Recommended)
1. Click the puzzle piece icon in Chrome's toolbar
2. Find "Songsterr Auto-Clicker" and click the pin icon
3. The extension icon will now be visible in your toolbar

## 🎯 How to Use

1. **Navigate to Songsterr.com**
   - The extension only works on https://www.songsterr.com/*

2. **Open the Extension Popup**
   - Click the extension icon in your toolbar
   - You'll see a beautiful purple interface

3. **Control the Extension**
   - **Toggle Switch**: Enable/disable auto-clicking
   - **Statistics**: View how many popups have been clicked
   - **Reset Button**: Reset the click counter
   - **About Button**: View extension information

4. **Automatic Operation**
   - When enabled, the extension automatically detects and clicks "continue with interruptions" links
   - Works continuously - no need to re-enable
   - Click counter updates in real-time

## ✨ Features

- **Smart Detection**: Finds the popup even with slight text variations
- **Continuous Operation**: Handles multiple popup appearances
- **Statistics Tracking**: Keep track of how many popups were blocked
- **Easy Toggle**: Enable/disable with one click
- **Privacy Focused**: Only works on Songsterr.com
- **Modern UI**: Beautiful gradient interface with animations
- **Persistent Settings**: Remembers your preferences

## 🔧 Troubleshooting

**Extension not working?**
- Make sure you're on songsterr.com
- Check that the extension is enabled in the popup
- Refresh the Songsterr page after installing

**Popup not appearing?**
- Pin the extension to your toolbar
- Check chrome://extensions/ to ensure it's loaded

**Auto-clicking not working?**
- Toggle the extension off and on
- Check browser console for error messages
- Make sure the popup text matches "continue with interruptions"

## 🛡️ Privacy & Security

- Extension only has access to songsterr.com
- No data is sent to external servers
- All statistics stored locally in your browser
- Open source code - you can review everything

## 📝 Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Only "activeTab" for songsterr.com
- **Detection Method**: MutationObserver for efficient DOM monitoring
- **Storage**: Chrome's local storage API
- **Compatibility**: Chrome, Edge, and other Chromium browsers

Enjoy uninterrupted music browsing on Songsterr! 🎸
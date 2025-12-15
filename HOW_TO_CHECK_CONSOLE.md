# How to Check the Browser Console

## Quick Steps

### 1. Open the Console

**Chrome/Edge/Brave:**
- Press `F12` OR
- Press `Ctrl+Shift+J` (Windows/Linux) OR `Cmd+Option+J` (Mac) OR
- Right-click on the page → "Inspect" → Click "Console" tab

**Firefox:**
- Press `F12` OR
- Press `Ctrl+Shift+K` (Windows/Linux) OR `Cmd+Option+K` (Mac) OR
- Right-click → "Inspect Element" → Click "Console" tab

**Safari:**
- First enable Developer menu: Preferences → Advanced → Check "Show Develop menu"
- Then press `Cmd+Option+C` OR
- Develop menu → "Show JavaScript Console"

### 2. What to Look For

Once the console is open, you'll see messages like:

**If localStorage is blocking the modal:**
```
FTUE already seen, skipping modal
```

**If the modal is showing:**
```
Showing FTUE modal
```

**If there's an error:**
```
FTUE modal element not found!
```
or
```
FTUE modal instance not initialized!
```

### 3. Test Commands

Type these in the console and press Enter:

**Clear the FTUE flag (to see modal again):**
```javascript
window.clearFTUE()
```

**Force show the modal:**
```javascript
window.showFTUE()
```

**Check if localStorage has the flag:**
```javascript
localStorage.getItem('colorMemoryFTUESeen')
```

**Manually clear the flag:**
```javascript
localStorage.removeItem('colorMemoryFTUESeen')
```

### 4. Visual Guide

The console usually appears at the bottom or side of your browser. It has:
- A text area where you can type commands
- Messages/logs from the website
- Error messages in red
- Warning messages in yellow
- Regular messages in white/gray

### 5. After Running Commands

After running `window.clearFTUE()`, refresh the page (F5 or Cmd+R) and the modal should appear!


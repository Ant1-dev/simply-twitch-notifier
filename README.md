# Twitch Chat Notifier

A browser extension that monitors Twitch chat and sends desktop notifications when specific keywords appear.

## Features

- Monitor Twitch chat for custom keywords
- Desktop notifications when keywords are detected
- Optional sound alerts with adjustable volume
- Works on any Twitch channel
- Supports both Chrome and Firefox

## Build Instructions

### Requirements

- **Operating System**: macOS, Windows, or Linux
- **Node.js**: v18.0.0 or higher (tested with v24.9.0)
- **npm**: v8.0.0 or higher (tested with v11.6.0)

### Installing Node.js and npm

Download and install Node.js from https://nodejs.org/ (npm is included with Node.js).

Verify installation:
```bash
node --version
npm --version
```

### Building from Source

1. Clone or extract the source code to a directory

2. Open a terminal and navigate to the project directory:
   ```bash
   cd /path/to/twitch-notifier
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the extension:

   **For Firefox (production build):**
   ```bash
   npm run build:firefox:prod
   ```
   Output: `dist-firefox/` directory

   **For Chrome (production build):**
   ```bash
   npm run build:chrome:prod
   ```
   Output: `dist-chrome/` directory

5. (Optional) Create a ZIP file for distribution:

   **Firefox:**
   ```bash
   npm run zip:firefox
   ```
   Output: `twitch-chat-notifier-firefox.zip`

   **Chrome:**
   ```bash
   npm run zip:chrome
   ```
   Output: `twitch-chat-notifier-chrome.zip`

### Available Build Scripts

| Script | Description |
|--------|-------------|
| `npm run build:firefox` | Development build for Firefox |
| `npm run build:chrome` | Development build for Chrome |
| `npm run build:firefox:prod` | Production build for Firefox (minified) |
| `npm run build:chrome:prod` | Production build for Chrome (minified) |
| `npm run zip:firefox` | Create ZIP from dist-firefox |
| `npm run zip:chrome` | Create ZIP from dist-chrome |
| `npm run build:prod` | Build both browsers (production) |

### Build Process Details

The build uses Webpack to:
1. Compile TypeScript source files to JavaScript
2. Bundle the webextension-polyfill dependency
3. Copy static assets (icons, sounds, HTML, CSS)
4. Copy the appropriate manifest file (manifest.json for Chrome, manifest-firefox.json for Firefox)

Production builds use `--mode production` which enables minification.

## Installation (End Users)

### Chrome

1. Open `chrome://extensions` in Chrome
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `dist-chrome` folder

### Firefox

1. Open `about:debugging#/runtime/this-firefox` in Firefox
2. Click "Load Temporary Add-on..."
3. Select the `manifest.json` file inside the `dist-firefox` folder

## Usage

1. Click the extension icon in your browser toolbar to open the options page
2. Add keywords you want to monitor (one per line or comma-separated)
3. Configure sound settings as desired
4. Visit any Twitch channel
5. When a chat message contains one of your keywords, you will receive a desktop notification

## Project Structure

```
src/
  background/    - Background script (handles notifications)
  content/       - Content script (monitors Twitch chat)
  options/       - Options page (keyword configuration)
  types.ts       - TypeScript type definitions
public/
  icons/         - Extension icons (16px, 32px, 128px)
  sounds/        - Notification sounds (notification.mp3)
manifest.json          - Chrome manifest (Manifest V3)
manifest-firefox.json  - Firefox manifest (Manifest V2)
webpack.config.mjs     - Webpack build configuration
tsconfig.json          - TypeScript configuration
package.json           - npm dependencies and scripts
```

## Dependencies

### Runtime
- `webextension-polyfill` - Cross-browser WebExtension API compatibility

### Development
- `typescript` - TypeScript compiler
- `webpack` - Module bundler
- `webpack-cli` - Webpack command line interface
- `ts-loader` - TypeScript loader for Webpack
- `copy-webpack-plugin` - Copies static files during build

## Permissions

- `notifications` - Required to show desktop notifications
- `storage` - Required to save your keyword list and settings
- `*://*.twitch.tv/*` - Required to monitor Twitch chat

## License

MIT

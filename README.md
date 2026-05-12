# Security Deposit Recovery Browser Extension

Manifest V3 Chrome/Edge extension for US renters preparing a local security deposit demand letter.

## Commands

```bash
npm install
npm run dev
npm run build
npm run build:zip
```

## Load in Chrome or Edge

1. Run `npm run build`.
2. Open `chrome://extensions` or `edge://extensions`.
3. Enable developer mode.
4. Choose "Load unpacked".
5. Select the `dist` directory.

## Publish Package

Run `npm run build:zip`, then upload `security-deposit-recovery.zip` to the Chrome Web Store Developer Dashboard.

All case data stays in `chrome.storage.local`. The extension does not use AI, remote APIs, authentication, analytics, or backend services.

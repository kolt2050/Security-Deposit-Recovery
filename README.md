# Security Deposit Recovery

Security Deposit Recovery is a local browser extension for Chrome and Edge that helps US renters prepare a security deposit case summary and downloadable demand letter PDF.

The extension is document preparation software. It is not legal advice.

## What It Does

- Reviews security deposit return deadlines for all 50 US states.
- Calculates the return deadline from the move-out date.
- Guides the renter through deposit, landlord action, evidence, contact, and refund details.
- Shows a readiness checklist and case review notes.
- Evaluates the case locally as `STRONG`, `MODERATE`, or `WEAK`.
- Generates a downloadable PDF demand letter.
- Saves progress locally in browser extension storage.
- Shows optional browser notifications for follow-up reminders.

## Privacy

All logic runs locally inside the extension.

The extension does not use:

- AI or LLM APIs
- backend servers
- authentication
- analytics
- remote storage
- third-party network requests
- email sending
- payment processing
- court filing automation

Case data is stored only in `chrome.storage.local`.

## Tech Stack

- Manifest V3
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Zod
- pdf-lib
- date-fns

## Development

Install dependencies:

```bash
npm install
```

Run the Vite dev server:

```bash
npm run dev
```

Build the extension:

```bash
npm run build
```

Create a Chrome Web Store ZIP package:

```bash
npm run build:zip
```

The ZIP file is generated as:

```text
security-deposit-recovery.zip
```

## Load Locally

1. Run `npm run build`.
2. Open `chrome://extensions` or `edge://extensions`.
3. Enable Developer mode.
4. Click "Load unpacked".
5. Select the `dist` directory.

## Project Structure

```text
src/
  background/   Manifest V3 service worker
  components/   Shared React UI components
  data/         State rules and questionnaire metadata
  lib/          Evaluation, PDF, storage, validation, notifications
  options/      Extension options page
  popup/        Browser action popup
  types/        Shared TypeScript types
  wizard/       Main case review application

docs/           Static privacy policy page for publishing
template/       Chrome Web Store listing copy and policy templates
public/icons/   Extension icons
```

## Chrome Web Store Materials

Submission copy is in:

```text
template/chrome-web-store-submission.md
```

Privacy policy page:

```text
docs/privacy-policy.html
```

Before submitting, publish the `docs/` folder with GitHub Pages or another static host, then replace the placeholder privacy policy URL in `template/chrome-web-store-submission.md`.

## Legal Disclaimer

This extension provides document preparation assistance and informational guidance only. It is not legal advice and does not create an attorney-client relationship. Users should verify current state and local law before relying on generated documents.

# Chrome Web Store Submission Notes

Use this document as copy-ready text for the Chrome Web Store Developer Dashboard.

## Extension Package

Upload the production ZIP generated from the `dist/` folder:

```text
security-deposit-recovery.zip
```

## Privacy Policy URL

After publishing the `docs/` folder with GitHub Pages or another static host, use:

```text
https://YOUR_DOMAIN_OR_GITHUB_PAGES_URL/privacy-policy.html
```

## Short Description

```text
Prepare a local security deposit case review and demand letter PDF for all 50 US states.
```

## Detailed Description

```text
Security Deposit Recovery helps renters organize a security deposit dispute and generate a downloadable demand letter PDF.

The extension runs fully inside the browser. It guides the user through deposit details, move-out dates, landlord actions, evidence tracking, contact details, and refund instructions. It then evaluates the case with deterministic state deadline rules for all 50 US states and produces a local case summary, readiness checklist, deadline calculator, recommended next steps, and a PDF demand letter.

This extension is document preparation software and informational guidance only. It is not legal advice, does not provide attorney services, and does not file claims or contact landlords.

No account, backend, analytics, AI, LLM API, OCR, payment processing, email sending, remote storage, or court filing automation is used.
```

## Single Purpose Statement

```text
The extension has one purpose: help renters locally prepare a security deposit case summary and downloadable demand letter PDF using user-entered information and deterministic state deadline rules.
```

## Permission Justifications

### `storage`

```text
Required to save questionnaire progress, completed case data, and notification preferences locally in Chrome extension storage.
```

### `downloads`

```text
Required to let the user download the locally generated security deposit demand letter PDF.
```

### `notifications`

```text
Required to show optional local reminders after PDF generation and follow-up reminders about the deposit claim.
```

## Data Usage Disclosure

The extension stores the following data locally in Chrome extension storage:

- selected state;
- deposit amount and monthly rent;
- lease and move-out dates;
- landlord return and itemized statement details;
- evidence checklist selections;
- tenant, landlord, property, email, and refund instruction details;
- notification preferences.

Suggested disclosure:

```text
The extension stores user-entered case details locally in Chrome extension storage. This data is used only to preserve progress, evaluate the case with local deterministic rules, and generate a demand letter PDF on the user's device. The extension does not sell, transfer, or use this data for advertising, analytics, or unrelated purposes.
```

## Third-Party Requests Disclosure

```text
The extension does not make third-party network requests.
```

## Remote Code Disclosure

```text
No remote code is loaded or executed. All JavaScript, rules, validation, and PDF generation code is bundled with the extension package.
```

## Privacy Practices Summary

```text
Security Deposit Recovery does not collect data for tracking or advertising. Case information remains in local browser extension storage and is used only for document preparation, local case evaluation, PDF generation, and optional reminders.
```

## Legal Disclaimer

```text
This extension provides document preparation assistance and informational guidance only. It is not legal advice and does not create an attorney-client relationship.
```

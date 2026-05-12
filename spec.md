IMPLEMENTATION SPEC — Security Deposit Recovery Browser Extension
Project goal

Build a production-ready browser extension for Chrome/Edge (Manifest V3) that helps US renters recover withheld security deposits.

The extension must guide users through a structured questionnaire, evaluate eligibility using deterministic state rules, and generate downloadable PDF demand letters.

NO AI.
NO LLM APIs.
NO backend.

All logic must run locally inside the extension.

Product concept

Flow:

User opens extension → completes wizard questionnaire → rules engine evaluates case → extension generates downloadable PDF demand letter.

This is document automation software, not legal advice.

Core MVP features

Must implement:

browser extension popup UI
full-page wizard flow
state-specific rules engine
eligibility evaluation
PDF demand letter generation
local persistence
browser notifications
downloadable documents
case summary screen

Must NOT implement:

AI integrations
chatbot
OCR
payment processing
authentication
backend APIs
email sending
court filing automation
remote storage
Target browsers

Required:

Google Chrome
Microsoft Edge

Extension standard:

Manifest V3
Tech stack

Required:

React
TypeScript
Vite
Tailwind CSS
Zustand
Zod
pdf-lib
date-fns

Do NOT use:

Redux
Firebase
Supabase
Next.js
backend server
OpenAI APIs
Extension architecture

Project structure:

/src
  /popup
    index.html
    main.tsx
    App.tsx

  /wizard
    index.html
    main.tsx
    WizardApp.tsx

  /options
    index.html
    main.tsx

  /background
    service-worker.ts

  /components
    Button.tsx
    Card.tsx
    ProgressBar.tsx
    QuestionRenderer.tsx
    PdfDownloadButton.tsx
    NotificationBanner.tsx

  /lib
    evaluator.ts
    pdf.ts
    templates.ts
    validation.ts
    notifications.ts
    storage.ts

  /data
    stateRules.ts
    questions.ts

  /types
    case.ts
    rules.ts
    evaluation.ts

manifest.json
vite.config.ts
tailwind.config.js
package.json
Manifest requirements

Create Manifest V3 config.

Required permissions:

[
  "storage",
  "downloads",
  "notifications"
]

Optional permissions:

[
  "activeTab"
]

No broad host permissions.

No content script required for MVP.

Extension UX flow
Entry point

User clicks extension icon.

Popup UI opens.

Popup content:

Headline:

Recover your security deposit

CTA button:

Start case review

Action:
opens full-page extension wizard.

Wizard flow

Route:
extension internal page

Example:

chrome-extension://<id>/wizard/index.html

Multi-step wizard.

Required steps:

State selection
Deposit details
Move-out details
Landlord actions
Evidence checklist
Contact details
Review
Results

Progress bar required.

Back/Next navigation required.

Save progress automatically.

Questionnaire schema
Step 1 — State

Fields:

state: "CA" | "TX" | "NY"

Required.

MVP only supports:

California
Texas
New York
Step 2 — Deposit details

Fields:

depositAmount: number
monthlyRent: number

Validation:

required
positive numbers only
Step 3 — Move-out details

Fields:

moveOutDate: string
leaseStartDate?: string

Validation:

valid date
moveOutDate must not be future date
Step 4 — Landlord actions

Fields:

depositReturned: boolean
returnedAmount?: number
itemizedStatementReceived: boolean
statementReceivedDate?: string
deductionReason?: string

Conditional validation required.

Step 5 — Evidence

Checklist only.

Fields:

hasLease: boolean
hasMoveInPhotos: boolean
hasMoveOutPhotos: boolean
hasMessages: boolean
hasReceipts: boolean

No actual file uploads in MVP.

Checkbox tracking only.

Step 6 — Contact details

Fields:

tenantName: string
landlordName: string
propertyAddress: string
tenantEmail: string

Validation:

required
email format validation
Type definitions

Exact required type:

export type CaseData = {
  state: "CA" | "TX" | "NY";
  depositAmount: number;
  monthlyRent: number;
  moveOutDate: string;
  leaseStartDate?: string;
  depositReturned: boolean;
  returnedAmount?: number;
  itemizedStatementReceived: boolean;
  statementReceivedDate?: string;
  deductionReason?: string;
  hasLease: boolean;
  hasMoveInPhotos: boolean;
  hasMoveOutPhotos: boolean;
  hasMessages: boolean;
  hasReceipts: boolean;
  tenantName: string;
  landlordName: string;
  propertyAddress: string;
  tenantEmail: string;
};
Storage

Use:

chrome.storage.local

Storage key:

deposit_recovery_case

Persist:

questionnaire progress
completed case
notification preferences

Handle corrupted storage safely.

Rules engine

Deterministic only.

No AI inference.

State rules:

CA = {
  deadlineDays: 21,
  itemizedRequired: true,
  penaltyMultiplier: 2
}
TX = {
  deadlineDays: 30,
  itemizedRequired: true,
  penaltyMultiplier: 1
}
NY = {
  deadlineDays: 14,
  itemizedRequired: true,
  penaltyMultiplier: 2
}
Evaluation engine

Implement:

evaluateCase(caseData): EvaluationResult

Return type:

type CaseStrength =
  | "STRONG"
  | "MODERATE"
  | "WEAK";

Result:

type EvaluationResult = {
  strength: CaseStrength;
  explanation: string;
  maxPotentialClaim: number;
  violatedRules: string[];
};

Logic:

STRONG if:

deposit not returned AND deadline exceeded

OR

itemized statement required but missing

MODERATE if:

partial refund
deductions provided

WEAK if:

landlord appears compliant
Results screen

Display:

case strength
explanation
violated rules
estimated claim amount
recommended next steps
evidence checklist summary

Buttons:

Download Demand Letter PDF
Clear Case
PDF generation

Generate client-side PDF only.

Library:

pdf-lib

Filename:

security-deposit-demand-letter.pdf

PDF content:

tenant name
landlord name
property address
move out date
deposit amount
state legal deadline
violation summary
formal demand language
response deadline
Document template

Static template interpolation only.

Example:

Dear {{landlordName}},

I am writing regarding the return of my security deposit for the property located at {{propertyAddress}}.

I vacated the premises on {{moveOutDate}}.

Under {{state}} law, landlords are required to return security deposits within {{deadlineDays}} days.

As of today, I have not received the required return and/or itemized statement.

I demand payment of ${{depositAmount}} within 7 days.
Notifications

Use:

chrome.notifications

Features:

optional reminder after PDF generation
follow-up reminder after 7 days

Example messages:

Follow up with your landlord regarding your deposit claim.
Popup requirements

Popup must:

show CTA
show saved progress if exists
allow reopening existing case

Buttons:

Start case review
Continue case

Popup max width:

400px
UI requirements

Must be:

responsive
keyboard accessible
lightweight
clean SaaS style

Required:

disabled invalid buttons
loading states
validation messages

No heavy animations.

Error handling

Handle:

invalid form input
corrupted chrome storage
PDF generation failure
notification permission denied
unsupported browser APIs

No crashes.

Legal disclaimer

Show globally:

This extension provides document preparation assistance and informational guidance only. It is not legal advice.
Security requirements

Must:

run fully local
no remote API calls
no external script loading
sanitize template values
strict TypeScript mode
no eval()
Acceptance criteria

Project complete only if:

✅ installs as Chrome extension
✅ installs as Edge extension
✅ popup opens correctly
✅ wizard navigation works
✅ form validation works
✅ chrome.storage persistence works
✅ rules engine evaluates correctly
✅ PDF downloads correctly
✅ notifications work
✅ no TypeScript errors
✅ no console errors
✅ production build succeeds

Build commands
npm install
npm run dev
npm run build
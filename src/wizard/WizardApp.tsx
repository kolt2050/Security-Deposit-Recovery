import { addDays, differenceInCalendarDays, format, isValid, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { stateRules } from "../data/stateRules";
import { evaluateCase } from "../lib/evaluator";
import { clearStoredCase } from "../lib/storage";
import { fieldErrors, validateCase } from "../lib/validation";
import type { CaseData, CaseDraft } from "../types/case";
import type { EvaluationResult } from "../types/evaluation";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { NotificationBanner } from "../components/NotificationBanner";
import { PdfDownloadButton } from "../components/PdfDownloadButton";
import { questionStepIds, QuestionRenderer } from "../components/QuestionRenderer";
import { useWizardStore } from "./store";

const stepFields: Record<string, Array<keyof CaseData>> = {
  state: ["state"],
  deposit: ["depositAmount", "monthlyRent"],
  moveOut: ["moveOutDate", "leaseStartDate"],
  landlord: [
    "depositReturned",
    "returnedAmount",
    "itemizedStatementReceived",
    "statementReceivedDate",
    "statementDeductionAmount",
    "statementDetails",
    "deductionReason"
  ],
  evidence: ["hasLease", "hasMoveInPhotos", "hasMoveOutPhotos", "hasMessages", "hasReceipts"],
  contact: ["tenantName", "landlordName", "propertyAddress", "tenantEmail", "refundBankAccount", "refundMailingAddress"]
};

const defaults: CaseDraft = {
  depositReturned: false,
  itemizedStatementReceived: false,
  hasLease: false,
  hasMoveInPhotos: false,
  hasMoveOutPhotos: false,
  hasMessages: false,
  hasReceipts: false,
  refundMailingAddress: ""
};

const testCaseDraft: CaseDraft = {
  state: "CA",
  depositAmount: 2400,
  monthlyRent: 2200,
  moveOutDate: "2026-03-15",
  leaseStartDate: "2024-03-01",
  depositReturned: true,
  returnedAmount: 600,
  itemizedStatementReceived: true,
  statementReceivedDate: "2026-04-20",
  statementDeductionAmount: 1800,
  statementDetails: "Cleaning fee: $450; repainting: $900; carpet replacement: $450. No receipts were attached.",
  deductionReason: "Landlord mentioned cleaning and repainting but did not provide receipts or an itemized statement.",
  refundBankAccount: "Test IBAN US00 0000 0000 0000 0000",
  refundMailingAddress: "123 Tenant Street, Apt 4B, Los Angeles, CA 90012",
  hasLease: true,
  hasMoveInPhotos: true,
  hasMoveOutPhotos: true,
  hasMessages: true,
  hasReceipts: false,
  tenantName: "Alex Tenant",
  landlordName: "Sample Property Management LLC",
  propertyAddress: "500 Sample Avenue, Los Angeles, CA 90012",
  tenantEmail: "alex.tenant@example.com"
};

function errorsForStep(errors: Record<string, string>, stepId: string): Record<string, string> {
  const allowed = stepFields[stepId] ?? [];
  return Object.fromEntries(Object.entries(errors).filter(([key]) => allowed.includes(key as keyof CaseData)));
}

function formatMoney(value: number | undefined): string {
  return Number.isFinite(value) ? `$${Number(value).toFixed(2)}` : "Not provided";
}

function getDeadlineInfo(draft: CaseDraft) {
  if (!draft.state || !draft.moveOutDate || !stateRules[draft.state]) {
    return undefined;
  }

  const moveOutDate = parseISO(draft.moveOutDate);
  if (!isValid(moveOutDate)) {
    return undefined;
  }

  const rule = stateRules[draft.state];
  const deadlineDate = addDays(moveOutDate, rule.deadlineDays);
  const daysFromToday = differenceInCalendarDays(deadlineDate, new Date());

  return {
    rule,
    deadlineDate,
    daysFromToday,
    status:
      daysFromToday < 0
        ? `${Math.abs(daysFromToday)} day(s) overdue`
        : daysFromToday === 0
          ? "Deadline is today"
          : `${daysFromToday} day(s) remaining`
  };
}

function getReadinessItems(draft: CaseDraft, caseData?: CaseData) {
  const evidenceCount = [
    draft.hasLease,
    draft.hasMoveInPhotos,
    draft.hasMoveOutPhotos,
    draft.hasMessages,
    draft.hasReceipts
  ].filter(Boolean).length;

  return [
    {
      label: "Case details",
      ready: Boolean(draft.state && draft.depositAmount && draft.monthlyRent && draft.moveOutDate)
    },
    {
      label: "Landlord actions",
      ready: typeof draft.depositReturned === "boolean" && typeof draft.itemizedStatementReceived === "boolean"
    },
    {
      label: "Evidence checklist",
      ready: evidenceCount >= 2
    },
    {
      label: "Refund instructions",
      ready: Boolean(draft.refundMailingAddress || draft.refundBankAccount)
    },
    {
      label: "Demand letter",
      ready: Boolean(caseData)
    }
  ];
}

function getReviewInsights(caseData: CaseData, evaluation: EvaluationResult) {
  const looksGood: string[] = [];
  const needsAttention: string[] = [];
  const optionalHelpful: string[] = [];

  if (evaluation.violatedRules.length > 0) {
    looksGood.push("The case has a clear rule issue to cite in the demand letter.");
  }

  if (caseData.refundMailingAddress) {
    looksGood.push("A mailing address for payment is included.");
  }

  if (!caseData.hasLease) {
    needsAttention.push("Add or locate the lease if possible.");
  }

  if (!caseData.hasMoveOutPhotos) {
    needsAttention.push("Move-out photos can help rebut damage claims.");
  }

  if (!caseData.hasMessages) {
    optionalHelpful.push("Messages with the landlord can support timeline and notice facts.");
  }

  if (!caseData.hasReceipts) {
    optionalHelpful.push("Receipts or repair records may help challenge deductions.");
  }

  if (!caseData.refundBankAccount) {
    optionalHelpful.push("Bank account / IBAN is optional if mailing address is enough.");
  }

  if (caseData.itemizedStatementReceived && !caseData.statementDetails) {
    needsAttention.push("The itemized statement is marked received, but the deduction details are missing.");
  }

  return { looksGood, needsAttention, optionalHelpful };
}

function ReadinessChecklist({ draft, caseData }: { draft: CaseDraft; caseData?: CaseData }) {
  const items = getReadinessItems(draft, caseData);
  const readyCount = items.filter((item) => item.ready).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Readiness checklist</h2>
          <p className="mt-1 text-sm text-slate-600">
            {readyCount} of {items.length} ready
          </p>
        </div>
        <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{Math.round((readyCount / items.length) * 100)}%</span>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.label} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
            <span className={item.ready ? "font-semibold text-success" : "font-semibold text-slate-500"}>{item.ready ? "Ready" : "Missing"}</span>{" "}
            {item.label}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function DeadlineCalculator({ draft }: { draft: CaseDraft }) {
  const deadline = getDeadlineInfo(draft);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-950">Deadline calculator</h2>
      {deadline ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-xs font-semibold uppercase text-slate-500">State deadline</p>
            <p className="mt-1 text-sm text-slate-950">
              {deadline.rule.label}: {deadline.rule.deadlineDays} days
            </p>
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-xs font-semibold uppercase text-slate-500">Return due date</p>
            <p className="mt-1 text-sm text-slate-950">{format(deadline.deadlineDate, "MMM d, yyyy")}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
            <p className={`mt-1 text-sm font-semibold ${deadline.daysFromToday < 0 ? "text-danger" : "text-success"}`}>{deadline.status}</p>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-600">Select a state and move-out date to calculate the legal return deadline.</p>
      )}
    </Card>
  );
}

function ReviewInsights({ caseData, evaluation }: { caseData: CaseData; evaluation: EvaluationResult }) {
  const insights = getReviewInsights(caseData, evaluation);
  const groups = [
    ["Looks good", insights.looksGood, "text-success"],
    ["Needs attention", insights.needsAttention, "text-danger"],
    ["Optional but helpful", insights.optionalHelpful, "text-warning"]
  ] as const;

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-950">Case review</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {groups.map(([title, items, color]) => (
          <div key={title} className="rounded-md border border-slate-200 p-3">
            <h3 className={`text-sm font-semibold ${color}`}>{title}</h3>
            {items.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                {
                  {
                    "Looks good": "Complete the form to see strengths here.",
                    "Needs attention": "No required issues found right now.",
                    "Optional but helpful": "No optional suggestions right now."
                  }[title]
                }
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function ReviewList({ caseData }: { caseData: CaseData }) {
  const rule = stateRules[caseData.state];
  const rows = [
    ["State", rule.label],
    ["Deposit", formatMoney(caseData.depositAmount)],
    ["Monthly rent", formatMoney(caseData.monthlyRent)],
    ["Move-out date", caseData.moveOutDate],
    ["Deposit returned", caseData.depositReturned ? "Yes" : "No"],
    ["Returned amount", formatMoney(caseData.returnedAmount ?? 0)],
    ["Itemized statement", caseData.itemizedStatementReceived ? "Received" : "Not received"],
    ["Statement deduction amount", caseData.itemizedStatementReceived ? formatMoney(caseData.statementDeductionAmount) : "Not applicable"],
    ["Statement details", caseData.statementDetails || "Not provided"],
    ["Tenant", caseData.tenantName],
    ["Landlord", caseData.landlordName],
    ["Property", caseData.propertyAddress],
    ["Bank account / IBAN", caseData.refundBankAccount || "Not provided"],
    ["Mailing address for refund", caseData.refundMailingAddress]
  ];

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-md border border-slate-200 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
          <dd className="mt-1 text-sm text-slate-950">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function EvidenceSummary({ caseData }: { caseData: CaseData }) {
  const items = [
    ["Lease", caseData.hasLease],
    ["Move-in photos", caseData.hasMoveInPhotos],
    ["Move-out photos", caseData.hasMoveOutPhotos],
    ["Messages", caseData.hasMessages],
    ["Receipts", caseData.hasReceipts]
  ];

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map(([label, present]) => (
        <li key={String(label)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <span className={present ? "font-semibold text-success" : "font-semibold text-slate-500"}>{present ? "Available" : "Missing"}</span>{" "}
          {label}
        </li>
      ))}
    </ul>
  );
}

function ResultsScreen({ caseData, evaluation, onClear }: { caseData: CaseData; evaluation: EvaluationResult; onClear: () => void }) {
  const strengthClass =
    evaluation.strength === "STRONG" ? "text-success" : evaluation.strength === "MODERATE" ? "text-warning" : "text-slate-600";

  return (
    <div className="space-y-5">
      <Card>
        <div className="space-y-3">
          <p className={`text-sm font-bold uppercase tracking-wide ${strengthClass}`}>{evaluation.strength} case</p>
          <h2 className="text-2xl font-bold text-slate-950">Estimated claim: ${evaluation.maxPotentialClaim.toFixed(2)}</h2>
          <p className="text-slate-700">{evaluation.explanation}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Likely next step</p>
              <p className="mt-1 text-sm text-slate-950">Send a written demand letter.</p>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Confidence driver</p>
              <p className="mt-1 text-sm text-slate-950">{evaluation.violatedRules.length ? "Deadline or itemization issue" : "Documentation dependent"}</p>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Local only</p>
              <p className="mt-1 text-sm text-slate-950">No account or remote upload.</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-950">Violated rules</h3>
            {evaluation.violatedRules.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {evaluation.violatedRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No clear deadline or itemized-statement violation was detected.</p>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-semibold text-slate-950">Follow-up plan</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Download and review the demand letter.</li>
          <li>Send it by a trackable method such as certified mail or a logged email thread.</li>
          <li>Save proof of delivery and a copy of everything sent.</li>
          <li>Follow up after 7 days if there is no response.</li>
          <li>Consider small claims options if the landlord still does not respond.</li>
        </ol>
      </Card>

      <ReviewInsights caseData={caseData} evaluation={evaluation} />

      <Card>
        <h3 className="mb-3 text-lg font-semibold text-slate-950">Evidence summary</h3>
        <EvidenceSummary caseData={caseData} />
      </Card>

      <div className="flex flex-wrap gap-3">
        <PdfDownloadButton caseData={caseData} evaluation={evaluation} />
        <Button variant="danger" onClick={onClear}>
          Clear Case
        </Button>
      </div>
    </div>
  );
}

export function WizardApp() {
  const { draft, completedCase, hydrated, hydrate, updateDraft, complete } = useWizardStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const mergedDraft = useMemo(() => ({ ...defaults, ...draft }), [draft]);
  const fullValidation = validateCase(mergedDraft);
  const caseData = fullValidation.success ? fullValidation.data : completedCase;
  const evaluation = caseData ? evaluateCase(caseData) : undefined;
  const allErrors = fullValidation.success ? {} : fieldErrors(fullValidation.error);

  async function clearCase() {
    await clearStoredCase();
    window.location.reload();
  }

  async function generateResults() {
    const parsed = validateCase(mergedDraft);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setShowResults(false);
      return;
    }
    setErrors({});
    await complete(parsed.data);
    setShowResults(true);
  }

  function fillTestCase() {
    updateDraft(testCaseDraft);
    setErrors({});
    setShowResults(false);
  }

  if (!hydrated) {
    return <main className="p-6 text-slate-700">Loading case...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <header className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Security Deposit Recovery</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Case review</h1>
            <p className="mt-2 text-slate-600">Fill out the case details, then generate your eligibility summary and demand letter.</p>
          </div>
          <NotificationBanner />
        </header>

        {showResults && caseData && evaluation ? (
          <ResultsScreen caseData={caseData} evaluation={evaluation} onClear={clearCase} />
        ) : (
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <DeadlineCalculator draft={mergedDraft} />
              <ReadinessChecklist draft={mergedDraft} caseData={caseData} />
            </div>

            {questionStepIds.map((stepId) => (
              <Card key={stepId}>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-950">
                    {
                      {
                        state: "State",
                        deposit: "Deposit details",
                        moveOut: "Move-out details",
                        landlord: "Landlord actions",
                        evidence: "Evidence",
                        contact: "Contact and refund details"
                      }[stepId]
                    }
                  </h2>
                </div>
                <QuestionRenderer draft={mergedDraft} errors={{ ...allErrors, ...errorsForStep(errors, stepId) }} update={updateDraft} stepId={stepId} />
              </Card>
            ))}

            {caseData ? (
              <>
                {evaluation ? <ReviewInsights caseData={caseData} evaluation={evaluation} /> : null}
                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-slate-950">Summary</h2>
                  <ReviewList caseData={caseData} />
                </Card>
              </>
            ) : errors && Object.keys(errors).length > 0 ? (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-danger">Please fix the highlighted fields before generating results.</p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button onClick={generateResults}>Generate Results</Button>
              <Button variant="secondary" onClick={fillTestCase}>
                Fill Test Data
              </Button>
              <Button variant="secondary" onClick={clearCase}>
                Clear Case
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

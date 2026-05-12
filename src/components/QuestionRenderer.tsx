import { format } from "date-fns";
import { stateRules } from "../data/stateRules";
import type { CaseDraft } from "../types/case";

type QuestionRendererProps = {
  draft: CaseDraft;
  errors: Record<string, string>;
  update: (patch: CaseDraft) => void;
  stepId: string;
};

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
const labelClass = "block text-sm font-medium text-slate-800";
const todayInputValue = format(new Date(), "yyyy-MM-dd");

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-sm text-danger">{message}</p> : null;
}

function HelpTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-bold leading-none text-slate-600"
        aria-label={text}
      >
        ?
      </button>
      <span className="pointer-events-none absolute left-1/2 top-6 z-20 hidden w-64 -translate-x-1/2 rounded-md border border-slate-200 bg-slate-950 px-3 py-2 text-xs font-normal leading-snug text-white shadow-soft group-focus-within:block group-hover:block">
        {text}
      </span>
    </span>
  );
}

function LabelText({ children, help }: { children: string; help: string }) {
  return (
    <span>
      {children}
      <HelpTip text={help} />
    </span>
  );
}

function parseOptionalNumber(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export function QuestionRenderer({ draft, errors, update, stepId }: QuestionRendererProps) {
  if (stepId === "state") {
    return (
      <label className={labelClass}>
        <LabelText help="The state where the rental property is located. This controls the deadline and rule calculation.">Rental property state</LabelText>
        <select className={inputClass} value={draft.state ?? ""} onChange={(event) => update({ state: event.target.value as CaseDraft["state"] })}>
          <option value="">Select a state</option>
          {Object.values(stateRules)
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((rule) => (
              <option key={rule.state} value={rule.state}>
                {rule.label}
              </option>
            ))}
        </select>
        <ErrorText message={errors.state} />
      </label>
    );
  }

  if (stepId === "deposit") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          <LabelText help="The total security deposit you paid at the beginning of the lease, not including monthly rent.">Security deposit amount</LabelText>
          <input className={inputClass} type="number" min="0" value={draft.depositAmount ?? ""} onChange={(event) => update({ depositAmount: parseOptionalNumber(event.target.value) })} />
          <ErrorText message={errors.depositAmount} />
        </label>
        <label className={labelClass}>
          <LabelText help="Your regular monthly rent amount. This helps keep the case summary complete.">Monthly rent</LabelText>
          <input className={inputClass} type="number" min="0" value={draft.monthlyRent ?? ""} onChange={(event) => update({ monthlyRent: parseOptionalNumber(event.target.value) })} />
          <ErrorText message={errors.monthlyRent} />
        </label>
      </div>
    );
  }

  if (stepId === "moveOut") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          <LabelText help="The date you gave up possession or moved out. State return deadlines are usually counted from this date.">Move-out date</LabelText>
          <input className={inputClass} type="date" max={todayInputValue} value={draft.moveOutDate ?? ""} onChange={(event) => update({ moveOutDate: event.target.value })} />
          <ErrorText message={errors.moveOutDate} />
        </label>
        <label className={labelClass}>
          <LabelText help="The date your lease began. This is optional but helps identify the rental period.">Lease start date</LabelText>
          <input
            className={inputClass}
            type="date"
            max={draft.moveOutDate || todayInputValue}
            value={draft.leaseStartDate ?? ""}
            onChange={(event) => update({ leaseStartDate: event.target.value || undefined })}
          />
          <ErrorText message={errors.leaseStartDate} />
        </label>
      </div>
    );
  }

  if (stepId === "landlord") {
    return (
      <div className="space-y-4">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
          <input type="checkbox" checked={draft.depositReturned ?? false} onChange={(event) => update({ depositReturned: event.target.checked })} />
          <span>
            Deposit was returned
            <HelpTip text="Check this if the landlord returned any part of the security deposit." />
          </span>
        </label>
        {draft.depositReturned ? (
          <label className={labelClass}>
            <LabelText help="The amount of deposit money the landlord already returned to you.">Returned amount</LabelText>
            <input className={inputClass} type="number" min="0" value={draft.returnedAmount ?? ""} onChange={(event) => update({ returnedAmount: parseOptionalNumber(event.target.value) })} />
            <ErrorText message={errors.returnedAmount} />
          </label>
        ) : null}
        <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            checked={draft.itemizedStatementReceived ?? false}
            onChange={(event) => update({ itemizedStatementReceived: event.target.checked })}
          />
          <span>
            Itemized statement received
            <HelpTip text="Check this if the landlord sent a written list explaining deductions or charges taken from the deposit." />
          </span>
        </label>
        {draft.itemizedStatementReceived ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <LabelText help="The date you received the written itemized statement from the landlord.">Statement received date</LabelText>
              <input
                className={inputClass}
                type="date"
                max={todayInputValue}
                value={draft.statementReceivedDate ?? ""}
                onChange={(event) => update({ statementReceivedDate: event.target.value || undefined })}
              />
              <ErrorText message={errors.statementReceivedDate} />
            </label>
            <label className={labelClass}>
              <LabelText help="The total amount the landlord says was deducted in the itemized statement.">Deductions listed in statement</LabelText>
              <input
                className={inputClass}
                type="number"
                min="0"
                value={draft.statementDeductionAmount ?? ""}
                onChange={(event) => update({ statementDeductionAmount: parseOptionalNumber(event.target.value) })}
              />
              <ErrorText message={errors.statementDeductionAmount} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              <LabelText help="Briefly describe the deductions listed, such as cleaning, repairs, unpaid rent, or other charges.">Statement details</LabelText>
              <textarea className={inputClass} value={draft.statementDetails ?? ""} rows={3} onChange={(event) => update({ statementDetails: event.target.value })} />
              <ErrorText message={errors.statementDetails} />
            </label>
          </div>
        ) : null}
        <label className={labelClass}>
          <LabelText help="Any reason the landlord gave for keeping money, even if it was informal or sent by text/email.">Deduction reason</LabelText>
          <textarea className={inputClass} value={draft.deductionReason ?? ""} rows={3} onChange={(event) => update({ deductionReason: event.target.value })} />
        </label>
      </div>
    );
  }

  if (stepId === "evidence") {
    type EvidenceKey = "hasLease" | "hasMoveInPhotos" | "hasMoveOutPhotos" | "hasMessages" | "hasReceipts";
    const helpByKey: Record<EvidenceKey, string> = {
      hasLease: "A lease helps show the deposit amount, address, parties, and rental terms.",
      hasMoveInPhotos: "Move-in photos can show what condition the property was in before you lived there.",
      hasMoveOutPhotos: "Move-out photos can help prove the condition when you left.",
      hasMessages: "Messages can show notices, promises, deadlines, and landlord responses.",
      hasReceipts: "Receipts can help challenge deductions or prove payments and repairs."
    };
    const items: Array<[EvidenceKey, string]> = [
      ["hasLease", "Lease agreement"],
      ["hasMoveInPhotos", "Move-in photos"],
      ["hasMoveOutPhotos", "Move-out photos"],
      ["hasMessages", "Messages with landlord"],
      ["hasReceipts", "Receipts or repair records"]
    ];

    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 rounded-md border border-slate-200 p-3 text-sm font-medium text-slate-800">
            <input type="checkbox" checked={Boolean(draft[key])} onChange={(event) => update({ [key]: event.target.checked })} />
            <span>
              {label}
              <HelpTip text={helpByKey[key]} />
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (stepId === "contact") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          <LabelText help="Your legal name as it should appear in the demand letter.">Tenant name</LabelText>
          <input className={inputClass} value={draft.tenantName ?? ""} onChange={(event) => update({ tenantName: event.target.value })} />
          <ErrorText message={errors.tenantName} />
        </label>
        <label className={labelClass}>
          <LabelText help="The landlord, property manager, or company that should receive the demand letter.">Landlord name</LabelText>
          <input className={inputClass} value={draft.landlordName ?? ""} onChange={(event) => update({ landlordName: event.target.value })} />
          <ErrorText message={errors.landlordName} />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          <LabelText help="The rental property address connected to this security deposit.">Property address</LabelText>
          <input className={inputClass} value={draft.propertyAddress ?? ""} onChange={(event) => update({ propertyAddress: event.target.value })} />
          <ErrorText message={errors.propertyAddress} />
        </label>
        <label className={labelClass}>
          <LabelText help="Your email address for the letter and case record.">Tenant email</LabelText>
          <input className={inputClass} type="email" value={draft.tenantEmail ?? ""} onChange={(event) => update({ tenantEmail: event.target.value })} />
          <ErrorText message={errors.tenantEmail} />
        </label>
        <label className={labelClass}>
          <LabelText help="Optional payment details if you want to offer an electronic refund method.">Bank account / IBAN for refund</LabelText>
          <input className={inputClass} value={draft.refundBankAccount ?? ""} onChange={(event) => update({ refundBankAccount: event.target.value || undefined })} />
          <ErrorText message={errors.refundBankAccount} />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          <LabelText help="The address where the landlord can mail a check or written response.">Mailing address for refund</LabelText>
          <textarea className={inputClass} value={draft.refundMailingAddress ?? ""} rows={3} onChange={(event) => update({ refundMailingAddress: event.target.value })} />
          <ErrorText message={errors.refundMailingAddress} />
        </label>
      </div>
    );
  }

  return null;
}

export const questionStepIds = ["state", "deposit", "moveOut", "landlord", "evidence", "contact"] as const;

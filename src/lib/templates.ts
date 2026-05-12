import { addDays, format, parseISO } from "date-fns";
import { stateRules } from "../data/stateRules";
import type { CaseData } from "../types/case";
import type { EvaluationResult } from "../types/evaluation";

export function sanitizeTemplateValue(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

export function buildDemandLetter(caseData: CaseData, evaluation: EvaluationResult, today = new Date()): string[] {
  const rule = stateRules[caseData.state];
  const responseDeadline = format(addDays(today, 7), "MMMM d, yyyy");
  const moveOutDate = format(parseISO(caseData.moveOutDate), "MMMM d, yyyy");
  const tenantName = sanitizeTemplateValue(caseData.tenantName);
  const landlordName = sanitizeTemplateValue(caseData.landlordName);
  const propertyAddress = sanitizeTemplateValue(caseData.propertyAddress);
  const refundBankAccount = caseData.refundBankAccount ? sanitizeTemplateValue(caseData.refundBankAccount) : "";
  const refundMailingAddress = sanitizeTemplateValue(caseData.refundMailingAddress);
  const violationSummary = evaluation.violatedRules.length
    ? evaluation.violatedRules.join(" ")
    : "My records indicate that the security deposit remains unresolved.";
  const statementSummary = caseData.itemizedStatementReceived
    ? `I received an itemized statement on ${caseData.statementReceivedDate}. It lists $${(caseData.statementDeductionAmount ?? 0).toFixed(
        2
      )} in deductions: ${sanitizeTemplateValue(caseData.statementDetails ?? "")}`
    : "I have not received the required itemized statement.";

  return [
    format(today, "MMMM d, yyyy"),
    "",
    `Dear ${landlordName},`,
    "",
    `I am writing regarding the return of my security deposit for the property located at ${propertyAddress}.`,
    `I vacated the premises on ${moveOutDate}.`,
    `Under ${rule.label} law, landlords are required to return security deposits within ${rule.deadlineDays} days.`,
    "",
    `Deposit amount: $${caseData.depositAmount.toFixed(2)}`,
    `Amount returned: $${(caseData.returnedAmount ?? 0).toFixed(2)}`,
    statementSummary,
    "",
    violationSummary,
    "",
    `I demand payment of $${Math.max(caseData.depositAmount - (caseData.returnedAmount ?? 0), 0).toFixed(
      2
    )} within 7 days, no later than ${responseDeadline}.`,
    `Please return the funds by mail to: ${refundMailingAddress}.`,
    refundBankAccount ? `Alternatively, payment may be sent to this bank account / IBAN: ${refundBankAccount}.` : "",
    "",
    "This letter is sent to preserve my rights and request prompt resolution.",
    "",
    "Sincerely,",
    tenantName,
    caseData.tenantEmail
  ];
}

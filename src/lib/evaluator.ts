import { addDays, differenceInCalendarDays, isAfter, parseISO } from "date-fns";
import { stateRules } from "../data/stateRules";
import type { CaseData } from "../types/case";
import type { EvaluationResult } from "../types/evaluation";

export function evaluateCase(caseData: CaseData, today = new Date()): EvaluationResult {
  const rule = stateRules[caseData.state];
  const moveOutDate = parseISO(caseData.moveOutDate);
  const deadlineDate = addDays(moveOutDate, rule.deadlineDays);
  const deadlineExceeded = isAfter(today, deadlineDate);
  const violatedRules: string[] = [];
  const returnedAmount = caseData.returnedAmount ?? 0;
  const unpaidDeposit = Math.max(caseData.depositAmount - returnedAmount, 0);
  const partialRefund = caseData.depositReturned && returnedAmount < caseData.depositAmount;

  if (!caseData.depositReturned && deadlineExceeded) {
    violatedRules.push(`${rule.label} ${rule.deadlineDays}-day return deadline appears exceeded.`);
  }

  if (rule.itemizedRequired && !caseData.itemizedStatementReceived && deadlineExceeded) {
    violatedRules.push(`${rule.label} requires an itemized statement when deductions are withheld.`);
  }

  if (partialRefund && caseData.deductionReason) {
    violatedRules.push("Deposit was only partially returned; deductions should be documented and lawful.");
  }

  const maxPotentialClaim = Math.round(unpaidDeposit + caseData.depositAmount * rule.penaltyMultiplier);

  if ((!caseData.depositReturned && deadlineExceeded) || (rule.itemizedRequired && !caseData.itemizedStatementReceived && deadlineExceeded)) {
    return {
      strength: "STRONG",
      explanation: `The ${rule.label} deadline appears to have passed by ${Math.max(
        differenceInCalendarDays(today, deadlineDate),
        0
      )} day(s), and required payment or documentation may be missing.`,
      maxPotentialClaim,
      violatedRules
    };
  }

  if (partialRefund || caseData.deductionReason) {
    return {
      strength: "MODERATE",
      explanation:
        "The landlord returned part of the deposit or provided deductions. The claim may depend on whether the deductions are supported.",
      maxPotentialClaim,
      violatedRules
    };
  }

  return {
    strength: "WEAK",
    explanation:
      "Based on the answers provided, the landlord appears closer to compliance. Keep records and follow up if the deadline has not passed.",
    maxPotentialClaim: unpaidDeposit,
    violatedRules
  };
}

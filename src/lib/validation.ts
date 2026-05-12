import { isFuture, isValid, parseISO } from "date-fns";
import { z } from "zod";
import { supportedStateCodes, type CaseData } from "../types/case";

const optionalDate = z
  .string()
  .optional()
  .refine((value) => !value || isValid(parseISO(value)), "Enter a valid date.");

const optionalPastOrTodayDate = optionalDate.refine(
  (value) => !value || !isFuture(parseISO(value)),
  "Date cannot be in the future."
);

const requiredPastOrTodayDate = z
  .string()
  .min(1, "Move-out date is required.")
  .refine((value) => isValid(parseISO(value)), "Enter a valid date.")
  .refine((value) => !isFuture(parseISO(value)), "Move-out date cannot be in the future.");

const money = z.coerce
  .number({ invalid_type_error: "Enter a valid amount." })
  .finite("Enter a valid amount.")
  .positive("Enter a positive number.");

const optionalMoney = z.coerce
  .number({ invalid_type_error: "Enter a valid amount." })
  .finite("Enter a valid amount.")
  .nonnegative("Amount cannot be negative.")
  .optional();

export const caseSchema: z.ZodType<CaseData> = z
  .object({
    state: z.enum(supportedStateCodes, { required_error: "Select a supported state." }),
    depositAmount: money,
    monthlyRent: money,
    moveOutDate: requiredPastOrTodayDate,
    leaseStartDate: optionalDate,
    depositReturned: z.boolean(),
    returnedAmount: optionalMoney,
    itemizedStatementReceived: z.boolean(),
    statementReceivedDate: optionalPastOrTodayDate,
    statementDeductionAmount: optionalMoney,
    statementDetails: z.string().trim().optional(),
    deductionReason: z.string().trim().optional(),
    refundBankAccount: z.string().trim().optional(),
    refundMailingAddress: z.string().trim().min(1, "Mailing address for refund is required."),
    hasLease: z.boolean(),
    hasMoveInPhotos: z.boolean(),
    hasMoveOutPhotos: z.boolean(),
    hasMessages: z.boolean(),
    hasReceipts: z.boolean(),
    tenantName: z.string().trim().min(1, "Tenant name is required."),
    landlordName: z.string().trim().min(1, "Landlord name is required."),
    propertyAddress: z.string().trim().min(1, "Property address is required."),
    tenantEmail: z.string().trim().email("Enter a valid email address.")
  })
  .superRefine((data, context) => {
    if (data.depositReturned && data.returnedAmount === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnedAmount"],
        message: "Enter the amount returned."
      });
    }

    if (data.returnedAmount !== undefined && data.returnedAmount > data.depositAmount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnedAmount"],
        message: "Returned amount cannot exceed deposit amount."
      });
    }

    if (data.leaseStartDate) {
      const leaseStartDate = parseISO(data.leaseStartDate);
      const moveOutDate = parseISO(data.moveOutDate);
      if (isFuture(leaseStartDate)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leaseStartDate"],
          message: "Lease start date cannot be in the future."
        });
      }
      if (isValid(leaseStartDate) && isValid(moveOutDate) && leaseStartDate > moveOutDate) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leaseStartDate"],
          message: "Lease start date cannot be after move-out date."
        });
      }
    }

    if (data.itemizedStatementReceived && !data.statementReceivedDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["statementReceivedDate"],
        message: "Enter the statement received date."
      });
    }

    if (data.itemizedStatementReceived && data.statementDeductionAmount === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["statementDeductionAmount"],
        message: "Enter the deduction amount listed in the statement."
      });
    }

    if (data.itemizedStatementReceived && !data.statementDetails) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["statementDetails"],
        message: "Describe the deductions listed in the itemized statement."
      });
    }
  });

export function validateCase(data: unknown) {
  return caseSchema.safeParse(data);
}

export function fieldErrors(error: z.ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((errors, issue) => {
    const key = String(issue.path[0] ?? "form");
    errors[key] = issue.message;
    return errors;
  }, {});
}

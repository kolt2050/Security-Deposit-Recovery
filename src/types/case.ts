export const supportedStateCodes = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY"
] as const;

export type SupportedState = (typeof supportedStateCodes)[number];

export type CaseData = {
  state: SupportedState;
  depositAmount: number;
  monthlyRent: number;
  moveOutDate: string;
  leaseStartDate?: string;
  depositReturned: boolean;
  returnedAmount?: number;
  itemizedStatementReceived: boolean;
  statementReceivedDate?: string;
  statementDeductionAmount?: number;
  statementDetails?: string;
  deductionReason?: string;
  refundBankAccount?: string;
  refundMailingAddress: string;
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

export type CaseDraft = Partial<CaseData>;

export type StoredCase = {
  draft: CaseDraft;
  currentStep: number;
  completedCase?: CaseData;
  notificationPreferences: {
    followUpReminders: boolean;
  };
};

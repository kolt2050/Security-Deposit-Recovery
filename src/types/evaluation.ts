export type CaseStrength = "STRONG" | "MODERATE" | "WEAK";

export type EvaluationResult = {
  strength: CaseStrength;
  explanation: string;
  maxPotentialClaim: number;
  violatedRules: string[];
};

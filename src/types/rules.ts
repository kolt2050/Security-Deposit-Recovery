import type { SupportedState } from "./case";

export type StateRule = {
  state: SupportedState;
  label: string;
  deadlineDays: number;
  itemizedRequired: boolean;
  penaltyMultiplier: number;
};

export type WizardStepId =
  | "state"
  | "deposit"
  | "moveOut"
  | "landlord"
  | "evidence"
  | "contact"
  | "review"
  | "results";

export type WizardStep = {
  id: WizardStepId;
  title: string;
  description: string;
};

export const wizardSteps: WizardStep[] = [
  {
    id: "state",
    title: "State selection",
    description: "Choose the state where the rental property is located."
  },
  {
    id: "deposit",
    title: "Deposit details",
    description: "Enter the security deposit and monthly rent amounts."
  },
  {
    id: "moveOut",
    title: "Move-out details",
    description: "Tell us when you left the property."
  },
  {
    id: "landlord",
    title: "Landlord actions",
    description: "Record what your landlord returned or sent."
  },
  {
    id: "evidence",
    title: "Evidence checklist",
    description: "Track the documents and records you already have."
  },
  {
    id: "contact",
    title: "Contact details",
    description: "Add the names and property address for the letter."
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm the case information before generating results."
  },
  {
    id: "results",
    title: "Results",
    description: "Review case strength and download your demand letter."
  }
];

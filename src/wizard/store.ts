import { create } from "zustand";
import type { CaseData, CaseDraft, StoredCase } from "../types/case";
import { loadStoredCase, saveCompletedCase, updateStoredDraft } from "../lib/storage";

type WizardStore = {
  draft: CaseDraft;
  currentStep: number;
  completedCase?: CaseData;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  updateDraft: (patch: CaseDraft) => void;
  setStep: (step: number) => void;
  complete: (caseData: CaseData) => Promise<void>;
};

function applyStoredCase(stored: StoredCase) {
  return {
    draft: stored.completedCase ?? stored.draft,
    currentStep: stored.currentStep,
    completedCase: stored.completedCase,
    hydrated: true
  };
}

export const useWizardStore = create<WizardStore>((set, get) => ({
  draft: {},
  currentStep: 0,
  hydrated: false,
  async hydrate() {
    try {
      const stored = await loadStoredCase();
      set(applyStoredCase(stored));
    } catch {
      set({ draft: {}, currentStep: 0, completedCase: undefined, hydrated: true });
    }
  },
  updateDraft(patch) {
    const next = { ...get().draft, ...patch };
    set({ draft: next });
    void updateStoredDraft(next, get().currentStep).catch(() => undefined);
  },
  setStep(step) {
    set({ currentStep: step });
    void updateStoredDraft(get().draft, step).catch(() => undefined);
  },
  async complete(caseData) {
    await saveCompletedCase(caseData);
    set({ draft: caseData, completedCase: caseData, currentStep: 7 });
  }
}));

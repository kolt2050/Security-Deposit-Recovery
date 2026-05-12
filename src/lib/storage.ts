import type { CaseData, CaseDraft, StoredCase } from "../types/case";
import { validateCase } from "./validation";

export const STORAGE_KEY = "deposit_recovery_case";

const defaultStoredCase: StoredCase = {
  draft: {},
  currentStep: 0,
  notificationPreferences: {
    followUpReminders: true
  }
};

function sanitizeForStorage<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForStorage(item)).filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, sanitizeForStorage(entry)])
        .filter(([, entry]) => entry !== undefined)
    ) as T;
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    return undefined as T;
  }

  return value;
}

function sanitizeDraft(draft: CaseDraft | undefined): CaseDraft {
  return sanitizeForStorage(draft ?? {});
}

function hasChromeStorage(): boolean {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

export async function loadStoredCase(): Promise<StoredCase> {
  if (!hasChromeStorage()) {
    return defaultStoredCase;
  }

  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const stored = result[STORAGE_KEY] as Partial<StoredCase> | undefined;
    if (!stored || typeof stored !== "object") {
      return defaultStoredCase;
    }

    const draft = sanitizeDraft(stored.draft);
    const completedCase = stored.completedCase && validateCase(sanitizeForStorage(stored.completedCase)).success ? sanitizeForStorage(stored.completedCase) : undefined;

    return {
      draft,
      currentStep: Number.isInteger(stored.currentStep) ? Number(stored.currentStep) : 0,
      completedCase,
      notificationPreferences: {
        followUpReminders: stored.notificationPreferences?.followUpReminders ?? true
      }
    };
  } catch {
    await clearStoredCase();
    return defaultStoredCase;
  }
}

export async function saveStoredCase(data: StoredCase): Promise<void> {
  if (!hasChromeStorage()) {
    return;
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: sanitizeForStorage(data) });
}

export async function updateStoredDraft(draft: CaseDraft, currentStep: number): Promise<void> {
  const stored = await loadStoredCase();
  await saveStoredCase({
    ...stored,
    draft: sanitizeDraft(draft),
    currentStep
  });
}

export async function saveCompletedCase(completedCase: CaseData): Promise<void> {
  const stored = await loadStoredCase();
  await saveStoredCase({
    ...stored,
    draft: sanitizeForStorage(completedCase),
    currentStep: 7,
    completedCase: sanitizeForStorage(completedCase)
  });
}

export async function clearStoredCase(): Promise<void> {
  if (!hasChromeStorage()) {
    return;
  }

  await chrome.storage.local.remove(STORAGE_KEY);
}

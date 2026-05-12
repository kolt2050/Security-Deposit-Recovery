import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { NotificationBanner } from "../components/NotificationBanner";
import { loadStoredCase } from "../lib/storage";
import type { StoredCase } from "../types/case";

function openWizard() {
  const url = chrome.runtime.getURL("src/wizard/index.html");
  void chrome.tabs.create({ url });
}

export function App() {
  const [stored, setStored] = useState<StoredCase | null>(null);

  useEffect(() => {
    void loadStoredCase().then(setStored);
  }, []);

  const hasProgress = stored ? Object.keys(stored.draft).length > 0 || Boolean(stored.completedCase) : false;

  return (
    <main className="w-[400px] max-w-full bg-slate-50 p-4">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Security Deposit Recovery</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">Recover your security deposit</h1>
          <p className="mt-2 text-sm text-slate-600">Build a local case summary and downloadable demand letter.</p>
        </div>

        <NotificationBanner />

        <div className="grid gap-2">
          <Button onClick={openWizard}>Start case review</Button>
          {hasProgress ? (
            <Button variant="secondary" onClick={openWizard}>
              Continue case
            </Button>
          ) : null}
        </div>
      </div>
    </main>
  );
}

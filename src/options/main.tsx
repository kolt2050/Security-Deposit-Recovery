import React from "react";
import ReactDOM from "react-dom/client";
import "../styles.css";
import { Card } from "../components/Card";
import { NotificationBanner } from "../components/NotificationBanner";

function OptionsApp() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl space-y-5">
        <h1 className="text-2xl font-bold text-slate-950">Security Deposit Recovery Options</h1>
        <NotificationBanner />
        <Card>
          <h2 className="text-lg font-semibold text-slate-950">Privacy</h2>
          <p className="mt-2 text-sm text-slate-700">
            Case data is stored only in local browser extension storage. No remote APIs, accounts, or backend services are used.
          </p>
        </Card>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>
);

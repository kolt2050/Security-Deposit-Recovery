import { useState } from "react";
import { downloadPdf, generateDemandLetterPdf } from "../lib/pdf";
import { scheduleFollowUpReminder, showNotification } from "../lib/notifications";
import type { CaseData } from "../types/case";
import type { EvaluationResult } from "../types/evaluation";
import { Button } from "./Button";

export function PdfDownloadButton({ caseData, evaluation }: { caseData: CaseData; evaluation: EvaluationResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setLoading(true);
    setError("");

    try {
      const bytes = await generateDemandLetterPdf(caseData, evaluation);
      await downloadPdf(bytes);
      await showNotification("Demand letter generated", "Your security deposit demand letter is ready.");
      await scheduleFollowUpReminder();
    } catch {
      setError("PDF generation failed. Please review the case details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleDownload} loading={loading}>
        Download Demand Letter PDF
      </Button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}

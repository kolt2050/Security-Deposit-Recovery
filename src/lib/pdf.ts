import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { CaseData } from "../types/case";
import type { EvaluationResult } from "../types/evaluation";
import { buildDemandLetter } from "./templates";

export const DEMAND_LETTER_FILENAME = "security-deposit-demand-letter.pdf";

function wrapText(text: string, maxChars: number): string[] {
  if (!text) {
    return [""];
  }

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

export async function generateDemandLetterPdf(caseData: CaseData, evaluation: EvaluationResult): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const margin = 64;
  const lineHeight = 16;
  let y = 728;

  page.drawText("Security Deposit Demand Letter", {
    x: margin,
    y,
    size: 16,
    font: bold,
    color: rgb(0.09, 0.13, 0.18)
  });
  y -= 32;

  for (const paragraph of buildDemandLetter(caseData, evaluation)) {
    const lines = wrapText(paragraph, 78);
    for (const line of lines) {
      if (y < 72) {
        page = pdfDoc.addPage([612, 792]);
        y = 728;
      }
      page.drawText(line, {
        x: margin,
        y,
        size: 11,
        font,
        color: rgb(0.09, 0.13, 0.18)
      });
      y -= lineHeight;
    }
  }

  y -= 16;
  if (y < 72) {
    page = pdfDoc.addPage([612, 792]);
    y = 728;
  }
  page.drawText("Informational notice: This document is not legal advice.", {
    x: margin,
    y,
    size: 9,
    font,
    color: rgb(0.35, 0.39, 0.45)
  });

  return pdfDoc.save();
}

export async function downloadPdf(bytes: Uint8Array): Promise<void> {
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  try {
    if (typeof chrome !== "undefined" && chrome.downloads) {
      await chrome.downloads.download({
        url,
        filename: DEMAND_LETTER_FILENAME,
        saveAs: true
      });
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = DEMAND_LETTER_FILENAME;
    link.click();
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

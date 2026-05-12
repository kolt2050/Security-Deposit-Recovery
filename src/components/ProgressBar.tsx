export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = Math.round(((current + 1) / total) * 100);

  return (
    <div aria-label="Wizard progress">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>
          Step {current + 1} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

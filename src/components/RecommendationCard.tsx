import { useState } from "react";
import type { Recommendation } from "../lib/advisor";
import { cn } from "../utils/cn";

const RANK_LABELS = ["Top match", "Runner-up", "Alternative"];

export default function RecommendationCard({
  rec,
  rank,
}: {
  rec: Recommendation;
  rank: number;
}) {
  const [open, setOpen] = useState(rank === 0);
  const { material, score } = rec;

  return (
    <div
      className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
      style={{ borderColor: rank === 0 ? material.color : "#e5e7eb" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: material.color }}
        >
          #{rank + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900">{material.name}</h3>
          </div>
          <p className="truncate text-xs text-slate-500">
            {RANK_LABELS[rank] ?? "Candidate"} · {material.family}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold" style={{ color: material.color }}>
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-slate-400">match</span>
        </div>
      </button>

      <div className="px-4 pb-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${score}%`, backgroundColor: material.color }}
          />
        </div>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 p-4 pt-2">
            <p className="text-sm text-slate-600">{material.description}</p>

            {rec.reasons.length > 0 && (
              <div className="space-y-1">
                {rec.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                    <span className="mt-0.5">✓</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}

            {rec.warnings.length > 0 && (
              <div className="space-y-1">
                {rec.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-amber-700">
                    <span className="mt-0.5">⚠</span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <Stat label="Strength" value={`${material.tensileStrength} MPa`} />
              <Stat label="Cost" value={`$${material.costPerKg.toFixed(1)}/kg`} />
              <Stat label="Max temp" value={`${material.tempResistance}°C`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 py-2">
      <div className="text-sm font-semibold text-slate-800">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}

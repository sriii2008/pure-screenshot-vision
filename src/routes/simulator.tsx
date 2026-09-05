import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell, Panel, StatusPill } from "@/components/rail/Shell";
import { weeklyBlocks, weekDays, departmentBar, departmentColor } from "@/lib/rail-data";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "What-If Simulator — Rail Optimizer" },
      {
        name: "description",
        content:
          "Adjust maintenance duration, priority weighting, block window and train constraints to preview the resulting optimized schedule.",
      },
      { property: "og:title", content: "What-If Simulator — Rail Optimizer" },
      { property: "og:description", content: "Preview how duration, priority and window changes reshape the optimized plan." },
    ],
  }),
  component: Simulator,
});

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-fog">{label}</span>
        <span className="font-mono text-mint">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-foreground/10 accent-mint"
      />
    </div>
  );
}

function Simulator() {
  const [durationScale, setDurationScale] = useState(100);
  const [priorityWeight, setPriorityWeight] = useState(50);
  const [windowStart, setWindowStart] = useState(0);
  const [windowEnd, setWindowEnd] = useState(24);
  const [maxTrains, setMaxTrains] = useState(12);

  const result = useMemo(() => {
    return weeklyBlocks
      .map((b) => {
        const dur = Math.max(1, Math.round(((b.end - b.start) * durationScale) / 100));
        let start = Math.max(b.start, windowStart);
        if (start + dur > windowEnd) start = Math.max(windowStart, windowEnd - dur);
        const end = Math.min(windowEnd, start + dur);
        const feasible = end - start >= dur && b.trainsAffected <= maxTrains;
        const score = Math.round(b.priority * (0.5 + priorityWeight / 100) - b.trainsAffected * 2);
        return { ...b, simStart: start, simEnd: end, feasible, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [durationScale, priorityWeight, windowStart, windowEnd, maxTrains]);

  const deferred = result.filter((r) => !r.feasible).length;
  const totalHours = result.filter((r) => r.feasible).reduce((s, r) => s + (r.simEnd - r.simStart), 0);
  const trains = result.filter((r) => r.feasible).reduce((s, r) => s + r.trainsAffected, 0);

  return (
    <Shell title="What-If Simulator" subtitle="Adjust constraints and preview the re-optimized plan before submitting for approval">
      <section className="grid grid-cols-3 gap-4">
        <Panel title="Parameters">
          <div className="space-y-5">
            <Slider label="Maintenance duration" value={durationScale} min={50} max={150} step={5} suffix="%" onChange={setDurationScale} />
            <Slider label="Priority weighting" value={priorityWeight} min={0} max={100} step={5} suffix="%" onChange={setPriorityWeight} />
            <Slider label="Block window start" value={windowStart} min={0} max={20} suffix=":00" onChange={(v) => setWindowStart(Math.min(v, windowEnd - 2))} />
            <Slider label="Block window end" value={windowEnd} min={4} max={24} suffix=":00" onChange={(v) => setWindowEnd(Math.max(v, windowStart + 2))} />
            <Slider label="Max services affected" value={maxTrains} min={0} max={20} suffix=" trains" onChange={setMaxTrains} />
          </div>
          <div className="mt-6 space-y-2 border-t border-line pt-4 text-xs">
            <div className="flex justify-between">
              <span className="text-fog">Possession hours</span>
              <span className="font-mono">{totalHours}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fog">Services affected</span>
              <span className="font-mono text-gold">{trains}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fog">Deferred blocks</span>
              <span className={`font-mono ${deferred ? "text-rose" : "text-mint"}`}>{deferred}</span>
            </div>
          </div>
        </Panel>

        <Panel className="col-span-2" title="Resulting optimized schedule" right={<span className="font-mono text-[11px] text-gold">Simulation only · not submitted</span>}>
          <div className="space-y-2">
            {result.map((b) => (
              <div key={b.id} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-3 text-xs">
                  <div className="font-medium">{b.activity}</div>
                  <div className={`font-mono text-[10px] ${departmentColor[b.department]}`}>
                    {b.department} · {b.section}
                  </div>
                </div>
                <div className="relative col-span-7 h-8 rounded-md bg-foreground/4">
                  <div
                    className={`absolute inset-y-0 flex items-center rounded px-2 font-mono text-[10px] text-primary-foreground ${
                      b.feasible ? departmentBar[b.department] : "bg-rose/50"
                    }`}
                    style={{ left: `${(b.simStart / 24) * 100}%`, width: `${((b.simEnd - b.simStart) / 24) * 100}%` }}
                  >
                    {String(b.simStart).padStart(2, "0")}:00–{String(b.simEnd).padStart(2, "0")}:00
                  </div>
                </div>
                <div className="col-span-1 text-right font-mono text-xs">{b.score}</div>
                <div className="col-span-1 text-right">
                  <StatusPill status={b.feasible ? "Scheduled" : "Conflict"} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-fog">
            Ranked by AI score · original week reference: {weekDays[0]}–{weekDays[6]}
          </p>
        </Panel>
      </section>
    </Shell>
  );
}

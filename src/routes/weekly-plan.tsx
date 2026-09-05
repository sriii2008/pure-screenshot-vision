import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Panel, StatusPill } from "@/components/rail/Shell";
import { weeklyBlocks, weekDays, departmentBar, departmentColor } from "@/lib/rail-data";

export const Route = createFileRoute("/weekly-plan")({
  head: () => ({
    meta: [
      { title: "Optimized Weekly Plan — Rail Optimizer" },
      {
        name: "description",
        content: "Hour-by-hour optimized weekly maintenance block timeline with department, section, priority and operational impact.",
      },
      { property: "og:title", content: "Optimized Weekly Plan — Rail Optimizer" },
      { property: "og:description", content: "Weekly maintenance block timeline with priority and train impact." },
    ],
  }),
  component: WeeklyPlan,
});

const hours = [0, 4, 8, 12, 16, 20, 24];

function WeeklyPlan() {
  return (
    <Shell title="Optimized Weekly Plan" subtitle="Week 34 · Mon 08 Sep – Sun 14 Sep 2025 · generated 06:15 IST">
      <Panel
        title="Block timeline"
        right={
          <div className="flex gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-mint" />Engineering</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet" />S&amp;T</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gold" />Traction</span>
          </div>
        }
      >
        <div className="mb-2 grid grid-cols-12 gap-2 font-mono text-[10px] text-fog">
          <div className="col-span-1" />
          <div className="col-span-11 flex justify-between">
            {hours.map((h) => (
              <span key={h}>{String(h).padStart(2, "0")}:00</span>
            ))}
          </div>
        </div>
        <div className="space-y-2 text-xs">
          {weekDays.map((day, dayIndex) => (
            <div key={day} className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-1 font-mono text-fog">{day}</div>
              <div className="relative col-span-11 h-10 rounded-md bg-foreground/4">
                {weeklyBlocks
                  .filter((b) => b.day === dayIndex)
                  .map((b) => (
                    <Link
                      key={b.id}
                      to="/blocks/$blockId"
                      params={{ blockId: b.id }}
                      className={`absolute inset-y-0 flex flex-col justify-center overflow-hidden rounded px-2 text-primary-foreground ${departmentBar[b.department]}`}
                      style={{ left: `${(b.start / 24) * 100}%`, width: `${((b.end - b.start) / 24) * 100}%` }}
                    >
                      <span className="truncate text-[11px] font-medium">{b.activity}</span>
                      <span className="truncate font-mono text-[10px] opacity-80">
                        {String(b.start).padStart(2, "0")}:00–{String(b.end).padStart(2, "0")}:00
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-4" title="Scheduled activities">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-fog">
              <th className="pb-2">Block</th>
              <th className="pb-2">Activity</th>
              <th className="pb-2">Department</th>
              <th className="pb-2">Section</th>
              <th className="pb-2">Day</th>
              <th className="pb-2">Start</th>
              <th className="pb-2">End</th>
              <th className="pb-2 text-right">Priority</th>
              <th className="pb-2">Operational impact</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {weeklyBlocks.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-foreground/4">
                <td className="py-2.5 font-mono">
                  <Link to="/blocks/$blockId" params={{ blockId: b.id }} className="text-mint hover:underline">
                    {b.id}
                  </Link>
                </td>
                <td className="py-2.5">{b.activity}</td>
                <td className={`py-2.5 ${departmentColor[b.department]}`}>{b.department}</td>
                <td className="py-2.5 text-fog">{b.section}</td>
                <td className="py-2.5 font-mono text-fog">{weekDays[b.day]}</td>
                <td className="py-2.5 font-mono">{String(b.start).padStart(2, "0")}:00</td>
                <td className="py-2.5 font-mono">{String(b.end).padStart(2, "0")}:00</td>
                <td className="py-2.5 text-right font-mono font-bold">{b.priority}</td>
                <td className="py-2.5 text-fog">
                  {b.impact} · {b.trainsAffected} services
                </td>
                <td className="py-2.5">
                  <StatusPill status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Shell>
  );
}

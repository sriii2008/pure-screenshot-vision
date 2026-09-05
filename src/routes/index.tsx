import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Panel, StatusPill } from "@/components/rail/Shell";
import { kpis, requests, weeklyBlocks, assets, conflicts, weekDays, departmentBar } from "@/lib/rail-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rail Optimizer — KPI Overview" },
      {
        name: "description",
        content:
          "Live overview of maintenance requests, upcoming blocks, asset availability and train operational impact across the zone.",
      },
      { property: "og:title", content: "Rail Optimizer — KPI Overview" },
      {
        property: "og:description",
        content: "Live overview of maintenance requests, blocks, asset availability and train impact.",
      },
    ],
  }),
  component: Overview,
});

const pipeline = [
  "Existing Railway Systems",
  "Data Integration",
  "AI Priority Scoring",
  "Scheduling Optimization",
  "Weekly / Monthly Plans",
  "Controller Review",
];

function Kpi({ label, value, unit, note, tone = "" }: { label: string; value: string; unit?: string; note: string; tone?: string }) {
  return (
    <div className="glass p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-fog">{label}</div>
      <div className={`mt-2 font-display text-3xl font-semibold ${tone}`}>
        {value}
        {unit && <span className="text-lg text-fog">{unit}</span>}
      </div>
      <div className="mt-2 font-mono text-xs text-fog">{note}</div>
    </div>
  );
}

function Overview() {
  return (
    <Shell title="KPI Overview" subtitle="Central Railway Zone · Week 34 · Mon 08 Sep – Sun 14 Sep 2025">
      <section className="mb-6 grid grid-cols-4 gap-4 xl:grid-cols-7">
        <Kpi label="Total Requests" value={String(kpis.totalRequests)} note="+12 this week" />
        <Kpi label="Critical" value={String(kpis.criticalRequests)} note="4 due < 24h" tone="text-rose" />
        <Kpi label="Upcoming Blocks" value={String(kpis.upcomingBlocks)} note="next 14 days" />
        <Kpi label="Asset Availability" value={String(kpis.assetAvailability)} unit="%" note="zone fleet" tone="text-mint" />
        <Kpi label="Block Productivity" value={String(kpis.blockProductivity)} unit="%" note="target 80%" />
        <Kpi label="Train Impact" value={String(kpis.trainImpactMinutes)} note="delay min / week" tone="text-gold" />
        <Kpi label="Completion Rate" value={String(kpis.completionRate)} unit="%" note="closed / total" />
      </section>

      <Panel className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fog">Planning pipeline</span>
          <span className="font-mono text-[10px] text-gold">AI outputs pending controller approval</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {pipeline.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span
                className={`rounded-lg px-3 py-2 ${
                  i === 5 ? "bg-gold/15 text-gold" : i === 2 || i === 3 ? "bg-mint/15 text-mint" : "bg-foreground/5 text-fog"
                }`}
              >
                {step}
              </span>
              {i < pipeline.length - 1 && <span className="font-mono text-fog">→</span>}
            </span>
          ))}
        </div>
      </Panel>

      <section className="grid grid-cols-3 gap-4">
        <Panel
          className="col-span-2"
          title="Optimized Weekly Block Timeline"
          right={
            <div className="flex gap-4 font-mono text-[11px]">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-mint" />Engineering</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet" />S&amp;T</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gold" />Traction</span>
            </div>
          }
        >
          <div className="space-y-2 text-xs">
            {weekDays.map((day, dayIndex) => (
              <div key={day} className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-1 font-mono text-fog">{day.slice(0, 3)}</div>
                <div className="relative col-span-11 h-8 rounded-md bg-foreground/4">
                  {weeklyBlocks
                    .filter((b) => b.day === dayIndex)
                    .map((b) => (
                      <Link
                        key={b.id}
                        to="/blocks/$blockId"
                        params={{ blockId: b.id }}
                        className={`absolute inset-y-0 flex items-center overflow-hidden rounded px-2 font-mono text-[10px] text-primary-foreground ${departmentBar[b.department]}`}
                        style={{ left: `${(b.start / 24) * 100}%`, width: `${((b.end - b.start) / 24) * 100}%` }}
                      >
                        {b.activity}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Asset Availability">
          <div className="space-y-4 text-xs">
            {assets.slice(0, 5).map((a) => (
              <div key={a.name}>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-fog">{a.name}</span>
                  <span className={`font-mono ${a.availability < 40 ? "text-rose" : a.availability < 60 ? "text-gold" : "text-mint"}`}>
                    {a.availability}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-foreground/8">
                  <div
                    className={`h-full rounded-full ${a.availability < 60 ? "grad-warn" : "grad-primary"}`}
                    style={{ width: `${a.availability}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-4">
        <Panel
          className="col-span-2"
          title="Maintenance Requests"
          right={
            <Link to="/requests" className="font-mono text-xs text-mint hover:underline">
              View all {kpis.totalRequests} →
            </Link>
          }
        >
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-fog">
                <th className="pb-2">ID</th>
                <th className="pb-2">Asset</th>
                <th className="pb-2">Dept</th>
                <th className="pb-2">Section</th>
                <th className="pb-2">Priority</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {requests.slice(0, 5).map((r) => (
                <tr key={r.id}>
                  <td className="py-2.5 font-mono text-fog">{r.id}</td>
                  <td className="py-2.5 font-mono">{r.assetId}</td>
                  <td className="py-2.5 text-fog">{r.department}</td>
                  <td className="py-2.5 text-fog">{r.section}</td>
                  <td className="py-2.5 font-mono">{r.priority}</td>
                  <td className="py-2.5"><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Coordination Conflicts">
          <div className="space-y-3">
            {conflicts.map((c) => (
              <div
                key={c.id}
                className={`rounded-lg border-l-2 bg-foreground/4 p-3 ${c.severity === "High" ? "border-rose" : "border-gold"}`}
              >
                <div className="text-xs font-medium">{c.title}</div>
                <div className="mt-1 text-[11px] text-fog">{c.detail}</div>
                <Link to="/coordination" className="mt-2 inline-block font-mono text-[11px] text-mint hover:underline">
                  Review →
                </Link>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </Shell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Panel, StatusPill } from "@/components/rail/Shell";
import { conflicts, coordinatedBlocks, weeklyBlocks, weekDays, departmentColor, departmentBar } from "@/lib/rail-data";

export const Route = createFileRoute("/coordination")({
  head: () => ({
    meta: [
      { title: "Department Coordination — Rail Optimizer" },
      {
        name: "description",
        content: "Engineering, S&T and Traction requests side by side with highlighted conflicts and coordinated joint blocks.",
      },
      { property: "og:title", content: "Department Coordination — Rail Optimizer" },
      { property: "og:description", content: "Conflicts and coordinated blocks across Engineering, S&T and Traction." },
    ],
  }),
  component: Coordination,
});

const depts = ["Engineering", "S&T", "Traction"] as const;

function Coordination() {
  return (
    <Shell title="Department Coordination" subtitle="Cross-department block requests, detected conflicts and merged possessions">
      <section className="grid grid-cols-3 gap-4">
        {depts.map((d) => (
          <Panel key={d} title={d} right={<span className={`font-mono text-[11px] ${departmentColor[d]}`}>{weeklyBlocks.filter((b) => b.department === d).length} blocks</span>}>
            <div className="space-y-2">
              {weeklyBlocks
                .filter((b) => b.department === d)
                .map((b) => (
                  <Link
                    key={b.id}
                    to="/blocks/$blockId"
                    params={{ blockId: b.id }}
                    className="block rounded-lg bg-foreground/4 p-3 transition-colors hover:bg-foreground/8"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{b.activity}</span>
                      <StatusPill status={b.status} />
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-fog">
                      {b.section} · {weekDays[b.day]} · {String(b.start).padStart(2, "0")}:00–{String(b.end).padStart(2, "0")}:00
                    </div>
                  </Link>
                ))}
            </div>
          </Panel>
        ))}
      </section>

      <section className="mt-4 grid grid-cols-2 gap-4">
        <Panel title="Detected conflicts">
          <div className="space-y-3">
            {conflicts.map((c) => (
              <div key={c.id} className={`rounded-lg border-l-2 bg-foreground/4 p-3 ${c.severity === "High" ? "border-rose" : "border-gold"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{c.title}</span>
                  <span className={`font-mono text-[10px] ${c.severity === "High" ? "text-rose" : "text-gold"}`}>{c.severity}</span>
                </div>
                <div className="mt-1 text-[11px] text-fog">{c.detail}</div>
                <div className="mt-2 flex gap-3">
                  {c.blocks.map((b) => (
                    <Link key={b} to="/blocks/$blockId" params={{ blockId: b }} className="font-mono text-[11px] text-mint hover:underline">
                      {b} →
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Coordinated blocks">
          <div className="space-y-3">
            {coordinatedBlocks.map((c) => (
              <div key={c.id} className="rounded-lg border-l-2 border-mint bg-foreground/4 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{c.section}</span>
                  <span className="font-mono text-[10px] text-mint">{c.saving}</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-fog">{c.window}</div>
                <div className="mt-2 flex gap-2">
                  {c.departments.map((d) => (
                    <span key={d} className={`rounded-full px-2 py-0.5 text-[10px] text-primary-foreground ${departmentBar[d as (typeof depts)[number]]}`}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </Shell>
  );
}

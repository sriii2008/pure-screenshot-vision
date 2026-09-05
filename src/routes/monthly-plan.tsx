import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel } from "@/components/rail/Shell";
import { monthlyPlan, departmentBar, departmentColor } from "@/lib/rail-data";

export const Route = createFileRoute("/monthly-plan")({
  head: () => ({
    meta: [
      { title: "Monthly Plan — Rail Optimizer" },
      {
        name: "description",
        content: "Month-wide maintenance block plan across Engineering, S&T and Traction with possession hours per department.",
      },
      { property: "og:title", content: "Monthly Plan — Rail Optimizer" },
      { property: "og:description", content: "Month-wide maintenance block plan and possession hours by department." },
    ],
  }),
  component: MonthlyPlan,
});

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MonthlyPlan() {
  const offset = 0; // 1 Sep 2025 is a Monday
  const cells = Array.from({ length: 30 }, (_, i) => i + 1);
  const totals = (["Engineering", "S&T", "Traction"] as const).map((d) => ({
    dept: d,
    hours: monthlyPlan.filter((m) => m.department === d).reduce((s, m) => s + m.hours, 0),
    count: monthlyPlan.filter((m) => m.department === d).length,
  }));

  return (
    <Shell title="Monthly Plan" subtitle="September 2025 · Mumbai–Pune corridor · 18 planned possessions">
      <section className="mb-4 grid grid-cols-3 gap-4">
        {totals.map((t) => (
          <Panel key={t.dept}>
            <div className="font-mono text-[10px] uppercase tracking-wider text-fog">{t.dept}</div>
            <div className={`mt-2 font-display text-3xl font-semibold ${departmentColor[t.dept]}`}>{t.hours}h</div>
            <div className="mt-2 font-mono text-xs text-fog">{t.count} possessions planned</div>
          </Panel>
        ))}
      </section>

      <Panel title="September block calendar">
        <div className="mb-2 grid grid-cols-7 gap-2 font-mono text-[10px] uppercase tracking-wider text-fog">
          {dayNames.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {cells.map((date) => {
            const items = monthlyPlan.filter((m) => m.date === date);
            return (
              <div key={date} className="min-h-24 rounded-lg bg-foreground/4 p-2">
                <div className="font-mono text-[10px] text-fog">{String(date).padStart(2, "0")}</div>
                <div className="mt-1 space-y-1">
                  {items.map((m) => (
                    <div
                      key={m.label}
                      className={`rounded px-1.5 py-1 text-[10px] leading-tight text-primary-foreground ${departmentBar[m.department]}`}
                    >
                      {m.label}
                      <span className="block font-mono opacity-80">{m.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </Shell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel } from "@/components/rail/Shell";
import { assets, availabilityTrend, downtimeByDept } from "@/lib/rail-data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/asset-availability")({
  head: () => ({
    meta: [
      { title: "Asset Availability — Rail Optimizer" },
      {
        name: "description",
        content: "Asset availability trends by department and maintenance-related downtime hours across the maintenance fleet.",
      },
      { property: "og:title", content: "Asset Availability — Rail Optimizer" },
      { property: "og:description", content: "Availability trends and maintenance-related downtime by department." },
    ],
  }),
  component: AssetAvailability,
});

const axis = { stroke: "var(--fog)", fontSize: 11, fontFamily: "var(--font-mono-family)" };
const tooltipStyle = {
  background: "var(--panel)",
  border: "1px solid var(--line)",
  borderRadius: "0.5rem",
  fontSize: 12,
};

function AssetAvailability() {
  return (
    <Shell title="Asset Availability" subtitle="Rolling six-week availability and maintenance downtime by department">
      <section className="grid grid-cols-3 gap-4">
        <Panel className="col-span-2" title="Availability trend (%)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={availabilityTrend}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={axis} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="engineering" name="Engineering" stroke="var(--mint)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="snt" name="S&T" stroke="var(--violet)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="traction" name="Traction" stroke="var(--gold)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Downtime hours (30 days)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={downtimeByDept}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dept" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="planned" name="Planned" fill="var(--mint)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unplanned" name="Unplanned" fill="var(--rose)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>

      <Panel className="mt-4" title="Maintenance fleet">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-fog">
              <th className="pb-2">Asset</th>
              <th className="pb-2 w-1/2">Availability</th>
              <th className="pb-2 text-right">%</th>
              <th className="pb-2 text-right">Downtime (h)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {assets.map((a) => (
              <tr key={a.name}>
                <td className="py-3">{a.name}</td>
                <td className="py-3 pr-6">
                  <div className="h-2 rounded-full bg-foreground/8">
                    <div
                      className={`h-full rounded-full ${a.availability < 60 ? "grad-warn" : "grad-primary"}`}
                      style={{ width: `${a.availability}%` }}
                    />
                  </div>
                </td>
                <td className={`py-3 text-right font-mono ${a.availability < 40 ? "text-rose" : a.availability < 60 ? "text-gold" : "text-mint"}`}>
                  {a.availability}%
                </td>
                <td className="py-3 text-right font-mono text-fog">{a.downtimeHrs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Shell>
  );
}

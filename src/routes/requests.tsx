import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Panel, StatusPill } from "@/components/rail/Shell";
import { requests, departmentColor, type Department } from "@/lib/rail-data";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "Maintenance Requests — Rail Optimizer" },
      {
        name: "description",
        content:
          "Consolidated maintenance requests from TMS, SMMS, TDMS and BDMS with severity, AI priority score, duration and deadline.",
      },
      { property: "og:title", content: "Maintenance Requests — Rail Optimizer" },
      { property: "og:description", content: "Requests from TMS, SMMS, TDMS and BDMS with AI priority scoring." },
    ],
  }),
  component: Requests,
});

const filters: (Department | "All")[] = ["All", "Engineering", "S&T", "Traction"];

function Requests() {
  const [dept, setDept] = useState<Department | "All">("All");
  const rows = requests.filter((r) => dept === "All" || r.department === dept);

  return (
    <Shell title="Maintenance Requests" subtitle="Ingested from Engineering/TMS, S&T/SMMS, Traction/TDMS and BDMS">
      <Panel
        title={`${rows.length} requests`}
        right={
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setDept(f)}
                className={`rounded-lg px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  dept === f ? "bg-foreground/10 text-foreground" : "text-fog hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-fog">
              <th className="pb-2">Asset ID</th>
              <th className="pb-2">Department</th>
              <th className="pb-2">Source</th>
              <th className="pb-2">Location</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Severity</th>
              <th className="pb-2 text-right">Priority</th>
              <th className="pb-2 text-right">Duration</th>
              <th className="pb-2">Deadline</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {rows.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-foreground/4">
                <td className="py-2.5 font-mono">{r.assetId}</td>
                <td className={`py-2.5 ${departmentColor[r.department]}`}>{r.department}</td>
                <td className="py-2.5 font-mono text-fog">{r.source}</td>
                <td className="py-2.5 text-fog">
                  {r.section} · {r.location}
                </td>
                <td className="py-2.5">{r.type}</td>
                <td className="py-2.5">
                  <span
                    className={
                      r.severity === "Critical"
                        ? "text-rose"
                        : r.severity === "High"
                          ? "text-gold"
                          : r.severity === "Medium"
                            ? "text-foreground"
                            : "text-fog"
                    }
                  >
                    {r.severity}
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono font-bold">{r.priority}</td>
                <td className="py-2.5 text-right font-mono text-fog">{r.durationHrs}h</td>
                <td className="py-2.5 font-mono text-fog">{r.deadline}</td>
                <td className="py-2.5">
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Shell>
  );
}

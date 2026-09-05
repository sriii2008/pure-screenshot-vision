import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Panel, StatusPill } from "@/components/rail/Shell";
import { weeklyBlocks, weekDays, departmentColor } from "@/lib/rail-data";

export const Route = createFileRoute("/blocks/")({
  head: () => ({
    meta: [
      { title: "Block Details — Rail Optimizer" },
      {
        name: "description",
        content: "Select a maintenance block to view its reason, affected section, duration, train impact and optimization rationale.",
      },
      { property: "og:title", content: "Block Details — Rail Optimizer" },
      { property: "og:description", content: "Reason, impact and optimization rationale for each maintenance block." },
    ],
  }),
  component: BlockList,
});

function BlockList() {
  return (
    <Shell title="Block Details" subtitle="Select a block to review its rationale, impact and approval status">
      <Panel title={`${weeklyBlocks.length} blocks this week`}>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-fog">
              <th className="pb-2">Block</th>
              <th className="pb-2">Activity</th>
              <th className="pb-2">Department</th>
              <th className="pb-2">Section</th>
              <th className="pb-2">Window</th>
              <th className="pb-2">Train impact</th>
              <th className="pb-2">Approval</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {weeklyBlocks.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-foreground/4">
                <td className="py-2.5 font-mono">{b.id}</td>
                <td className="py-2.5">{b.activity}</td>
                <td className={`py-2.5 ${departmentColor[b.department]}`}>{b.department}</td>
                <td className="py-2.5 text-fog">{b.section}</td>
                <td className="py-2.5 font-mono text-fog">
                  {weekDays[b.day]} {String(b.start).padStart(2, "0")}:00–{String(b.end).padStart(2, "0")}:00
                </td>
                <td className="py-2.5 text-fog">
                  {b.impact} · {b.trainsAffected} services
                </td>
                <td className="py-2.5">
                  <StatusPill status={b.approval} />
                </td>
                <td className="py-2.5 text-right">
                  <Link to="/blocks/$blockId" params={{ blockId: b.id }} className="font-mono text-mint hover:underline">
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Shell>
  );
}

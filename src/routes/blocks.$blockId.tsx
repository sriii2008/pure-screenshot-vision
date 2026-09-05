import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell, Panel, StatusPill } from "@/components/rail/Shell";
import { weeklyBlocks, weekDays, requests, departmentColor } from "@/lib/rail-data";

export const Route = createFileRoute("/blocks/$blockId")({
  head: ({ params }) => ({
    meta: [
      { title: `Block ${params.blockId} — Rail Optimizer` },
      {
        name: "description",
        content: `Reason, affected section, duration, train impact, optimization explanation and approval status for maintenance block ${params.blockId}.`,
      },
      { property: "og:title", content: `Block ${params.blockId} — Rail Optimizer` },
      { property: "og:description", content: `Full decision record for maintenance block ${params.blockId}.` },
    ],
  }),
  loader: ({ params }) => {
    const block = weeklyBlocks.find((b) => b.id === params.blockId);
    if (!block) throw notFound();
    return { block };
  },
  component: BlockDetail,
});

function Field({ label, value, tone = "" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg bg-foreground/4 p-3">
      <div className="font-mono text-[10px] uppercase tracking-wider text-fog">{label}</div>
      <div className={`mt-1 text-sm ${tone}`}>{value}</div>
    </div>
  );
}

function BlockDetail() {
  const { block } = Route.useLoaderData();
  const request = requests.find((r) => r.id === block.requestId);

  return (
    <Shell title={`${block.id} · ${block.activity}`} subtitle={`${block.section} · ${weekDays[block.day]} · Week 34`}>
      <Link to="/blocks" className="mb-4 inline-block font-mono text-xs text-mint hover:underline">
        ← All blocks
      </Link>

      <section className="grid grid-cols-3 gap-4">
        <Panel className="col-span-2" title="Block record" right={<StatusPill status={block.status} />}>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Department" value={block.department} tone={departmentColor[block.department]} />
            <Field label="Affected section" value={block.section} />
            <Field
              label="Duration"
              value={`${block.end - block.start}h · ${String(block.start).padStart(2, "0")}:00–${String(block.end).padStart(2, "0")}:00`}
            />
            <Field label="Priority score" value={String(block.priority)} />
            <Field label="Train impact" value={`${block.impact} · ${block.trainsAffected} services`} tone="text-gold" />
            <Field label="Source request" value={request ? `${request.id} · ${request.source}` : "—"} />
          </div>

          <div className="mt-4 rounded-lg bg-foreground/4 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-fog">Reason for block</div>
            <p className="mt-1 text-sm">{block.reason}</p>
          </div>

          <div className="mt-3 rounded-lg border-l-2 border-mint bg-foreground/4 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-mint">Optimization explanation</div>
            <p className="mt-1 text-sm">{block.explanation}</p>
          </div>
        </Panel>

        <Panel title="Approval">
          <div className="rounded-lg bg-foreground/4 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-fog">Current status</div>
            <div className="mt-2">
              <StatusPill status={block.approval} />
            </div>
            <p className="mt-3 text-[11px] text-fog">
              This schedule is an AI recommendation. Authorized railway personnel retain final authority to approve, amend or reject
              the possession.
            </p>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-fog">Raised by</span>
              <span className="font-mono">{request?.source ?? "—"}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-fog">Severity</span>
              <span className="font-mono">{request?.severity ?? "—"}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-fog">Deadline</span>
              <span className="font-mono">{request?.deadline ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fog">Asset</span>
              <span className="font-mono">{request?.assetId ?? "—"}</span>
            </div>
          </div>

          <Link to="/coordination" className="mt-4 inline-block font-mono text-xs text-mint hover:underline">
            View department coordination →
          </Link>
        </Panel>
      </section>
    </Shell>
  );
}

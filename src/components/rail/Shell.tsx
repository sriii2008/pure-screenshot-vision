import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Overview" },
  { to: "/requests", label: "Requests" },
  { to: "/weekly-plan", label: "Weekly Plan" },
  { to: "/monthly-plan", label: "Monthly Plan" },
  { to: "/asset-availability", label: "Asset Availability" },
  { to: "/simulator", label: "What-If Simulator" },
  { to: "/coordination", label: "Coordination" },
  { to: "/blocks", label: "Block Details" },
] as const;

export function Aurora() {
  return (
    <div className="aurora-field" aria-hidden>
      <div
        className="aurora-blob"
        style={{ width: 620, height: 620, top: -180, left: -120, background: "var(--mint)", opacity: 0.16 }}
      />
      <div
        className="aurora-blob"
        style={{ width: 560, height: 560, top: 120, right: -160, background: "var(--violet)", opacity: 0.16 }}
      />
      <div
        className="aurora-blob"
        style={{ width: 520, height: 520, bottom: -220, left: "30%", background: "var(--gold)", opacity: 0.1 }}
      />
    </div>
  );
}

export function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <>
      <Aurora />
      <div className="relative z-10 min-h-screen bg-background text-foreground">
        <aside className="glass fixed inset-y-0 left-0 flex w-60 flex-col gap-1 rounded-none border-y-0 border-l-0 p-5">
          <div className="mb-7 flex items-center gap-2.5 px-2">
            <div className="grad-primary grid size-9 place-items-center rounded-lg font-display font-bold text-primary-foreground">
              R
            </div>
            <div>
              <div className="font-display text-sm font-semibold leading-none tracking-tight">Rail Optimizer</div>
              <div className="mt-1 font-mono text-[10px] text-fog">DECISION SUPPORT</div>
            </div>
          </div>
          <nav className="flex flex-col gap-1 text-sm">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-lg px-3 py-2.5 text-fog transition-colors hover:bg-foreground/5 hover:text-foreground"
                activeProps={{ className: "rounded-lg px-3 py-2.5 bg-foreground/8 text-foreground font-medium" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-line pt-4">
            <div className="flex items-center gap-2.5 px-2">
              <div className="grad-warn size-8 rounded-full" />
              <div>
                <div className="text-xs font-medium">A. Verghese</div>
                <div className="font-mono text-[10px] text-fog">Zonal Planner · CR</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="px-8 pb-10 pl-68 pt-6">
          <header className="mb-7 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-1 text-sm text-fog">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="glass rounded-lg px-3 py-2 text-xs text-fog">
                Sector: <span className="font-medium text-foreground">Mumbai–Pune</span>
              </div>
              <div className="glass rounded-lg px-3 py-2 font-mono text-xs text-mint">LIVE · 09:42 IST</div>
            </div>
          </header>
          {children}
          <p className="mt-8 font-mono text-[11px] text-fog">
            AI outputs are decision support only. Final block approval rests with authorized railway personnel.
          </p>
        </main>
      </div>
    </>
  );
}

export function Panel({
  title,
  right,
  className = "",
  children,
}: {
  title?: string;
  right?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`glass p-5 ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-semibold">{title}</h2>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Conflict" || status === "Rejected"
      ? "bg-rose/15 text-rose"
      : status === "At-risk" || status === "Pending" || status === "Awaiting controller"
        ? "bg-gold/15 text-gold"
        : "bg-mint/15 text-mint";
  return (
    <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${tone}`}>{status}</span>
  );
}

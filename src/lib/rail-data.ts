export type Department = "Engineering" | "S&T" | "Traction";
export type SourceSystem = "TMS" | "SMMS" | "TDMS" | "BDMS";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type RequestStatus = "Scheduled" | "At-risk" | "Conflict" | "Pending" | "Completed";

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  department: Department;
  source: SourceSystem;
  location: string;
  section: string;
  type: string;
  severity: Severity;
  priority: number;
  durationHrs: number;
  deadline: string;
  status: RequestStatus;
}

export const requests: MaintenanceRequest[] = [
  { id: "MNT-4471", assetId: "TRK-4412", department: "Engineering", source: "TMS", location: "KM 214.7", section: "MMCT–KYN", type: "Rail grinding", severity: "Critical", priority: 96, durationHrs: 6, deadline: "2025-09-10", status: "Scheduled" },
  { id: "MNT-4468", assetId: "SIG-2207", department: "S&T", source: "SMMS", location: "KM 229.3", section: "KYN–LNL", type: "Interlocking test", severity: "High", priority: 88, durationHrs: 4, deadline: "2025-09-11", status: "At-risk" },
  { id: "MNT-4465", assetId: "OHE-0918", department: "Traction", source: "TDMS", location: "KM 188.0", section: "LNL–PUNE", type: "OHE sag correction", severity: "Critical", priority: 93, durationHrs: 8, deadline: "2025-09-09", status: "Conflict" },
  { id: "MNT-4460", assetId: "BRG-0042", department: "Engineering", source: "BDMS", location: "KM 156.9", section: "PUNE–DD", type: "Bearing replacement", severity: "Medium", priority: 64, durationHrs: 5, deadline: "2025-09-14", status: "Scheduled" },
  { id: "MNT-4457", assetId: "TRK-4488", department: "Engineering", source: "TMS", location: "KM 129.4", section: "MMCT–KYN", type: "Ballast regrading", severity: "High", priority: 81, durationHrs: 7, deadline: "2025-09-12", status: "Pending" },
  { id: "MNT-4452", assetId: "SIG-2260", department: "S&T", source: "SMMS", location: "KM 77.2", section: "KYN–LNL", type: "Axle counter swap", severity: "Medium", priority: 58, durationHrs: 3, deadline: "2025-09-16", status: "Scheduled" },
  { id: "MNT-4448", assetId: "TSS-1104", department: "Traction", source: "TDMS", location: "KM 201.5", section: "LNL–PUNE", type: "Substation breaker", severity: "High", priority: 84, durationHrs: 6, deadline: "2025-09-11", status: "At-risk" },
  { id: "MNT-4441", assetId: "TRK-4501", department: "Engineering", source: "TMS", location: "KM 243.8", section: "PUNE–DD", type: "Weld renewal", severity: "Low", priority: 39, durationHrs: 2, deadline: "2025-09-20", status: "Pending" },
  { id: "MNT-4436", assetId: "SIG-2288", department: "S&T", source: "SMMS", location: "KM 98.6", section: "MMCT–KYN", type: "Relay room audit", severity: "Medium", priority: 61, durationHrs: 4, deadline: "2025-09-17", status: "Scheduled" },
  { id: "MNT-4430", assetId: "OHE-0955", department: "Traction", source: "TDMS", location: "KM 167.1", section: "KYN–LNL", type: "Insulator cleaning", severity: "Low", priority: 34, durationHrs: 3, deadline: "2025-09-22", status: "Completed" },
  { id: "MNT-4425", assetId: "BRG-0071", department: "Engineering", source: "BDMS", location: "KM 118.2", section: "PUNE–DD", type: "Girder inspection", severity: "Medium", priority: 57, durationHrs: 4, deadline: "2025-09-19", status: "Pending" },
  { id: "MNT-4419", assetId: "TRK-4520", department: "Engineering", source: "TMS", location: "KM 265.0", section: "LNL–PUNE", type: "Tamping run", severity: "High", priority: 79, durationHrs: 6, deadline: "2025-09-13", status: "Scheduled" },
];

export interface Block {
  id: string;
  activity: string;
  department: Department;
  section: string;
  day: number; // 0 = Mon
  start: number; // hour
  end: number;
  priority: number;
  impact: "Low" | "Moderate" | "High";
  trainsAffected: number;
  status: "Scheduled" | "At-risk" | "Conflict";
  approval: "Approved" | "Awaiting controller" | "Rejected";
  reason: string;
  explanation: string;
  requestId: string;
}

export const weeklyBlocks: Block[] = [
  { id: "BLK-2201", activity: "Rail grinding", department: "Engineering", section: "MMCT–KYN", day: 0, start: 1, end: 7, priority: 96, impact: "Moderate", trainsAffected: 6, status: "Scheduled", approval: "Approved", reason: "Rolling contact fatigue detected at KM 214.7 during last USFD run.", explanation: "Placed in the 01:00–07:00 low-density window; only 6 services rescheduled, and the adjacent S&T request was merged to avoid a second possession.", requestId: "MNT-4471" },
  { id: "BLK-2202", activity: "Interlocking test", department: "S&T", section: "KYN–LNL", day: 1, start: 0, end: 4, priority: 88, impact: "Low", trainsAffected: 2, status: "At-risk", approval: "Awaiting controller", reason: "Point machine response outside tolerance on 24B.", explanation: "Scheduled ahead of deadline; crew availability is the limiting factor, so the window is flagged at-risk.", requestId: "MNT-4468" },
  { id: "BLK-2203", activity: "OHE sag correction", department: "Traction", section: "LNL–PUNE", day: 1, start: 12, end: 20, priority: 93, impact: "High", trainsAffected: 11, status: "Conflict", approval: "Awaiting controller", reason: "Contact wire height deviation over ghat gradient.", explanation: "Only feasible slot before deadline overlaps a freight path; controller must accept 11 affected services or defer to Thursday night.", requestId: "MNT-4465" },
  { id: "BLK-2204", activity: "Ballast regrading", department: "Engineering", section: "MMCT–KYN", day: 2, start: 2, end: 9, priority: 81, impact: "Moderate", trainsAffected: 5, status: "Scheduled", approval: "Approved", reason: "Ballast deficiency reported over 3.2 km stretch.", explanation: "Co-located with BLK-2201 corridor so machinery transfer time is reused.", requestId: "MNT-4457" },
  { id: "BLK-2205", activity: "Substation breaker", department: "Traction", section: "LNL–PUNE", day: 3, start: 1, end: 7, priority: 84, impact: "Moderate", trainsAffected: 4, status: "At-risk", approval: "Awaiting controller", reason: "Breaker operations count exceeded service limit.", explanation: "Requires traction power isolation; paired with S&T work on the same feeder to reduce total downtime.", requestId: "MNT-4448" },
  { id: "BLK-2206", activity: "Axle counter swap", department: "S&T", section: "KYN–LNL", day: 3, start: 13, end: 16, priority: 58, impact: "Low", trainsAffected: 1, status: "Scheduled", approval: "Approved", reason: "Intermittent reset on section 12A.", explanation: "Fitted into the mid-day traffic trough with no service cancellations.", requestId: "MNT-4452" },
  { id: "BLK-2207", activity: "Tamping run", department: "Engineering", section: "LNL–PUNE", day: 4, start: 0, end: 6, priority: 79, impact: "Moderate", trainsAffected: 5, status: "Scheduled", approval: "Approved", reason: "Track geometry index degraded to level 3.", explanation: "Machine already stabled at Lonavla, cutting mobilisation by 90 minutes.", requestId: "MNT-4419" },
  { id: "BLK-2208", activity: "Bearing replacement", department: "Engineering", section: "PUNE–DD", day: 5, start: 3, end: 8, priority: 64, impact: "Low", trainsAffected: 2, status: "Scheduled", approval: "Approved", reason: "Bridge bearing corrosion noted in BDMS inspection.", explanation: "Weekend traffic pattern gives the widest possession with least passenger impact.", requestId: "MNT-4460" },
  { id: "BLK-2209", activity: "Relay room audit", department: "S&T", section: "MMCT–KYN", day: 6, start: 2, end: 6, priority: 61, impact: "Low", trainsAffected: 1, status: "Scheduled", approval: "Approved", reason: "Statutory six-monthly relay inspection due.", explanation: "Sunday early hours; no coordination conflict with any Engineering possession.", requestId: "MNT-4436" },
];

export const weekDays = ["Mon 08", "Tue 09", "Wed 10", "Thu 11", "Fri 12", "Sat 13", "Sun 14"];

export interface MonthlyEntry {
  date: number;
  label: string;
  department: Department;
  hours: number;
}

export const monthlyPlan: MonthlyEntry[] = [
  { date: 2, label: "Tamping — MMCT–KYN", department: "Engineering", hours: 6 },
  { date: 4, label: "Relay audit — KYN", department: "S&T", hours: 4 },
  { date: 5, label: "OHE patrol — LNL", department: "Traction", hours: 5 },
  { date: 8, label: "Rail grinding — MMCT–KYN", department: "Engineering", hours: 6 },
  { date: 9, label: "Interlocking — KYN–LNL", department: "S&T", hours: 4 },
  { date: 9, label: "OHE sag — LNL–PUNE", department: "Traction", hours: 8 },
  { date: 10, label: "Ballast — MMCT–KYN", department: "Engineering", hours: 7 },
  { date: 11, label: "Breaker — LNL–PUNE", department: "Traction", hours: 6 },
  { date: 12, label: "Tamping — LNL–PUNE", department: "Engineering", hours: 6 },
  { date: 13, label: "Bearing — PUNE–DD", department: "Engineering", hours: 5 },
  { date: 14, label: "Relay room — MMCT–KYN", department: "S&T", hours: 4 },
  { date: 17, label: "Girder check — PUNE–DD", department: "Engineering", hours: 4 },
  { date: 18, label: "Axle counter — KYN–LNL", department: "S&T", hours: 3 },
  { date: 21, label: "Insulator clean — KYN–LNL", department: "Traction", hours: 3 },
  { date: 23, label: "Weld renewal — PUNE–DD", department: "Engineering", hours: 2 },
  { date: 25, label: "Signal cable — KYN", department: "S&T", hours: 5 },
  { date: 26, label: "Feeder test — LNL", department: "Traction", hours: 4 },
  { date: 29, label: "USFD run — MMCT–KYN", department: "Engineering", hours: 6 },
];

export const assets = [
  { name: "Track Tamping Machine (TT-04)", availability: 58, downtimeHrs: 74 },
  { name: "Rail Grinder (RG-11)", availability: 72, downtimeHrs: 49 },
  { name: "Ballast Regrader (BR-09)", availability: 34, downtimeHrs: 116 },
  { name: "Signal Test Rig (ST-02)", availability: 21, downtimeHrs: 138 },
  { name: "OHE Tower Wagon (TW-07)", availability: 81, downtimeHrs: 33 },
  { name: "Crew Pool A (18 techs)", availability: 81, downtimeHrs: 0 },
];

export const availabilityTrend = [
  { week: "W29", engineering: 88, snt: 84, traction: 79 },
  { week: "W30", engineering: 86, snt: 87, traction: 82 },
  { week: "W31", engineering: 90, snt: 83, traction: 85 },
  { week: "W32", engineering: 92, snt: 86, traction: 84 },
  { week: "W33", engineering: 89, snt: 90, traction: 88 },
  { week: "W34", engineering: 93, snt: 91, traction: 90 },
];

export const downtimeByDept = [
  { dept: "Engineering", planned: 62, unplanned: 18 },
  { dept: "S&T", planned: 41, unplanned: 12 },
  { dept: "Traction", planned: 55, unplanned: 21 },
];

export const conflicts = [
  { id: "CNF-01", title: "OHE sag block vs. freight path 1204", detail: "LNL–PUNE · 12:00–20:00 overlap · Traction vs. Operations", severity: "High" as const, blocks: ["BLK-2203"] },
  { id: "CNF-02", title: "Rail grinder double-booked", detail: "MMCT–KYN · 02:00–09:00 · BLK-2201 and BLK-2204 share RG-11", severity: "Medium" as const, blocks: ["BLK-2201", "BLK-2204"] },
  { id: "CNF-03", title: "Crew overtime threshold", detail: "Pool A exceeds 12h across Thursday · reassign to Pool B", severity: "Medium" as const, blocks: ["BLK-2205", "BLK-2206"] },
];

export const coordinatedBlocks = [
  { id: "CRD-11", section: "LNL–PUNE", window: "Thu 01:00–07:00", departments: ["Traction", "S&T"], saving: "3h 20m possession saved" },
  { id: "CRD-12", section: "MMCT–KYN", window: "Wed 02:00–09:00", departments: ["Engineering", "S&T"], saving: "1h 45m possession saved" },
];

export const kpis = {
  totalRequests: 428,
  criticalRequests: 17,
  upcomingBlocks: 56,
  assetAvailability: 91.4,
  blockProductivity: 78.2,
  trainImpactMinutes: 312,
  completionRate: 86.7,
};

export const departmentColor: Record<Department, string> = {
  Engineering: "text-mint",
  "S&T": "text-violet",
  Traction: "text-gold",
};

export const departmentBar: Record<Department, string> = {
  Engineering: "bg-mint/70",
  "S&T": "bg-violet/70",
  Traction: "bg-gold/70",
};

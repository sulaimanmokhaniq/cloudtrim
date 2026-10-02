// Seeded demo data: a fictional Saudi SME so the live demo never depends on a real account.

export const TEAM_NAME = "SSB";

export type Risk = "low" | "medium" | "high";

export type Finding = {
  id: string;
  category: string;
  title: string;
  resource: string;
  detail: string;
  monthlySavings: number; // SAR
  risk: Risk;
  action: string;
  permission: string; // the scoped, temporary permission this remediation requests
  safeguards: string[];
  explanation: string; // cached AI explanation, used when the live model is unavailable
};

export const company = {
  name: "Nakhla Tech (fictional)",
  employees: 120,
  provider: "AWS",
  region: "me-central-1",
  monthlySpend: 85400,
  lastScan: "12 minutes ago",
  resourcesScanned: 342,
};

export const monthlyTrend = [
  { month: "Apr", value: 61200 },
  { month: "May", value: 66800 },
  { month: "Jun", value: 70100 },
  { month: "Jul", value: 74900 },
  { month: "Aug", value: 79600 },
  { month: "Sep", value: 85400 },
  { month: "Oct", value: 91300, forecast: true },
];

export const byService = [
  { name: "EC2 compute", value: 38900 },
  { name: "RDS databases", value: 19700 },
  { name: "EBS & snapshots", value: 11200 },
  { name: "S3 storage", value: 6800 },
  { name: "Data transfer", value: 5400 },
  { name: "Other", value: 3400 },
];

export const providers = [
  { name: "AWS", status: "connected" as const, note: "Connected · read-only" },
  { name: "STC Cloud", status: "soon" as const, note: "Coming soon" },
  { name: "SCCC (Alibaba Cloud)", status: "soon" as const, note: "Coming soon" },
  { name: "CNTXT", status: "soon" as const, note: "Coming soon" },
  { name: "Microsoft Azure", status: "soon" as const, note: "Coming soon" },
  { name: "Google Cloud", status: "soon" as const, note: "Coming soon" },
];

export const readOnlyPermissions = [
  "ce:GetCostAndUsage",
  "ce:GetCostForecast",
  "ec2:DescribeInstances",
  "ec2:DescribeVolumes",
  "ec2:DescribeSnapshots",
  "ec2:DescribeAddresses",
  "rds:DescribeDBInstances",
  "cloudwatch:GetMetricStatistics",
];

export const findings: Finding[] = [
  {
    id: "dev-schedule",
    category: "Scheduling",
    title: "Dev environment runs 24/7",
    resource: "8 instances tagged env=dev",
    detail: "Zero usage between 8pm and 7am and on weekends",
    monthlySavings: 3100,
    risk: "low",
    action: "Stop instances outside working hours and start them each morning",
    permission: "ec2:StopInstances, ec2:StartInstances on 8 env=dev instances",
    safeguards: ["No data is deleted", "Instant manual start when needed"],
    explanation:
      "Your dev servers run all week, but the team only uses them about 55 hours. Stopping them at night and on weekends cuts their cost by roughly 65% with no customer impact, because this is not production.",
  },
  {
    id: "rds-rightsize",
    category: "Rightsizing",
    title: "Oversized production database",
    resource: "rds: orders-db (db.r5.2xlarge)",
    detail: "Average CPU 9%, peak 31% over 30 days",
    monthlySavings: 2900,
    risk: "medium",
    action: "Downsize to db.r6g.xlarge during the maintenance window",
    permission: "rds:ModifyDBInstance, rds:CreateDBSnapshot on orders-db",
    safeguards: ["Snapshot before change", "Maintenance window only", "One-click rollback"],
    explanation:
      "This database never uses more than a third of its capacity, even at peak. Moving to a smaller Graviton instance keeps a comfortable safety margin and roughly halves the cost. Because it is production, we schedule it inside the maintenance window with a snapshot first.",
  },
  {
    id: "idle-ec2",
    category: "Idle",
    title: "Instance idle for 14 days",
    resource: "ec2: staging-api-old (m5.2xlarge)",
    detail: "2.1% CPU and no network traffic for 14 days",
    monthlySavings: 1380,
    risk: "low",
    action: "Stop the instance and keep its disk",
    permission: "ec2:StopInstances on staging-api-old",
    safeguards: ["Stop, not terminate", "Restart in one click"],
    explanation:
      "This server has not received a single request in two weeks. It looks like an old staging copy left behind after the new release. Stopping it is fully reversible because the disk stays intact.",
  },
  {
    id: "old-snapshots",
    category: "Storage",
    title: "Snapshots older than 180 days",
    resource: "41 snapshots · 3.8 TB",
    detail: "Not linked to any running instance or backup policy",
    monthlySavings: 710,
    risk: "medium",
    action: "Move to archive tier instead of deleting",
    permission: "ec2:ModifySnapshotTier on 41 snapshots",
    safeguards: ["Archive, not delete", "Restorable on demand"],
    explanation:
      "These snapshots belong to servers deleted months ago. Archiving instead of deleting cuts their cost by about 75% and keeps them available if compliance ever needs them.",
  },
  {
    id: "gp2-gp3",
    category: "Modernize",
    title: "Previous-generation gp2 volumes",
    resource: "23 EBS volumes · 4.1 TB",
    detail: "gp3 is about 20% cheaper with equal or better baseline performance",
    monthlySavings: 620,
    risk: "low",
    action: "Upgrade volumes to gp3 with no downtime",
    permission: "ec2:ModifyVolume on 23 volumes",
    safeguards: ["No downtime", "No data changes"],
    explanation:
      "The gp2 to gp3 upgrade happens while the server keeps running, with no interruption, and gives higher baseline performance at a lower price. It is one of the safest wins available.",
  },
  {
    id: "orphan-ebs",
    category: "Orphaned",
    title: "Unattached disks",
    resource: "6 EBS volumes · 1.2 TB",
    detail: "Status 'available' for more than 30 days",
    monthlySavings: 450,
    risk: "medium",
    action: "Snapshot, then delete the volumes",
    permission: "ec2:CreateSnapshot, ec2:DeleteVolume on 6 volumes",
    safeguards: ["Snapshot before delete", "Restore from snapshot in minutes"],
    explanation:
      "These disks outlived the servers they belonged to and nothing reads from them. We snapshot each one first, then delete it, so any disk can be restored in minutes if needed.",
  },
  {
    id: "unused-eip",
    category: "Orphaned",
    title: "Unused static IP addresses",
    resource: "3 Elastic IPs",
    detail: "Not attached to any instance",
    monthlySavings: 42,
    risk: "low",
    action: "Release the addresses",
    permission: "ec2:ReleaseAddress on 3 addresses",
    safeguards: ["Checked against DNS records first"],
    explanation:
      "AWS charges for idle static IPs. The amount is small but it is pure waste, and we confirm no DNS record points at the address before releasing it.",
  },
];

export const totalSavings = findings.reduce((s, f) => s + f.monthlySavings, 0);

export const riskLabel: Record<Risk, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

export function sar(n: number) {
  return "SAR " + new Intl.NumberFormat("en-US").format(Math.round(n));
}

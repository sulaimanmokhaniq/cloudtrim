"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { Finding, company, findings, providers, readOnlyPermissions, sar, totalSavings, monthlyTrend, byService } from "@/lib/data";
import { MonthlySpendBarChart, SpendByServiceWidget } from "@/components/Charts";

const STEPS = ["Create Account", "Connect Cloud", "AI Analysis", "Dashboard"];

export type CloudAccount = {
  id: string;
  provider: string;
  accountName: string;
  monthlySpend: number;
  findings: Finding[];
};

// Preset mock data for secondary/tertiary clouds
const CLOUD_PRESETS: Record<string, { spend: number; findings: Finding[] }> = {
  AWS: {
    spend: 85400,
    findings: findings,
  },
  "STC Cloud": {
    spend: 48200,
    findings: [
      {
        id: "stc-idle-vm",
        category: "Idle",
        title: "Idle STC Cloud VM Instance",
        resource: "stc-vm: app-backend-stc (c5.xlarge)",
        detail: "Zero CPU traffic for 10 days",
        monthlySavings: 2400,
        risk: "low",
        action: "Stop instance to eliminate idle charges",
        permission: "stc:StopVM",
        safeguards: ["Reversible in 1-click"],
        explanation: "This STC Cloud VM server has had zero activity for 10 days. Stopping it stops billing immediately.",
      },
      {
        id: "stc-storage",
        category: "Storage",
        title: "Unattached STC Block Storage Volume",
        resource: "stc-volume: vol-data-archive (500 GB)",
        detail: "Unattached for 25 days",
        monthlySavings: 1850,
        risk: "medium",
        action: "Create snapshot and release volume",
        permission: "stc:DeleteVolume",
        safeguards: ["Snapshot created first"],
        explanation: "Unattached storage volume in STC Cloud billing daily without any attached server.",
      },
    ],
  },
  "Google Cloud": {
    spend: 36000,
    findings: [
      {
        id: "gcp-gke-nodepool",
        category: "Rightsizing",
        title: "Over-provisioned GKE Node Pool",
        resource: "gcp: gke-prod-cluster (n2-standard-8)",
        detail: "Memory usage under 25%",
        monthlySavings: 2100,
        risk: "medium",
        action: "Resize node pool to n2-standard-4",
        permission: "container.clusters.update",
        safeguards: ["Rolling node update"],
        explanation: "The GKE Kubernetes node pool has 75% unallocated RAM across nodes.",
      },
      {
        id: "gcp-ip",
        category: "Orphaned",
        title: "Unused External IP Address",
        resource: "gcp-ip: static-prod-lb-ip",
        detail: "Not assigned to any load balancer",
        monthlySavings: 180,
        risk: "low",
        action: "Release static IP address",
        permission: "compute.addresses.delete",
        safeguards: ["DNS verification complete"],
        explanation: "Google Cloud charges for unassigned static external IP addresses.",
      },
    ],
  },
  "Microsoft Azure": {
    spend: 52000,
    findings: [
      {
        id: "azure-vmss",
        category: "Idle",
        title: "Unused Azure VM Scale Set",
        resource: "azure: vmss-staging-east",
        detail: "Idle instance count min=4",
        monthlySavings: 3200,
        risk: "low",
        action: "Reduce minimum replica count to 1",
        permission: "Microsoft.Compute/virtualMachineScaleSets/write",
        safeguards: ["Auto-scale active"],
        explanation: "Azure VM Scale Set keeps 4 instances running constantly for staging workloads.",
      },
      {
        id: "azure-ssd",
        category: "Rightsizing",
        title: "Over-provisioned Premium SSD P30",
        resource: "azure-disk: sql-data-disk (1 TB)",
        detail: "IOPS utilization under 10%",
        monthlySavings: 1400,
        risk: "medium",
        action: "Downgrade to Standard SSD P20",
        permission: "Microsoft.Compute/disks/write",
        safeguards: ["Snapshot backup first"],
        explanation: "Premium SSD disk IOPS performance exceeds actual database workload requirements.",
      },
    ],
  },
  "SCCC (Alibaba Cloud)": {
    spend: 28500,
    findings: [
      {
        id: "sccc-ecs",
        category: "Idle",
        title: "Unused SCCC ECS Compute Instance",
        resource: "ecs: ecs.g6.xlarge (Riyadh)",
        detail: "No active connections",
        monthlySavings: 1200,
        risk: "low",
        action: "Stop ECS instance",
        permission: "ecs:StopInstance",
        safeguards: ["Disk data retained"],
        explanation: "SCCC Alibaba Cloud ECS instance running in Riyadh data center without workload traffic.",
      },
    ],
  },
  CNTXT: {
    spend: 19800,
    findings: [
      {
        id: "cntxt-legacy",
        category: "Modernize",
        title: "Legacy Cloud Instance Type",
        resource: "cntxt-vm: app-worker-01",
        detail: "Gen 1 instance type",
        monthlySavings: 950,
        risk: "low",
        action: "Upgrade to Gen 2 instance tier",
        permission: "cntxt:MigrateInstance",
        safeguards: ["Zero downtime migration"],
        explanation: "Migrating to CNTXT Gen 2 tier provides higher performance per SAR spent.",
      },
    ],
  },
};

export default function Start() {
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState({ name: "", email: "", company: "" });
  const [selectedCloudProvider, setSelectedCloudProvider] = useState("AWS");
  // A provider button on the landing page links here with ?provider=<name> to preselect it
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("provider");
    if (wanted && providers.some((p) => p.name === wanted)) setSelectedCloudProvider(wanted);
  }, []);
  const [connectedClouds, setConnectedClouds] = useState<CloudAccount[]>([]);

  // Function called after completing analysis for a cloud account
  const handleAddCloudComplete = (providerName: string) => {
    const preset = CLOUD_PRESETS[providerName] || {
      spend: 35000,
      findings: [
        {
          id: `custom-${Date.now()}`,
          category: "Idle",
          title: `Unused ${providerName} Instance`,
          resource: `${providerName.toLowerCase()}: server-01`,
          detail: "Zero CPU activity",
          monthlySavings: 1800,
          risk: "low",
          action: "Stop instance",
          permission: "cloud:Stop",
          safeguards: ["Reversible"],
          explanation: `Idle instance identified in ${providerName} scan.`,
        },
      ],
    };

    const newCloud: CloudAccount = {
      id: `${providerName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      provider: providerName,
      accountName: `${providerName} Account`,
      monthlySpend: preset.spend,
      findings: preset.findings,
    };

    // Avoid exact duplicate IDs if adding same provider twice
    setConnectedClouds((prev) => {
      // If provider already added, append count label
      const count = prev.filter((c) => c.provider === providerName).length;
      if (count > 0) {
        newCloud.accountName = `${providerName} Account #${count + 1}`;
      }
      return [...prev, newCloud];
    });

    setStep(3); // Go to Dashboard
  };

  return (
    <div className="min-h-screen text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Stepper step={step} />
        <div className="mt-8">
          {step === 0 && (
            <CreateAccountStep
              value={account}
              onChange={setAccount}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <ConnectCloudStep
              selectedCloud={selectedCloudProvider}
              setSelectedCloud={setSelectedCloudProvider}
              onBack={() => {
                if (connectedClouds.length > 0) {
                  setStep(3); // Back to dashboard if clouds already exist
                } else {
                  setStep(0);
                }
              }}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <FetchAndAnalysisStep
              cloudName={selectedCloudProvider}
              onDone={() => handleAddCloudComplete(selectedCloudProvider)}
            />
          )}
          {step === 3 && (
            <DashboardStep
              company={account.company || company.name}
              name={account.name}
              connectedClouds={connectedClouds}
              onAddAnotherCloud={() => {
                // Determine next provider to pre-select for user convenience
                const existingProviders = new Set(connectedClouds.map((c) => c.provider));
                const available = providers.find((p) => !existingProviders.has(p.name));
                if (available) setSelectedCloudProvider(available.name);
                setStep(1); // Go to Connect Cloud step
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4 border border-line bg-card">
      {STEPS.map((title, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li
            key={title}
            className={`flex items-center gap-2 border-line px-3 py-3 ${i > 0 ? "border-l" : ""} ${
              active ? "bg-brand text-onbrand" : done ? "bg-card text-ink" : "bg-bg text-muted"
            }`}
          >
            <span
              className={`num flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold ${
                active ? "border border-onbrand" : done ? "bg-brand text-onbrand" : "border border-line"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className="hidden text-xs font-semibold sm:inline">{title}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- 1. Create Account ---------- */

function CreateAccountStep({
  value,
  onChange,
  onNext,
}: {
  value: { name: string; email: string; company: string };
  onChange: (v: { name: string; email: string; company: string }) => void;
  onNext: () => void;
}) {
  const inputClass = "w-full border border-line bg-bg-2 px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-brand focus:outline-none";

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      <div className="border border-line bg-card p-6">
        <p className="micro text-brand font-mono">Step 1 of 4</p>
        <h1 className="font-display mt-2 text-2xl font-bold">Create Account</h1>
        <p className="mt-1 text-xs text-muted">Enter your details to get started.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
        >
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1">Full Name</label>
            <input
              required
              className={inputClass}
              placeholder="Sara Al-Qahtani"
              value={value.name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1">Work Email</label>
            <input
              required
              type="email"
              className={inputClass}
              placeholder="sara@company.sa"
              value={value.email}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1">Company</label>
            <input
              className={inputClass}
              placeholder="Nakhla Tech"
              value={value.company}
              onChange={(e) => onChange({ ...value, company: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary arrow bg-brand px-6 py-2.5 text-xs font-bold text-onbrand">
              Next: Connect Cloud →
            </button>
            <button
              type="button"
              onClick={() => onChange({ name: "Sara Al-Qahtani", email: "sara@nakhla.sa", company: "Nakhla Tech" })}
              className="text-xs text-muted underline hover:text-ink"
            >
              Fill Sample
            </button>
          </div>
        </form>
      </div>

      <div className="border border-line bg-bg-2 p-5 text-xs space-y-3">
        <h3 className="font-bold text-ink">Included</h3>
        <ul className="space-y-2 text-ink-2">
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-brand" /> Full waste & savings report</li>
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-brand" /> Multi-cloud account support</li>
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-brand" /> Read-only API security</li>
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-brand" /> Saudi NCA ECC & PDPL compliant</li>
        </ul>
      </div>
    </div>
  );
}

/* ---------- 2. Connect Cloud ---------- */

function ConnectCloudStep({
  selectedCloud,
  setSelectedCloud,
  onBack,
  onNext,
}: {
  selectedCloud: string;
  setSelectedCloud: (s: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const inputClass = "w-full border border-line bg-bg-2 px-3 py-2 font-mono text-xs placeholder:text-muted focus:border-brand focus:outline-none";

  return (
    <div className="space-y-5">
      <div>
        <p className="micro text-brand font-mono">Step 2 of 4</p>
        <h1 className="font-display mt-1 text-2xl font-bold">Connect Cloud API</h1>
        <p className="mt-1 text-xs text-muted">Select cloud provider and enter API read-only credentials.</p>
      </div>

      {/* Prominent Read-Only Alert */}
      <div className="border border-amber/60 bg-amber-soft/20 p-3.5 flex items-center gap-3 text-xs">
        <span className="text-base">🔒</span>
        <div>
          <strong className="text-amber">Read-Only Notice:</strong> Access is strictly read-only. No write or delete permissions.
        </div>
      </div>

      {/* Cloud Provider Selection */}
      <div>
        <label className="block text-xs font-semibold mb-2">Select Cloud Provider:</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {providers.map((p) => {
            const isSelected = selectedCloud === p.name;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setSelectedCloud(p.name)}
                className={`p-2.5 text-center border text-xs transition-all ${
                  isSelected
                    ? "border-brand bg-brand-soft/40 font-bold text-brand scale-[1.02] shadow-sm"
                    : "border-line bg-card hover:bg-bg-2 text-ink-2"
                }`}
              >
                <div className="font-semibold">{p.name}</div>
                {p.status === "soon" && <div className="mt-0.5 text-[10px] font-normal text-muted">Preview</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Credentials Form */}
      <div className="border border-line bg-card p-5 space-y-4">
        <h3 className="font-bold text-xs">API Read-Only Credentials ({selectedCloud})</h3>
        {selectedCloud !== "AWS" && (
          <p className="text-[11px] text-muted">
            Preview: {selectedCloud} uses sample findings in this demo. The live connector is on the roadmap; AWS is the
            connector built today.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] text-muted mb-1">API Key ID / Username</label>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AKIAIOSFODNN7EXAMPLE"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[11px] text-muted mb-1">API Secret / Token</label>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="••••••••••••••••••••"
              className={inputClass}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setApiKey("AKIAIOSFODNN7EXAMPLE");
            setApiSecret("wJalrXUtnFEMI/K7MDENG/bPxRiCYEXAMPLEKEY");
          }}
          className="text-[11px] text-muted underline hover:text-ink"
        >
          Fill Demo Keys
        </button>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-ghost px-4 py-2 text-xs font-semibold">
          Back
        </button>
        <button type="button" onClick={onNext} className="btn-primary arrow bg-brand px-6 py-2.5 text-xs font-bold text-onbrand">
          Start Fetch & Analysis →
        </button>
      </div>
    </div>
  );
}

/* ---------- 3. Loading & AI Analysis ---------- */

const STAGES = [
  "Connecting to Cloud API...",
  "Verifying Read-Only access...",
  "Fetching 6-month usage & cost metrics...",
  "Scanning compute, storage, databases...",
  "Running AI waste detection algorithm...",
  "Generating cost optimization recommendations...",
];

function FetchAndAnalysisStep({ cloudName, onDone }: { cloudName: string; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const currentPreset = CLOUD_PRESETS[cloudName]?.findings || findings;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + 2.5;
      });
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const stageIndex = Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length));
  const done = progress >= 100;
  const found = Math.min(currentPreset.length, Math.floor((progress / 100) * (currentPreset.length + 0.5)));

  return (
    <div className="space-y-5">
      <div>
        <p className="micro text-brand font-mono">Step 3 of 4</p>
        <h1 className="font-display mt-1 text-2xl font-bold">Fetching & AI Analysis</h1>
        <p className="mt-1 text-xs text-muted">Scanning {cloudName} account metrics...</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-line bg-card p-5 space-y-4">
          <div className="flex justify-between text-xs font-bold">
            <span>Status</span>
            <span className="font-mono text-brand">{Math.round(progress)}%</span>
          </div>

          <div className="h-3 w-full overflow-hidden bg-bg-2 border border-line rounded-full">
            <div className="h-full bg-brand transition-all duration-150" style={{ width: `${progress}%` }} />
          </div>

          <p className="text-xs font-mono text-brand bg-brand-soft/30 p-2.5 border-l-2 border-brand">
            {STAGES[stageIndex]}
          </p>
        </div>

        <div className="border border-line bg-card p-5 space-y-2">
          <h3 className="font-bold text-xs border-b border-line pb-2 flex justify-between items-center">
            <span>Live AI Findings</span>
            <span className="text-[10px] text-brand font-mono">[{cloudName}]</span>
          </h3>
          <ul className="space-y-2 text-xs">
            {currentPreset.slice(0, found).map((f) => (
              <li key={f.id} className="p-2 bg-bg-2 border border-line flex justify-between items-center">
                <span className="font-medium text-ink">{f.title}</span>
                <span className="font-mono font-bold text-brand shrink-0 ml-2">+{sar(f.monthlySavings)}/mo</span>
              </li>
            ))}
            {found === 0 && <li className="text-muted p-4 text-center">Analyzing resources...</li>}
          </ul>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={onDone}
          disabled={!done}
          className={`btn-primary arrow px-6 py-2.5 text-xs font-bold transition-all ${
            done ? "bg-brand text-onbrand cursor-pointer" : "bg-muted text-bg opacity-50 cursor-not-allowed"
          }`}
        >
          {done ? "View Dashboard →" : "Analyzing..."}
        </button>
      </div>
    </div>
  );
}

/* ---------- 4. Dashboard & Multi-Cloud Recommendations ---------- */

function DashboardStep({
  company: companyName,
  name,
  connectedClouds,
  onAddAnotherCloud,
}: {
  company: string;
  name: string;
  connectedClouds: CloudAccount[];
  onAddAnotherCloud: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState<string>("ALL");
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pendingItem, setPendingItem] = useState<(Finding & { cloudProvider: string; accountName: string }) | null>(null);
  const [appliedItemIds, setAppliedItemIds] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [auditLog, setAuditLog] = useState<{ time: string; event: string }[]>([
    { time: "Just now", event: "Multi-cloud AI waste scan completed successfully." },
    { time: "Just now", event: "Read-only access checked for all connected API keys." },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  // Calculate totals
  const activeClouds = connectedClouds.length > 0 ? connectedClouds : [
    {
      id: "aws-default",
      provider: "AWS",
      accountName: "AWS Account",
      monthlySpend: 85400,
      findings: findings,
    },
  ];

  // Filter clouds based on tab
  const displayedClouds = selectedTab === "ALL" 
    ? activeClouds 
    : activeClouds.filter((c) => c.id === selectedTab || c.provider === selectedTab);

  const totalSpend = displayedClouds.reduce((sum, c) => sum + c.monthlySpend, 0);
  const allFindings = displayedClouds.flatMap((c) => 
    c.findings.slice(0, 4).map((f) => ({ ...f, cloudProvider: c.provider, accountName: c.accountName }))
  );

  const activeFindings = allFindings.filter((f) => !appliedItemIds.has(f.id));
  const totalWaste = activeFindings.reduce((sum, f) => sum + f.monthlySavings, 0);
  const wastePct = totalSpend > 0 ? Math.round((totalWaste / totalSpend) * 100) : 0;
  const realizedSavings = allFindings
    .filter((f) => appliedItemIds.has(f.id))
    .reduce((sum, f) => sum + f.monthlySavings, 0);

  const handleConfirmEmailAction = () => {
    if (!pendingItem) return;
    setAppliedItemIds((prev) => new Set([...prev, pendingItem.id]));
    const nowStr = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setAuditLog((prev) => [
      { time: nowStr, event: `Email authorization sent for [${pendingItem.cloudProvider}] ${pendingItem.title}` },
      ...prev,
    ]);
    showToast(
      `📩 Confirmation email sent to ${name ? name.split(" ")[0] : "your email"}. Once approved via email, the requested change will be executed safely on [${pendingItem.cloudProvider}].`
    );
    setPendingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Floating Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 max-w-md bg-brand text-onbrand border-2 border-brand-2 p-4 text-xs font-semibold rounded-lg shadow-2xl flex items-start gap-3 animate-bounce">
          <span className="text-lg shrink-0">🔔</span>
          <div className="flex-1 leading-relaxed">{toastMsg}</div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="text-onbrand/80 hover:text-onbrand font-bold text-base shrink-0 leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* ⚠️ Apply Recommendation Confirmation Warning Modal (المربع التحذيري) */}
      {pendingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-card border-2 border-amber/70 rounded-lg p-6 max-w-lg w-full space-y-4 shadow-2xl text-ink">
            <div className="flex items-center gap-3 border-b border-line pb-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-amber text-onbrand font-bold flex items-center justify-center text-xl">
                ⚠️
              </div>
              <div>
                <h3 className="font-bold text-base text-amber">Confirmation Warning: Apply Recommendation</h3>
                <p className="text-xs text-muted">Cloud Provider: <strong className="text-brand font-mono">[{pendingItem.cloudProvider}]</strong></p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-bg-2 p-3 border border-line space-y-1">
                <span className="block font-bold text-ink text-sm">{pendingItem.title}</span>
                <span className="block text-muted font-mono">{pendingItem.resource}</span>
                <span className="block text-brand font-bold font-mono">Monthly Savings: {sar(pendingItem.monthlySavings)}</span>
              </div>

              <div className="space-y-1.5 text-ink-2">
                <p><strong>Proposed Action:</strong> {pendingItem.action}</p>
                <p className="font-mono text-[11px] text-muted"><strong>Required IAM Permission:</strong> {pendingItem.permission}</p>
                <p><strong>Safety Safeguards:</strong> {pendingItem.safeguards.join(", ")}</p>
              </div>

              <div className="bg-amber-soft/30 border-l-4 border-amber p-3 text-amber text-[11px] leading-relaxed">
                <strong>Important Notice:</strong> Confirming this action will send a 1-click authorization email to <strong>{name ? name : "user"} (sara@company.sa)</strong>. The changes on <strong>[{pendingItem.cloudProvider}]</strong> will be executed ONLY after you approve the email.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingItem(null)}
                className="btn-ghost px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEmailAction}
                className="btn-primary bg-brand text-onbrand px-5 py-2 text-xs font-bold shadow-md hover:brightness-110"
              >
                Confirm & Send Confirmation Email 📩
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Report Modal Preview */}
      {showPdfModal && (
        <PdfReportModal
          companyName={companyName}
          activeClouds={activeClouds}
          allFindings={allFindings}
          totalSpend={totalSpend}
          totalWaste={totalWaste}
          wastePct={wastePct}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {/* Header & Add Another Cloud Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="micro text-brand font-mono">Step 4 of 4</p>
          <h1 className="font-display mt-1 text-2xl font-bold">CloudTrim Dashboard</h1>
          <p className="mt-1 text-xs text-muted">
            Managing <strong className="text-ink">{activeClouds.length}</strong> cloud account{activeClouds.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* ➕ Button to Add Second / Third Cloud */}
        <button
          type="button"
          onClick={onAddAnotherCloud}
          className="btn-primary bg-brand px-4 py-2 text-xs font-bold text-onbrand flex items-center gap-1.5 self-start sm:self-auto hover:brightness-110 shadow-sm transition-all"
        >
          <span>+ Connect Another Cloud</span>
        </button>
      </div>

      {/* 📤 Export & Share Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-2 border border-line p-3.5 text-xs rounded-lg">
        <span className="font-semibold text-ink-2">Export & Share:</span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Download PDF - Instant Direct Export */}
          <button
            type="button"
            onClick={() => {
              const printWin = window.open("", "_blank");
              if (!printWin) return;
              printWin.document.write(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <title>CloudTrim_Executive_Report_${companyName.replace(/\s+/g, '_')}.pdf</title>
                    <style>
                      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@600;700;800&display=swap');
                      
                      *, *::before, *::after {
                        box-sizing: border-box !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                      }
                      
                      @page {
                        size: A4 landscape;
                        margin: 10mm;
                      }

                      body {
                        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
                        padding: 20px !important;
                        color: #0f172a !important;
                        background: #ffffff !important;
                        margin: 0 !important;
                      }
                      
                      .header-banner {
                        background-color: #741b27 !important;
                        color: #ffffff !important;
                        padding: 22px 28px !important;
                        border-radius: 10px !important;
                        margin-bottom: 24px !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                      }
                      .header-banner h1 {
                        margin: 0 !important;
                        font-size: 22px !important;
                        font-weight: 800 !important;
                        letter-spacing: -0.02em !important;
                        color: #ffffff !important;
                      }
                      .header-banner p {
                        margin: 6px 0 0 0 !important;
                        font-size: 13px !important;
                        color: #f3eae0 !important;
                        font-family: 'Plus Jakarta Sans', sans-serif !important;
                      }
                      .metrics-grid {
                        display: grid !important;
                        grid-template-columns: repeat(4, 1fr) !important;
                        gap: 16px !important;
                        margin-bottom: 28px !important;
                      }
                      .metric-card {
                        background-color: #fcfbf9 !important;
                        border: 1px solid #e5dfd5 !important;
                        padding: 16px 20px !important;
                        border-radius: 10px !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                      }
                      .metric-card.highlight {
                        background-color: #fff5f5 !important;
                        border: 1.5px solid #f87171 !important;
                      }
                      .metric-title {
                        font-size: 12px !important;
                        color: #64748b !important;
                        font-weight: 600 !important;
                      }
                      .metric-card.highlight .metric-title {
                        color: #741b27 !important;
                      }
                      .metric-value {
                        font-size: 22px !important;
                        font-weight: 800 !important;
                        margin-top: 6px !important;
                        font-family: 'Plus Jakarta Sans', sans-serif !important;
                        color: #0f172a !important;
                      }
                      .metric-value.amber { color: #d97706 !important; }
                      .metric-value.rose { color: #741b27 !important; }
                      .metric-sub {
                        font-size: 11px !important;
                        color: #94a3b8 !important;
                        margin-top: 4px !important;
                      }
                      .metric-sub.amber { color: #b45309 !important; }
                      .section-heading {
                        font-size: 16px !important;
                        font-weight: 800 !important;
                        color: #0f172a !important;
                        margin-bottom: 16px !important;
                      }
                      .table-container {
                        background-color: #ffffff !important;
                        border: 1px solid #e2e8f0 !important;
                        border-radius: 10px !important;
                        overflow: hidden !important;
                      }
                      .table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                      }
                      .table th {
                        background-color: #f8fafc !important;
                        text-align: left !important;
                        padding: 12px 16px !important;
                        font-size: 12px !important;
                        font-weight: 700 !important;
                        color: #475569 !important;
                        border-bottom: 1px solid #e2e8f0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                      }
                      .table td {
                        padding: 14px 16px !important;
                        font-size: 13px !important;
                        border-bottom: 1px solid #f1f5f9 !important;
                        color: #334155 !important;
                      }
                      .badge-provider {
                        background-color: #ffe4e6 !important;
                        color: #741b27 !important;
                        font-size: 11px !important;
                        font-weight: 700 !important;
                        padding: 3px 8px !important;
                        border-radius: 4px !important;
                        display: inline-block !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                      }
                      .title-col {
                        font-weight: 700 !important;
                        color: #0f172a !important;
                      }
                      .savings-col {
                        font-weight: 800 !important;
                        color: #741b27 !important;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="header-banner">
                      <h1>CloudTrim Executive FinOps Report</h1>
                      <p>Company: <strong>${companyName}</strong> &nbsp;|&nbsp; Date: <strong>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                    </div>

                    <div class="metrics-grid">
                      <div class="metric-card">
                        <div class="metric-title">This month's bill</div>
                        <div class="metric-value">${sar(totalSpend)}</div>
                        <div class="metric-sub">+7.3% vs last month</div>
                      </div>
                      <div class="metric-card">
                        <div class="metric-title">Waste found / month</div>
                        <div class="metric-value amber">${sar(totalWaste)}</div>
                        <div class="metric-sub amber">${wastePct}% of the bill</div>
                      </div>
                      <div class="metric-card highlight">
                        <div class="metric-title">Savings realized</div>
                        <div class="metric-value rose">${sar(realizedSavings)}</div>
                        <div class="metric-sub">${appliedItemIds.size > 0 ? `${appliedItemIds.size} action(s) authorized` : 'After your approval'}</div>
                      </div>
                      <div class="metric-card">
                        <div class="metric-title">Next month forecast</div>
                        <div class="metric-value">${sar(Math.round(totalSpend * 1.07))}</div>
                        <div class="metric-sub">If nothing changes</div>
                      </div>
                    </div>

                    <div class="section-heading">Actionable Optimization Recommendations</div>

                    <div class="table-container">
                      <table class="table">
                        <thead>
                          <tr>
                            <th style="width: 40px;">#</th>
                            <th style="width: 100px;">Provider</th>
                            <th>Recommendation Title</th>
                            <th style="width: 140px;">Monthly Savings</th>
                            <th>Proposed Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${allFindings.map((f, idx) => `
                            <tr>
                              <td style="color: #64748b;">${idx + 1}</td>
                              <td><span class="badge-provider">${f.cloudProvider}</span></td>
                              <td class="title-col">${f.title}</td>
                              <td class="savings-col">${sar(f.monthlySavings)}/mo</td>
                              <td>${f.action}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>

                    <script>
                      window.onload = function() {
                        setTimeout(function() {
                          window.print();
                        }, 250);
                      };
                    </script>
                  </body>
                </html>
              `);
              printWin.document.close();
            }}
            className="btn-primary bg-brand text-onbrand px-4 py-2 font-bold flex items-center gap-2 hover:brightness-110 shadow-md transition-all cursor-pointer"
          >
            <span>📄 Download PDF Executive Report</span>
          </button>

          {/* Send to WhatsApp (Clickable with Alert) */}
          <button
            type="button"
            onClick={() => showToast("⚠️ Feature Unavailable: WhatsApp export is currently under development.")}
            className="btn-ghost border border-line bg-card px-3 py-1.5 font-semibold text-ink hover:bg-bg-2 flex items-center gap-1.5 cursor-pointer"
          >
            <span>💬 Send to WhatsApp</span>
            <span className="text-[10px] bg-amber-soft text-amber px-1 rounded font-mono">(Unavailable)</span>
          </button>

          {/* Send to Telegram (Clickable with Alert) */}
          <button
            type="button"
            onClick={() => showToast("⚠️ Feature Unavailable: Telegram export is currently under development.")}
            className="btn-ghost border border-line bg-card px-3 py-1.5 font-semibold text-ink hover:bg-bg-2 flex items-center gap-1.5 cursor-pointer"
          >
            <span>✈️ Send to Telegram</span>
            <span className="text-[10px] bg-amber-soft text-amber px-1 rounded font-mono">(Unavailable)</span>
          </button>
        </div>
      </div>

      {/* Cloud Account Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-line pb-2">
        <button
          type="button"
          onClick={() => setSelectedTab("ALL")}
          className={`px-3 py-1.5 text-xs font-bold transition-all border ${
            selectedTab === "ALL"
              ? "bg-brand text-onbrand border-brand shadow-sm"
              : "bg-card text-muted border-line hover:text-ink"
          }`}
        >
          All Clouds ({activeClouds.length})
        </button>

        {activeClouds.map((cloud) => (
          <button
            key={cloud.id}
            type="button"
            onClick={() => setSelectedTab(cloud.id)}
            className={`px-3 py-1.5 text-xs font-bold transition-all border flex items-center gap-1.5 ${
              selectedTab === cloud.id
                ? "bg-brand text-onbrand border-brand shadow-sm"
                : "bg-card text-muted border-line hover:text-ink"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-sage" />
            <span>{cloud.accountName}</span>
          </button>
        ))}
      </div>

      {/* 📊 Top Metric Cards (Matching Screenshot Design) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: This month's bill */}
        <div className="bg-card p-5 border border-line shadow-xs space-y-1">
          <span className="block text-xs text-muted font-medium">This month&apos;s bill</span>
          <span className="block text-2xl font-bold font-mono text-ink tracking-tight">{sar(totalSpend)}</span>
          <span className="block text-[11px] text-muted font-mono">+7.3% vs last month</span>
        </div>

        {/* Card 2: Waste found / month */}
        <div className="bg-card p-5 border border-line shadow-xs space-y-1">
          <span className="block text-xs text-muted font-medium">Waste found / month</span>
          <span className="block text-2xl font-bold font-mono text-amber tracking-tight">{sar(totalWaste)}</span>
          <span className="block text-[11px] text-amber/80 font-mono">{wastePct}% of the bill</span>
        </div>

        {/* Card 3: Savings realized (Highlighted Card) */}
        <div className="bg-brand-soft/40 p-5 border-2 border-brand/50 shadow-xs space-y-1 rounded-sm">
          <span className="block text-xs text-brand font-semibold">Savings realized</span>
          <span className="block text-2xl font-bold font-mono text-brand tracking-tight">
            {sar(realizedSavings)}
          </span>
          <span className="block text-[11px] text-muted font-mono">
            {appliedItemIds.size > 0 ? `${appliedItemIds.size} action(s) authorized` : "After your approval"}
          </span>
        </div>

        {/* Card 4: Next month forecast */}
        <div className="bg-card p-5 border border-line shadow-xs space-y-1">
          <span className="block text-xs text-muted font-medium">Next month forecast</span>
          <span className="block text-2xl font-bold font-mono text-ink tracking-tight">{sar(Math.round(totalSpend * 1.07))}</span>
          <span className="block text-[11px] text-muted font-mono">If nothing changes</span>
        </div>
      </div>

      {/* 📊 Side-by-Side Charts Section (Matching Screenshot Design) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Monthly Spend Bar Chart */}
        <div className="lg:col-span-7 border border-line bg-card p-6 rounded-xl shadow-xs">
          <MonthlySpendBarChart data={monthlyTrend} />
        </div>

        {/* Right Column: Spend by Service */}
        <div className="lg:col-span-5 border border-line bg-card p-6 rounded-xl shadow-xs">
          <SpendByServiceWidget items={byService} />
        </div>
      </div>

      {/* Connected Clouds Summary */}
      {activeClouds.length > 1 && selectedTab === "ALL" && (
        <div className="border border-line bg-card p-4 space-y-3">
          <h3 className="font-bold text-xs text-ink uppercase tracking-wider">Connected Clouds Breakdown</h3>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {activeClouds.map((cloud) => {
              const cloudWaste = cloud.findings.reduce((s, f) => s + f.monthlySavings, 0);
              return (
                <div
                  key={cloud.id}
                  onClick={() => setSelectedTab(cloud.id)}
                  className="p-3 bg-bg-2 border border-line hover:border-brand/60 cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{cloud.accountName}</span>
                    <span className="text-[10px] bg-brand-soft text-brand px-1.5 py-0.5">Read-Only</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1">
                    <span className="text-muted">Spend: {sar(cloud.monthlySpend)}</span>
                    <span className="font-mono font-bold text-brand">Waste: {sar(cloudWaste)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Recommendations List */}
      <div className="border border-line bg-card p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-line pb-3">
          <div>
            <h3 className="font-bold text-sm text-ink">AI Optimization Recommendations</h3>
            <p className="text-[11px] text-muted">
              Showing recommendations for {selectedTab === "ALL" ? "All Connected Clouds" : displayedClouds[0]?.accountName}
            </p>
          </div>
          <span className="text-xs font-mono text-brand bg-brand-soft px-2 py-1 font-bold">
            {activeFindings.length} Actionable Items
          </span>
        </div>

        <div className="space-y-3.5">
          {activeFindings.map((item, idx) => {
            const isApplied = appliedItemIds.has(item.id);
            return (
              <div
                key={`${item.id}-${idx}`}
                className="p-4 bg-bg-2 border border-line rounded-lg space-y-3 hover:border-brand/50 transition-all shadow-sm relative overflow-hidden"
              >
                {/* Left accent border */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand" />

                {/* Top Row: Provider badge, Category, Title, Savings */}
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-line/60 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Cloud Provider Badge */}
                    <span className="font-mono text-[10px] bg-ink text-bg px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {item.cloudProvider}
                    </span>
                    {item.cloudProvider !== "AWS" && (
                      <span className="text-[10px] font-mono border border-line px-2 py-0.5 rounded text-muted">Preview</span>
                    )}
                    {/* Category Badge */}
                    <span className="text-[10px] font-mono bg-brand-soft text-brand px-2 py-0.5 rounded font-semibold border border-brand/20">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm text-ink font-display">
                      #{idx + 1} {item.title}
                    </h4>
                  </div>

                  {/* Monthly Savings Badge */}
                  <span className="font-mono font-bold text-brand bg-card border border-brand/30 px-2.5 py-1 rounded text-xs shrink-0 shadow-2xs">
                    Save {sar(item.monthlySavings)} / mo
                  </span>
                </div>

                {/* Explanation Content */}
                <p className="text-xs text-ink-2 leading-relaxed pl-1">
                  {item.explanation}
                </p>

                {/* Action Details & Submit Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-line/40">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="font-semibold text-amber">Recommended Action:</span>
                    <span className="text-ink-2 font-medium">{item.action}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPendingItem(item)}
                    disabled={isApplied}
                    className={`btn-primary px-4 py-1.5 text-xs font-bold transition-all rounded shrink-0 shadow-sm ${
                      isApplied
                        ? "bg-emerald-800 text-emerald-100 cursor-not-allowed opacity-80"
                        : "bg-brand text-onbrand hover:brightness-110"
                    }`}
                  >
                    {isApplied ? "✓ Email Authorization Sent" : "Apply Recommendation"}
                  </button>
                </div>
              </div>
            );
          })}

          {activeFindings.length === 0 && (
            <div className="p-6 text-center text-xs text-muted bg-bg-2 border border-line rounded">
              All recommendations applied or pending email authorization!
            </div>
          )}
        </div>
      </div>

      {/* Audit Log Activity */}
      <div className="border border-line bg-card p-5 space-y-3">
        <h3 className="font-bold text-xs text-ink uppercase tracking-wider border-b border-line pb-2">
          Audit & Security Activity Log
        </h3>
        <ul className="space-y-2 text-xs font-mono">
          {auditLog.map((log, i) => (
            <li key={i} className="flex items-start gap-2 text-ink-2 bg-bg-2 p-2 border border-line/40">
              <span className="text-muted shrink-0">[{log.time}]</span>
              <span>{log.event}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* In-place Navigation */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="btn-primary bg-brand px-6 py-2.5 text-xs font-bold text-onbrand"
        >
          Back to Top ↑
        </button>
        <Link href="/" className="btn-ghost px-4 py-2 text-xs font-semibold">
          Home
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, sub, value, tone = "text-ink" }: { label: string; sub?: string; value: string; tone?: string }) {
  return (
    <div className="bg-card p-3.5 border border-line shadow-sm relative overflow-hidden hover:shadow-md transition-shadow group">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand via-amber to-brand opacity-60 group-hover:opacity-100 transition-opacity" />
      <span className="block text-[11px] font-semibold text-ink-2">{label}</span>
      {sub && <span className="block text-[9px] text-muted font-mono">{sub}</span>}
      <span className={`num font-display mt-1.5 block text-lg sm:text-xl font-bold ${tone}`}>{value}</span>
    </div>
  );
}

/* ---------- PDF Executive Report Modal ---------- */

function PdfReportModal({
  companyName,
  activeClouds,
  allFindings,
  totalSpend,
  totalWaste,
  wastePct,
  onClose,
}: {
  companyName: string;
  activeClouds: CloudAccount[];
  allFindings: (Finding & { cloudProvider: string; accountName: string })[];
  totalSpend: number;
  totalWaste: number;
  wastePct: number;
  onClose: () => void;
}) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white text-gray-900 rounded-lg shadow-2xl overflow-y-auto border border-gray-200">
        
        {/* Floating Actions Bar (no-print) */}
        <div className="sticky top-0 z-10 no-print flex items-center justify-between bg-gray-900 text-white px-6 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Executive PDF Report Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>🖨️ Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 text-xs font-semibold rounded transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* PRINTABLE & VISUALLY STUNNING REPORT CONTENT */}
        <div className="p-8 space-y-8 bg-white" id="pdf-report-content">
          
          {/* Header Banner */}
          <div className="border-b-4 border-red-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-red-900 via-rose-900 to-gray-900 text-white p-6 rounded-lg shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">CloudTrim</span>
                <span className="bg-red-800/80 text-rose-100 text-[10px] font-mono px-2 py-0.5 rounded border border-rose-700/50">
                  FinOps AI Audit
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-2">Executive Cloud Savings & Waste Report</h1>
              <p className="text-xs text-rose-200 mt-1">Prepared for: <strong className="text-white">{companyName}</strong></p>
            </div>
            <div className="text-right text-xs text-rose-200 font-mono space-y-1">
              <div>Date: <strong className="text-white">{currentDate}</strong></div>
              <div>Connected Clouds: <strong className="text-white">{activeClouds.length} Account(s)</strong></div>
              <div className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/60 inline-block mt-1">
                ✓ NCA ECC & PDPL Compliant
              </div>
            </div>
          </div>

          {/* Color Stat Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border-2 border-gray-200 shadow-sm">
              <span className="block text-xs font-bold text-gray-500 uppercase">Monthly Cloud Bill</span>
              <span className="text-2xl font-extrabold text-gray-900 mt-1 block font-mono">{sar(totalSpend)}</span>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-300 shadow-sm">
              <span className="block text-xs font-bold text-amber-800 uppercase">Identified Waste</span>
              <span className="text-2xl font-extrabold text-amber-700 mt-1 block font-mono">{sar(totalWaste)}</span>
            </div>

            <div className="p-4 rounded-lg bg-rose-50 border-2 border-rose-300 shadow-sm">
              <span className="block text-xs font-bold text-rose-800 uppercase">Waste Percentage</span>
              <span className="text-2xl font-extrabold text-rose-700 mt-1 block font-mono">{wastePct}%</span>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50 border-2 border-emerald-400 shadow-sm">
              <span className="block text-xs font-bold text-emerald-800 uppercase">12-Mo Savings Potential</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1 block font-mono">{sar(totalWaste * 12)}</span>
            </div>
          </div>

          {/* Connected Clouds Summary Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 border-b-2 border-gray-200 pb-1 uppercase tracking-wider flex items-center justify-between">
              <span>Connected Cloud Accounts ({activeClouds.length})</span>
              <span className="text-xs text-gray-500 font-normal">Read-only access</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeClouds.map((cloud) => {
                const cloudWaste = cloud.findings.reduce((s, f) => s + f.monthlySavings, 0);
                return (
                  <div key={cloud.id} className="p-3 bg-gray-50 border border-gray-300 rounded flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{cloud.accountName}</span>
                      <span className="text-gray-500 block text-[10px]">Monthly Spend: {sar(cloud.monthlySpend)}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold font-mono text-emerald-700 text-sm">Save {sar(cloudWaste)}/mo</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Recommendations Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 border-b-2 border-gray-200 pb-1 uppercase tracking-wider">
              Prioritized Optimization Action Items ({allFindings.length})
            </h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-900 text-white font-bold">
                    <th className="p-3">#</th>
                    <th className="p-3">Cloud</th>
                    <th className="p-3">Finding Title</th>
                    <th className="p-3">Affected Resource</th>
                    <th className="p-3 text-right">Monthly Savings</th>
                    <th className="p-3 text-center">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-sans">
                  {allFindings.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3 font-mono font-bold text-gray-600">{idx + 1}</td>
                      <td className="p-3 font-bold text-red-900">{item.cloudProvider}</td>
                      <td className="p-3 font-semibold text-gray-900">
                        {item.title}
                        <p className="text-[10px] text-gray-600 font-normal mt-0.5 leading-normal">{item.explanation}</p>
                      </td>
                      <td className="p-3 font-mono text-gray-600 text-[11px]">{item.resource}</td>
                      <td className="p-3 font-mono font-bold text-emerald-700 text-right whitespace-nowrap">
                        {sar(item.monthlySavings)}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          item.risk === "low" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                          item.risk === "medium" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                          "bg-rose-100 text-rose-800 border border-rose-300"
                        }`}>
                          {item.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <div>
              <p className="font-bold text-gray-900">CloudTrim AI FinOps Engine</p>
              <p>Generated automatically from read-only access. No changes were made to your accounts.</p>
            </div>
            <div className="text-right font-mono text-[11px]">
              <p>Report Ref: CT-AUDIT-{Math.floor(100000 + Math.random() * 900000)}</p>
              <p>Kingdom of Saudi Arabia</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

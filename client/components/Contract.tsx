"use client";

import { useState, useCallback } from "react";
import {
  createBug,
  closeBug,
  getBug,
  listBugs,
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function BugIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 4A2.5 2.5 0 0 1 12 6.5" />
      <path d="M14.5 4A2.5 2.5 0 0 0 12 6.5" />
      <path d="M9.5 20A2.5 2.5 0 0 1 12 17.5" />
      <path d="M14.5 20A2.5 2.5 0 0 0 12 17.5" />
      <path d="M12 12v3" />
      <path d="M12 3v1" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#f87171]/30 focus-within:shadow-[0_0_20px_rgba(248,113,113,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Method Signature ─────────────────────────────────────────

function MethodSignature({
  name,
  params,
  returns,
  color,
}: {
  name: string;
  params: string;
  returns?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-mono text-sm">
      <span style={{ color }} className="font-semibold">fn</span>
      <span className="text-white/70">{name}</span>
      <span className="text-white/20 text-xs">{params}</span>
      {returns && (
        <span className="ml-auto text-white/15 text-[10px]">{returns}</span>
      )}
    </div>
  );
}

// ── Status Config ────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; dot: string; variant: "success" | "warning" | "info" }> = {
  open: { color: "text-[#f87171]", bg: "bg-[#f87171]/10", border: "border-[#f87171]/20", dot: "bg-[#f87171]", variant: "warning" },
  closed: { color: "text-[#34d399]", bg: "bg-[#34d399]/10", border: "border-[#34d399]/20", dot: "bg-[#34d399]", variant: "success" },
};

// ── Main Component ───────────────────────────────────────────

type Tab = "track" | "create" | "close" | "list";

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("track");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const [createId, setCreateId] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [closeId, setCloseId] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const [trackId, setTrackId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [bugData, setBugData] = useState<{ reporter: string; description: string; status: string } | null>(null);

  const [isListing, setIsListing] = useState(false);
  const [bugList, setBugList] = useState<string[]>([]);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleCreateBug = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!createId.trim() || !createDescription.trim()) return setError("Fill in all fields");
    setError(null);
    setIsCreating(true);
    setTxStatus("Awaiting signature...");
    try {
      await createBug(walletAddress, createId.trim(), createDescription.trim());
      setTxStatus("Bug reported on-chain!");
      setCreateId("");
      setCreateDescription("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsCreating(false);
    }
  }, [walletAddress, createId, createDescription]);

  const handleCloseBug = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!closeId.trim()) return setError("Enter a bug ID");
    setError(null);
    setIsClosing(true);
    setTxStatus("Awaiting signature...");
    try {
      await closeBug(walletAddress, closeId.trim());
      setTxStatus("Bug closed on-chain!");
      setCloseId("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsClosing(false);
    }
  }, [walletAddress, closeId]);

  const handleTrackBug = useCallback(async () => {
    if (!trackId.trim()) return setError("Enter a bug ID");
    setError(null);
    setIsTracking(true);
    setBugData(null);
    try {
      const result = await getBug(trackId.trim());
      if (result && typeof result === "object") {
        setBugData(result as { reporter: string; description: string; status: string });
      } else {
        setError("Bug not found");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setIsTracking(false);
    }
  }, [trackId]);

  const handleListBugs = useCallback(async () => {
    setError(null);
    setIsListing(true);
    try {
      const result = await listBugs();
      setBugList(result || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setIsListing(false);
    }
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "track", label: "Track", icon: <SearchIcon />, color: "#4fc3f7" },
    { key: "create", label: "Report", icon: <PlusIcon />, color: "#f87171" },
    { key: "close", label: "Close", icon: <CheckIcon />, color: "#34d399" },
    { key: "list", label: "List", icon: <ListIcon />, color: "#fbbf24" },
  ];

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("on-chain") || txStatus.includes("closed") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f87171]/20 to-[#fbbf24]/20 border border-white/[0.06]">
                <BugIcon />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Bug Tracker</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="warning" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); setBugData(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Track */}
            {activeTab === "track" && (
              <div className="space-y-5">
                <MethodSignature name="get_bug" params="(id: String)" returns="-> Bug" color="#4fc3f7" />
                <Input label="Bug ID" value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="e.g. BUG-001" />
                <ShimmerButton onClick={handleTrackBug} disabled={isTracking} shimmerColor="#4fc3f7" className="w-full">
                  {isTracking ? <><SpinnerIcon /> Querying...</> : <><SearchIcon /> Track Bug</>}
                </ShimmerButton>

                {bugData && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-fade-in-up">
                    <div className="border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-white/25">Bug Details</span>
                      {(() => {
                        const status = bugData.status || "Unknown";
                        const cfg = STATUS_CONFIG[status];
                        return cfg ? (
                          <Badge variant={cfg.variant}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                            {status}
                          </Badge>
                        ) : (
                          <Badge>{status}</Badge>
                        );
                      })()}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/35">Bug ID</span>
                        <span className="font-mono text-sm text-white/80">{trackId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/35">Reporter</span>
                        <span className="font-mono text-sm text-white/80">{truncate(bugData.reporter)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/35">Description</span>
                        <span className="font-mono text-sm text-white/80">{bugData.description}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Create */}
            {activeTab === "create" && (
              <div className="space-y-5">
                <MethodSignature name="create_bug" params="(id: String, reporter: Address, description: String)" color="#f87171" />
                <Input label="Bug ID" value={createId} onChange={(e) => setCreateId(e.target.value)} placeholder="e.g. BUG-001" />
                <Input label="Description" value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} placeholder="Describe the bug..." />
                {walletAddress ? (
                  <ShimmerButton onClick={handleCreateBug} disabled={isCreating} shimmerColor="#f87171" className="w-full">
                    {isCreating ? <><SpinnerIcon /> Reporting...</> : <><BugIcon /> Report Bug</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#f87171]/20 bg-[#f87171]/[0.03] py-4 text-sm text-[#f87171]/60 hover:border-[#f87171]/30 hover:text-[#f87171]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to report bugs
                  </button>
                )}
              </div>
            )}

            {/* Close */}
            {activeTab === "close" && (
              <div className="space-y-5">
                <MethodSignature name="close_bug" params="(id: String)" color="#34d399" />
                <Input label="Bug ID" value={closeId} onChange={(e) => setCloseId(e.target.value)} placeholder="e.g. BUG-001" />

                {walletAddress ? (
                  <ShimmerButton onClick={handleCloseBug} disabled={isClosing} shimmerColor="#34d399" className="w-full">
                    {isClosing ? <><SpinnerIcon /> Closing...</> : <><CheckIcon /> Close Bug</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#34d399]/20 bg-[#34d399]/[0.03] py-4 text-sm text-[#34d399]/60 hover:border-[#34d399]/30 hover:text-[#34d399]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to close bugs
                  </button>
                )}
              </div>
            )}

            {/* List */}
            {activeTab === "list" && (
              <div className="space-y-5">
                <MethodSignature name="list_bugs" params="()" returns="-> Vec<Symbol>" color="#fbbf24" />
                <ShimmerButton onClick={handleListBugs} disabled={isListing} shimmerColor="#fbbf24" className="w-full">
                  {isListing ? <><SpinnerIcon /> Loading...</> : <><ListIcon /> List All Bugs</>}
                </ShimmerButton>

                {bugList.length > 0 && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-fade-in-up">
                    <div className="border-b border-white/[0.06] px-4 py-3">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-white/25">All Bugs ({bugList.length})</span>
                    </div>
                    <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                      {bugList.map((id) => (
                        <div key={id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.02]">
                          <span className="font-mono text-sm text-white/80">{id}</span>
                          <span className="text-[10px] text-white/25">View to see status</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Bug Tracker &middot; Soroban</p>
            <div className="flex items-center gap-2">
              {["open", "closed"].map((s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={cn("h-1 w-1 rounded-full", STATUS_CONFIG[s]?.dot ?? "bg-white/20")} />
                  <span className="font-mono text-[9px] text-white/15 capitalize">{s}</span>
                  {i < 1 && <span className="text-white/10 text-[8px]">&rarr;</span>}
                </span>
              ))}
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}

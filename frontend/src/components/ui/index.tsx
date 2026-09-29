"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  ChevronRight,
  Compass,
  ExternalLink,
  FileSearch,
  FileText,
  Flame,
  Globe2,
  LayoutDashboard,
  Map,
  Menu,
  Network,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { fetchAlerts, fetchCases } from "@/lib/api";
import { AlertResponse, CaseDetail } from "@/lib/types";

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export function Panel({
  children,
  className = "",
  noPad = false,
  flat = false,
}: {
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
  flat?: boolean;
}) {
  return (
    <section
      className={cx(
        flat ? "card-flat" : "card-editorial",
        !noPad && "p-6 sm:p-7",
        className
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-line bg-paper-100/60 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
      <div className="space-y-1.5 max-w-2xl">
        {eyebrow && (
          <div className="editorial-kicker text-ink-faint">{eyebrow}</div>
        )}
        <h3 className="headline-sub text-ink">{title}</h3>
        {description && (
          <p className="text-xs leading-relaxed text-ink-soft">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 sm:pt-1">{action}</div>}
    </div>
  );
}

export function StatusBadge({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const v = (value || "").toUpperCase();
  const red = ["CRITICAL", "IMMINENT", "BLOCK", "FAILED"].some((x) =>
    v.includes(x)
  );
  const amber = ["HIGH", "VERIFY", "PENDING", "MEDIUM", "MODERATE"].some((x) =>
    v.includes(x)
  );
  const green = [
    "ALLOW",
    "RESOLVED",
    "ACKNOWLEDGED",
    "DISPATCHED",
    "OPERATIONAL",
    "ACTIVE",
  ].some((x) => v.includes(x));

  return (
    <span
      className={cx(
        "status-pill",
        red
          ? "status-pill-crimson"
          : amber
          ? "status-pill-amber"
          : green
          ? "status-pill-emerald"
          : "status-pill-slate",
        className
      )}
    >
      {v.replaceAll("_", " ")}
    </span>
  );
}

export function StatMetric({
  label,
  value,
  detail,
  context,
  tone = "neutral",
  href,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  context?: string;
  tone?: "emerald" | "crimson" | "amber" | "slate" | "neutral";
  href?: string;
}) {
  const content = (
    <div className="card-editorial p-6 sm:p-7 group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-3">
        <div className="editorial-kicker text-ink-faint">{label}</div>
        {context && (
          <span className="mono text-[9px] uppercase tracking-wider text-ink-faint bg-paper-100 px-2 py-0.5 border border-line">
            {context}
          </span>
        )}
      </div>
      <div className="mt-3.5 flex items-baseline gap-2">
        <div className="font-editorial text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
          {value}
        </div>
      </div>
      {detail && (
        <div className="mt-2 text-xs text-ink-soft flex items-center justify-between">
          <span>{detail}</span>
          {href && (
            <ArrowUpRight
              size={13}
              className="text-ink-faint group-hover:text-shield-emerald transition-colors"
            />
          )}
        </div>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

export function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "slate",
  href,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  icon: React.ElementType;
  tone?: "slate" | "crimson" | "amber" | "emerald" | "green" | "red" | "cyan";
  href?: string;
}) {
  const content = (
    <div className="card-editorial p-6 sm:p-7 group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="editorial-kicker text-ink-faint">{label}</div>
          <div className="mt-3 font-editorial text-3xl font-extrabold tracking-tight text-ink">
            {value}
          </div>
          {detail && <div className="mt-2 text-xs text-ink-soft">{detail}</div>}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-paper-100 text-ink-soft">
          <Icon size={16} />
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cx(
        "animate-pulse bg-paper-200 border border-line-faint",
        className
      )}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center border border-dashed border-line-strong bg-paper-100 p-8 text-center">
      <div className="mb-3 border border-line bg-paper p-3 text-ink-soft">
        <FileSearch size={20} />
      </div>
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-ink-soft">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="border border-red-300 bg-shield-crimson-light/60 p-5">
      <div className="flex items-start gap-3.5">
        <Siren size={18} className="mt-0.5 text-shield-crimson shrink-0" />
        <div>
          <div className="text-sm font-bold text-shield-crimson">
            Intelligence feed unavailable
          </div>
          <div className="mt-1 text-xs leading-relaxed text-ink-muted">
            {message}
          </div>
          {retry && (
            <button
              onClick={retry}
              className="btn-editorial btn-editorial-quiet mt-4"
            >
              Retry connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const nav = [
  {
    group: "Surveillance & Triage",
    items: [
      { href: "/app", label: "Command Center", icon: LayoutDashboard },
    ],
  },
  {
    group: "Forensic Investigation",
    items: [
      {
        href: "/cases/CASE-2026-4401",
        label: "Case Investigations",
        icon: Network,
      },
      { href: "/cashout", label: "Cash-Out Surveillance", icon: Map },
    ],
  },
  {
    group: "Tactical Response",
    items: [{ href: "/alerts", label: "Alert Dispatch", icon: Siren }],
  },
  {
    group: "Institutional",
    items: [
      { href: "/about-the-data", label: "About The Data", icon: FileText },
      { href: "/", label: "Public Showcase", icon: ExternalLink },
    ],
  },
];

function Sidebar({
  mobileOpen,
  close,
}: {
  mobileOpen: boolean;
  close: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cx(
        "fixed inset-y-0 left-0 z-50 w-[264px] border-r border-line bg-paper-50 transition-transform duration-200 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Brand Header */}
        <div className="flex h-[88px] items-center justify-between border-b border-line px-6">
          <Link href="/app" onClick={close} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper-100 overflow-hidden">
              <img
                src="/logo.png"
                alt="UPIShield"
                width={40}
                height={40}
                className="h-10 w-10 object-cover"
              />
            </div>
            <div>
              <div className="font-editorial text-lg font-black tracking-tight text-ink">
                UPI<span className="text-shield-emerald">Shield</span>
              </div>
              <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-ink-faint">
                Cybercrime Intelligence
              </div>
            </div>
          </Link>
          <button
            className="text-ink-soft hover:text-ink lg:hidden p-1 border border-line"
            onClick={close}
            aria-label="Close navigation drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          {nav.map((section) => (
            <div key={section.group}>
              <div className="mb-2.5 px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-ink-faint">
                {section.group}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(
                          item.href.split("/").slice(0, 2).join("/")
                        );
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={cx(
                        "group flex h-11 items-center gap-3 border px-3 text-xs font-semibold transition-all duration-150",
                        active
                          ? "border-shield-emerald/40 bg-shield-emerald-light text-shield-emerald-dark"
                          : "border-transparent text-ink-soft hover:border-line hover:bg-paper-100 hover:text-ink"
                      )}
                    >
                      <Icon
                        size={16}
                        className={
                          active ? "text-shield-emerald" : "text-ink-faint group-hover:text-ink"
                        }
                      />
                      <span>{item.label}</span>
                      {active && (
                        <ChevronRight
                          size={14}
                          className="ml-auto text-shield-emerald"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Environment Status Badge */}
          <div className="border-t border-line pt-5">
            <div className="mb-2.5 px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-ink-faint">
              Operational Scope
            </div>
            <div className="border border-line bg-paper-100 p-4">
              <div className="flex items-center gap-2">
                <span className="pulse-subtle h-2 w-2 rounded-full bg-shield-emerald" />
                <span className="mono text-[10px] font-bold uppercase tracking-wider text-shield-emerald-dark">
                  Synthetic Telemetry
                </span>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-ink-soft">
                Multi-hop mule network analysis with ATM & CSP cash-out prediction models.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="border-t border-line bg-paper-100 px-6 py-4">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">
            <span>Operational Platform</span>
            <span className="mono font-semibold text-shield-emerald">ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ openMobile }: { openMobile: () => void }) {
  const [openSearch, setOpenSearch] = useState(false);
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchAlerts().then(setAlerts).catch(() => {});
    fetchCases().then(setCases).catch(() => {});
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch(true);
      }
      if (e.key === "Escape") setOpenSearch(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        cases: cases.slice(0, 4),
        accounts: cases.slice(0, 3).map((c) => ({
          case_id: c.id,
          title: c.title,
          upi: c.primary_mule_upi || "—",
          account: c.primary_mule_account || "—",
        })),
      };
    }

    const matchedCases = cases
      .filter((c) =>
        `${c.id} ${c.title} ${c.category}`.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedAccounts = cases
      .filter(
        (c) =>
          (c.primary_mule_upi && c.primary_mule_upi.toLowerCase().includes(q)) ||
          (c.primary_mule_account && c.primary_mule_account.toLowerCase().includes(q))
      )
      .map((c) => ({
        case_id: c.id,
        title: c.title,
        upi: c.primary_mule_upi || "—",
        account: c.primary_mule_account || "—",
      }))
      .slice(0, 4);

    return { cases: matchedCases, accounts: matchedAccounts };
  }, [query, cases]);

  const critical = alerts.some(
    (a) => a.priority === "CRITICAL" && a.status !== "RESOLVED"
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-[88px] border-b border-line bg-paper/95 backdrop-blur-md lg:left-[264px]">
      <div className="flex h-full items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={openMobile}
            className="border border-line bg-paper-50 p-2.5 text-ink-soft hover:text-ink lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
          <div className="hidden sm:block">
            <div className="editorial-kicker text-ink-faint">
              Financial Cybercrime Intelligence Platform
            </div>
            <div className="mt-1 text-sm font-semibold tracking-tight text-ink">
              Mule Network Forensics <span className="text-line-strong mx-1.5">/</span> Cash-Out Prediction
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search trigger */}
          <button
            onClick={() => setOpenSearch(true)}
            className="hidden md:flex h-10 w-[min(380px,32vw)] items-center gap-3 border border-line bg-paper-50 px-3.5 text-xs text-ink-faint hover:border-ink-soft hover:text-ink transition-colors shadow-subtle"
          >
            <Search size={14} />
            <span>Search case, mule account, UPI...</span>
            <kbd className="ml-auto border border-line bg-paper-100 px-1.5 py-0.5 mono text-[9px] text-ink-soft">
              ⌘K
            </kbd>
          </button>

          {/* System status pill */}
          <div className="hidden lg:flex h-10 items-center gap-2 border border-shield-emerald/30 bg-shield-emerald-light px-3.5">
            <span className="h-2 w-2 rounded-full bg-shield-emerald animate-pulse" />
            <span className="mono text-[10px] font-bold uppercase tracking-wider text-shield-emerald-dark">
              Model Online · NCR Hotspots
            </span>
          </div>

          {/* Alerts Bell */}
          <Link
            href="/alerts"
            className="relative flex h-10 w-10 items-center justify-center border border-line bg-paper-50 text-ink-soft hover:text-ink hover:border-ink-soft transition-colors shadow-subtle"
            aria-label="View Alerts"
          >
            <Bell size={16} />
            {critical && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-shield-crimson" />
            )}
          </Link>
        </div>
      </div>

      {/* Quick Search Dialog Modal */}
      {openSearch && (
        <div
          className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm p-4 flex items-start justify-center pt-[10vh]"
          onClick={() => setOpenSearch(false)}
        >
          <div
            className="w-full max-w-xl border border-line bg-paper-50 shadow-elevated overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 bg-white">
              <Search size={16} className="text-ink-faint shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpenSearch(false);
                  if (e.key === "Enter" && searchResults.cases[0]) {
                    router.push(`/cases/${searchResults.cases[0].id}`);
                    setOpenSearch(false);
                  }
                }}
                placeholder="Search by case code, victim, mule account or syndicate..."
                className="flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-ink-faint"
              />
              {/* Clickable ESC Pill */}
              <button
                type="button"
                onClick={() => setOpenSearch(false)}
                className="border border-line px-2 py-0.5 mono text-[9px] text-ink-faint hover:text-ink hover:bg-paper-100 transition-colors"
                title="Press Escape or click to close"
              >
                ESC
              </button>
              {/* Explicit X Close Button */}
              <button
                type="button"
                onClick={() => setOpenSearch(false)}
                className="p-1 text-ink-faint hover:text-ink hover:bg-paper-100 transition-colors border border-transparent hover:border-line"
                aria-label="Close search"
              >
                <X size={15} />
              </button>
            </div>

            {/* Grouped Results Container */}
            <div className="max-h-[420px] overflow-y-auto p-3 space-y-4">
              {/* Group 1: Investigations */}
              <div>
                <div className="px-2 pb-1.5 text-[9px] uppercase font-bold tracking-[0.2em] text-ink-faint border-b border-line-faint">
                  Active Investigations ({searchResults.cases.length})
                </div>
                {searchResults.cases.length ? (
                  <div className="divide-y divide-line-faint">
                    {searchResults.cases.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          router.push(`/cases/${c.id}`);
                          setOpenSearch(false);
                        }}
                        className="flex w-full items-center gap-3 p-2.5 text-left hover:bg-paper-100 transition-colors group"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-line bg-paper-100 text-shield-emerald group-hover:border-shield-emerald">
                          <Network size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="mono text-[10px] font-bold text-shield-emerald">
                              {c.id}
                            </span>
                            <StatusBadge
                              value={c.risk_evaluation?.decision || c.status}
                            />
                          </div>
                          <div className="truncate text-xs font-semibold text-ink mt-0.5">
                            {c.title}
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-ink-faint group-hover:text-ink" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-[11px] text-ink-faint">
                    No investigations match current query.
                  </div>
                )}
              </div>

              {/* Group 2: Mule Accounts & VPAs */}
              {searchResults.accounts.length > 0 && (
                <div>
                  <div className="px-2 pb-1.5 text-[9px] uppercase font-bold tracking-[0.2em] text-ink-faint border-b border-line-faint">
                    Identified Mule Accounts &amp; VPAs ({searchResults.accounts.length})
                  </div>
                  <div className="divide-y divide-line-faint">
                    {searchResults.accounts.map((acc, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          router.push(`/cases/${acc.case_id}`);
                          setOpenSearch(false);
                        }}
                        className="flex w-full items-center gap-3 p-2.5 text-left hover:bg-paper-100 transition-colors group"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-line bg-paper-100 text-shield-crimson group-hover:border-shield-crimson">
                          <AlertTriangle size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mono text-[11px] font-bold text-ink truncate">
                            {acc.upi}
                          </div>
                          <div className="text-[10px] text-ink-faint truncate">
                            Linked to: {acc.case_id} · {acc.title}
                          </div>
                        </div>
                        <span className="mono text-[9px] text-shield-emerald font-bold">
                          Inspect →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Public marketing pages do not show the workspace sidebar / topbar chrome
  const isPublicPage = pathname === "/" || pathname === "/about-the-data";

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-atmosphere min-h-screen text-ink">
      <Sidebar mobileOpen={mobileOpen} close={() => setMobileOpen(false)} />
      <Topbar openMobile={() => setMobileOpen(true)} />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <main className="min-h-screen pt-[88px] lg:ml-[264px]">
        <div className="page-container px-4 py-8 sm:px-8 lg:px-12">
          {children}
        </div>
      </main>
      <footer className="border-t border-line bg-paper-100 py-6 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-ink-faint lg:ml-[264px]">
        UPIShield · Financial Cybercrime Intelligence &amp; Cash-Out Prediction
      </footer>
    </div>
  );
}


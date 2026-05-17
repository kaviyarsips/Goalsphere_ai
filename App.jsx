import { useState } from "react";
import {
  LayoutDashboard, Target, CalendarCheck, BarChart3,
  Users, Plus, Trash2, Eye, EyeOff, LogOut,
  Shield, UserCheck, ChevronRight, Sparkles,
  CheckCircle, XCircle, Lock, Unlock, Bell,
  TrendingUp, AlertTriangle, FileText, Send,
  Clock, Zap, AlertCircle, RefreshCw, ShieldAlert
} from "lucide-react";

// ─── Demo credentials ─────────────────────────────────────────────────────────
const DEMO_USERS = [
  { id: 1, name: "Kaviyarasi R",  initials: "KR", email: "employee@gs.com",  password: "demo123", role: "EMPLOYEE", dept: "Engineering" },
  { id: 2, name: "Arjun Mehta",   initials: "AM", email: "employee2@gs.com", password: "demo123", role: "EMPLOYEE", dept: "Sales"        },
  { id: 3, name: "Priya Sharma",  initials: "PS", email: "manager@gs.com",   password: "demo123", role: "MANAGER",  dept: "Engineering" },
  { id: 4, name: "HR Admin",      initials: "HA", email: "admin@gs.com",     password: "demo123", role: "ADMIN",    dept: "HR"          },
];

// ─── Seed goals ───────────────────────────────────────────────────────────────
const SEED_GOALS = [
  { id: 1, userId: 1, title: "Increase Team Productivity",  desc: "Improve sprint delivery by 20%",  progress: 70, status: "Approved", weight: 25, locked: false, checkins: { Q1: { actual: 65, comment: "Good start" }, Q2: { actual: 72, comment: "" } } },
  { id: 2, userId: 1, title: "Customer NPS Score",          desc: "Reach NPS of 60+ by Q4",          progress: 45, status: "Pending",  weight: 25, locked: false, checkins: {} },
  { id: 3, userId: 1, title: "Cost Optimisation",           desc: "Reduce infra cost by 15%",         progress: 80, status: "Approved", weight: 20, locked: true,  checkins: { Q1: { actual: 80, comment: "On track" } } },
  { id: 4, userId: 2, title: "Increase Sales Revenue",      desc: "Grow Q2 revenue by 20%",           progress: 60, status: "Pending",  weight: 15, locked: false, checkins: {} },
  { id: 5, userId: 2, title: "Expand Client Accounts",      desc: "Onboard 5 new enterprise clients", progress: 40, status: "Approved", weight: 15, locked: false, checkins: { Q1: { actual: 35, comment: "" } } },
];

const AUDIT_SEED = [
  { id: 1, user: "Kaviyarasi R", action: "Goal Created",      detail: "Increase Team Productivity", time: "2h ago",  icon: "🎯" },
  { id: 2, user: "Priya Sharma", action: "Goal Approved",     detail: "Cost Optimisation",           time: "3h ago",  icon: "✅" },
  { id: 3, user: "Arjun Mehta",  action: "Check-in Saved",   detail: "Q1 · 35% actual",             time: "5h ago",  icon: "📊" },
  { id: 4, user: "HR Admin",     action: "Goal Unlocked",     detail: "Increase Team Productivity",  time: "1d ago",  icon: "🔓" },
  { id: 5, user: "Kaviyarasi R", action: "AI Suggestion Used",detail: "Improve sales → SMART goal",  time: "1d ago",  icon: "🤖" },
];

// ─── Escalation seed data ─────────────────────────────────────────────────────
const SEED_ESCALATIONS = [
  {
    id: 1, employeeId: 2, employeeName: "Arjun Mehta", dept: "Sales",
    trigger: "GOAL_NOT_SUBMITTED", conditionDays: 7,
    description: "Goals not submitted within 7 days of cycle open",
    currentStage: 1,
    stages: [
      { level: 1, target: "Employee",    notifiedAt: "2025-05-10 09:00", method: "Email", status: "SENT"    },
      { level: 2, target: "Manager",     notifiedAt: null,               method: "Email", status: "PENDING" },
      { level: 3, target: "HR / Admin",  notifiedAt: null,               method: "Email", status: "PENDING" },
    ],
    status: "OPEN", createdAt: "2025-05-10", resolvedAt: null, resolvedBy: null,
    notes: ""
  },
  {
    id: 2, employeeId: 1, employeeName: "Kaviyarasi R", dept: "Engineering",
    trigger: "APPROVAL_DELAYED", conditionDays: 5,
    description: "Manager has not approved goals within 5 days of submission",
    currentStage: 2,
    stages: [
      { level: 1, target: "Employee",    notifiedAt: "2025-05-08 10:00", method: "Email", status: "SENT" },
      { level: 2, target: "Manager",     notifiedAt: "2025-05-11 10:00", method: "Email", status: "SENT" },
      { level: 3, target: "HR / Admin",  notifiedAt: null,               method: "Email", status: "PENDING" },
    ],
    status: "OPEN", createdAt: "2025-05-08", resolvedAt: null, resolvedBy: null,
    notes: "Manager Priya notified twice"
  },
  {
    id: 3, employeeId: 2, employeeName: "Arjun Mehta", dept: "Sales",
    trigger: "CHECKIN_OVERDUE", conditionDays: 10,
    description: "Q1 quarterly check-in not completed within active window",
    currentStage: 3,
    stages: [
      { level: 1, target: "Employee",    notifiedAt: "2025-04-30 09:00", method: "Email", status: "SENT" },
      { level: 2, target: "Manager",     notifiedAt: "2025-05-05 09:00", method: "Email", status: "SENT" },
      { level: 3, target: "HR / Admin",  notifiedAt: "2025-05-10 09:00", method: "Email", status: "SENT" },
    ],
    status: "OPEN", createdAt: "2025-04-30", resolvedAt: null, resolvedBy: null,
    notes: "All three levels notified. Awaiting action."
  },
  {
    id: 4, employeeId: 1, employeeName: "Kaviyarasi R", dept: "Engineering",
    trigger: "CHECKIN_OVERDUE", conditionDays: 3,
    description: "Q2 quarterly check-in not completed within active window",
    currentStage: 1,
    stages: [
      { level: 1, target: "Employee",    notifiedAt: "2025-05-12 09:00", method: "Email", status: "SENT"    },
      { level: 2, target: "Manager",     notifiedAt: null,               method: "Email", status: "PENDING" },
      { level: 3, target: "HR / Admin",  notifiedAt: null,               method: "Email", status: "PENDING" },
    ],
    status: "RESOLVED", createdAt: "2025-05-12", resolvedAt: "2025-05-13", resolvedBy: "Priya Sharma",
    notes: "Employee completed check-in after reminder"
  },
];

// ─── Escalation rule config ───────────────────────────────────────────────────
const ESCALATION_RULES = [
  {
    id: "RULE_001",
    trigger: "GOAL_NOT_SUBMITTED",
    label: "Goal Not Submitted",
    description: "Employee has not submitted goals within N days of cycle open",
    thresholdDays: 7,
    chain: [
      { day: 0,  target: "Employee",   action: "Send reminder email" },
      { day: 3,  target: "Manager",    action: "Notify line manager" },
      { day: 7,  target: "HR / Admin", action: "Escalate to HR & skip-level" },
    ],
    active: true,
    color: "#f59e0b", icon: "📋"
  },
  {
    id: "RULE_002",
    trigger: "APPROVAL_DELAYED",
    label: "Approval Delayed",
    description: "Manager has not approved goals within N days of submission",
    thresholdDays: 5,
    chain: [
      { day: 0, target: "Manager",    action: "Send approval reminder" },
      { day: 3, target: "Manager",    action: "Second reminder + flag" },
      { day: 5, target: "HR / Admin", action: "Escalate to HR for intervention" },
    ],
    active: true,
    color: "#f97316", icon: "⏳"
  },
  {
    id: "RULE_003",
    trigger: "CHECKIN_OVERDUE",
    label: "Check-in Overdue",
    description: "Quarterly check-in not completed within the active window",
    thresholdDays: 10,
    chain: [
      { day: 0,  target: "Employee",   action: "Auto-reminder to complete check-in" },
      { day: 5,  target: "Manager",    action: "Notify manager to follow up" },
      { day: 10, target: "HR / Admin", action: "Critical escalation to HR + skip-level" },
    ],
    active: true,
    color: "#ef4444", icon: "🚨"
  },
];

const TRIGGER_LABELS = {
  GOAL_NOT_SUBMITTED: "Goal Not Submitted",
  APPROVAL_DELAYED:   "Approval Delayed",
  CHECKIN_OVERDUE:    "Check-in Overdue",
};

const TRIGGER_COLORS = {
  GOAL_NOT_SUBMITTED: { bg: "#2a1800", color: "#f59e0b", border: "rgba(245,158,11,0.3)"  },
  APPROVAL_DELAYED:   { bg: "#2d1500", color: "#f97316", border: "rgba(249,115,22,0.3)"  },
  CHECKIN_OVERDUE:    { bg: "#2d0a0a", color: "#ef4444", border: "rgba(239,68,68,0.3)"   },
};

const STAGE_COLORS = { SENT: "#10b981", PENDING: "#546a8f" };

const THRUSTS = ["Revenue Growth","Cost Reduction","Customer Satisfaction","Process Improvement","Innovation","People Development","Quality","Other"];

// ─── AI Rewrite ───────────────────────────────────────────────────────────────
function aiRewrite(input) {
  const map = {
    sales:       "Increase quarterly sales revenue by 18% through targeted outreach before Q3.",
    productivity:"Improve team sprint velocity by 20% via daily standups and retrospectives by Q2.",
    customer:    "Achieve NPS of 65+ by resolving top-5 customer pain points before Q4.",
    cost:        "Reduce infrastructure costs by 15% through vendor renegotiation by Q3.",
    quality:     "Reduce defect rate below 2% by implementing automated testing across 80% of paths.",
    training:    "Complete 3 industry certifications and run 2 knowledge-sharing sessions by Q4.",
    revenue:     "Grow ARR by 25% through upsell and expansion within existing accounts.",
    innovation:  "Ship 3 high-impact features with >40% user adoption within 60 days of launch.",
    retention:   "Improve retention to 92%+ through structured career development plans by Q3.",
  };
  const lower = (input || "").toLowerCase();
  for (const [k, v] of Object.entries(map)) if (lower.includes(k)) return v;
  return `Achieve measurable improvement in "${input}" by defining clear KPIs and tracking quarterly progress, targeting a 15% gain by Q2.`;
}

// ─── Colour helpers ───────────────────────────────────────────────────────────
const STATUS_COLOR = {
  Approved: ["#10b981","#052e1c"],
  Pending:  ["#f59e0b","#2a1800"],
  Returned: ["#ef4444","#2d0a0a"],
  Draft:    ["#64748b","#1a2235"],
  Locked:   ["#8b5cf6","#1a1030"]
};
const progressColor = p => p >= 80 ? "#10b981" : p >= 50 ? "#3b7ff5" : p >= 25 ? "#f59e0b" : "#ef4444";

// ─── Shared input style ───────────────────────────────────────────────────────
const IS = {
  background: "#0d1424", border: "1px solid #1e2f4a", borderRadius: 9,
  padding: "9px 12px", color: "#e8eef8", fontSize: 13, outline: "none",
  boxSizing: "border-box", width: "100%"
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [tab, setTab]           = useState("EMPLOYEE");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const TABS = [
    { key: "EMPLOYEE", label: "Employee",   icon: "👤", color: "#3b7ff5" },
    { key: "MANAGER",  label: "Manager",    icon: "👔", color: "#8b5cf6" },
    { key: "ADMIN",    label: "HR / Admin", icon: "🛡️", color: "#f59e0b" },
  ];

  const quickFill = (role) => {
    const map = { EMPLOYEE: ["employee@gs.com","demo123"], MANAGER: ["manager@gs.com","demo123"], ADMIN: ["admin@gs.com","demo123"] };
    setEmail(map[role][0]); setPassword(map[role][1]); setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    setTimeout(() => {
      const found = DEMO_USERS.find(u => u.email === email && u.password === password && u.role === tab);
      if (found) { onLogin(found); }
      else { setError("Invalid credentials. Use the Quick Fill buttons below."); }
      setLoading(false);
    }, 600);
  };

  const activeTab = TABS.find(t => t.key === tab);

  return (
    <div style={{ minHeight: "100vh", background: "#070b14", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI', Arial, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,127,245,0.07) 0%,transparent 70%)", top: -200, left: -200, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)", bottom: -100, right: -100, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, background: "linear-gradient(135deg,#3b7ff5,#8b5cf6)", borderRadius: 18, marginBottom: 16, boxShadow: "0 0 36px rgba(59,127,245,0.3)" }}>
            <Target size={30} color="#fff" />
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#e8eef8", letterSpacing: "-0.5px" }}>GoalSphere <span style={{ color: "#3b7ff5" }}>AI</span></h1>
          <p style={{ color: "#546a8f", marginTop: 6, fontSize: 13 }}>Enterprise Performance Management Portal</p>
        </div>

        <div style={{ background: "#111827", border: "1px solid #1e2f4a", borderRadius: 20, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "#0d1424", borderRadius: 12, padding: 4 }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setError(""); setEmail(""); setPassword(""); }}
                style={{ flex: 1, padding: "9px 4px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: tab === t.key ? t.color : "transparent", color: tab === t.key ? "#fff" : "#546a8f" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 600, color: "#e8eef8" }}>Sign in as {activeTab.label}</h2>
          <p style={{ margin: "0 0 22px", fontSize: 12, color: "#546a8f" }}>Access your performance dashboard</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8fa3c8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder={`${tab.toLowerCase()}@gs.com`}
                style={{ ...IS, borderRadius: 10, padding: "11px 14px", fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8fa3c8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  style={{ ...IS, borderRadius: 10, padding: "11px 42px 11px 14px", fontSize: 14 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#546a8f", cursor: "pointer", display: "flex" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div style={{ background: "#2d0a0a", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#ef4444", marginBottom: 14 }}>⚠ {error}</div>}

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: 13, background: activeTab.color, border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? "Signing in…" : <><span>Sign In</span><ChevronRight size={16} /></>}
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #1e2f4a" }}>
            <p style={{ fontSize: 11, color: "#546a8f", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Quick Demo Fill</p>
            <div style={{ display: "flex", gap: 6 }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => { setTab(t.key); quickFill(t.key); }}
                  style={{ flex: 1, padding: "7px 4px", background: "#0d1424", border: `1px solid ${tab === t.key && email ? t.color : "#1e2f4a"}`, borderRadius: 8, color: t.color, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#546a8f", marginTop: 10, textAlign: "center" }}>All passwords: <span style={{ color: "#3b7ff5", fontWeight: 600 }}>demo123</span></p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 22 }}>
          {["🤖 AI-Powered","🔒 Secure","📊 Analytics"].map(l => (
            <span key={l} style={{ fontSize: 11, color: "#546a8f" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK-INS  (extracted component — avoids stale-closure on per-row state)
// ═══════════════════════════════════════════════════════════════════════════════
function CheckInRow({ goal, selectedQ, onSave }) {
  const existing = goal.checkins?.[selectedQ] || {};
  const [planned, setPlanned]   = useState(String(goal.target || ""));
  const [actual,  setActual]    = useState(existing.actual !== undefined ? String(existing.actual) : "");
  const [comment, setComment]   = useState(existing.comment || "");
  const [saved,   setSaved]     = useState(false);

  const handleSave = () => {
    onSave(goal.id, selectedQ, Number(actual) || 0, comment);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: "#0d1424", border: "1px solid #1e2f4a", borderRadius: 14, padding: 20, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#e8eef8" }}>{goal.title}</h4>
          <p style={{ marginTop: 4, color: "#546a8f", fontSize: 12 }}>{goal.desc}</p>
        </div>
        <span style={{ background: goal.progress >= 70 ? "#052e1c" : "#2a1800", color: goal.progress >= 70 ? "#10b981" : "#f59e0b", padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, height: "fit-content" }}>
          {goal.progress}% Complete
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: 12, color: "#8fa3c8", marginBottom: 6, display: "block", textTransform: "uppercase", fontSize: 11, letterSpacing: "0.5px" }}>Planned Target</label>
          <input value={planned} onChange={e => setPlanned(e.target.value)} placeholder="Planned KPI"
            style={{ ...IS, background: "#111827", borderRadius: 10, padding: "10px 12px" }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: "#8fa3c8", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Actual Achievement</label>
          <input value={actual} onChange={e => setActual(e.target.value)} placeholder="Actual Result"
            style={{ ...IS, background: "#111827", borderRadius: 10, padding: "10px 12px" }} />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, color: "#8fa3c8", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Manager Comments</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Manager review comments…" rows={2}
          style={{ ...IS, background: "#111827", borderRadius: 10, padding: "10px 12px", resize: "vertical" }} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: "#8fa3c8" }}>Progress</span>
          <span style={{ fontSize: 12, color: progressColor(goal.progress), fontWeight: 700 }}>{goal.progress}%</span>
        </div>
        <div style={{ height: 7, background: "#1a2235", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${goal.progress}%`, background: progressColor(goal.progress), borderRadius: 10 }} />
        </div>
      </div>

      <button onClick={handleSave}
        style={{ background: saved ? "#052e1c" : "#3b7ff5", border: saved ? "1px solid rgba(16,185,129,0.3)" : "none", color: saved ? "#10b981" : "#fff", padding: "9px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
        {saved ? "✓ Saved!" : "Save Check-in"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ESCALATION MODULE
// ═══════════════════════════════════════════════════════════════════════════════
function EscalationModule({ escalations, setEscalations, currentUser, addAudit, toast }) {
  const [activeView, setActiveView] = useState("log");   // log | rules
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [expandedId, setExpandedId]   = useState(null);
  const [noteModal, setNoteModal]     = useState(null);
  const [noteText, setNoteText]       = useState("");

  const openEsc    = escalations.filter(e => e.status === "OPEN");
  const resolvedEsc = escalations.filter(e => e.status === "RESOLVED");
  const criticalCount = escalations.filter(e => e.status === "OPEN" && e.currentStage >= 3).length;
  const pendingNotif  = escalations.filter(e => e.status === "OPEN" && e.stages.some(s => s.status === "PENDING")).length;

  const filtered = escalations.filter(e =>
    filterStatus === "ALL" ? true : filterStatus === "OPEN" ? e.status === "OPEN" : e.status === "RESOLVED"
  );

  const escalateNext = (escId) => {
    setEscalations(prev => prev.map(e => {
      if (e.id !== escId || e.status === "RESOLVED") return e;
      const nextStageIdx = e.currentStage;           // currentStage is 1-based; pending stages are index currentStage
      if (nextStageIdx >= e.stages.length) return e; // all stages already sent
      const updatedStages = e.stages.map((s, i) => {
        if (i === nextStageIdx) return { ...s, status: "SENT", notifiedAt: new Date().toLocaleString() };
        return s;
      });
      const newStage = Math.min(e.currentStage + 1, e.stages.length);
      addAudit("Escalation Sent", `${TRIGGER_LABELS[e.trigger]} · ${e.stages[nextStageIdx].target}`);
      toast(`Notification sent to ${e.stages[nextStageIdx].target} ✓`);
      return { ...e, stages: updatedStages, currentStage: newStage };
    }));
  };

  const resolveEsc = (escId) => {
    const note = noteText.trim() || "Resolved by " + currentUser.name;
    setEscalations(prev => prev.map(e => {
      if (e.id !== escId) return e;
      return { ...e, status: "RESOLVED", resolvedAt: new Date().toLocaleDateString(), resolvedBy: currentUser.name, notes: note };
    }));
    addAudit("Escalation Resolved", escalations.find(e => e.id === escId)?.description || "");
    toast("Escalation resolved ✓");
    setNoteModal(null); setNoteText("");
  };

  const VIEWS = [
    { key: "log",   label: "Escalation Log",     icon: FileText    },
    { key: "rules", label: "Automation Rules",    icon: Zap         },
  ];

  const stageLabel = (stageNum) => ["Employee", "Manager", "HR / Admin"][stageNum - 1] || "HR";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        {[
          ["Total",        escalations.length,    "📋", "#3b7ff5"],
          ["Open",         openEsc.length,         "🔴", "#ef4444"],
          ["Critical",     criticalCount,          "🚨", "#f97316"],
          ["Pending Notif",pendingNotif,           "📨", "#f59e0b"],
          ["Resolved",     resolvedEsc.length,     "✅", "#10b981"],
        ].map(([l, v, ic, c]) => (
          <div key={l} style={{ background: "#111827", border: `1px solid ${c}22`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "#546a8f", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{l}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{ic}</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#e8eef8" }}>{v}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 6, background: "#0d1424", borderRadius: 10, padding: 4, alignSelf: "flex-start" }}>
        {VIEWS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveView(key)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: activeView === key ? "#1e3a5f" : "transparent", color: activeView === key ? "#60a5fa" : "#546a8f" }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* ── ESCALATION LOG ──────────────────────────────────────────────────── */}
      {activeView === "log" && (
        <div style={{ background: "#111827", border: "1px solid #1e2f4a", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#e8eef8" }}>Escalation Log</h3>
            <div style={{ display: "flex", gap: 6 }}>
              {["ALL","OPEN","RESOLVED"].map(f => (
                <button key={f} onClick={() => setFilterStatus(f)}
                  style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    background: filterStatus === f ? "#1e3a5f" : "transparent",
                    color: filterStatus === f ? "#60a5fa" : "#546a8f" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#546a8f" }}>
              <AlertTriangle size={32} color="#1e2f4a" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>No escalations</div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(esc => {
              const tc   = TRIGGER_COLORS[esc.trigger] || TRIGGER_COLORS.CHECKIN_OVERDUE;
              const isExp = expandedId === esc.id;
              const isResolved = esc.status === "RESOLVED";
              const nextPending = esc.stages.find(s => s.status === "PENDING");

              return (
                <div key={esc.id} style={{ background: "#0d1424", border: `1px solid ${isResolved ? "rgba(16,185,129,0.15)" : tc.border}`, borderRadius: 12, overflow: "hidden" }}>

                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", flexWrap: "wrap" }}
                    onClick={() => setExpandedId(isExp ? null : esc.id)}>

                    {/* Trigger badge */}
                    <span style={{ fontSize: 11, fontWeight: 700, color: tc.color, background: tc.bg, padding: "3px 10px", borderRadius: 20, border: `1px solid ${tc.border}`, whiteSpace: "nowrap" }}>
                      {TRIGGER_LABELS[esc.trigger]}
                    </span>

                    {/* Employee */}
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e8eef8" }}>{esc.employeeName}</div>
                      <div style={{ fontSize: 11, color: "#546a8f" }}>{esc.dept} · Since {esc.createdAt}</div>
                    </div>

                    {/* Stage indicator */}
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      {esc.stages.map((s, i) => (
                        <div key={i} title={s.target} style={{ width: 24, height: 24, borderRadius: "50%", background: s.status === "SENT" ? "#10b981" : "#1a2235", border: `2px solid ${s.status === "SENT" ? "#10b981" : "#334155"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: s.status === "SENT" ? "#fff" : "#546a8f" }}>
                          L{s.level}
                        </div>
                      ))}
                      <span style={{ fontSize: 10, color: "#546a8f", marginLeft: 4 }}>
                        {isResolved ? "Resolved" : `Stage ${esc.currentStage}/${esc.stages.length}`}
                      </span>
                    </div>

                    {/* Status pill */}
                    <span style={{ fontSize: 11, fontWeight: 600, color: isResolved ? "#10b981" : "#f59e0b", background: isResolved ? "#052e1c" : "#2a1800", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                      {esc.status}
                    </span>

                    <span style={{ fontSize: 14, color: "#546a8f" }}>{isExp ? "▲" : "▼"}</span>
                  </div>

                  {/* Expanded detail */}
                  {isExp && (
                    <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e2f4a" }}>
                      <p style={{ fontSize: 12, color: "#8fa3c8", margin: "12px 0 14px" }}>{esc.description}</p>

                      {/* Escalation chain timeline */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#546a8f", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Escalation Chain</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {esc.stages.map((s, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.status === "SENT" ? "#052e1c" : "#1a2235", border: `2px solid ${s.status === "SENT" ? "#10b981" : "#334155"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {s.status === "SENT" ? <CheckCircle size={13} color="#10b981" /> : <Clock size={13} color="#546a8f" />}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: s.status === "SENT" ? "#e8eef8" : "#546a8f" }}>
                                  Level {s.level}: {s.target}
                                </div>
                                <div style={{ fontSize: 11, color: "#334155" }}>
                                  {s.notifiedAt ? `Notified: ${s.notifiedAt}` : "Pending"}
                                </div>
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 600, color: s.status === "SENT" ? "#10b981" : "#546a8f", background: s.status === "SENT" ? "#052e1c" : "#1a2235", padding: "2px 8px", borderRadius: 10 }}>
                                {s.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {esc.notes && (
                        <div style={{ background: "#111827", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#8fa3c8", marginBottom: 14 }}>
                          📝 {esc.notes}
                        </div>
                      )}

                      {isResolved ? (
                        <div style={{ background: "#052e1c", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#10b981" }}>
                          ✓ Resolved on {esc.resolvedAt} by {esc.resolvedBy}
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {/* Send next notification */}
                          {nextPending && (currentUser.role === "MANAGER" || currentUser.role === "ADMIN") && (
                            <button onClick={() => escalateNext(esc.id)}
                              style={{ display: "flex", alignItems: "center", gap: 6, background: "#0e1e3f", border: "1px solid rgba(59,127,245,0.3)", color: "#60a5fa", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                              <Send size={13} /> Notify {nextPending.target}
                            </button>
                          )}
                          {/* Resolve */}
                          {(currentUser.role === "MANAGER" || currentUser.role === "ADMIN") && (
                            <button onClick={() => { setNoteModal(esc.id); setNoteText(""); }}
                              style={{ display: "flex", alignItems: "center", gap: 6, background: "#052e1c", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                              <CheckCircle size={13} /> Mark Resolved
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AUTOMATION RULES ────────────────────────────────────────────────── */}
      {activeView === "rules" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#111827", border: "1px solid #1e2f4a", borderRadius: 14, padding: "20px 22px" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "#e8eef8" }}>Configured Escalation Rules</h3>
            <p style={{ margin: "0 0 18px", fontSize: 12, color: "#546a8f" }}>Rules that automatically trigger notifications and escalations based on defined conditions</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ESCALATION_RULES.map(rule => {
                const tc = TRIGGER_COLORS[rule.trigger] || TRIGGER_COLORS.CHECKIN_OVERDUE;
                return (
                  <div key={rule.id} style={{ background: "#0d1424", border: `1px solid ${tc.border}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tc.color}15`, border: `1px solid ${tc.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                          {rule.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#e8eef8" }}>{rule.label}</div>
                          <div style={{ fontSize: 12, color: "#546a8f", marginTop: 2 }}>{rule.description}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: tc.color, background: tc.bg, padding: "3px 10px", borderRadius: 20, border: `1px solid ${tc.border}` }}>
                          Threshold: {rule.thresholdDays}d
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#10b981", background: "#052e1c", padding: "3px 10px", borderRadius: 20 }}>● Active</span>
                      </div>
                    </div>

                    {/* Chain steps */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#546a8f", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Escalation Chain</div>
                    <div style={{ display: "flex", gap: 0, position: "relative" }}>
                      {rule.chain.map((step, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                          <div style={{ flex: 1, background: "#111827", border: "1px solid #1e2f4a", borderRadius: 9, padding: "9px 12px", minWidth: 0 }}>
                            <div style={{ fontSize: 10, color: "#546a8f", marginBottom: 3 }}>Day {step.day}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: tc.color }}>{step.target}</div>
                            <div style={{ fontSize: 11, color: "#8fa3c8", marginTop: 2 }}>{step.action}</div>
                          </div>
                          {i < rule.chain.length - 1 && (
                            <div style={{ width: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ color: "#334155", fontSize: 16 }}>→</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Resolve modal */}
      {noteModal && (
        <div onClick={() => setNoteModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#111827", border: "1px solid #1e2f4a", borderRadius: 18, padding: 28, width: "100%", maxWidth: 400, boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600, color: "#e8eef8" }}>Resolve Escalation</h3>
            <p style={{ fontSize: 12, color: "#546a8f", marginBottom: 14 }}>Add a resolution note before closing.</p>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Describe how the issue was resolved…" rows={3}
              style={{ ...IS, background: "#0d1424", borderRadius: 10, padding: "10px 12px", resize: "vertical", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setNoteModal(null)} style={{ flex: 1, padding: 11, background: "transparent", border: "1px solid #1e2f4a", borderRadius: 10, color: "#8fa3c8", cursor: "pointer", fontSize: 13 }}>Cancel</button>
              <button onClick={() => resolveEsc(noteModal)} style={{ flex: 2, padding: 11, background: "#052e1c", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, color: "#10b981", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✓ Confirm Resolve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser]           = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [goals, setGoals]         = useState(SEED_GOALS);
  const [escalations, setEscalations] = useState(SEED_ESCALATIONS);
  const [auditLogs, setAuditLogs] = useState(AUDIT_SEED);
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal]   = useState(null);
  const [notif, setNotif]         = useState(null);
  const [selectedQ, setSelectedQ] = useState("Q1");
  const [returnModal, setReturnModal]   = useState(null);
  const [returnComment, setReturnComment] = useState("");
  const [aiSuggest, setAiSuggest] = useState("");
  const [aiResult, setAiResult]   = useState("");

  if (!user) return <LoginPage onLogin={u => { setUser(u); setActiveTab("dashboard"); }} />;

  const myGoals = user.role === "EMPLOYEE" ? goals.filter(g => g.userId === user.id) : goals;
  const totalW  = myGoals.reduce((a, b) => a + b.weight, 0);
  const avgProg = myGoals.length ? Math.round(myGoals.reduce((a, b) => a + b.progress, 0) / myGoals.length) : 0;
  const pending = goals.filter(g => g.status === "Pending").length;
  const openEscCount = escalations.filter(e => e.status === "OPEN").length;

  const toast = (msg, type = "success") => { setNotif({ msg, type }); setTimeout(() => setNotif(null), 3000); };
  const addAudit = (action, detail, icon = "📝") => setAuditLogs(l => [{ id: Date.now(), user: user.name, action, detail, time: "just now", icon }, ...l]);

  // ── Goal CRUD ────────────────────────────────────────────────────────────────
  const saveGoal = (form) => {
    if (!form.title.trim()) { toast("Goal title required", "error"); return; }
    if (form.weight < 10)   { toast("Minimum 10% weightage", "error"); return; }
    const currentW = myGoals.filter(g => !editGoal || g.id !== editGoal.id).reduce((a, b) => a + b.weight, 0);
    if (currentW + form.weight > 100) { toast(`Weightage exceeds 100%. Available: ${100 - currentW}%`, "error"); return; }
    if (!editGoal && myGoals.length >= 8) { toast("Maximum 8 goals allowed", "error"); return; }
    if (editGoal) {
      setGoals(g => g.map(x => x.id === editGoal.id ? { ...x, ...form } : x));
      addAudit("Goal Edited", form.title, "✏️");
      toast("Goal updated ✓");
    } else {
      const ng = { id: Date.now(), userId: user.id, status: "Draft", locked: false, checkins: {}, ...form };
      setGoals(g => [...g, ng]);
      addAudit("Goal Created", form.title, "🎯");
      toast("Goal created ✓");
    }
    setShowModal(false); setEditGoal(null);
  };

  const deleteGoal = (id) => {
    const g = goals.find(x => x.id === id);
    if (g?.locked) { toast("Goal is locked", "error"); return; }
    setGoals(g => g.filter(x => x.id !== id));
    addAudit("Goal Deleted", g?.title, "🗑️");
    toast("Goal deleted");
  };

  const submitForApproval = (id) => {
    setGoals(g => g.map(x => x.id === id ? { ...x, status: "Pending" } : x));
    addAudit("Goal Submitted", goals.find(x => x.id === id)?.title, "📤");
    toast("Submitted for approval ✓");
  };

  const approveGoal = (id) => {
    setGoals(g => g.map(x => x.id === id ? { ...x, status: "Approved" } : x));
    addAudit("Goal Approved", goals.find(x => x.id === id)?.title, "✅");
    toast("Goal approved ✓");
  };

  const returnGoal = (id, comment) => {
    setGoals(g => g.map(x => x.id === id ? { ...x, status: "Returned", managerComment: comment } : x));
    addAudit("Goal Returned", goals.find(x => x.id === id)?.title, "↩️");
    toast("Goal returned with comment");
    setReturnModal(null); setReturnComment("");
  };

  const toggleLock = (id) => {
    const g = goals.find(x => x.id === id);
    setGoals(goals => goals.map(x => x.id === id ? { ...x, locked: !x.locked } : x));
    addAudit(g?.locked ? "Goal Unlocked" : "Goal Locked", g?.title, g?.locked ? "🔓" : "🔒");
    toast(g?.locked ? "Goal unlocked" : "Goal locked");
  };

  const saveCheckin = (goalId, q, actual, comment) => {
    setGoals(g => g.map(x => x.id === goalId ? { ...x, progress: Math.min(100, Math.round(actual)), checkins: { ...x.checkins, [q]: { actual, comment } } } : x));
    addAudit("Check-in Saved", `${q} · ${actual} actual`, "📊");
    toast("Check-in saved ✓");
  };

  // ── Navigation config ────────────────────────────────────────────────────────
  const NAV = {
    EMPLOYEE: [
      ["dashboard",   "Dashboard",    LayoutDashboard],
      ["goals",       "My Goals",     Target],
      ["checkins",    "Check-ins",    CalendarCheck],
      ["analytics",   "Analytics",    BarChart3],
    ],
    MANAGER: [
      ["dashboard",   "Dashboard",    LayoutDashboard],
      ["goals",       "My Goals",     Target],
      ["team",        "Team Goals",   Users],
      ["checkins",    "Check-ins",    CalendarCheck],
      ["analytics",   "Analytics",    BarChart3],
      ["escalations", "Escalations",  AlertTriangle],
    ],
    ADMIN: [
      ["dashboard",   "Dashboard",    LayoutDashboard],
      ["admin",       "Admin Panel",  Shield],
      ["analytics",   "Analytics",    BarChart3],
      ["audit",       "Audit Logs",   FileText],
      ["team",        "All Users",    Users],
      ["escalations", "Escalations",  AlertTriangle],
    ],
  };
  const navItems = NAV[user.role] || NAV.EMPLOYEE;
  const ROLE_COLOR = { EMPLOYEE: "#3b7ff5", MANAGER: "#8b5cf6", ADMIN: "#f59e0b" };
  const rc = ROLE_COLOR[user.role];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070b14", color: "#e8eef8", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside style={{ width: 220, minWidth: 220, background: "#0d1424", borderRight: "1px solid #1e2f4a", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid #1e2f4a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#3b7ff5,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(59,127,245,0.25)", flexShrink: 0 }}>
              <Target size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>GoalSphere</div>
              <div style={{ fontSize: 10, color: "#3b7ff5", fontWeight: 600, letterSpacing: "0.5px" }}>AI PORTAL</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#546a8f", letterSpacing: "0.8px", padding: "4px 8px 8px", textTransform: "uppercase" }}>Menu</div>
          {navItems.map(([key, label, Icon]) => {
            const active = activeTab === key;
            return (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, border: "none", background: active ? "rgba(59,127,245,0.15)" : "transparent", color: active ? "#fff" : "#8fa3c8", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 2, textAlign: "left", borderLeft: `2px solid ${active ? "#3b7ff5" : "transparent"}` }}>
                <Icon size={15} />
                {label}
                {key === "team" && pending > 0 && user.role === "MANAGER" && (
                  <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "1px 6px" }}>{pending}</span>
                )}
                {key === "escalations" && openEscCount > 0 && (
                  <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "1px 6px" }}>{openEscCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "12px 10px", borderTop: "1px solid #1e2f4a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#111827", borderRadius: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${rc}25`, border: `1px solid ${rc}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: rc, flexShrink: 0 }}>{user.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: rc, background: `${rc}20`, padding: "1px 6px", borderRadius: 4, display: "inline-block", marginTop: 2 }}>{user.role}</div>
            </div>
          </div>
          <button onClick={() => { setUser(null); setActiveTab("dashboard"); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 9, background: "transparent", border: "1px solid #1e2f4a", color: "#546a8f", cursor: "pointer", fontSize: 12 }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", borderBottom: "1px solid #1e2f4a", background: "#0d1424", position: "sticky", top: 0, zIndex: 10, gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Enterprise Goal Portal</h2>
            <p style={{ margin: "3px 0 0", color: "#546a8f", fontSize: 12 }}>FY 2025-26 · Welcome, {user.name.split(" ")[0]} 👋</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button style={{ background: "#111827", border: "1px solid #1e2f4a", padding: "9px 11px", borderRadius: 10, color: "#e8eef8", cursor: "pointer", fontSize: 15, position: "relative" }}>
              🔔 <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, background: "#ef4444", borderRadius: "50%" }} />
            </button>
            {(user.role === "EMPLOYEE" || user.role === "MANAGER") && (
              <button onClick={() => { setEditGoal(null); setShowModal(true); }}
                style={{ background: "#3b7ff5", border: "none", padding: "9px 16px", borderRadius: 10, color: "#fff", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                <Plus size={15} /> Add Goal
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>

          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 24 }}>
            {[
              ["Total Goals",       myGoals.length,    "🎯", "#3b7ff5"],
              ["Avg Progress",      `${avgProg}%`,     "📈", "#10b981"],
              ["Weightage Used",    `${totalW}%`,      "⚖️",  totalW===100?"#10b981":totalW>100?"#ef4444":"#f59e0b"],
              ["Pending Approvals", pending,           "⏳", "#f59e0b"],
            ].map(([label, val, icon, color]) => (
              <div key={label} style={{ background: "#111827", border: "1px solid #1e2f4a", borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "#546a8f", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{icon}</div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#e8eef8" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* ── DASHBOARD ─────────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
                <SBox title="Goal Health Overview">
                  {myGoals.slice(0,5).map(g => (
                    <div key={g.id} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: "#8fa3c8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{g.title}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: progressColor(g.progress), marginLeft: 8 }}>{g.progress}%</span>
                      </div>
                      <div style={{ height: 6, background: "#1a2235", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${g.progress}%`, background: progressColor(g.progress), borderRadius: 10 }} />
                      </div>
                    </div>
                  ))}
                </SBox>

                <SBox title="Recent Activity">
                  {auditLogs.slice(0,6).map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: i < 5 ? "1px solid #1e2f4a" : "none" }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: "#1a2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{a.action}</div>
                        <div style={{ fontSize: 11, color: "#546a8f" }}>{a.user} · {a.detail}</div>
                        <div style={{ fontSize: 10, color: "#3b4a60", marginTop: 2 }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </SBox>
              </div>

              <SBox title="Quarter Completion Heatmap">
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#546a8f", fontWeight: 600 }}>Employee</th>
                        {["Q1","Q2","Q3","Q4"].map(q => <th key={q} style={{ textAlign: "center", padding: "8px 12px", fontSize: 11, color: "#546a8f", fontWeight: 600 }}>{q}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[{name:"Kaviyarasi R",q:[85,72,0,0]},{name:"Arjun Mehta",q:[90,78,0,0]},{name:"Priya Sharma",q:[92,88,45,0]},{name:"Ravi Kumar",q:[65,55,0,0]}].map(row => (
                        <tr key={row.name}>
                          <td style={{ padding: "8px 12px", fontSize: 12, color: "#8fa3c8" }}>{row.name}</td>
                          {row.q.map((v, i) => {
                            const color = v === 0 ? "#1a2235" : v >= 80 ? "#10b981" : v >= 60 ? "#3b7ff5" : "#f59e0b";
                            return <td key={i} style={{ textAlign: "center", padding: "6px 12px" }}>
                              <div style={{ width: 42, height: 28, background: color, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: v === 0 ? "#546a8f" : "#fff" }}>{v || "—"}</div>
                            </td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SBox>
            </div>
          )}

          {/* ── MY GOALS ──────────────────────────────────────────────────── */}
          {activeTab === "goals" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ background: "#1a1030", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 14, padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Sparkles size={14} color="#8b5cf6" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#8b5cf6" }}>AI Goal Coach</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={aiSuggest} onChange={e => setAiSuggest(e.target.value)} placeholder="Type a rough goal idea… e.g. 'improve sales'"
                    style={{ flex: 1, background: "#0d1424", border: "1px solid #1e2f4a", borderRadius: 9, padding: "9px 12px", color: "#e8eef8", fontSize: 13, outline: "none" }} />
                  <button onClick={() => setAiResult(aiRewrite(aiSuggest))}
                    style={{ background: "#8b5cf6", border: "none", borderRadius: 9, padding: "9px 16px", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={13} /> Suggest
                  </button>
                </div>
                {aiResult && (
                  <div style={{ marginTop: 10, background: "#0d1424", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#c4b5fd", lineHeight: 1.5 }}>
                    💡 <em>"{aiResult}"</em>
                    <button onClick={() => { setEditGoal(null); setShowModal(true); }}
                      style={{ marginLeft: 12, fontSize: 11, background: "rgba(139,92,246,0.2)", border: "none", borderRadius: 5, color: "#8b5cf6", cursor: "pointer", padding: "3px 8px", fontWeight: 600 }}>Use This →</button>
                  </div>
                )}
              </div>

              <SBox title="Goal Sheet">
                <div style={{ background: "#0d1424", border: "1px solid #1e2f4a", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#546a8f" }}>Total Weightage</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: totalW===100?"#10b981":totalW>100?"#ef4444":"#f59e0b" }}>{totalW}% / 100%</span>
                  </div>
                  <div style={{ height: 5, background: "#1a2235", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(totalW,100)}%`, background: totalW===100?"#10b981":totalW>100?"#ef4444":"#3b7ff5", borderRadius: 10 }} />
                  </div>
                  {totalW === 100 && <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>✓ Fully allocated — ready to submit</div>}
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 550 }}>
                    <thead>
                      <tr>
                        {["Goal","Thrust","Progress","Weight","Status","Actions"].map(h => (
                          <th key={h} style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #1e2f4a", fontSize: 11, color: "#546a8f", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {myGoals.map(g => {
                        const [sc, sbg] = STATUS_COLOR[g.status] || ["#546a8f","#1a2235"];
                        return (
                          <tr key={g.id} style={{ borderBottom: "1px solid #111827" }}>
                            <td style={{ padding: "12px", maxWidth: 180 }}>
                              <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.title}</div>
                              {g.locked && <span style={{ fontSize: 10, color: "#8b5cf6" }}>🔒 Locked</span>}
                            </td>
                            <td style={{ padding: "12px", fontSize: 12, color: "#546a8f", whiteSpace: "nowrap" }}>{g.thrustArea || "—"}</td>
                            <td style={{ padding: "12px", minWidth: 100 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ flex: 1, height: 5, background: "#1a2235", borderRadius: 10, overflow: "hidden" }}>
                                  <div style={{ height: "100%", width: `${g.progress}%`, background: progressColor(g.progress), borderRadius: 10 }} />
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: progressColor(g.progress), minWidth: 30 }}>{g.progress}%</span>
                              </div>
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, fontWeight: 600, color: "#8b5cf6" }}>{g.weight}%</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: sc, background: sbg, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{g.status}</span>
                            </td>
                            <td style={{ padding: "12px" }}>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {!g.locked && (g.status === "Draft" || g.status === "Returned") && (
                                  <button onClick={() => { setEditGoal(g); setShowModal(true); }} style={{ background: "#1a2840", border: "1px solid #243555", color: "#8fa3c8", padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontSize: 11 }}>Edit</button>
                                )}
                                {!g.locked && g.status === "Draft" && (
                                  <button onClick={() => submitForApproval(g.id)} style={{ background: "#052e1c", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontSize: 11 }}>Submit</button>
                                )}
                                {!g.locked && (g.status === "Draft" || g.status === "Returned") && (
                                  <button onClick={() => deleteGoal(g.id)} style={{ background: "#2d0a0a", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "5px 8px", borderRadius: 7, cursor: "pointer", fontSize: 11 }}>✕</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {myGoals.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "#546a8f", fontSize: 13 }}>No goals yet. Click "Add Goal" to get started.</div>}
                </div>
              </SBox>
            </div>
          )}

          {/* ── CHECK-INS ─────────────────────────────────────────────────── */}
          {activeTab === "checkins" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <SBox title="Quarterly Check-ins">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, color: "#e8eef8" }}>Quarterly Review Tracker</h3>
                    <p style={{ color: "#546a8f", fontSize: 12, marginTop: 4 }}>Track quarterly achievements and manager feedback</p>
                  </div>
                  <select value={selectedQ} onChange={e => setSelectedQ(e.target.value)}
                    style={{ background: "#0d1424", border: "1px solid #1e2f4a", borderRadius: 10, color: "#e8eef8", padding: "10px 14px", outline: "none" }}>
                    <option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option>
                  </select>
                </div>

                {myGoals.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#546a8f" }}>
                    <CalendarCheck size={36} color="#1e2f4a" style={{ marginBottom: 10 }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 4 }}>No goals yet</div>
                    <div style={{ fontSize: 13 }}>Add goals first, then record your check-ins here.</div>
                  </div>
                ) : (
                  myGoals.map(goal => (
                    <CheckInRow key={`${goal.id}-${selectedQ}`} goal={goal} selectedQ={selectedQ} onSave={saveCheckin} />
                  ))
                )}
              </SBox>
            </div>
          )}

          {/* ── ANALYTICS ─────────────────────────────────────────────────── */}
          {activeTab === "analytics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
                <SBox title="QoQ Progress">
                  {[["Q1",88,"#10b981"],["Q2",72,"#3b7ff5"],["Q3",45,"#f59e0b"],["Q4",0,"#546a8f"]].map(([q,v,color]) => (
                    <div key={q} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <span style={{ width: 24, fontSize: 13, color: "#546a8f", fontWeight: 600 }}>{q}</span>
                      <div style={{ flex: 1, height: 28, background: "#1a2235", borderRadius: 8, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${v}%`, background: color, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                          {v > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{v}%</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </SBox>

                <SBox title="Goal Status Distribution">
                  <div style={{ width: 160, height: 160, borderRadius: "50%", background: "conic-gradient(#10b981 0% 40%,#3b7ff5 40% 75%,#f59e0b 75% 90%,#ef4444 90% 100%)", margin: "10px auto 20px" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[["Approved","#10b981","40%"],["On Track","#3b7ff5","35%"],["Pending","#f59e0b","15%"],["At Risk","#ef4444","10%"]].map(([l,c,p]) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                        <span style={{ color: "#8fa3c8" }}>{l}</span>
                        <span style={{ color: c, fontWeight: 700, marginLeft: "auto" }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </SBox>

                <SBox title="Goals by Thrust Area">
                  {[["Revenue Growth",4,"#10b981"],["Process Improvement",3,"#3b7ff5"],["Customer Satisfaction",3,"#8b5cf6"],["Cost Reduction",2,"#f59e0b"],["Innovation",2,"#ec4899"]].map(([label,count,color]) => (
                    <div key={label} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#8fa3c8" }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color }}>{count}</span>
                      </div>
                      <div style={{ height: 5, background: "#1a2235", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${count * 20}%`, background: color, borderRadius: 10 }} />
                      </div>
                    </div>
                  ))}
                </SBox>

                <SBox title="Goal Health Indicators">
                  {myGoals.slice(0,5).map(g => {
                    const health = g.progress >= 70 ? "🟢 Healthy" : g.progress >= 40 ? "🟡 Moderate" : "🔴 At Risk";
                    const hc = g.progress >= 70 ? "#10b981" : g.progress >= 40 ? "#f59e0b" : "#ef4444";
                    return (
                      <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2f4a" }}>
                        <span style={{ fontSize: 12, color: "#8fa3c8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 8 }}>{g.title}</span>
                        <span style={{ fontSize: 11, color: hc, fontWeight: 600, whiteSpace: "nowrap" }}>{health}</span>
                      </div>
                    );
                  })}
                </SBox>
              </div>
            </div>
          )}

          {/* ── TEAM ──────────────────────────────────────────────────────── */}
          {activeTab === "team" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <SBox title={user.role === "ADMIN" ? "All Users" : "Team Goal Approval Workflow"}>
                {user.role === "MANAGER" && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                      <thead>
                        <tr>{["Employee","Goal","Weightage","Status","Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #1e2f4a", fontSize: 11, color: "#546a8f", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {goals.filter(g => [1,2].includes(g.userId)).map(g => {
                          const emp = DEMO_USERS.find(u => u.id === g.userId);
                          const [sc] = STATUS_COLOR[g.status] || ["#546a8f"];
                          return (
                            <tr key={g.id} style={{ borderBottom: "1px solid #111827" }}>
                              <td style={{ padding: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#60a5fa", flexShrink: 0 }}>{emp?.initials}</div>
                                  <span style={{ fontSize: 13 }}>{emp?.name}</span>
                                </div>
                              </td>
                              <td style={{ padding: "12px", fontSize: 13, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.title}</td>
                              <td style={{ padding: "12px", fontSize: 13, color: "#8b5cf6", fontWeight: 600 }}>{g.weight}%</td>
                              <td style={{ padding: "12px" }}>
                                <span style={{ fontSize: 11, fontWeight: 600, color: sc, background: STATUS_COLOR[g.status]?.[1]||"#1a2235", padding: "3px 9px", borderRadius: 20 }}>{g.status}</span>
                              </td>
                              <td style={{ padding: "12px" }}>
                                {g.status === "Pending" ? (
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={() => approveGoal(g.id)} style={{ background: "#052e1c", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={13} /> Approve</button>
                                    <button onClick={() => setReturnModal(g)} style={{ background: "#2d0a0a", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><XCircle size={13} /> Return</button>
                                  </div>
                                ) : <span style={{ fontSize: 12, color: "#546a8f" }}>{g.status === "Approved" ? "✓ Done" : "—"}</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {user.role === "ADMIN" && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                      <thead>
                        <tr>{["Name","Role","Dept","Goals","Action"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #1e2f4a", fontSize: 11, color: "#546a8f", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {DEMO_USERS.map(u => {
                          const rc2 = ROLE_COLOR[u.role] || "#546a8f";
                          return (
                            <tr key={u.id} style={{ borderBottom: "1px solid #111827" }}>
                              <td style={{ padding: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${rc2}20`, border: `1px solid ${rc2}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: rc2, flexShrink: 0 }}>{u.initials}</div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                                    <div style={{ fontSize: 11, color: "#546a8f" }}>{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "12px" }}><span style={{ fontSize: 11, fontWeight: 600, color: rc2, background: `${rc2}20`, padding: "3px 9px", borderRadius: 20 }}>{u.role}</span></td>
                              <td style={{ padding: "12px", fontSize: 13, color: "#8fa3c8" }}>{u.dept}</td>
                              <td style={{ padding: "12px", fontSize: 13 }}>{goals.filter(g => g.userId === u.id).length}</td>
                              <td style={{ padding: "12px" }}>
                                <button style={{ background: "#1a2235", border: "1px solid #1e2f4a", color: "#8fa3c8", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>View Goals</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </SBox>
            </div>
          )}

          {/* ── ADMIN PANEL ───────────────────────────────────────────────── */}
          {activeTab === "admin" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                {[["Total Users",4,"👥","#3b7ff5"],["Pending Goals",pending,"⏳","#f59e0b"],["Approved Goals",goals.filter(g=>g.status==="Approved").length,"✅","#10b981"],["Locked Goals",goals.filter(g=>g.locked).length,"🔒","#8b5cf6"]].map(([l,v,i,c]) => (
                  <div key={l} style={{ background: "#111827", border: `1px solid ${c}25`, borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ fontSize: 11, color: "#546a8f", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{l}</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{i} {v}</div>
                  </div>
                ))}
              </div>

              <SBox title="Goal Lock Management">
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                    <thead>
                      <tr>{["Goal","Employee","Status","Lock","Action"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #1e2f4a", fontSize: 11, color: "#546a8f", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {goals.map(g => {
                        const emp = DEMO_USERS.find(u => u.id === g.userId);
                        return (
                          <tr key={g.id} style={{ borderBottom: "1px solid #111827" }}>
                            <td style={{ padding: "12px", fontSize: 13, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.title}</td>
                            <td style={{ padding: "12px", fontSize: 13, color: "#8fa3c8" }}>{emp?.name}</td>
                            <td style={{ padding: "12px" }}><span style={{ fontSize: 11, color: STATUS_COLOR[g.status]?.[0]||"#546a8f" }}>{g.status}</span></td>
                            <td style={{ padding: "12px", fontSize: 13 }}>{g.locked ? "🔒 Locked" : "🟢 Open"}</td>
                            <td style={{ padding: "12px" }}>
                              <button onClick={() => toggleLock(g.id)} style={{ background: g.locked?"#052e1c":"#2a1e00", border: `1px solid ${g.locked?"rgba(16,185,129,0.3)":"rgba(245,158,11,0.3)"}`, color: g.locked?"#10b981":"#f59e0b", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                                {g.locked ? <><Unlock size={12} /> Unlock</> : <><Lock size={12} /> Lock</>}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </SBox>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { toast("Report exported as CSV ✓"); addAudit("Report Exported", "All goals CSV", "📥"); }}
                  style={{ background: "#3b7ff5", border: "none", borderRadius: 10, padding: "11px 20px", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  📥 Export Report (CSV)
                </button>
                <button onClick={() => { toast("PDF report generated ✓"); }}
                  style={{ background: "#111827", border: "1px solid #1e2f4a", borderRadius: 10, padding: "11px 20px", color: "#8fa3c8", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  📄 Export PDF
                </button>
              </div>
            </div>
          )}

          {/* ── AUDIT LOGS ────────────────────────────────────────────────── */}
          {activeTab === "audit" && (
            <SBox title="Audit Logs">
              {auditLogs.map((a, i) => (
                <div key={a.id} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: i < auditLogs.length - 1 ? "1px solid #1e2f4a" : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1a2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{a.action}</span>
                      <span style={{ fontSize: 11, color: "#546a8f" }}>{a.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#546a8f", marginTop: 2 }}>{a.user} · {a.detail}</div>
                  </div>
                </div>
              ))}
            </SBox>
          )}

          {/* ── ESCALATIONS ───────────────────────────────────────────────── */}
          {activeTab === "escalations" && (
            <EscalationModule
              escalations={escalations}
              setEscalations={setEscalations}
              currentUser={user}
              addAudit={addAudit}
              toast={toast}
            />
          )}

        </div>
      </main>

      {/* ── GOAL MODAL ──────────────────────────────────────────────────────── */}
      {showModal && <GoalModal existingGoals={myGoals} editGoal={editGoal} onSave={saveGoal} onClose={() => { setShowModal(false); setEditGoal(null); }} thrustAreas={THRUSTS} />}

      {/* ── RETURN MODAL ────────────────────────────────────────────────────── */}
      {returnModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: "#111827", border: "1px solid #1e2f4a", borderRadius: 18, padding: 28, width: "100%", maxWidth: 420 }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>Return Goal</h3>
            <p style={{ fontSize: 13, color: "#546a8f", marginBottom: 16 }}>"{returnModal.title}"</p>
            <textarea value={returnComment} onChange={e => setReturnComment(e.target.value)} placeholder="Add a comment explaining why this goal is being returned…" rows={3}
              style={{ ...IS, background: "#0d1424", borderRadius: 10, padding: "10px 12px", resize: "vertical", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setReturnModal(null); setReturnComment(""); }} style={{ flex: 1, padding: 11, background: "transparent", border: "1px solid #1e2f4a", borderRadius: 10, color: "#8fa3c8", cursor: "pointer", fontSize: 13 }}>Cancel</button>
              <button onClick={() => returnGoal(returnModal.id, returnComment)} style={{ flex: 2, padding: 11, background: "#2d0a0a", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#ef4444", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Return Goal</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ───────────────────────────────────────────────────────────── */}
      {notif && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: notif.type==="error"?"#2d0a0a":"#052e1c", border: `1px solid ${notif.type==="error"?"rgba(239,68,68,0.4)":"rgba(16,185,129,0.4)"}`, borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 500, color: notif.type==="error"?"#ef4444":"#10b981", zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          {notif.type==="error"?"⚠ ":"✓ "}{notif.msg}
        </div>
      )}
    </div>
  );
}

// ─── Shared section box ───────────────────────────────────────────────────────
function SBox({ title, children }) {
  return (
    <div style={{ background: "#111827", border: "1px solid #1e2f4a", borderRadius: 14, padding: "22px 24px" }}>
      <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 600, color: "#e8eef8" }}>{title}</h3>
      {children}
    </div>
  );
}

// ─── Goal Modal ───────────────────────────────────────────────────────────────
function GoalModal({ existingGoals, editGoal, onSave, onClose, thrustAreas }) {
  const totalUsed = existingGoals.filter(g => !editGoal || g.id !== editGoal?.id).reduce((a, b) => a + b.weight, 0);
  const [form, setForm]     = useState(editGoal || { title: "", desc: "", thrustArea: thrustAreas[0], uom: "NUMERIC_MAX", target: "", weight: 20, progress: 0 });
  const [error, setError]   = useState("");
  const [aiResult, setAiResult] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title.trim())                              { setError("Goal title is required"); return; }
    if (Number(form.weight) < 10)                        { setError("Minimum 10% weightage per goal"); return; }
    if (!editGoal && existingGoals.length >= 8)          { setError("Maximum 8 goals allowed"); return; }
    const avail = 100 - totalUsed;
    if (Number(form.weight) > avail + (editGoal ? Number(editGoal.weight) : 0)) { setError(`Exceeds 100%. Available: ${avail}%`); return; }
    onSave({ ...form, weight: Number(form.weight), target: Number(form.target), progress: Number(form.progress) || 0 });
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16, backdropFilter: "blur(2px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#111827", border: "1px solid #1e2f4a", borderRadius: 20, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#e8eef8" }}>{editGoal ? "Edit Goal" : "Add New Goal"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#546a8f", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ background: "#1a1030", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#8b5cf6", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={12} /> AI Goal Coach
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Type goal idea for AI rewrite…" style={{ ...IS, flex: 1 }} />
            <button onClick={() => setAiResult(aiRewrite(form.title))} style={{ background: "#8b5cf6", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>✨ Suggest</button>
          </div>
          {aiResult && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#c4b5fd", background: "#0d1424", borderRadius: 8, padding: "8px 12px" }}>
              💡 {aiResult}
              <button onClick={() => { set("title", aiResult); setAiResult(""); }} style={{ marginLeft: 8, fontSize: 11, background: "rgba(139,92,246,0.2)", border: "none", borderRadius: 5, color: "#8b5cf6", cursor: "pointer", padding: "2px 7px", fontWeight: 600 }}>Use</button>
            </div>
          )}
        </div>

        {error && <div style={{ background: "#2d0a0a", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#ef4444", marginBottom: 14 }}>⚠ {error}</div>}

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#546a8f", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Goal Title *</label>
          <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Improve sales performance" style={IS} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#546a8f", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Description</label>
          <textarea value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Describe how you'll achieve this…" rows={2} style={{ ...IS, resize: "vertical" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#546a8f", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Thrust Area *</label>
            <select value={form.thrustArea} onChange={e => set("thrustArea", e.target.value)} style={IS}>{thrustAreas.map(a => <option key={a}>{a}</option>)}</select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#546a8f", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Unit of Measure</label>
            <select value={form.uom} onChange={e => set("uom", e.target.value)} style={IS}>
              <option value="NUMERIC_MAX">Numeric (Higher = Better)</option>
              <option value="NUMERIC_MIN">Numeric (Lower = Better)</option>
              <option value="TIMELINE">Timeline (Days)</option>
              <option value="ZERO">Zero Target</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#546a8f", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Target *</label>
            <input type="number" value={form.target} onChange={e => set("target", e.target.value)} placeholder="e.g. 100" style={IS} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#546a8f", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Weightage % * <span style={{ fontWeight: 400 }}>(avail: {100-totalUsed}%)</span></label>
            <input type="number" min="10" max={100-totalUsed} value={form.weight} onChange={e => set("weight", e.target.value)} style={IS} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, background: "transparent", border: "1px solid #1e2f4a", borderRadius: 10, color: "#8fa3c8", cursor: "pointer", fontSize: 13 }}>Cancel</button>
          <button onClick={submit}  style={{ flex: 2, padding: 11, background: "#3b7ff5", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            {editGoal ? "Save Changes" : "Create Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}


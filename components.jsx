/* ============================================================
   Shared primitives → window.*
   Consumes window.AppCtx for navigate / openSource / toast
   ============================================================ */
const AppCtx = React.createContext({});
window.AppCtx = AppCtx;

const { useState, useEffect, useRef, useContext, useCallback } = React;

/* ---------- Status pill ---------- */
const STATUS_CLASS = {
  Ready: "pill-ready", Verified: "pill-verified", Processing: "pill-processing",
  "Needs Review": "pill-review", Flagged: "pill-flagged", New: "pill-new",
  "Stage 1": "pill-triaging", "Stage 2": "pill-screening", "Stage 3": "pill-ic",
  Passed: "pill-passed", "Stage 4": "pill-pursuing", "On Track": "pill-ready",
  Watch: "pill-review", Outperform: "pill-verified", Connected: "pill-ready",
  Syncing: "pill-processing", Paused: "pill-neutral", Launched: "pill-ready",
  Filed: "pill-screening", "Phase III": "pill-violet",
};
function StatusPill({ status, dot = true }) {
  const cls = STATUS_CLASS[status] || "pill-neutral";
  return (
    <span className={"pill " + cls}>
      {dot && <span className="dot"></span>}
      {status}
    </span>
  );
}
window.StatusPill = StatusPill;

/* ---------- Fit score bar ---------- */
function FitBar({ score }) {
  const color = score >= 85 ? "var(--green-500)" : score >= 75 ? "var(--blue-500)" : score >= 65 ? "var(--amber-500)" : "var(--gray-400)";
  return (
    <div className="fit-bar">
      <div className="fit-track"><div className="fit-fill" style={{ width: score + "%", background: color }}></div></div>
      <span className="fit-num" style={{ color }}>{score}</span>
    </div>
  );
}
window.FitBar = FitBar;

/* ---------- Avatar / logo ---------- */
function Avatar({ name, color = "#2f6bff", size = "" }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
  return <span className={"avatar " + size} style={{ background: color }}>{initials}</span>;
}
function LogoTile({ initials, sector, size = 38 }) {
  const c = window.DB.logoColor(sector);
  return <span className="logo-tile" style={{ background: c.bg, color: c.fg, width: size, height: size, fontSize: size * 0.37 }}>{initials}</span>;
}
window.Avatar = Avatar; window.LogoTile = LogoTile;

/* ---------- Confidence dot ---------- */
const CONF_LABEL = { verified: "Verified from source", estimated: "AI-estimated", review: "Needs review" };
function ConfDot({ level = "verified" }) {
  return (
    <span className="tip" style={{ display: "inline-flex" }}>
      <span className={"conf-dot conf-" + level}></span>
      <span className="tip-bub">{CONF_LABEL[level]}</span>
    </span>
  );
}
window.ConfDot = ConfDot;

/* ---------- Popover menu ---------- */
function Menu({ items, align = "right", trigger, always = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      {trigger ? (
        React.cloneElement(trigger, { onClick: (e) => { e.stopPropagation(); setOpen((o) => !o); } })
      ) : (
        <button className={"ovf-btn" + (always ? " always" : "")} onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>
          <Icon name="more" size={16} />
        </button>
      )}
      {open && (
        <div className="menu" style={{ top: "calc(100% + 4px)", [align]: 0 }} onClick={(e) => e.stopPropagation()}>
          {items.map((it, i) =>
            it.sep ? <div key={i} className="menu-sep"></div> :
            it.label ? <div key={i} className="menu-label">{it.label}</div> :
            <div key={i} className={"menu-item" + (it.danger ? " danger" : "")} onClick={() => { setOpen(false); it.onClick && it.onClick(); }}>
              {it.icon && <Icon name={it.icon} size={14} />}
              <span>{it.text}</span>
            </div>
          )}
        </div>
      )}
    </span>
  );
}
window.Menu = Menu;

/* ---------- Provenance value ---------- */
// A number/value with hover-reveal source + override affordances.
function Prov({ value, metric = "default", conf = "verified", className = "", strong = false }) {
  const ctx = useContext(AppCtx);
  const [overridden, setOverridden] = useState(false);
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const menuItems = [
    { icon: "sourceDoc", text: "View source documents", onClick: () => ctx.openSource(metric, val) },
    { icon: "override", text: "Override with manual value", onClick: () => setEditing(true) },
    { icon: "refresh", text: "Refresh with AI guidance", onClick: () => ctx.toast("Re-running extraction for " + metric + "…", "ai") },
    { sep: true },
    { icon: "flag", text: "Report data issue", danger: true, onClick: () => ctx.toast("Issue reported to the deal team", "flag") },
    { label: "Updated 2h ago · Critic AI" },
  ];
  if (editing) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <input className="input" style={{ height: 26, width: 90, fontSize: 12 }} value={val} autoFocus
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { setEditing(false); setOverridden(true); ctx.toast("Override saved — marked analyst-confirmed", "check"); } if (e.key === "Escape") { setEditing(false); setVal(value); } }} />
        <button className="prov-btn" onClick={() => { setEditing(false); setOverridden(true); ctx.toast("Override saved — marked analyst-confirmed", "check"); }}><Icon name="check" size={13} /></button>
      </span>
    );
  }
  return (
    <span className={"prov " + className} style={strong ? { fontWeight: 600 } : {}}>
      <ConfDot level={overridden ? "verified" : conf} />
      <span className="num">{val}</span>
      {overridden && <span className="tag" style={{ fontSize: 9, padding: "1px 5px" }}>edited</span>}
      <span className="prov-actions">
        <button className="prov-btn" title="Refresh" onClick={() => ctx.toast("Refreshing " + metric + "…", "ai")}><Icon name="refresh" size={11} /></button>
        <Menu align="left" items={menuItems} trigger={<button className="prov-btn"><Icon name="more" size={12} /></button>} />
      </span>
    </span>
  );
}
window.Prov = Prov;

/* ---------- Citation chip ---------- */
function Cite({ n = 1, metric = "default", onClick }) {
  const ctx = useContext(AppCtx);
  return (
    <span className="cite-chip" onClick={(e) => { e.stopPropagation(); (onClick || (() => ctx.openSource(metric)))(); }}>
      <Icon name="sourceDoc" size={9} /> {n}
    </span>
  );
}
window.Cite = Cite;

/* ---------- Sparkline ---------- */
function Sparkline({ data, color = "#2f6bff", w = 84, h = 26, fill = true }) {
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / rng) * (h - 6)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${w} ${h} L 0 ${h} Z`;
  const id = "sg" + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={w} height={h} className="sparkline">
      {fill && <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.18" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>}
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={color} />
    </svg>
  );
}
window.Sparkline = Sparkline;

/* ---------- Line chart (labeled) ---------- */
function LineChart({ series, w = 560, h = 200, color = "#2f6bff", yfmt = (v) => v }) {
  const pad = { l: 38, r: 14, t: 14, b: 26 };
  const vals = series.map((d) => d.v);
  const min = Math.min(...vals) * 0.96, max = Math.max(...vals) * 1.04, rng = max - min || 1;
  const x = (i) => pad.l + (i / (series.length - 1)) * (w - pad.l - pad.r);
  const y = (v) => pad.t + (1 - (v - min) / rng) * (h - pad.t - pad.b);
  const line = series.map((d, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(d.v).toFixed(1)).join(" ");
  const area = line + ` L ${x(series.length - 1)} ${h - pad.b} L ${x(0)} ${h - pad.b} Z`;
  const ticks = 4;
  const id = "lg" + Math.random().toString(36).slice(2, 7);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.16" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const gv = min + (rng * i) / ticks; const gy = y(gv);
        return <g key={i}>
          <line x1={pad.l} y1={gy} x2={w - pad.r} y2={gy} stroke="var(--border)" strokeWidth="1" />
          <text x={pad.l - 7} y={gy + 3} textAnchor="end" fontSize="9.5" fill="var(--text-muted)" className="num">{yfmt(gv)}</text>
        </g>;
      })}
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {series.map((d, i) => <circle key={i} cx={x(i)} cy={y(d.v)} r={i === series.length - 1 ? 3.5 : 0} fill={color} />)}
      {series.map((d, i) => <text key={i} x={x(i)} y={h - 8} textAnchor="middle" fontSize="9.5" fill="var(--text-muted)">{d.p}</text>)}
    </svg>
  );
}
window.LineChart = LineChart;

/* ---------- Bar chart ---------- */
function BarChart({ series, w = 560, h = 200, color = "#2f6bff", yfmt = (v) => v }) {
  const pad = { l: 38, r: 14, t: 14, b: 26 };
  const vals = series.map((d) => d.v);
  const max = Math.max(...vals) * 1.1, min = 0, rng = max - min || 1;
  const bw = (w - pad.l - pad.r) / series.length;
  const y = (v) => pad.t + (1 - (v - min) / rng) * (h - pad.t - pad.b);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const gv = (max * i) / 4; const gy = y(gv);
        return <g key={i}><line x1={pad.l} y1={gy} x2={w - pad.r} y2={gy} stroke="var(--border)" strokeWidth="1" /><text x={pad.l - 7} y={gy + 3} textAnchor="end" fontSize="9.5" fill="var(--text-muted)" className="num">{yfmt(gv)}</text></g>;
      })}
      {series.map((d, i) => {
        const bh = h - pad.b - y(d.v);
        return <g key={i}>
          <rect x={pad.l + bw * i + bw * 0.22} y={y(d.v)} width={bw * 0.56} height={Math.max(bh, 0)} rx="2.5" fill={i === series.length - 1 ? color : color + "9c"} />
          <text x={pad.l + bw * i + bw / 2} y={h - 8} textAnchor="middle" fontSize="9.5" fill="var(--text-muted)">{d.p}</text>
        </g>;
      })}
    </svg>
  );
}
window.BarChart = BarChart;

/* ---------- Modal / Drawer shells ---------- */
function Modal({ children, onClose, size = "" }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn); return () => document.removeEventListener("keydown", fn);
  }, []);
  return (
    <div className="overlay center" onMouseDown={onClose}>
      <div className={"modal " + size} onMouseDown={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
function Drawer({ children, onClose }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn); return () => document.removeEventListener("keydown", fn);
  }, []);
  return (
    <div className="overlay right" onMouseDown={onClose}>
      <div className="drawer" onMouseDown={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
window.Modal = Modal; window.Drawer = Drawer;

/* ---------- Section card ---------- */
function SectionCard({ title, icon, iconColor = "#2f6bff", actions, children, menu }) {
  const ctx = useContext(AppCtx);
  const defaultMenu = [
    { icon: "sparkles", text: "Explore further", onClick: () => ctx.toast("Opening deep-dive on " + title + "…", "ai") },
    { icon: "edit", text: "Edit section configuration", onClick: () => ctx.openEditSection({ name: title }) },
    { icon: "sourceDoc", text: "View source documents", onClick: () => ctx.openSource(title) },
    { icon: "refresh", text: "Refresh all metrics", onClick: () => ctx.toast("Refreshing all metrics in " + title + "…", "ai") },
    { sep: true },
    { icon: "flag", text: "Report data issue", danger: true, onClick: () => ctx.toast("Issue reported", "flag") },
  ];
  return (
    <div className="section-card">
      <div className="section-head">
        <span className="ic" style={{ background: iconColor + "1a", color: iconColor }}><Icon name={icon} size={15} /></span>
        <span className="ttl">{title}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          {actions}
          <Menu items={menu || defaultMenu} />
        </div>
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}
window.SectionCard = SectionCard;

/* ---------- KV ---------- */
function KV({ k, children }) {
  return <div className="kv"><span className="k">{k}</span><span className="v">{children}</span></div>;
}
window.KV = KV;

/* ---------- Page header ---------- */
function PageHead({ title, sub, children }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="t-display">{title}</h1>
        {sub && <p className="t-body" style={{ marginTop: 4 }}>{sub}</p>}
      </div>
      {children && <div className="row gap-10 center">{children}</div>}
    </div>
  );
}
window.PageHead = PageHead;

/* ---------- Segmented ---------- */
function Seg({ value, onChange, options }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <div key={o.value} className={"seg-item" + (value === o.value ? " active" : "")} onClick={() => onChange(o.value)}>
          {o.icon && <Icon name={o.icon} size={14} />}{o.label}
        </div>
      ))}
    </div>
  );
}
window.Seg = Seg;

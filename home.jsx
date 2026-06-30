/* ============================================================
   Home → window.HomeView
   ============================================================ */
function HomeView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const active = db.activeDeals();
  const inDiligence = active.filter((d) => ["Stage 3", "Stage 4"].includes(d.status)).length;
  const stats = [
    { label: "Active Deals", value: String(active.length), delta: "+3 this week", up: true, icon: "dealflow", color: "#2f6bff", view: "dealflow" },
    { label: "In Diligence", value: String(inDiligence), delta: "IC review & pursuing", up: true, icon: "target", color: "#16a34a", view: "dealflow" },
    { label: "Sectors Tracked", value: String(db.sectors.length), delta: "40 new signals", up: true, icon: "sector", color: "#7c5cfc", view: "sector" },
    { label: "Needs Review", value: "8", delta: "AI-flagged items", up: false, icon: "flag", color: "#e08a00", view: "dealflow" },
  ];
  const recent = active.filter((d) => ["Stage 1", "Stage 2", "Stage 3", "Stage 4"].includes(d.status)).slice(0, 5);
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? recent : recent.slice(0, 3);

  return (
    <div className="page page-wide">
      <PageHead title="Welcome back, Alex" sub="Here's what's moved across your pipeline and sectors today.">
        <button className="btn btn-secondary" onClick={() => ctx.navigate("dealflow", { weekly: true })}><Icon name="columns" size={15} /> Weekly Review</button>
        <button className="btn btn-primary" onClick={() => ctx.openWizard()}><Icon name="plus" size={15} /> New Deal</button>
      </PageHead>

      {/* stat cards */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {stats.map((s) => (
          <div key={s.label} className="card card-pad card-hover metric-card pointer" onClick={() => ctx.navigate(s.view)}>
            <div className="row between center">
              <span className="metric-label">{s.label}</span>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: s.color + "1a", color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={s.icon} size={16} /></span>
            </div>
            <div className="metric-value">{s.value}</div>
            <div className={"metric-delta " + (s.up ? "delta-up" : "")} style={!s.up ? { color: "var(--text-muted)" } : {}}>
              {s.up && <Icon name="arrowUp" size={12} />}{s.delta}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22, alignItems: "start" }}>
        {/* recent deals */}
        <div>
          <div className="row between center mb-12">
            <div className="row gap-10 center">
              <h2 className="t-h2">Recent Deals</h2>
              <span className="tag">{recent.length} active</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => ctx.navigate("dealflow")}>View all <Icon name="arrowRight" size={13} /></button>
          </div>
          <div className="col gap-12">
            {shown.map((d) => <DealHomeCard key={d.id} d={d} />)}
          </div>
          {recent.length > 3 && (
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => setShowAll((s) => !s)}>
              {showAll ? "Show less" : `Show ${recent.length - 3} more deals`}
            </button>
          )}
        </div>

        {/* activity feed */}
        <div className="card card-pad">
          <div className="rail-panel-head" style={{ paddingBottom: 6 }}>
            <h3 className="t-h3">Recent Activity</h3>
            <Icon name="bell" size={15} style={{ color: "var(--text-muted)" }} />
          </div>
          <div>
            {db.activity.map((a, i) => (
              <div key={i} className="feed-item" style={{ borderBottom: i < db.activity.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span className="feed-ic" style={{ background: a.color + "1a", color: a.color }}>
                  <Icon name={a.type === "file" ? "upload" : a.type === "flag" ? "flag" : a.type === "deal" ? "layers" : a.type === "status" ? "refresh" : a.type === "section" ? "sparkles" : "trending"} size={14} />
                </span>
                <div className="feed-main">
                  <div className="feed-line"><strong style={{ fontWeight: 560 }}>{a.deal}</strong> — {a.name}</div>
                  <div className="feed-time">{a.user} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DealHomeCard({ d }) {
  const ctx = useContext(AppCtx);
  const [hover, setHover] = useState(false);
  return (
    <div className="card card-hover pointer" style={{ padding: 16 }} onClick={() => ctx.navigate("workspace", { id: d.id })}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="row gap-14" style={{ alignItems: "flex-start" }}>
        <LogoTile initials={d.initials} sector={d.sector} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row between center" style={{ marginBottom: 5 }}>
            <div className="row gap-8 center">
              <span className="t-h3">{d.name}</span>
              <span className="tag">{d.dealType}</span>
              <span className="pill pill-screening" style={{ fontSize: 10.5 }}>{d.strategy}</span>
            </div>
            <div className="row gap-10 center">
              <StatusPill status={d.status} />
              <Menu items={[
                { icon: "eye", text: "Open workspace", onClick: () => ctx.navigate("workspace", { id: d.id }) },
                { icon: "sparkles", text: "Generate memo", onClick: () => ctx.navigate("memos") },
                { sep: true },
                { icon: "flag", text: "Pass on deal", danger: true, onClick: () => ctx.toast("Marked as passed", "flag") },
              ]} />
            </div>
          </div>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--text-secondary)", marginBottom: 10, maxHeight: hover ? 200 : 38, overflow: "hidden", transition: "max-height .3s var(--ease)" }}>
            <span style={{ fontWeight: 560, color: "var(--text-primary)" }}>AI thesis · </span>
            {hover ? d.thesis : d.take}
          </p>
          <div className="row between center">
            <div className="row gap-16 center">
              {d.revenue != null && <Metric label="Revenue" v={"$" + d.revenue + "M"} />}
              {d.ebitda != null && <Metric label="EBITDA" v={"$" + d.ebitda + "M"} />}
              {d.ask != null && <Metric label="Ask" v={"$" + d.ask + "M"} />}
            </div>
            <div className="row gap-10 center">
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Fit</div>
                <FitBar score={d.fit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Metric({ label, v }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</div>
      <div className="num" style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
    </div>
  );
}
window.HomeView = HomeView;

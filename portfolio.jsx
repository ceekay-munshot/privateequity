/* ============================================================
   Portfolio / PMIS → window.PortfolioView, PortfolioCoView
   ============================================================ */
function PortfolioView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const totalRev = db.portfolio.reduce((s, p) => s + p.revenue, 0);
  const watch = db.portfolio.filter((p) => p.status === "Watch").length;
  return (
    <div className="page page-wide">
      <PageHead title="Portfolio" sub="Live monitoring of companies you own — built from recurring MIS data, recency-aware.">
        <button className="btn btn-secondary"><Icon name="download" size={15} /> Export</button>
        <button className="btn btn-primary"><Icon name="plus" size={15} /> Add Company</button>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        <MiniStat label="Companies" value="4" sub="across 4 sectors" color="#2f6bff" icon="portfolio" />
        <MiniStat label="Aggregate Revenue" value={"$" + totalRev + "M"} sub="+16% blended YoY" color="#16a34a" icon="trending" up />
        <MiniStat label="Blended MOIC" value="1.9x" sub="unrealized" color="#7c5cfc" icon="pkg" />
        <MiniStat label="Need Attention" value={watch} sub="covenant watch" color="#e08a00" icon="alert" />
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="dtable">
          <thead><tr><th>Company</th><th>Own %</th><th className="num">Revenue</th><th className="num">EBITDA</th><th className="num">Growth</th><th>Trend</th><th>Covenant</th><th>Status</th><th style={{ width: 36 }}></th></tr></thead>
          <tbody>
            {db.portfolio.map((p) => (
              <tr key={p.id} onClick={() => ctx.navigate("portfolioco", { id: p.id })}>
                <td><span className="row gap-10 center"><LogoTile initials={p.initials} sector={p.sector} size={30} /><div><div style={{ fontWeight: 560 }}>{p.name}</div><div className="t-small">{p.sub}</div></div></span></td>
                <td className="num">{p.own}%</td>
                <td className="num">${p.revenue}M</td>
                <td className="num">${p.ebitda}M</td>
                <td className="num"><span className={p.growth >= 15 ? "delta-up" : ""} style={{ fontWeight: 560, color: p.growth >= 15 ? "var(--green-600)" : p.growth < 10 ? "var(--amber-600)" : "var(--text-secondary)" }}>+{p.growth}%</span></td>
                <td><Sparkline data={p.spark} color={db.SECTOR_COLOR[p.sector]} /></td>
                <td>{p.covenant.ok ? <span className="pill pill-ready" style={{ fontSize: 10 }}><span className="dot"></span>{p.covenant.value}x ok</span> : <span className="pill pill-flagged" style={{ fontSize: 10 }}><span className="dot"></span>{p.covenant.value}x tight</span>}</td>
                <td><StatusPill status={p.status} /></td>
                <td onClick={(e) => e.stopPropagation()}><Menu items={[{ icon: "eye", text: "Open monitoring", onClick: () => ctx.navigate("portfolioco", { id: p.id }) }, { icon: "sparkles", text: "Generate board pack", onClick: () => ctx.navigate("memos") }, { icon: "bell", text: "Configure alerts" }]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniStat({ label, value, sub, color, icon, up }) {
  return (
    <div className="card card-pad metric-card">
      <div className="row between center"><span className="metric-label">{label}</span><span style={{ width: 28, height: 28, borderRadius: 8, background: color + "1a", color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={icon} size={15} /></span></div>
      <div className="metric-value">{value}</div>
      <div className="metric-delta" style={{ color: up ? "var(--green-600)" : "var(--text-muted)" }}>{up && <Icon name="arrowUp" size={11} />}{sub}</div>
    </div>
  );
}

/* ---------- Per-company monitoring ---------- */
function PortfolioCoView({ params }) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const p = db.portfolioById((params && params.id) || "forge") || db.portfolio[1];
  const mis = db.misSeries[p.id] || db.misSeries.forge;
  const timeline = db.misTimeline[p.id] || db.misTimeline.forge;
  const [period, setPeriod] = useState("quarterly");
  const [metric, setMetric] = useState("revenue");
  const series = mis[metric];
  const latest = series[series.length - 1];

  return (
    <div className="page page-wide">
      <div className="row gap-10 center mb-16">
        <button className="btn btn-icon btn-secondary btn-sm" onClick={() => ctx.navigate("portfolio")}><Icon name="chevLeft" size={15} /></button>
        <LogoTile initials={p.initials} sector={p.sector} size={40} />
        <div style={{ flex: 1 }}>
          <div className="row gap-10 center"><h1 className="t-h1">{p.name}</h1><StatusPill status={p.status} /></div>
          <div className="t-body">{p.desc} · {p.own}% owned · invested {p.invested}</div>
        </div>
        <span className="pill pill-ready"><Icon name="clock" size={11} /> Latest: {p.period}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        <div className="col gap-16">
          {/* chart card */}
          <div className="card card-pad">
            <div className="row between center mb-16">
              <Seg value={metric} onChange={setMetric} options={[{ value: "revenue", label: "Revenue" }, { value: "ebitda", label: "EBITDA" }, { value: "margin", label: "Margin %" }]} />
              <Seg value={period} onChange={setPeriod} options={[{ value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }]} />
            </div>
            <div className="row gap-24 center mb-16">
              <div><div className="metric-label" style={{ marginBottom: 3 }}>{metric === "margin" ? "Margin" : metric === "ebitda" ? "EBITDA" : "Revenue"} · {latest.p}</div><div className="num" style={{ fontSize: 26, fontWeight: 660 }}>{metric === "margin" ? latest.v + "%" : "$" + latest.v + "M"}</div></div>
              <div style={{ paddingLeft: 24, borderLeft: "1px solid var(--border)" }}><div className="metric-label" style={{ marginBottom: 3 }}>vs prior period</div><div className="metric-delta" style={{ fontSize: 14, color: latest.v >= series[series.length - 2].v ? "var(--green-600)" : "var(--red-600)" }}>{latest.v >= series[series.length - 2].v ? "▲" : "▼"} {Math.abs(latest.v - series[series.length - 2].v).toFixed(1)}{metric === "margin" ? "pp" : "M"}</div></div>
              <div className="tag" style={{ marginLeft: "auto" }}><Icon name="info" size={11} /> AI answers from the most recent period</div>
            </div>
            <LineChart series={series} color={db.SECTOR_COLOR[p.sector]} yfmt={(v) => metric === "margin" ? v.toFixed(0) + "%" : "$" + v.toFixed(0)} />
          </div>

          {/* MIS timeline */}
          <div className="card card-pad">
            <div className="rail-panel-head" style={{ paddingBottom: 12 }}><div className="row gap-8 center"><h3 className="t-h3">Interactions & MIS Calls</h3><span className="tag">{timeline.length}</span></div><button className="btn btn-secondary btn-sm"><Icon name="upload" size={13} /> Upload transcript</button></div>
            <p className="t-small mb-16">Every founder call & email — AI-summarized, capturing the "why this, why not that" decisions. Searchable institutional memory.</p>
            <div style={{ position: "relative", paddingLeft: 26 }}>
              <div style={{ position: "absolute", left: 9, top: 6, bottom: 6, width: 2, background: "var(--border)" }}></div>
              {timeline.map((t, i) => (
                <div key={i} style={{ position: "relative", marginBottom: i < timeline.length - 1 ? 18 : 0 }}>
                  <span style={{ position: "absolute", left: -26, top: 2, width: 20, height: 20, borderRadius: "50%", background: t.kind === "call" ? "var(--blue-50)" : "var(--gray-100)", border: "2px solid #fff", boxShadow: "0 0 0 1px var(--border)", color: t.kind === "call" ? "var(--blue-600)" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={t.kind === "call" ? "chat" : "mail"} size={11} /></span>
                  <div className="card" style={{ padding: 13 }}>
                    <div className="row between center mb-4"><span style={{ fontWeight: 560, fontSize: 13 }}>{t.title}</span><span className="t-small nowrap">{t.date}</span></div>
                    <div className="t-small mb-8">{t.who}</div>
                    <p className="t-small" style={{ lineHeight: 1.55, color: "var(--text-secondary)" }}>{t.summary}</p>
                    <div className="row gap-6 mt-8 wrap">{t.tags.map((tg) => <span key={tg} className="tag" style={{ fontSize: 10 }}>{tg}</span>)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right rail: covenant + KPIs */}
        <div className="col gap-16">
          <div className="card card-pad">
            <div className="rail-panel-head"><h3 className="t-h3">Covenant Watch</h3><Icon name="shield" size={15} style={{ color: p.covenant.ok ? "var(--green-500)" : "var(--amber-500)" }} /></div>
            <div className={"alert-row " + (p.covenant.ok ? "" : "warn")} style={{ marginBottom: 12 }}>
              <span className="alert-ic" style={{ background: p.covenant.ok ? "var(--green-100)" : "var(--amber-100)", color: p.covenant.ok ? "var(--green-600)" : "var(--amber-600)" }}><Icon name={p.covenant.ok ? "checkCircle" : "alert"} size={16} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 560 }}>{p.covenant.name}</div>
                <div className="t-small">{p.covenant.ok ? "Within threshold" : "Approaching covenant"}</div>
              </div>
            </div>
            <div className="row between center mb-4"><span className="t-small">Current</span><span className="num" style={{ fontWeight: 600 }}>{p.covenant.value}x</span></div>
            <div className="fit-track" style={{ width: "100%", height: 8, marginBottom: 6 }}><div className="fit-fill" style={{ width: Math.min(100, (p.covenant.value / p.covenant.threshold) * 100) + "%", background: p.covenant.ok ? "var(--green-500)" : "var(--amber-500)" }}></div></div>
            <div className="row between"><span className="t-small">Threshold</span><span className="num t-small">{p.covenant.threshold}x</span></div>
          </div>

          <div className="card card-pad">
            <div className="rail-panel-head"><h3 className="t-h3">Key Metrics</h3><span className="tag">as of {p.period}</span></div>
            <div className="col" style={{ gap: 0 }}>
              {[["Revenue (LTM)", "$" + p.revenue + "M", "verified"], ["EBITDA", "$" + p.ebitda + "M", "verified"], ["EBITDA margin", (p.ebitda / p.revenue * 100).toFixed(1) + "%", "verified"], ["YoY growth", "+" + p.growth + "%", "verified"], ["Unrealized MOIC", p.moic + "x", "estimated"]].map(([k, v, c], i) => (
                <div key={k} className="row between center" style={{ padding: "9px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                  <span className="row gap-7 center"><ConfDot level={c} /><span className="t-small" style={{ color: "var(--text-secondary)" }}>{k}</span></span>
                  <span className="num" style={{ fontWeight: 600, fontSize: 13 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-secondary" style={{ justifyContent: "center" }} onClick={() => ctx.navigate("sectorco", { id: "industrials" })}><Icon name="sector" size={14} /> View sector intelligence</button>
        </div>
      </div>
    </div>
  );
}
window.PortfolioView = PortfolioView;
window.PortfolioCoView = PortfolioCoView;

/* ============================================================
   Sector Intelligence → window.SectorView, SectorCoView
   ============================================================ */
function SectorView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  return (
    <div className="page page-wide">
      <PageHead title="Sector Intelligence" sub="An always-on aggregation layer — the firehose of news, broker reports & filings turned into tracked, alerting views.">
        <button className="btn btn-secondary"><Icon name="bell" size={15} /> Manage alerts</button>
        <button className="btn btn-primary"><Icon name="plus" size={15} /> Track Sector</button>
      </PageHead>

      <div className="grid gap-16" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {db.sectors.map((s) => (
          <div key={s.id} className="card card-hover card-pad pointer" onClick={() => ctx.navigate("sectorco", { id: s.id })}>
            <div className="row between center mb-12">
              <div className="row gap-10 center">
                <span style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "1a", color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="sector" size={20} /></span>
                <div><div className="t-h3">{s.name}</div><div className="t-small">{s.note}</div></div>
              </div>
              <span className="pill pill-new"><span className="dot"></span>{s.signals} new</span>
            </div>
            <div className="row between center" style={{ paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <span className="row gap-6 center t-small"><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green-500)" }}></span> Updated {s.fresh}</span>
              <span className="row gap-5 center t-small" style={{ color: "var(--blue-600)", fontWeight: 540 }}>Open briefing <Icon name="arrowRight" size={13} /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectorCoView({ params }) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const id = (params && params.id) || "pharma";
  const sector = db.sectors.find((s) => s.id === id) || db.sectors[0];
  const brief = db.briefing[id] || db.briefing.pharma;
  const [tab, setTab] = useState("briefing");
  const showPharma = id === "pharma";

  return (
    <div className="page page-wide">
      <div className="row gap-10 center mb-16">
        <button className="btn btn-icon btn-secondary btn-sm" onClick={() => ctx.navigate("sector")}><Icon name="chevLeft" size={15} /></button>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: sector.color + "1a", color: sector.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="sector" size={19} /></span>
        <div style={{ flex: 1 }}><h1 className="t-h1">{sector.name}</h1><div className="t-body">{sector.note} · multi-year thematic horizon</div></div>
        <span className="pill pill-ready"><span className="dot"></span>Live · {sector.fresh}</span>
      </div>

      <div className="mb-16"><Seg value={tab} onChange={setTab} options={[{ value: "briefing", label: "Briefing", icon: "fileText" }, { value: "signals", label: "Signals & Alerts", icon: "bell" }, ...(showPharma ? [{ value: "trackers", label: "Trackers", icon: "grid" }] : []), { value: "sources", label: "Sources", icon: "database" }]} /></div>

      {tab === "briefing" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
          <div className="col gap-12">
            {brief.map((b, i) => (
              <div key={i} className="card card-hover card-pad">
                <div className="row between center mb-8">
                  <div className="row gap-8 center"><span className={"pill " + (b.sentiment === "opportunity" ? "pill-ready" : "pill-neutral")} style={{ fontSize: 10 }}>{b.topic}</span><span className="t-small">{b.date}</span></div>
                  <div className="row gap-8 center">
                    <span className="tag" style={{ fontSize: 10 }}><Icon name="layers" size={10} /> {b.count} sources bundled</span>
                    <Menu items={[{ icon: "bell", text: "Set alert on this topic" }, { icon: "sourceDoc", text: "View all sources" }, { icon: "sparkles", text: "Summarize for memo", onClick: () => ctx.toast("Adding to research note…", "ai") }]} />
                  </div>
                </div>
                <h3 className="t-h3" style={{ marginBottom: 6, lineHeight: 1.35 }}>{b.title}</h3>
                <p className="t-body" style={{ marginBottom: 10 }}>{b.summary}</p>
                <div className="row gap-6 wrap">{b.sources.map((s) => <span key={s} className="cite-chip"><Icon name="globe" size={9} /> {s}</span>)}</div>
              </div>
            ))}
          </div>
          <div className="card card-pad">
            <div className="rail-panel-head"><h3 className="t-h3">Sentiment Tracker</h3><Icon name="chat" size={14} style={{ color: "var(--text-muted)" }} /></div>
            <p className="t-small mb-12">Product sentiment scraped from forums, Reddit & customer channels.</p>
            <div className="row gap-16 center mb-12"><div><div className="metric-label">Net positive</div><div className="num" style={{ fontSize: 22, fontWeight: 660, color: "var(--green-600)" }}>+54</div></div><div className="metric-delta delta-up"><Icon name="arrowUp" size={11} /> +9 vs last month</div></div>
            <SentimentChart data={db.sentiment} />
          </div>
        </div>
      )}

      {tab === "signals" && (
        <div className="col gap-10" style={{ maxWidth: 760 }}>
          {[
            { sev: "warn", ic: "alert", t: "Government notifies expanded PLI scheme for API manufacturing", d: "Relevant to 2 watchlist names · published 3h ago", tag: "Policy" },
            { sev: "", ic: "trending", t: "New tender floated: state procurement of oncology biosimilars", d: "Tender portal · closes in 21 days", tag: "Tender" },
            { sev: "", ic: "pkg", t: "Funding round: clinical-skincare challenger raises Series C at 6x fwd revenue", d: "Direct comp to Lumen Skincare diligence", tag: "Funding" },
            { sev: "warn", ic: "calendar", t: "Patent cliff: Zelbrava ($7.2B) loses exclusivity Q3 2027", d: "Opportunity window opening for biosimilar entrants", tag: "Patent" },
          ].map((a, i) => (
            <div key={i} className={"alert-row " + a.sev}>
              <span className="alert-ic" style={{ background: a.sev === "warn" ? "var(--amber-100)" : "var(--blue-100)", color: a.sev === "warn" ? "var(--amber-600)" : "var(--blue-600)" }}><Icon name={a.ic} size={16} /></span>
              <div style={{ flex: 1 }}><div className="row gap-8 center mb-4"><span style={{ fontWeight: 560, fontSize: 13 }}>{a.t}</span></div><div className="t-small">{a.d}</div></div>
              <div className="row gap-8 center"><span className="tag">{a.tag}</span><button className="btn btn-secondary btn-sm"><Icon name="bell" size={12} /> Alert</button></div>
            </div>
          ))}
        </div>
      )}

      {tab === "trackers" && showPharma && (
        <div className="col gap-16">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card card-pad">
              <div className="rail-panel-head"><h3 className="t-h3">Drug Launch Tracker</h3><span className="tag">cross-company pricing</span></div>
              <table className="dtable" style={{ fontSize: 12 }}>
                <thead><tr><th>Drug</th><th>Molecule</th><th className="num">Price</th><th className="num">vs comp</th><th>Status</th></tr></thead>
                <tbody>
                  {db.drugLaunch.map((d) => (
                    <tr key={d.drug} style={{ cursor: "default" }}>
                      <td><div style={{ fontWeight: 560 }}>{d.drug}</div><div className="t-small">{d.company}</div></td>
                      <td className="t-small">{d.molecule}</td>
                      <td className="num">${d.price.toLocaleString()}</td>
                      <td className="num"><span style={{ color: d.price < d.comp ? "var(--green-600)" : "var(--red-600)", fontWeight: 560 }}>{d.price < d.comp ? "−" : "+"}{Math.abs(Math.round((d.price / d.comp - 1) * 100))}%</span></td>
                      <td><StatusPill status={d.status} dot={false} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card card-pad">
              <div className="rail-panel-head"><h3 className="t-h3">Patent Cliff Calendar</h3><Icon name="calendar" size={14} style={{ color: "var(--text-muted)" }} /></div>
              <p className="t-small mb-12">Upcoming expiries — opportunity window highlighted.</p>
              <div className="col gap-12">
                {db.patentCliff.map((d) => (
                  <div key={d.drug}>
                    <div className="row between center mb-4"><span className="row gap-7 center"><span style={{ fontWeight: 560, fontSize: 12.5 }}>{d.drug}</span><span className="t-small">{d.company}</span></span><span className="row gap-8 center"><span className="num t-small">${d.sales}B</span><span className="tag" style={{ fontSize: 10 }}>{d.expiry}</span></span></div>
                    <div className="fit-track" style={{ width: "100%", height: 7 }}><div className="fit-fill" style={{ width: d.window * 100 + "%", background: "linear-gradient(90deg, var(--amber-500), var(--red-500))" }}></div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "sources" && (
        <div className="card" style={{ overflow: "hidden", maxWidth: 760 }}>
          <table className="dtable">
            <thead><tr><th>Source</th><th>Type</th><th>Status</th><th style={{ width: 36 }}></th></tr></thead>
            <tbody>
              {db.sectorSources.map((s) => (
                <tr key={s.name} style={{ cursor: "default" }}>
                  <td><span className="row gap-9 center"><span style={{ width: 28, height: 28, borderRadius: 7, background: "var(--bg-sunken)", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="database" size={14} /></span><span style={{ fontWeight: 540 }}>{s.name}</span></span></td>
                  <td><span className="tag">{s.type}</span></td>
                  <td><StatusPill status={s.status} /></td>
                  <td><Menu items={[{ icon: "refresh", text: "Sync now" }, { icon: "settings", text: "Configure" }, { sep: true }, { icon: "x", text: "Disconnect", danger: true }]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SentimentChart({ data }) {
  const w = 260, h = 90, pad = 6;
  const x = (i) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const y = (v) => pad + (1 - v / 100) * (h - pad * 2);
  const pos = data.map((d, i) => (i ? "L" : "M") + x(i) + " " + y(d.pos)).join(" ");
  const neg = data.map((d, i) => (i ? "L" : "M") + x(i) + " " + y(d.neg)).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={pos} fill="none" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round" />
      <path d={neg} fill="none" stroke="var(--red-500)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.7" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].pos)} r="3" fill="var(--green-500)" />
    </svg>
  );
}
window.SectorView = SectorView;
window.SectorCoView = SectorCoView;

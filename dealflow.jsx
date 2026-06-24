/* ============================================================
   Deal Flow → window.DealFlowView
   ============================================================ */
function DealFlowView({ params }) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [view, setView] = useState(params && params.weekly ? "weekly" : "table");
  const [sort, setSort] = useState("fit");
  const [filters, setFilters] = useState({ sector: "All", minFit: 0, status: "All" });

  let deals = [...db.deals];
  if (filters.sector !== "All") deals = deals.filter((d) => d.sector === filters.sector);
  if (filters.status !== "All") deals = deals.filter((d) => d.status === filters.status);
  deals = deals.filter((d) => d.fit >= filters.minFit);
  deals.sort((a, b) => sort === "fit" ? b.fit - a.fit : sort === "rev" ? (b.revenue || 0) - (a.revenue || 0) : new Date(b.received) - new Date(a.received));

  const sectors = ["All", ...Object.keys(db.SECTOR_COLOR)];
  const statuses = ["All", "New", "Triaging", "Screening", "IC Review", "Pursuing", "Passed"];

  return (
    <div className="page page-wide">
      <PageHead title="Deal Flow" sub="A living pipeline — inbound opportunities ranked against your thesis. You see ~400 a year and act on ~10.">
        <Seg value={view} onChange={setView} options={[
          { value: "table", label: "Table", icon: "table" },
          { value: "kanban", label: "Pipeline", icon: "columns" },
          { value: "weekly", label: "Weekly Review", icon: "calendar" },
        ]} />
        <button className="btn btn-primary" onClick={() => ctx.openWizard()}><Icon name="plus" size={15} /> New Deal</button>
      </PageHead>

      {/* live ingestion banner */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 16px", marginBottom: 18, borderColor: "var(--blue-200)", background: "linear-gradient(90deg, var(--blue-50), #fff 70%)" }}>
        <span className="feed-ic" style={{ background: "var(--blue-100)", color: "var(--blue-600)" }}><Icon name="mail" size={15} /></span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 560 }}>12 new deals this week</span>
          <span className="t-small"> — auto-ingested from <strong style={{ color: "var(--text-secondary)" }}>deals@munshot.vc</strong>, Dropbox sync & WhatsApp connector. Metrics extracted automatically.</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => ctx.navigate("documents", { tab: "sources" })}>Manage sources <Icon name="arrowRight" size={13} /></button>
      </div>

      {view === "weekly" ? <WeeklyReview deals={db.deals.filter((d) => d.isNew)} /> : (
        <div style={{ display: "grid", gridTemplateColumns: "208px 1fr", gap: 20, alignItems: "start" }}>
          {/* filter rail */}
          <div className="card card-pad">
            <div className="row between center mb-12"><span className="t-h3">Filters</span><Icon name="filter" size={14} style={{ color: "var(--text-muted)" }} /></div>
            <FilterGroup label="Sector">
              {sectors.map((s) => (
                <label key={s} className="row gap-8 center pointer" style={{ padding: "5px 0", fontSize: 12.5 }}>
                  <input type="radio" checked={filters.sector === s} onChange={() => setFilters((f) => ({ ...f, sector: s }))} style={{ accentColor: "var(--blue-500)" }} />
                  {s !== "All" && <span style={{ width: 8, height: 8, borderRadius: 2, background: db.SECTOR_COLOR[s] }}></span>}
                  {s}
                </label>
              ))}
            </FilterGroup>
            <FilterGroup label={"Min fit score · " + filters.minFit}>
              <input type="range" min="0" max="95" step="5" value={filters.minFit} onChange={(e) => setFilters((f) => ({ ...f, minFit: +e.target.value }))} style={{ width: "100%", accentColor: "var(--blue-500)" }} />
            </FilterGroup>
            <FilterGroup label="Status">
              <select className="select" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </FilterGroup>
            <div className="divider" style={{ margin: "4px 0 12px" }}></div>
            <div className="t-small" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div className="row between"><span className="text-muted">Showing</span><strong className="num">{deals.length} deals</strong></div>
              <div className="row between"><span className="text-muted">Avg fit</span><strong className="num">{Math.round(deals.reduce((s, d) => s + d.fit, 0) / (deals.length || 1))}</strong></div>
            </div>
          </div>

          {view === "table" ? <DealTable deals={deals} sort={sort} setSort={setSort} /> : <KanbanBoard deals={deals} />}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="label" style={{ marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );
}

function DealTable({ deals, sort, setSort }) {
  const ctx = useContext(AppCtx);
  const th = (key, label, cls = "") => (
    <th className={"sortable " + cls} onClick={() => setSort(key)}>
      <span className="row gap-4 center" style={{ justifyContent: cls.includes("num") ? "flex-end" : "flex-start" }}>
        {label}{sort === key && <Icon name="chevDown" size={12} />}
      </span>
    </th>
  );
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="scroll" style={{ overflowX: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              <th>Company</th>
              <th>Sector</th>
              <th>Source</th>
              {th("date", "Received")}
              {th("rev", "Revenue", "num")}
              <th className="num">EBITDA</th>
              <th className="num">Ask</th>
              {th("fit", "Fit Score", "num")}
              <th>Status</th>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.id} className={d.isNew ? "row-new" : ""} onClick={() => ctx.navigate("workspace", { id: d.id })}>
                <td>
                  <div className="row gap-10 center">
                    <LogoTile initials={d.initials} sector={d.sector} size={30} />
                    <div style={{ minWidth: 0 }}>
                      <div className="row gap-6 center">
                        <span style={{ fontWeight: 560 }}>{d.name}</span>
                        {d.isNew && <span className="pill pill-new" style={{ fontSize: 9, padding: "1px 6px" }}>NEW</span>}
                      </div>
                      <div className="t-small truncate" style={{ maxWidth: 260 }}>{d.take}</div>
                    </div>
                  </div>
                </td>
                <td><div style={{ fontSize: 12.5 }}>{d.sector}</div><div className="t-small">{d.sub}</div></td>
                <td><div style={{ fontSize: 12.5 }}>{d.source}</div><div className="t-small">{d.sourceType}</div></td>
                <td className="t-small nowrap">{fmtDate(d.received)}</td>
                <td className="num">{d.revenue != null ? "$" + d.revenue.toFixed(0) + "M" : "—"}</td>
                <td className="num">{d.ebitda != null ? "$" + d.ebitda.toFixed(1) + "M" : "—"}</td>
                <td className="num">{d.ask != null ? "$" + d.ask + "M" : "—"}</td>
                <td className="num"><FitBar score={d.fit} /></td>
                <td><StatusPill status={d.status} /></td>
                <td onClick={(e) => e.stopPropagation()}>
                  <Menu items={[
                    { icon: "eye", text: "Open workspace", onClick: () => ctx.navigate("workspace", { id: d.id }) },
                    { icon: "sparkles", text: "Generate memo", onClick: () => ctx.navigate("memos") },
                    { icon: "sourceDoc", text: "View source documents", onClick: () => ctx.openSource("default") },
                    { sep: true },
                    { icon: "checkCircle", text: "Move to Pursuing" },
                    { icon: "flag", text: "Pass on deal", danger: true, onClick: () => ctx.toast("Marked as passed", "flag") },
                  ]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const STAGES = ["New", "Triaging", "Screening", "IC Review", "Pursuing", "Passed"];
function KanbanBoard({ deals }) {
  const ctx = useContext(AppCtx);
  return (
    <div className="scroll" style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{ display: "flex", gap: 12, minWidth: "min-content" }}>
        {STAGES.map((stage) => {
          const items = deals.filter((d) => d.status === stage);
          return (
            <div key={stage} style={{ width: 232, flex: "none" }}>
              <div className="row between center" style={{ padding: "0 4px 10px" }}>
                <div className="row gap-6 center"><StatusPill status={stage} dot={true} /><span className="num" style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{items.length}</span></div>
              </div>
              <div className="col gap-8" style={{ background: "var(--bg-sunken)", borderRadius: 10, padding: 8, minHeight: 120 }}>
                {items.map((d) => (
                  <div key={d.id} className="card card-hover pointer" style={{ padding: 11 }} onClick={() => ctx.navigate("workspace", { id: d.id })}>
                    <div className="row gap-8 center mb-8">
                      <LogoTile initials={d.initials} sector={d.sector} size={26} />
                      <span style={{ fontWeight: 560, fontSize: 12.5 }} className="truncate">{d.name}</span>
                    </div>
                    <p className="t-small" style={{ lineHeight: 1.4, marginBottom: 9, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.take}</p>
                    <div className="row between center">
                      <span className="tag" style={{ fontSize: 10 }}>{d.sub}</span>
                      <FitBar score={d.fit} />
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div style={{ textAlign: "center", padding: "16px 0", color: "var(--gray-400)", fontSize: 11.5 }}>Empty</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyReview({ deals }) {
  const ctx = useContext(AppCtx);
  const [idx, setIdx] = useState(0);
  const [decisions, setDecisions] = useState({});
  const d = deals[idx];
  const decide = (verb) => { setDecisions((p) => ({ ...p, [d.id]: verb })); ctx.toast(d.name + " → " + verb, verb === "Pass" ? "flag" : "check"); if (idx < deals.length - 1) setTimeout(() => setIdx((i) => i + 1), 250); };
  if (!d) return null;
  return (
    <div>
      <div className="row between center mb-16">
        <div className="row gap-10 center">
          <span className="t-small">Monday triage · batching {deals.length} new deals into minutes, not hours.</span>
        </div>
        <div className="row gap-8 center">
          <span className="num t-small">{idx + 1} / {deals.length}</span>
          <button className="btn btn-icon btn-secondary btn-sm" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}><Icon name="chevLeft" size={15} /></button>
          <button className="btn btn-icon btn-secondary btn-sm" disabled={idx === deals.length - 1} onClick={() => setIdx((i) => Math.min(deals.length - 1, i + 1))}><Icon name="chevRight" size={15} /></button>
        </div>
      </div>
      {/* progress dots */}
      <div className="row gap-4 mb-16" style={{ height: 4 }}>
        {deals.map((x, i) => <div key={x.id} style={{ flex: 1, borderRadius: 2, background: i === idx ? "var(--blue-500)" : decisions[x.id] ? (decisions[x.id] === "Pass" ? "var(--red-300, #f8cfcf)" : "var(--green-300, #c8ecd7)") : "var(--gray-200)" }}></div>)}
      </div>

      <div className="card fade-cycle" key={d.id} style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr" }}>
          {/* left: thesis */}
          <div style={{ padding: 26, borderRight: "1px solid var(--border)" }}>
            <div className="row gap-14 center mb-16">
              <LogoTile initials={d.initials} sector={d.sector} size={52} />
              <div>
                <div className="row gap-8 center"><h2 className="t-h1">{d.name}</h2><span className="pill pill-new">NEW</span></div>
                <div className="t-body">{d.desc}</div>
              </div>
            </div>
            <div className="row gap-8 wrap mb-16">
              <span className="tag">{d.sector} · {d.sub}</span>
              <span className="tag">{d.strategy}</span>
              <span className="tag"><Icon name="mail" size={11} /> via {d.source}</span>
              <span className="tag"><Icon name="pin" size={11} /> {d.geo}</span>
            </div>
            <div className="card-pad" style={{ background: "var(--blue-50)", borderRadius: 10, border: "1px solid var(--blue-100)" }}>
              <div className="row gap-7 center mb-8"><Icon name="sparkles" size={14} style={{ color: "var(--blue-600)" }} /><span className="label" style={{ color: "var(--blue-700)" }}>AI Take</span></div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-primary)" }}>{d.thesis}</p>
            </div>
            <div className="card-pad" style={{ marginTop: 12, background: "var(--bg-subtle)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div className="row gap-7 center mb-8"><Icon name="mail" size={13} style={{ color: "var(--text-muted)" }} /><span className="label">Banker email context</span></div>
              <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--text-secondary)", fontStyle: "italic" }}>
                “{d.source} reaching out on a proprietary basis ahead of broad launch. Management open to a partnership structure. First-round bids targeted for early Q3. Happy to set up a call.”
              </p>
            </div>
          </div>
          {/* right: metrics + decision */}
          <div style={{ padding: 26, display: "flex", flexDirection: "column" }}>
            <span className="label" style={{ marginBottom: 12 }}>Extracted metrics</span>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
              <WRMetric label="Revenue" v={d.revenue != null ? "$" + d.revenue + "M" : "—"} sub={d.revYoY ? "+" + d.revYoY + "% YoY" : ""} />
              <WRMetric label="EBITDA" v={d.ebitda != null ? "$" + d.ebitda + "M" : "—"} sub={d.ebitdaYoY ? "+" + d.ebitdaYoY + "% YoY" : ""} />
              <WRMetric label="Ask / Valuation" v={d.ask != null ? "$" + d.ask + "M" : "—"} sub={d.revenue ? (d.ask / d.revenue).toFixed(1) + "x rev" : ""} />
              <WRMetric label="Employees" v={d.employees} sub={"Founded " + d.founded} />
            </div>
            <div className="row between center mb-12" style={{ padding: "12px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
              <span className="label">Thesis fit</span>
              <div style={{ width: 140 }}><FitBar score={d.fit} /></div>
            </div>
            <div style={{ flex: 1 }}></div>
            {decisions[d.id] && (
              <div className="row gap-7 center mb-12" style={{ color: decisions[d.id] === "Pass" ? "var(--red-600)" : "var(--green-600)", fontSize: 12.5, fontWeight: 560 }}>
                <Icon name="checkCircle" size={15} /> Decision recorded: {decisions[d.id]}
              </div>
            )}
            <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <button className="btn btn-secondary" onClick={() => decide("Pass")}><Icon name="x" size={14} /> Pass</button>
              <button className="btn btn-secondary" onClick={() => decide("Discuss")}><Icon name="users" size={14} /> Discuss</button>
              <button className="btn btn-primary" onClick={() => decide("Pursue")}><Icon name="check" size={14} /> Pursue</button>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 10, justifyContent: "center" }} onClick={() => ctx.navigate("workspace", { id: d.id })}>Open full workspace <Icon name="arrowRight" size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
function WRMetric({ label, v, sub }) {
  return (
    <div>
      <div className="metric-label" style={{ marginBottom: 4 }}>{label}</div>
      <div className="num" style={{ fontSize: 19, fontWeight: 650 }}>{v}</div>
      {sub && <div className="metric-delta delta-up" style={{ marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function fmtDate(s) {
  const d = new Date(s);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
window.DealFlowView = DealFlowView;
window.fmtDate = fmtDate;

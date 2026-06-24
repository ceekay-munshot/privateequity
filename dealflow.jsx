/* ============================================================
   Deal Flow → window.DealFlowView
   Active pipeline (table / kanban) · Weekly Review · Archived
   Email→status automation · Excel import/export · actionables
   ============================================================ */
const STAGES = ["Triaging", "Screening", "IC Review", "Pursuing"];

function DealFlowView({ params }) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [view, setView] = useState(params && params.weekly ? "weekly" : "table");
  const [sort, setSort] = useState("fit");
  const [filters, setFilters] = useState({ sector: "All", minFit: 0, status: "All" });
  const [overrides, setOverrides] = useState({});
  const [emailOpen, setEmailOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const eff = (d) => overrides[d.id] || d.status;
  const move = (d, to) => { setOverrides((o) => ({ ...o, [d.id]: to })); ctx.toast(d.name + " → " + (to === "Passed" ? "Archived" : to), to === "Passed" ? "flag" : "check"); };
  const logAction = (d, label) => ctx.toast(label + " added to " + d.name + " actionables", "check");

  let deals = db.deals.filter((d) => eff(d) !== "Passed");
  const archived = db.deals.filter((d) => eff(d) === "Passed");
  if (filters.sector !== "All") deals = deals.filter((d) => d.sector === filters.sector);
  if (filters.status !== "All") deals = deals.filter((d) => eff(d) === filters.status);
  deals = deals.filter((d) => d.fit >= filters.minFit);
  deals.sort((a, b) => sort === "fit" ? b.fit - a.fit : sort === "rev" ? (b.revenue || 0) - (a.revenue || 0) : new Date(b.received) - new Date(a.received));

  const sectors = ["All", ...Object.keys(db.SECTOR_COLOR)];
  const statuses = ["All", ...STAGES];
  const pendingEmail = db.inbox.reduce((n, e) => n + e.updates.filter((u) => !u.applied).length, 0);

  return (
    <div className="page page-wide">
      <PageHead title="Deal Flow" sub="A living pipeline — inbound opportunities ranked against your thesis. You see ~400 a year and act on ~10.">
        <Seg value={view} onChange={setView} options={[
          { value: "table", label: "Table", icon: "table" },
          { value: "kanban", label: "Pipeline", icon: "columns" },
          { value: "weekly", label: "Weekly Review", icon: "calendar" },
          { value: "archived", label: "Archived", icon: "folder" },
        ]} />
        <button className="btn btn-primary" onClick={() => ctx.openWizard()}><Icon name="plus" size={15} /> New Deal</button>
      </PageHead>

      {/* live ingestion + email automation banner */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 16px", marginBottom: 18, borderColor: "var(--blue-200)", background: "linear-gradient(90deg, var(--blue-50), #fff 70%)" }}>
        <span className="feed-ic" style={{ background: "var(--blue-100)", color: "var(--blue-600)" }}><Icon name="mail" size={15} /></span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 560 }}>{pendingEmail > 0 ? pendingEmail + " status updates" : "All caught up"} from email</span>
          <span className="t-small"> — auto-ingested from <strong style={{ color: "var(--text-secondary)" }}>{db.intakeEmail}</strong>, Dropbox sync & WhatsApp. The AI reads "next steps" tables and moves deals automatically.</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setEmailOpen(true)}>Review email updates {pendingEmail > 0 && <span className="nav-badge">{pendingEmail}</span>} <Icon name="arrowRight" size={13} /></button>
      </div>

      {/* toolbar: excel import/export */}
      {(view === "table" || view === "archived") && (
        <div className="row gap-8 center mb-12" style={{ justifyContent: "flex-end" }}>
          <span className="t-small" style={{ marginRight: "auto" }}>{view === "archived" ? archived.length + " archived" : deals.length + " active deals"}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setImportOpen(true)}><Icon name="upload" size={13} /> Import Excel</button>
          <button className="btn btn-secondary btn-sm" onClick={() => ctx.toast("Exporting " + (view === "archived" ? archived.length : deals.length) + " rows to Paragon_Pipeline.xlsx", "check")}><Icon name="download" size={13} /> Export Excel</button>
        </div>
      )}

      {view === "weekly" ? <WeeklyReview deals={db.deals.filter((d) => d.isNew)} /> :
       view === "archived" ? <ArchivedTable deals={archived} onRestore={(d) => move(d, "Screening")} /> : (
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

          {view === "table" ? <DealTable deals={deals} sort={sort} setSort={setSort} eff={eff} move={move} logAction={logAction} /> : <KanbanBoard deals={deals} eff={eff} move={move} logAction={logAction} />}
        </div>
      )}

      {emailOpen && <EmailAutomationDrawer onClose={() => setEmailOpen(false)} />}
      {importOpen && <ExcelImportModal onClose={() => setImportOpen(false)} />}
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

function dealMenu(ctx, d, move, logAction) {
  return [
    { icon: "eye", text: "Open workspace", onClick: () => ctx.navigate("workspace", { id: d.id }) },
    { icon: "sparkles", text: "Generate screening memo", onClick: () => ctx.navigate("memos") },
    { label: "Move to stage" },
    ...STAGES.map((s) => ({ icon: "arrowRight", text: s, onClick: () => move(d, s) })),
    { sep: true },
    { icon: "calendar", text: "Schedule banker call", onClick: () => logAction(d, "Banker call") },
    { icon: "fileText", text: "Log next step / note", onClick: () => logAction(d, "Next step") },
    { sep: true },
    { icon: "flag", text: "Pass & archive", danger: true, onClick: () => move(d, "Passed") },
  ];
}

function DealTable({ deals, sort, setSort, eff, move, logAction }) {
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
                <td><StatusPill status={eff(d)} /></td>
                <td onClick={(e) => e.stopPropagation()}>
                  <Menu items={dealMenu(ctx, d, move, logAction)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KanbanBoard({ deals, eff, move, logAction }) {
  const ctx = useContext(AppCtx);
  const [dragId, setDragId] = useState(null);
  const [overStage, setOverStage] = useState(null);
  const drop = (stage) => {
    const d = deals.find((x) => x.id === dragId);
    if (d && eff(d) !== stage) move(d, stage);
    setDragId(null); setOverStage(null);
  };
  return (
    <div>
      <div className="row gap-6 center mb-12 t-small" style={{ color: "var(--text-muted)" }}>
        <Icon name="grid" size={13} /> Drag a card to another column to move the deal between stages — or use the ⋯ menu.
      </div>
      <div className="scroll" style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 12, minWidth: "min-content" }}>
          {STAGES.map((stage) => {
            const items = deals.filter((d) => eff(d) === stage);
            const over = overStage === stage;
            return (
              <div key={stage} style={{ width: 240, flex: "none" }}>
                <div className="row between center" style={{ padding: "0 4px 10px" }}>
                  <div className="row gap-6 center"><StatusPill status={stage} dot={true} /><span className="num" style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{items.length}</span></div>
                </div>
                <div className={"col gap-8 kanban-col" + (over ? " drop-over" : "")}
                  style={{ borderRadius: 10, padding: 8, minHeight: 150 }}
                  onDragOver={(e) => { if (dragId != null) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (!over) setOverStage(stage); } }}
                  onDragLeave={(e) => { if (e.currentTarget === e.target) setOverStage((s) => (s === stage ? null : s)); }}
                  onDrop={(e) => { e.preventDefault(); drop(stage); }}>
                  {items.map((d) => (
                    <div key={d.id}
                      className={"card card-hover kanban-card" + (dragId === d.id ? " dragging" : "")}
                      style={{ padding: 11 }}
                      draggable={true}
                      title="Drag to move between stages"
                      onDragStart={(e) => { setDragId(d.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", d.id); }}
                      onDragEnd={() => { setDragId(null); setOverStage(null); }}
                      onClick={() => ctx.navigate("workspace", { id: d.id })}>
                      <div className="row between center mb-8">
                        <div className="row gap-7 center" style={{ minWidth: 0 }}>
                          <span className="kanban-grip" aria-hidden="true"></span>
                          <LogoTile initials={d.initials} sector={d.sector} size={26} />
                          <span style={{ fontWeight: 560, fontSize: 12.5 }} className="truncate">{d.name}</span>
                        </div>
                        <span onClick={(e) => e.stopPropagation()}><Menu items={dealMenu(ctx, d, move, logAction)} /></span>
                      </div>
                      <p className="t-small" style={{ lineHeight: 1.4, marginBottom: 9, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.take}</p>
                      <div className="row between center">
                        <span className="tag" style={{ fontSize: 10 }}>{d.sub}</span>
                        <FitBar score={d.fit} />
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <div style={{ textAlign: "center", padding: "20px 0", color: over ? "var(--blue-600)" : "var(--gray-400)", fontSize: 11.5, fontWeight: over ? 560 : 400 }}>{over ? "Drop to move here" : "Drop deals here"}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- Archived (passed) deals ---------- */
function ArchivedTable({ deals, onRestore }) {
  const ctx = useContext(AppCtx);
  if (deals.length === 0) return (
    <div className="empty-state"><span className="empty-ic"><Icon name="folder" size={26} /></span><div className="t-h3">Nothing archived</div><p className="t-body">Passed deals move here, out of your active pipeline.</p></div>
  );
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="row between center" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
        <span className="t-small">Deals you've passed — kept for institutional memory, out of the active view.</span>
      </div>
      <div className="scroll" style={{ overflowX: "auto" }}>
        <table className="dtable">
          <thead><tr><th>Company</th><th>Sector</th><th>Source</th><th>Reason passed</th><th>Passed</th><th style={{ width: 36 }}></th></tr></thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.id} onClick={() => ctx.navigate("workspace", { id: d.id })}>
                <td><span className="row gap-10 center"><LogoTile initials={d.initials} sector={d.sector} size={30} /><span style={{ fontWeight: 540 }}>{d.name}</span></span></td>
                <td><div style={{ fontSize: 12.5 }}>{d.sector}</div><div className="t-small">{d.sub}</div></td>
                <td className="t-small">{d.source}</td>
                <td className="t-small" style={{ maxWidth: 280 }}>{d.passReason || "—"}</td>
                <td className="t-small nowrap">{d.passedDate ? fmtDate(d.passedDate) : "—"}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <Menu items={[
                    { icon: "eye", text: "Open workspace", onClick: () => ctx.navigate("workspace", { id: d.id }) },
                    { icon: "refresh", text: "Restore to pipeline", onClick: () => onRestore(d) },
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

/* ---------- Email → status automation drawer ---------- */
function EmailAutomationDrawer({ onClose }) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [applied, setApplied] = useState({});
  const isApplied = (eid, i, base) => applied[eid + ":" + i] !== undefined ? applied[eid + ":" + i] : base;
  return (
    <Drawer onClose={onClose}>
      <div className="modal-head">
        <div>
          <div className="row gap-8 center mb-4"><span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--blue-50)", color: "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="mail" size={15} /></span><h2 className="t-h2">Email → Status</h2></div>
          <p className="t-body">The AI read these emails and the "next steps" tables inside them.</p>
        </div>
        <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div className="modal-body scroll" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {db.inbox.map((e) => (
          <div key={e.id} className="card card-pad">
            <div className="row gap-10 center mb-8">
              <span className="feed-ic" style={{ background: "var(--bg-sunken)", color: "var(--text-secondary)" }}><Icon name="mail" size={14} /></span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 560 }} className="truncate">{e.subject}</div><div className="t-small">{e.from} · {e.time}</div></div>
            </div>
            <p className="t-small" style={{ fontStyle: "italic", marginBottom: 10 }}>"{e.preview}"</p>
            <div className="label mb-8">Detected next steps</div>
            <div className="col gap-8">
              {e.updates.map((u, i) => {
                const deal = db.dealById(u.deal);
                const on = isApplied(e.id, i, u.applied);
                return (
                  <div key={i} className="card" style={{ padding: 11, background: "var(--bg-subtle)" }}>
                    <div className="row between center mb-4">
                      <span style={{ fontWeight: 540, fontSize: 12.5 }}>{deal ? deal.name : u.deal}</span>
                      {u.from !== u.to
                        ? <span className="row gap-5 center t-small"><StatusPill status={u.from} dot={false} /><Icon name="arrowRight" size={12} style={{ color: "var(--text-muted)" }} /><StatusPill status={u.to} dot={false} /></span>
                        : <span className="tag">No status change</span>}
                    </div>
                    <div className="t-small" style={{ marginBottom: 8 }}>{u.step}</div>
                    {on
                      ? <span className="row gap-5 center" style={{ color: "var(--green-600)", fontSize: 11.5, fontWeight: 560 }}><Icon name="checkCircle" size={13} /> Applied automatically</span>
                      : <button className="btn btn-secondary btn-sm" onClick={() => { setApplied((p) => ({ ...p, [e.id + ":" + i]: true })); ctx.toast("Applied — " + (deal ? deal.name : u.deal) + " updated", "check"); }}><Icon name="check" size={12} /> Apply update</button>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="modal-foot"><button className="btn btn-secondary" onClick={onClose}>Close</button><button className="btn btn-primary" onClick={() => { onClose(); ctx.toast("All email updates applied", "check"); }}><Icon name="check" size={14} /> Apply all</button></div>
    </Drawer>
  );
}

/* ---------- Excel tracker import ---------- */
function ExcelImportModal({ onClose }) {
  const ctx = useContext(AppCtx);
  const cols = [
    { x: "Company", to: "Name", ok: true },
    { x: "Sector", to: "Sector", ok: true },
    { x: "Banker", to: "Source", ok: true },
    { x: "Rev ($m)", to: "Revenue", ok: true },
    { x: "EBITDA", to: "EBITDA", ok: true },
    { x: "Stage", to: "Status", ok: true },
    { x: "Notes", to: "Next step / note", ok: true },
  ];
  return (
    <Modal onClose={onClose} size="modal-lg">
      <div className="modal-head">
        <div><h2 className="t-h2">Import Excel tracker</h2><p className="t-body">We detected your existing tracker. Columns are auto-mapped — review and import.</p></div>
        <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div className="modal-body">
        <div className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 12, marginBottom: 16, borderColor: "var(--green-100)", background: "var(--green-50)" }}>
          <span style={{ width: 30, height: 30, borderRadius: 7, background: "#fff", color: "var(--green-600)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="table" size={15} /></span>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 540 }}>Paragon_Pipeline_Tracker.xlsx</div><div className="t-small">1,240 rows · 18 columns detected</div></div>
          <span className="pill pill-ready"><span className="dot"></span>Parsed</span>
        </div>
        <div className="label mb-8">Column mapping</div>
        <div className="card" style={{ overflow: "hidden" }}>
          <table className="dtable" style={{ fontSize: 12.5 }}>
            <thead><tr><th>Excel column</th><th>Maps to</th><th>Status</th></tr></thead>
            <tbody>
              {cols.map((c) => (
                <tr key={c.x} style={{ cursor: "default" }}>
                  <td className="mono" style={{ fontSize: 12 }}>{c.x}</td>
                  <td style={{ fontWeight: 540 }}>{c.to}</td>
                  <td><span className="row gap-5 center" style={{ color: "var(--green-600)" }}><Icon name="check" size={13} /> Mapped</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => { onClose(); ctx.toast("Imported 1,240 rows into the pipeline", "check"); }}><Icon name="upload" size={14} /> Import 1,240 rows</button>
      </div>
    </Modal>
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
          <button className="btn btn-secondary btn-sm" onClick={() => ctx.toast("Weekly pipeline PDF generated & sent to the team", "check")}><Icon name="download" size={13} /> Weekly PDF</button>
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
                "{d.source} reaching out on a proprietary basis ahead of broad launch. Management open to a partnership structure. First-round bids targeted for early Q3. Happy to set up a call."
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

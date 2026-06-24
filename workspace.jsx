/* ============================================================
   Deal Workspace / Tear Sheet → window.WorkspaceView
   ============================================================ */
function WorkspaceView({ params }) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const d = db.dealById((params && params.id) || "meridian") || db.deals[0];
  const [tab, setTab] = useState((params && params.tab) || "tear");
  const [analysisOpen, setAnalysisOpen] = useState(true);
  const [exploreSeed, setExploreSeed] = useState(null);
  const openExplore = (topic) => { setExploreSeed(topic + "\u0000" + Date.now()); setTab("explore"); };

  const subnav = [
    { id: "tear", label: "Tear Sheet", icon: "fileText" },
    { id: "explore", label: "Explore", icon: "search" },
    { id: "analysis", label: "Analysis", icon: "sparkles", expand: true },
    { id: "files", label: "Files", icon: "folder" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* in-deal sub-nav */}
      <div style={{ width: 210, flex: "none", borderRight: "1px solid var(--border)", background: "#fff", overflowY: "auto" }} className="scroll">
        <div style={{ padding: "16px 14px 10px" }}>
          <div className="row gap-10 center">
            <LogoTile initials={d.initials} sector={d.sector} size={34} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }} className="truncate">{d.name}</div>
              <div className="t-small truncate">{d.strategy}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "4px 8px" }}>
          {subnav.map((s) => (
            <div key={s.id}>
              <div className={"row gap-10 center pointer"} style={{ padding: "8px 9px", borderRadius: 8, fontSize: 12.5, fontWeight: 500, color: tab === s.id ? "var(--blue-700)" : "var(--text-secondary)", background: tab === s.id ? "var(--blue-50)" : "transparent" }}
                onClick={() => { setTab(s.id); if (s.expand) setAnalysisOpen((o) => !o); }}>
                <Icon name={s.icon} size={15} />{s.label}
                {s.expand && <Icon name="chevDown" size={13} style={{ marginLeft: "auto", transform: analysisOpen ? "none" : "rotate(-90deg)", transition: "transform .18s" }} />}
              </div>
              {s.expand && analysisOpen && (
                <div style={{ paddingLeft: 14, marginBottom: 4 }}>
                  {db.analyses.map((a) => (
                    <div key={a.name} className="row gap-8 center pointer" style={{ padding: "6px 9px", borderRadius: 7, fontSize: 12, color: "var(--text-secondary)" }} onClick={() => ctx.toast("Opening " + a.name + " analysis", "ai")}>
                      <span style={{ width: 6, height: 6, borderRadius: 2, background: a.status === "ready" ? "var(--green-500)" : "var(--amber-500)" }}></span>
                      <span className="truncate">{a.name}</span>
                    </div>
                  ))}
                  <div className="row gap-8 center pointer" style={{ padding: "6px 9px", borderRadius: 7, fontSize: 12, color: "var(--blue-600)", fontWeight: 540 }} onClick={() => ctx.openCreateSection(d)}>
                    <Icon name="plus" size={13} /> Create new analysis
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* main + rail */}
      <div className="app-main" style={{ flex: 1, minWidth: 0 }}>
        {tab === "explore" ? (
          <window.ExploreView d={d} seed={exploreSeed ? exploreSeed.split("\u0000")[0] : null} />
        ) : (
          <div className="app-content scroll" style={{ flex: 1 }}>
            <div className="page" style={{ maxWidth: 1240, paddingTop: 22 }}>
              {tab === "files" ? <DealFilesPanel /> :
               tab === "settings" ? <SettingsPanel d={d} /> :
               <TearSheet d={d} onExplore={openExplore} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Tear sheet ---------- */
function TearSheet({ d, onExplore }) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const fin = db.financials[d.id] || db.financials.meridian;
  const ppl = db.people[d.id] || db.people.meridian;
  const [showPeople, setShowPeople] = useState(false);
  const shownPeople = showPeople ? ppl : ppl.slice(0, 2);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 22, alignItems: "start" }}>
      <div>
        {/* header */}
        <div className="row gap-16" style={{ alignItems: "flex-start", marginBottom: 20 }}>
          <LogoTile initials={d.initials} sector={d.sector} size={54} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row gap-10 center" style={{ marginBottom: 4 }}>
              <h1 className="t-h1">{d.name}</h1>
              <span className="pill pill-screening">{d.strategy}</span>
              <StatusPill status={d.status} />
            </div>
            <p className="t-body" style={{ marginBottom: 8 }}>{d.desc}</p>
            <div className="row gap-14 center wrap">
              <span className="row gap-5 center t-small"><Icon name="globe" size={13} style={{ color: "var(--text-muted)" }} /> {d.website}</span>
              <span className="row gap-5 center t-small"><Icon name="pin" size={13} style={{ color: "var(--text-muted)" }} /> {d.hq}</span>
              <span className="row gap-5 center t-small"><Icon name="layers" size={13} style={{ color: "var(--text-muted)" }} /> {d.sector} · {d.sub}</span>
            </div>
          </div>
          <div className="row gap-8 center">
            <button className="btn btn-primary btn-sm nowrap" onClick={() => ctx.toast("Drafting screening memo from the IM + emails using your house template…", "ai")}><Icon name="sparkles" size={13} /> Screening memo</button>
            <div className="row gap-4 center">
              {["external", "linkedin", "bookmark", "download"].map((ic) => (
                <button key={ic} className="btn btn-icon btn-secondary btn-sm tip" onClick={() => ic === "download" ? ctx.navigate("memos") : ctx.toast("Opening " + ic, "")}>
                  <Icon name={ic} size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col gap-16">
          {/* Next Steps & Actionables */}
          <ActionablesCard d={d} />

          {/* Company Overview */}
          <SectionCard title="Company Overview" icon="building" iconColor="#2f6bff"
            actions={<span className="tag" title="Profile enriched from external data"><Icon name="sparkles" size={10} /> Enriched</span>}>
            <div className="row gap-6 wrap" style={{ marginBottom: 14 }}>
              <span className="t-small text-muted">Enriched by:</span>
              <span className="tag">PitchBook comps</span>
              <span className="tag">Broker research</span>
              <span className="tag">EU alt-data</span>
            </div>
            <div className="kv-grid">
              <KV k="Description"><span style={{ fontWeight: 440, fontSize: 13 }}>{d.desc}</span></KV>
              <KV k="Headquarters">{d.hq}</KV>
              <KV k="Sector">{d.sector}</KV>
              <KV k="Employees"><Prov value={d.employees} metric="Employees" conf="verified" /></KV>
              <KV k="Founded">{d.founded}</KV>
              <KV k="Regions Served">{d.regions}</KV>
            </div>
          </SectionCard>

          {/* Deal Terms */}
          <SectionCard title="Deal Terms" icon="scale" iconColor="#7c5cfc">
            <div className="kv-grid">
              <KV k="Deal Structure"><span style={{ fontWeight: 440, fontSize: 13 }}>Majority recapitalization with management rollover and a co-investment sleeve.</span></KV>
              <KV k="Investment Amount"><Prov value={"$" + d.ask + "M"} metric="Pre-money Valuation" conf="estimated" /></KV>
              <KV k="Investment Stage">{d.stage}</KV>
              <KV k="Ownership %"><Prov value={d.ownership != null ? d.ownership + "%" : "—"} metric="default" conf="estimated" /></KV>
              <KV k="Use of Proceeds">Shareholder liquidity, M&A, intl. expansion</KV>
            </div>
          </SectionCard>

          {/* Financial & Valuation Highlights */}
          <SectionCard title="Financial & Valuation Highlights" icon="trending" iconColor="#16a34a">
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))", gap: 16 }}>
              <HiMetric k="Pre-money Valuation" v={d.preMoney != null ? "$" + d.preMoney + "M" : "—"} metric="Pre-money Valuation" conf="estimated" as="2026" />
              <HiMetric k="Post-money Valuation" v={d.postMoney != null ? "$" + d.postMoney + "M" : "—"} metric="default" conf="estimated" as="2026" />
              <HiMetric k="Revenue" v={d.revenue != null ? "$" + d.revenue + "M" : "—"} metric="Revenue" conf="verified" yoy={d.revYoY} as="2022" />
              <HiMetric k="EBITDA" v={d.ebitda != null ? "$" + d.ebitda + "M" : "—"} metric="EBITDA" conf="verified" yoy={d.ebitdaYoY} as="2022" />
            </div>
          </SectionCard>

          {/* Financial Statements Summary */}
          <SectionCard title="Financial Statements Summary" icon="table" iconColor="#2563eb"
            actions={<span className="tag">USD millions</span>}>
            <FinTable fin={fin} group="P&L" rows={fin.pl} />
            <FinTable fin={fin} group="Balance Sheet" rows={fin.bs} />
            <FinTable fin={fin} group="Performance" rows={fin.perf} last />
          </SectionCard>

          {/* Key People */}
          <SectionCard title="Key People" icon="users" iconColor="#e08a00"
            actions={<span className="tag">{ppl.length} executives</span>}>
            <div className="grid gap-12" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {shownPeople.map((p) => (
                <div key={p.name} className="card" style={{ padding: 14 }}>
                  <div className="row gap-10 center mb-8">
                    <Avatar name={p.name} color={p.av} size="avatar-lg" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row gap-6 center"><span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span><Icon name="linkedin" size={13} style={{ color: "var(--blue-500)" }} /></div>
                      <div className="t-small">{p.title}</div>
                    </div>
                    <span className="pill pill-neutral">{p.exp}y exp</span>
                  </div>
                  <p className="t-small" style={{ lineHeight: 1.5, marginBottom: 8 }}>{p.bio}</p>
                  <div className="row gap-6 wrap">
                    <span className="tag" style={{ fontSize: 10 }}><Icon name="briefcase" size={10} /> {p.prev}</span>
                    <span className="tag" style={{ fontSize: 10 }}>{p.edu}</span>
                  </div>
                </div>
              ))}
            </div>
            {ppl.length > 2 && <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => setShowPeople((s) => !s)}>{showPeople ? "Show less" : `Show ${ppl.length - 2} more`}</button>}
          </SectionCard>
        </div>
      </div>

      {/* right rail */}
      <div>
        <div className="card card-pad rail-panel">
          <div className="rail-panel-head"><span className="t-h3">Quick Links</span><span className="tip" style={{ display: "inline-flex" }}><Icon name="sparkles" size={14} style={{ color: "var(--violet-500)" }} /><span className="tip-bub" style={{ width: 180, whiteSpace: "normal" }}>Each opens a pre-seeded research session scoped to that topic</span></span></div>
          <div className="col" style={{ gap: 1 }}>
            {db.quickLinks.map((q, i) => {
              const meta = db.quickLinkMeta[q] || {};
              const conf = meta.status === "review" ? "review" : meta.status === "stale" ? "estimated" : "verified";
              return (
                <div key={q} className="row between center pointer" style={{ padding: "8px 9px", borderRadius: 8, fontSize: 12.5 }} onClick={() => onExplore(q)}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--gray-100)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <span className="row gap-9 center" style={{ minWidth: 0 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: "var(--violet-50)", color: "var(--violet-500)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name="chat" size={12} /></span>
                    <span style={{ minWidth: 0 }}><span className="truncate" style={{ display: "block" }}>{q}</span><span className="t-small row gap-5 center" style={{ marginTop: 1 }}><ConfDot level={conf} />{meta.fresh || "Not yet run"}</span></span>
                  </span>
                  <Icon name="arrowRight" size={13} style={{ color: "var(--gray-300)", flex: "none" }} />
                </div>
              );
            })}
            <div className="row gap-8 center pointer" style={{ padding: "8px 9px", borderRadius: 8, fontSize: 12, color: "var(--blue-600)", fontWeight: 540 }} onClick={() => ctx.toast("Save the current Explore query to Quick Links", "")}>
              <Icon name="plus" size={13} /> Save a Q&A query
            </div>
          </div>
        </div>

        <div className="card card-pad rail-panel">
          <div className="rail-panel-head"><span className="t-h3">Tear Sheet</span><Icon name="settings" size={14} style={{ color: "var(--text-muted)" }} /></div>
          <div className="col gap-8">
            <RailBtn icon="columns" label="Layout controls" />
            <RailBtn icon="layers" label="Reorder sections" />
            <RailBtn icon="grid" label="Manage sections" badge="9 available" onClick={() => ctx.openManageSections(d)} />
            <button className="btn btn-secondary btn-sm" style={{ justifyContent: "center" }} onClick={() => ctx.openCreateSection(d)}><Icon name="plus" size={13} /> Create Section</button>
            <button className="btn btn-primary btn-sm" style={{ justifyContent: "center" }} onClick={() => ctx.toast("Refreshing all metrics across the tear sheet…", "ai")}><Icon name="refresh" size={13} /> Refresh All</button>
          </div>
        </div>

        <div className="card card-pad rail-panel">
          <div className="rail-panel-head"><span className="t-h3">Deal Updates</span></div>
          <div>
            {[
              { who: "Critic AI", what: "Verified EBITDA bridge against management model", t: "12m ago", c: "#16a34a", ic: "checkCircle" },
              { who: "David Kim", what: "Updated 'Investment Returns' analysis", t: "2h ago", c: "#2f6bff", ic: "trending" },
              { who: "Critic AI", what: "Flagged customer concentration risk", t: "5h ago", c: "#e08a00", ic: "flag" },
            ].map((u, i) => (
              <div key={i} className="feed-item" style={{ borderBottom: i < 2 ? "1px solid var(--border)" : "none", paddingTop: i === 0 ? 0 : 10 }}>
                <span className="feed-ic" style={{ background: u.c + "1a", color: u.c, width: 26, height: 26 }}><Icon name={u.ic} size={13} /></span>
                <div className="feed-main"><div className="feed-line" style={{ fontSize: 12 }}>{u.what}</div><div className="feed-time">{u.who} · {u.t}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ACTION_ICON = { call: "calendar", note: "fileText", task: "check" };
function ActionablesCard({ d }) {
  const ctx = useContext(AppCtx);
  const [items, setItems] = useState(window.DB.actionsFor(d.id));
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState("call");
  const [text, setText] = useState("");
  const toggle = (id) => setItems((xs) => xs.map((a) => a.id === id ? { ...a, done: !a.done } : a));
  const add = () => {
    if (!text.trim()) return;
    setItems((xs) => [...xs, { id: "n" + xs.length + Date.now(), type, text: text.trim(), due: "New", owner: "You", done: false }]);
    ctx.toast((type === "call" ? "Call" : type === "note" ? "Note" : "Task") + " added to actionables", "check");
    setText(""); setAdding(false);
  };
  const open = items.filter((a) => !a.done).length;
  return (
    <SectionCard title="Next Steps & Actionables" icon="check" iconColor="#16a34a"
      actions={<span className="tag">{open} open</span>}
      menu={[
        { icon: "calendar", text: "Schedule banker call", onClick: () => { setType("call"); setAdding(true); } },
        { icon: "fileText", text: "Add pipeline note", onClick: () => { setType("note"); setAdding(true); } },
        { icon: "check", text: "Add task", onClick: () => { setType("task"); setAdding(true); } },
      ]}>
      {items.length === 0 && !adding && (
        <p className="t-body" style={{ marginBottom: 12 }}>No next steps yet. Record what came out of your last discussion — a banker call, a note from the pipeline meeting, or a task.</p>
      )}
      <div className="col gap-8">
        {items.map((a) => (
          <div key={a.id} className="row gap-10 center" style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: a.done ? "var(--bg-subtle)" : "#fff" }}>
            <span className="conf-dot" style={{ width: 18, height: 18, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", background: a.done ? "var(--green-500)" : "var(--bg-sunken)", color: a.done ? "#fff" : "var(--text-muted)", cursor: "pointer" }} onClick={() => toggle(a.id)}>{a.done ? <Icon name="check" size={11} /> : <Icon name={ACTION_ICON[a.type]} size={11} />}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, textDecoration: a.done ? "line-through" : "none", color: a.done ? "var(--text-muted)" : "var(--text-primary)" }}>{a.text}</div>
              <div className="t-small">{a.owner} · {a.due}</div>
            </div>
            <span className="tag" style={{ fontSize: 10, textTransform: "capitalize" }}>{a.type}</span>
          </div>
        ))}
      </div>
      {adding ? (
        <div className="row gap-8 center mt-12">
          <select className="select" style={{ width: 110, height: 34 }} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="call">Call</option><option value="note">Note</option><option value="task">Task</option>
          </select>
          <input className="input" style={{ height: 34 }} autoFocus value={text} placeholder="e.g. Banker call with Jefferies, Thu 2pm" onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }} />
          <button className="btn btn-primary btn-sm" onClick={add}>Add</button>
        </div>
      ) : (
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => setAdding(true)}><Icon name="plus" size={13} /> Add next step</button>
      )}
    </SectionCard>
  );
}

function RailBtn({ icon, label, badge, onClick }) {
  return (
    <div className="row between center pointer" style={{ padding: "7px 9px", borderRadius: 8, fontSize: 12.5, border: "1px solid var(--border)" }} onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.background = "var(--gray-50)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
      <span className="row gap-9 center"><Icon name={icon} size={14} style={{ color: "var(--text-secondary)" }} />{label}</span>
      {badge && <span className="t-small">{badge}</span>}
    </div>
  );
}

function HiMetric({ k, v, metric, conf, yoy, as }) {
  return (
    <div className="card" style={{ padding: 13 }}>
      <div className="metric-label" style={{ marginBottom: 6 }}>{k}</div>
      <div style={{ fontSize: 20, fontWeight: 650 }}><Prov value={v} metric={metric} conf={conf} /></div>
      <div className="row gap-8 center" style={{ marginTop: 6 }}>
        {yoy != null && <span className="metric-delta delta-up"><Icon name="arrowUp" size={11} /> {yoy}% YoY</span>}
        <span className="t-small" style={{ marginLeft: yoy != null ? 0 : "auto" }}>as of {as}</span>
      </div>
    </div>
  );
}

function FinTable({ fin, group, rows, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 8 }}>
      <table className="dtable" style={{ fontSize: 12.5 }}>
        <thead>
          <tr>
            <th style={{ background: "transparent", borderBottom: "1px solid var(--border)", color: "var(--text-primary)", fontSize: 11, fontWeight: 640, textTransform: "none", letterSpacing: 0 }}>{group}</th>
            {fin.years.map((y) => <th key={y} className="num" style={{ background: "transparent", borderBottom: "1px solid var(--border)" }}>{y}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.k} style={{ cursor: "default" }}>
              <td style={{ padding: "8px 14px" }}><span className="row gap-7 center"><ConfDot level={r.conf} />{r.k}</span></td>
              {r.v.map((val, i) => <td key={i} className="num" style={{ padding: "8px 14px", fontWeight: i === 0 ? 600 : 440, color: i === 0 ? "var(--text-primary)" : "var(--text-secondary)" }}>{val.toFixed(1)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Deal Files panel (in-deal) ---------- */
function DealFilesPanel() {
  const db = window.DB;
  const [tab, setTab] = useState("files");
  return (
    <div>
      <div className="row between center mb-16">
        <div>
          <h1 className="t-h1">Deal Files</h1>
          <div className="t-small">{db.files.length} files · 29.1 MB · auto-extracted & indexed</div>
        </div>
        <div className="row gap-10 center">
          <Seg value={tab} onChange={setTab} options={[{ value: "files", label: "Files" }, { value: "datasets", label: "Datasets" }]} />
          <Menu align="right" trigger={<button className="btn btn-primary"><Icon name="plus" size={15} /> Add Documents <Icon name="chevDown" size={13} /></button>}
            items={[{ icon: "upload", text: "Add Files" }, { icon: "folder", text: "Add Folder (with sync)" }]} />
        </div>
      </div>
      <FilesTable files={db.files} />
    </div>
  );
}
window.FilesTable = function FilesTable({ files }) {
  const ctx = useContext(AppCtx);
  const ICON = { pdf: "#dc2626", xls: "#16a34a", csv: "#16a34a", ppt: "#e08a00", doc: "#2f6bff" };
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <table className="dtable">
        <thead><tr><th>Name</th><th>Size</th><th>Status</th><th>Updated</th><th>Uploaded by</th><th style={{ width: 36 }}></th></tr></thead>
        <tbody>
          {files.map((f) => (
            <tr key={f.name} style={{ cursor: "default" }}>
              <td><span className="row gap-10 center"><span style={{ width: 30, height: 30, borderRadius: 7, background: ICON[f.ftype] + "1a", color: ICON[f.ftype], display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="file" size={15} /></span><span style={{ fontWeight: 540 }}>{f.name}</span></span></td>
              <td className="num t-small">{f.size}</td>
              <td><StatusPill status={f.status} /></td>
              <td className="t-small nowrap">{f.updated}</td>
              <td><span className="row gap-7 center"><Avatar name={f.by} color={f.av} size="avatar-sm" /><span className="t-small">{f.by}</span></span></td>
              <td><Menu items={[{ icon: "eye", text: "Open", onClick: () => ctx.openSource("default") }, { icon: "download", text: "Download" }, { sep: true }, { icon: "flag", text: "Remove", danger: true }]} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function ExplorePanel({ d }) {
  return <window.QueryBuilder embedded={true} />;
}
function SettingsPanel({ d }) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [restrict, setRestrict] = useState(true);
  return (
    <div style={{ maxWidth: 820 }}>
      <div className="row between center mb-16">
        <div><h1 className="t-h1">Deal settings</h1><div className="t-small">Access, team and export defaults for {d.name}.</div></div>
      </div>
      <div className="card card-pad mb-16">
        <div className="row between center">
          <div><div className="t-h3">Restrict this deal by role</div><p className="t-small" style={{ marginTop: 3 }}>{restrict ? "Only assigned members and partners can open this deal." : "Everyone in the firm can see this deal."}</p></div>
          <div className={"toggle" + (restrict ? " on" : "")} onClick={() => { setRestrict((r) => !r); ctx.toast(restrict ? "Deal now visible to everyone" : "Deal restricted to the team", "check"); }}></div>
        </div>
      </div>
      <div className="row between center mb-8"><span className="label">Deal team</span><button className="btn btn-secondary btn-sm" onClick={() => ctx.toast("Member added to deal", "check")}><Icon name="plus" size={13} /> Add member</button></div>
      <div className="card" style={{ overflow: "hidden", marginBottom: 16 }}>
        {db.team.slice(0, 4).map((m, i) => (
          <div key={m.name} className="row between center" style={{ padding: "11px 16px", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
            <div className="row gap-11 center"><Avatar name={m.name} color={m.av} /><div><div style={{ fontWeight: 540, fontSize: 13 }}>{m.name}</div><div className="t-small">{m.scope}</div></div></div>
            <span className="pill pill-neutral">{m.role}</span>
          </div>
        ))}
      </div>
      <div className="card card-pad">
        <div className="col gap-12">
          <div className="row between center"><span className="t-small">Auto-refresh metrics when new data arrives</span><div className="toggle on"></div></div>
          <div className="divider"></div>
          <div className="row between center"><span className="t-small">Default export</span><span className="tag">Paragon IC Memo v3</span></div>
          <div className="divider"></div>
          <div className="row between center"><span className="t-small">Manage who sees what, firm-wide</span><button className="btn btn-secondary btn-sm" onClick={() => ctx.navigate("settings")}>Open Access Control <Icon name="arrowRight" size={12} /></button></div>
        </div>
      </div>
    </div>
  );
}
window.WorkspaceView = WorkspaceView;

/* ============================================================
   Documents → window.DocumentsView, QueryBuilder
   ============================================================ */
function DocumentsView({ params }) {
  const db = window.DB;
  const [tab, setTab] = useState((params && params.tab) || "files");
  return (
    <div className="page page-wide">
      <PageHead title="Documents" sub="Every file, indexed and queryable — across deals and companies." />
      <div className="mb-16"><Seg value={tab} onChange={setTab} options={[
        { value: "files", label: "Deal Files", icon: "folder" },
        { value: "query", label: "Document Query", icon: "search" },
        { value: "clauses", label: "Key Clauses", icon: "scale" },
        { value: "sources", label: "Ingestion Sources", icon: "api" },
      ]} /></div>
      {tab === "files" && <FilesTab />}
      {tab === "query" && <window.QueryBuilder />}
      {tab === "clauses" && <KeyClauses />}
      {tab === "sources" && <IngestionSources />}
    </div>
  );
}

function FilesTab() {
  const db = window.DB;
  const ctx = useContext(AppCtx);
  const [sync, setSync] = useState(true);
  const [showFolder, setShowFolder] = useState(false);
  return (
    <div>
      <div className="row between center mb-14">
        <div className="t-small">{db.files.length} files · 29.1 MB</div>
        <div className="row gap-10 center">
          <div className="global-search" style={{ width: 240, height: 34 }}><Icon name="search" size={15} /><input placeholder="Search files…" style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: "inherit", fontSize: 13 }} /></div>
          <Menu align="right" trigger={<button className="btn btn-primary"><Icon name="plus" size={15} /> Add Documents <Icon name="chevDown" size={13} /></button>}
            items={[{ icon: "upload", text: "Add Files" }, { icon: "folder", text: "Add Folder", onClick: () => setShowFolder(true) }]} />
        </div>
      </div>
      <window.FilesTable files={db.files} />
      {showFolder && (
        <Modal onClose={() => setShowFolder(false)}>
          <div className="modal-head"><h2 className="t-h2">Add Folder</h2><button className="x-btn" onClick={() => setShowFolder(false)}><Icon name="x" size={18} /></button></div>
          <div className="modal-body">
            <div style={{ border: "2px dashed var(--border-strong)", borderRadius: 12, padding: 32, textAlign: "center", background: "var(--bg-subtle)", marginBottom: 14 }}>
              <span className="empty-ic" style={{ margin: "0 auto 10px" }}><Icon name="folder" size={22} /></span>
              <div className="t-h3">Drop a folder here</div>
              <button className="btn btn-secondary btn-sm" style={{ margin: "10px auto 0" }}>Select Folder</button>
            </div>
            <p className="t-small mb-16">Supported: PDF, CSV, XLS, XLSX, XLSM, TXT, DOC, DOCX, PPT, PPTX</p>
            <div className="card" style={{ padding: 13, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 540 }}>Enable Folder Sync</div><div className="t-small">Keeps the folder continuously synced. Supported in Chrome, Edge & Opera.</div></div>
              <div className={"toggle" + (sync ? " on" : "")} onClick={() => setSync((s) => !s)}></div>
            </div>
          </div>
          <div className="modal-foot"><button className="btn btn-secondary" onClick={() => setShowFolder(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { setShowFolder(false); ctx.toast("Folder uploading & syncing…", "ai"); }}><Icon name="upload" size={14} /> Upload Folder</button></div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Document Query Builder ---------- */
function QueryBuilder({ embedded }) {
  const ctx = useContext(AppCtx);
  const [scope, setScope] = useState("loan documents");
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const examples = [
    "What was the interest rate and key covenants in this facility?",
    "What was the lead investor's stance in the pre-Series A round?",
    "Compare the change-of-control clauses across these three companies",
  ];
  const ask = (text) => {
    const query = text || q; if (!query.trim()) return;
    setQ(query); setLoading(true); setAnswer(null);
    setTimeout(() => { setLoading(false); setAnswer(query.toLowerCase().includes("compare")); }, 1100);
  };
  return (
    <div style={{ maxWidth: embedded ? "none" : 880 }}>
      {!embedded && <div className="row gap-10 center mb-14">
        <span className="label">Scope</span>
        <select className="select" style={{ width: 220 }} value={scope} onChange={(e) => setScope(e.target.value)}>
          <option>loan documents</option><option>Meridian Surgical</option><option>3 selected companies</option><option>all documents</option>
        </select>
        <span className="t-small">Conversational Q&A over your indexed corpus.</span>
      </div>}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="global-search active" style={{ maxWidth: "none", height: 46, background: "#fff" }}>
          <Icon name="sparkles" size={18} style={{ color: "var(--violet-500)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask anything about these documents…" style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: "inherit", fontSize: 14.5, color: "var(--text-primary)" }} />
          <button className="btn btn-primary btn-sm" onClick={() => ask()}>Ask <Icon name="arrowRight" size={13} /></button>
        </div>
        <div className="row gap-8 wrap mt-12">
          {examples.map((ex) => <button key={ex} className="chip" style={{ fontSize: 12 }} onClick={() => ask(ex)}>{ex}</button>)}
        </div>
      </div>

      {loading && <div className="card card-pad"><div className="row gap-8 center mb-12" style={{ color: "var(--violet-500)" }}><Icon name="sparkles" size={15} /> <span style={{ fontSize: 13, fontWeight: 540 }}>Reading documents & extracting citations…</span></div><div className="skel" style={{ height: 9, marginBottom: 8 }}></div><div className="skel" style={{ height: 9, width: "85%", marginBottom: 8 }}></div><div className="skel" style={{ height: 9, width: "60%" }}></div></div>}

      {answer === false && (
        <div className="card card-pad fade-cycle">
          <div className="label mb-8">Answer</div>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
            The facility carries a floating rate of <Prov value="SOFR + 425bps" metric="default" conf="verified" /> with a 0.50% floor. Two financial maintenance covenants apply: a maximum <strong>Net Leverage of 4.75x</strong> <Cite n={1} /> stepping down to 4.25x, and a minimum <strong>Fixed-Charge Coverage of 1.50x</strong> <Cite n={2} />. A springing covenant is tested only when revolver utilization exceeds 35%.
          </p>
          <div className="alert-row" style={{ background: "var(--green-50)", borderColor: "var(--green-100)" }}>
            <span className="alert-ic" style={{ background: "var(--green-100)", color: "var(--green-600)" }}><Icon name="checkCircle" size={16} /></span>
            <div><div style={{ fontSize: 12.5, fontWeight: 560 }}>Critic AI · verified</div><div className="t-small">Both covenant figures cross-checked against the credit agreement (pp. 84, 86). No discrepancy.</div></div>
          </div>
        </div>
      )}
      {answer === true && (
        <div className="card card-pad fade-cycle">
          <div className="label mb-12">Side-by-side comparison · Change-of-control clauses</div>
          <table className="dtable">
            <thead><tr><th>Provision</th><th>Meridian</th><th>Northwind</th><th>Cobalt</th></tr></thead>
            <tbody>
              {[
                ["CoC trigger", "&gt;50% voting", "&gt;50% voting", "&gt;33% voting"],
                ["Acceleration", "Mandatory prepay", "Lender option", "Mandatory prepay"],
                ["Prepay premium", "101%", "102% → 101%", "Par"],
                ["Board consent", "Required", "Not required", "Required"],
              ].map((r, i) => (
                <tr key={i} style={{ cursor: "default" }}>
                  <td style={{ fontWeight: 540 }}>{r[0]}</td>
                  {r.slice(1).map((c, j) => <td key={j}><span className="row gap-6 center" dangerouslySetInnerHTML={{ __html: c }}></span></td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row gap-6 center mt-12"><Cite n={1} /><Cite n={2} /><Cite n={3} /><span className="t-small">Each cell links to the source clause & page.</span></div>
        </div>
      )}
    </div>
  );
}

/* ---------- Key Clauses repository ---------- */
function KeyClauses() {
  const rows = [
    { co: "Meridian Surgical", rate: "SOFR + 425", lev: "4.75x", fcc: "1.50x", coc: ">50%", exit: "Drag at 2x" },
    { co: "Northwind Logistics", rate: "SOFR + 375", lev: "5.00x", fcc: "1.25x", coc: ">50%", exit: "Tag/Drag" },
    { co: "Cobalt Cloud", rate: "SOFR + 500", lev: "4.25x", fcc: "1.75x", coc: ">33%", exit: "Drag at 2.5x" },
    { co: "Harborstone Foods", rate: "Fixed 7.2%", lev: "4.00x", fcc: "1.50x", coc: ">50%", exit: "Put @ yr5" },
  ];
  return (
    <div className="card" style={{ overflow: "hidden", maxWidth: 980 }}>
      <div className="row between center" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
        <span className="t-small">A fixed set of key clauses extracted per document — compare across companies at a glance.</span>
        <button className="btn btn-secondary btn-sm"><Icon name="download" size={13} /> Export</button>
      </div>
      <div className="scroll" style={{ overflowX: "auto" }}>
        <table className="dtable">
          <thead><tr><th>Company</th><th>Interest Rate</th><th>Max Leverage</th><th>Min FCC</th><th>CoC Trigger</th><th>Exit Terms</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.co} style={{ cursor: "default" }}>
                <td style={{ fontWeight: 560 }}>{r.co}</td>
                <td><span className="row gap-6 center"><ConfDot level="verified" /><span className="num">{r.rate}</span></span></td>
                <td className="num">{r.lev}</td>
                <td className="num">{r.fcc}</td>
                <td className="num">{r.coc}</td>
                <td className="t-small">{r.exit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Ingestion Sources ---------- */
function IngestionSources() {
  const db = window.DB;
  const ctx = useContext(AppCtx);
  return (
    <div style={{ maxWidth: 800 }}>
      <div className="card" style={{ marginBottom: 14, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", borderColor: "var(--blue-200)", background: "linear-gradient(90deg, var(--blue-50), #fff 70%)" }}>
        <span className="feed-ic" style={{ background: "var(--blue-100)", color: "var(--blue-600)" }}><Icon name="sparkles" size={16} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 560 }}>Email → status automation</div>
          <div className="t-small">Everything forwarded to <strong style={{ color: "var(--text-secondary)" }}>{db.intakeEmail}</strong> is parsed into the pipeline. The AI reads "next steps" tables and moves deals automatically.</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => ctx.navigate("dealflow")}>Review updates <Icon name="arrowRight" size={13} /></button>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        {db.ingestion.map((s, i) => (
          <div key={s.name} className="row between center" style={{ padding: "13px 16px", borderBottom: i < db.ingestion.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div className="row gap-12 center">
              <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--bg-sunken)", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={s.icon} size={16} /></span>
              <div><div className="row gap-7 center"><span style={{ fontWeight: 540, fontSize: 13 }}>{s.name}</span>{s.category && <span className="tag" style={{ fontSize: 10 }}>{s.category}</span>}</div><div className="t-small">{s.detail}</div></div>
            </div>
            <div className="row gap-14 center">
              <span className="t-small num">{s.sync}</span>
              <StatusPill status={s.status} />
              <Menu items={[{ icon: "refresh", text: "Sync now" }, { icon: "settings", text: "Configure" }, { sep: true }, { icon: "x", text: s.status === "Paused" ? "Resume" : "Pause" }]} />
            </div>
          </div>
        ))}
      </div>
      <div className="row gap-10 center" style={{ marginTop: 14 }}>
        <button className="btn btn-secondary"><Icon name="plus" size={14} /> Connect a source</button>
        <button className="btn btn-secondary" onClick={() => ctx.navigate("settings")}><Icon name="shield" size={14} /> Access control</button>
      </div>
    </div>
  );
}
window.DocumentsView = DocumentsView;
window.QueryBuilder = QueryBuilder;

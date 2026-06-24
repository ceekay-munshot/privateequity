/* ============================================================
   Global Files — thematic, firm-wide shared knowledge library
   window.GlobalFilesView
   ============================================================ */
function GlobalFilesView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [active, setActive] = useState(db.globalFiles[0].id);
  const [expanded, setExpanded] = useState({ [db.globalFiles[0].id]: true });
  const folder = db.globalFiles.find((f) => f.id === active) || db.globalFiles[0];
  const FC = { pdf: "#dc2626", xls: "#16a34a", csv: "#16a34a", ppt: "#e08a00", doc: "#2f6bff" };

  const countFiles = (node) => (node.children || []).reduce((s, c) => s + (c.children ? countFiles(c) : 1), 0);

  return (
    <div className="page page-wide">
      <PageHead title="Global Files" sub="The firm's organization-wide, thematic knowledge — curated once, reusable as a source in any deal's research and tear-sheet extraction.">
        <button className="btn btn-secondary"><Icon name="users" size={15} /> Sharing</button>
        <button className="btn btn-primary"><Icon name="upload" size={15} /> Upload</button>
      </PageHead>

      <div className="card" style={{ marginBottom: 16, padding: "11px 16px", display: "flex", gap: 10, alignItems: "center", borderColor: "var(--blue-200)", background: "var(--blue-50)" }}>
        <Icon name="info" size={16} style={{ color: "var(--blue-600)" }} />
        <span className="t-small" style={{ color: "var(--text-primary)" }}>Distinct from <strong>deal files</strong> (scoped to one transaction). Global files are durable, firm-wide knowledge — industry data, country research, ILPA templates, knowledge graphs — pullable into any Explore session.</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
        {/* tree */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="row between center" style={{ padding: "11px 14px", borderBottom: "1px solid var(--border)" }}>
            <span className="t-h3">Shared Folders</span><span className="tag">{db.globalFiles.length}</span>
          </div>
          <div style={{ padding: 8 }}>
            {db.globalFiles.map((f) => (
              <div key={f.id}>
                <div className="row between center pointer" style={{ padding: "8px 9px", borderRadius: 8, background: active === f.id ? "var(--blue-50)" : "transparent" }} onClick={() => { setActive(f.id); setExpanded((s) => ({ ...s, [f.id]: !s[f.id] })); }}>
                  <span className="row gap-8 center" style={{ minWidth: 0 }}>
                    <Icon name="chevRight" size={12} style={{ color: "var(--gray-400)", transform: expanded[f.id] ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
                    <span style={{ width: 26, height: 26, borderRadius: 7, background: active === f.id ? "var(--blue-100)" : "var(--bg-sunken)", color: active === f.id ? "var(--blue-600)" : "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name="folder" size={14} /></span>
                    <span className="truncate" style={{ fontSize: 12.5, fontWeight: active === f.id ? 560 : 480 }}>{f.name}</span>
                  </span>
                  {f.shared && <span className="tip" style={{ display: "inline-flex" }}><Icon name="users" size={13} style={{ color: "var(--gray-400)" }} /><span className="tip-bub">Shared with team</span></span>}
                </div>
                {expanded[f.id] && (f.children || []).map((c) => (
                  <div key={c.name} className="row gap-8 center" style={{ padding: "5px 9px 5px 30px", fontSize: 12, color: "var(--text-secondary)" }}>
                    <span style={{ width: 18, height: 18, borderRadius: 5, background: c.children ? "var(--bg-sunken)" : (FC[c.ftype] || "#888") + "1a", color: c.children ? "var(--text-muted)" : (FC[c.ftype] || "#888"), display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={c.children ? "folder" : "file"} size={10} /></span>
                    <span className="truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* folder detail */}
        <div className="card">
          <div className="row between center" style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
            <div className="row gap-12 center">
              <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--blue-50)", color: "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="folder" size={20} /></span>
              <div>
                <div className="t-h2">{folder.name}</div>
                <div className="t-small">{countFiles(folder)} files · owner {folder.owner} · updated {folder.updated}</div>
              </div>
            </div>
            <div className="row gap-7 center">
              <span className="pill pill-screening"><Icon name="users" size={11} /> Shared with team</span>
              <Menu align="right" items={[{ icon: "upload", text: "Upload here" }, { icon: "folder", text: "New subfolder" }, { icon: "edit", text: "Tag / theme" }, { icon: "users", text: "Manage permissions" }, { sep: true }, { icon: "x", text: "Archive folder", danger: true }]} />
            </div>
          </div>
          <div style={{ padding: 8 }}>
            <table className="dtable">
              <thead><tr><th>Name</th><th>Owner</th><th>Updated</th><th>Sharing</th><th style={{ width: 36 }}></th></tr></thead>
              <tbody>
                {(folder.children || []).map((c) => (
                  <tr key={c.name} onClick={() => ctx.openSource("default")}>
                    <td><span className="row gap-10 center"><span style={{ width: 28, height: 28, borderRadius: 7, background: c.children ? "var(--bg-sunken)" : (FC[c.ftype] || "#888") + "1a", color: c.children ? "var(--text-secondary)" : (FC[c.ftype] || "#888"), display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={c.children ? "folder" : "file"} size={14} /></span><span style={{ fontWeight: 540 }}>{c.name}</span>{c.children && <span className="tag" style={{ fontSize: 10 }}>{countFiles(c)} files</span>}</span></td>
                    <td className="t-small">{folder.owner}</td>
                    <td className="t-small nowrap">{c.updated || folder.updated}</td>
                    <td><span className="row gap-5 center t-small"><Icon name="users" size={12} style={{ color: "var(--green-500)" }} /> Team</span></td>
                    <td onClick={(e) => e.stopPropagation()}><Menu items={[{ icon: "sparkles", text: "Use in Explore", onClick: () => ctx.toast("Added to research scope", "ai") }, { icon: "download", text: "Download" }, { icon: "edit", text: "Tag / theme" }, { sep: true }, { icon: "x", text: "Remove", danger: true }]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
window.GlobalFilesView = GlobalFilesView;

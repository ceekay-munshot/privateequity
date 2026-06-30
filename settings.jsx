/* ============================================================
   Settings & Access → window.SettingsView
   Integrations + role-based permission controls
   ============================================================ */
function SettingsView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [tab, setTab] = useState("workspace");
  return (
    <div className="page page-wide">
      <PageHead title="Settings & Access" sub="Configure your workspace, connected data sources and who can see what." />
      <div className="mb-16"><Seg value={tab} onChange={setTab} options={[
        { value: "workspace", label: "Workspace", icon: "building" },
        { value: "integrations", label: "Integrations", icon: "api" },
        { value: "access", label: "Access Control", icon: "shield" },
      ]} /></div>
      {tab === "workspace" && <WorkspaceSettings />}
      {tab === "integrations" && <IntegrationsSettings />}
      {tab === "access" && <AccessSettings />}
    </div>
  );
}

function WorkspaceSettings() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  return (
    <div className="grid gap-16" style={{ gridTemplateColumns: "1fr 1fr", maxWidth: 980 }}>
      <div className="card card-pad">
        <div className="label mb-8">Firm</div>
        <input className="input mb-16" defaultValue={db.firm} />
        <div className="label mb-8">Deal intake email · source of truth</div>
        <div className="row gap-8 center">
          <input className="input" readOnly value={db.intakeEmail} style={{ fontFamily: "var(--font-mono)" }} />
          <button className="btn btn-secondary nowrap" onClick={() => ctx.toast("Copied " + db.intakeEmail, "check")}><Icon name="link" size={14} /> Copy</button>
        </div>
        <p className="t-small mt-8">Teasers, IMs and memos forwarded here are ingested, indexed and filed to the right deal. Stage changes stay manual.</p>
      </div>
      <div className="card card-pad">
        <div className="label mb-8">Defaults</div>
        <div className="col gap-12">
          <div className="row between center"><span className="t-small">Default memo template</span><span className="tag">Paragon IC Memo v3</span></div>
          <div className="divider"></div>
          <div className="row between center"><span className="t-small">Auto-generate weekly pipeline PDF</span><div className="toggle on"></div></div>
          <div className="divider"></div>
          <div className="row between center"><span className="t-small">Hide empty fields on tear sheets</span><div className="toggle on"></div></div>
          <div className="divider"></div>
          <div className="row between center"><span className="t-small">Data residency</span><span className="tag">EU + US</span></div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsSettings() {
  const db = window.DB;
  const ctx = useContext(AppCtx);
  const IC = { mail: "mail", folder: "folder", chat: "chat", api: "api", table: "table", globe: "globe" };
  const cats = ["Email", "Documents", "External data"];
  return (
    <div style={{ maxWidth: 820 }}>
      <div className="card" style={{ marginBottom: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", borderColor: "var(--blue-200)", background: "linear-gradient(90deg, var(--blue-50), #fff 70%)" }}>
        <span className="feed-ic" style={{ background: "var(--blue-100)", color: "var(--blue-600)" }}><Icon name="database" size={16} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 560 }}>Connected data sources</div>
          <div className="t-small">Intake mailboxes, document stores and market-data providers feeding the pipeline. Stage changes are always made manually.</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => ctx.navigate("documents", { tab: "sources" })}>Ingestion sources <Icon name="arrowRight" size={13} /></button>
      </div>
      {cats.map((cat) => (
        <div key={cat} style={{ marginBottom: 18 }}>
          <div className="label mb-8">{cat}</div>
          <div className="card" style={{ overflow: "hidden" }}>
            {db.ingestion.filter((s) => s.category === cat).map((s, i, arr) => (
              <div key={s.name} className="row between center" style={{ padding: "13px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div className="row gap-12 center">
                  <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--bg-sunken)", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={IC[s.icon] || "api"} size={16} /></span>
                  <div><div style={{ fontWeight: 540, fontSize: 13 }}>{s.name}</div><div className="t-small">{s.detail}</div></div>
                </div>
                <div className="row gap-12 center">
                  <span className="t-small num">{s.sync}</span>
                  <StatusPill status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-secondary"><Icon name="plus" size={14} /> Connect a source</button>
    </div>
  );
}

function AccessSettings() {
  const db = window.DB;
  const ctx = useContext(AppCtx);
  const [restrict, setRestrict] = useState(true);
  return (
    <div style={{ maxWidth: 980 }}>
      <div className="card card-pad mb-16">
        <div className="row between center">
          <div>
            <div className="t-h3">Restrict views by role</div>
            <p className="t-small" style={{ marginTop: 3 }}>{restrict ? "Each member sees only the deals and sectors in their scope." : "Everyone sees the same view — all deals and sectors."}</p>
          </div>
          <div className={"toggle" + (restrict ? " on" : "")} onClick={() => { setRestrict((r) => !r); ctx.toast(restrict ? "Everyone now sees the same view" : "Views restricted by role", "check"); }}></div>
        </div>
      </div>

      <div className="label mb-8">Role permissions</div>
      <div className="card mb-16" style={{ overflow: "hidden" }}>
        <table className="dtable">
          <thead><tr><th>Role</th><th>Deals</th><th>Sectors</th><th>Memos</th><th>Settings</th></tr></thead>
          <tbody>
            {db.roles.map((r) => (
              <tr key={r.role} style={{ cursor: "default" }}>
                <td style={{ fontWeight: 560 }}>{r.role}</td>
                <td className="t-small">{restrict ? r.deals : "All"}</td>
                <td className="t-small">{restrict ? r.sectors : "All"}</td>
                <td className="t-small">{r.memos}</td>
                <td className="t-small">{r.settings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row between center mb-8">
        <span className="label">Team members</span>
        <button className="btn btn-secondary btn-sm" onClick={() => ctx.toast("Invite sent", "check")}><Icon name="plus" size={13} /> Invite member</button>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        {db.team.map((m, i) => (
          <div key={m.name} className="row between center" style={{ padding: "12px 16px", borderBottom: i < db.team.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div className="row gap-11 center">
              <Avatar name={m.name} color={m.av} />
              <div><div style={{ fontWeight: 540, fontSize: 13 }}>{m.name}</div><div className="t-small">{restrict ? m.scope : "All deals & sectors"}</div></div>
            </div>
            <div className="row gap-12 center">
              <span className="pill pill-neutral">{m.role}</span>
              <Menu items={[{ icon: "edit", text: "Change role" }, { icon: "eye", text: "View as this member" }, { sep: true }, { icon: "x", text: "Remove", danger: true }]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
window.SettingsView = SettingsView;

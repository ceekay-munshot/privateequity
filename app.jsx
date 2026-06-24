/* ============================================================
   App shell + routing → mounts to #root
   ============================================================ */
const { useState: uS, useEffect: uE, useCallback: uC } = React;

const NAV = [
  { section: null, items: [
    { id: "home", label: "Home", icon: "home" },
    { id: "dealflow", label: "Deal Flow", icon: "dealflow", badge: "6" },
    { id: "notifications", label: "Notifications", icon: "bell" },
  ]},
  { section: "Intelligence", items: [
    { id: "sector", label: "Sector Intelligence", icon: "sector" },
    { id: "explore", label: "Explore", icon: "sparkles" },
  ]},
  { section: "Work", items: [
    { id: "documents", label: "Documents", icon: "documents" },
    { id: "globalfiles", label: "Global Files", icon: "database" },
    { id: "memos", label: "Memos & Models", icon: "memos" },
    { id: "templates", label: "Templates", icon: "templates" },
  ]},
];

const VIEW_TITLES = {
  home: "Home", dealflow: "Deal Flow", notifications: "Notifications", sector: "Sector Intelligence", explore: "Explore",
  documents: "Documents", globalfiles: "Global Files", memos: "Memos & Models", templates: "Templates", settings: "Settings",
  workspace: "Deal Flow", sectorco: "Sector Intelligence",
};

function App() {
  const [route, setRoute] = uS({ view: "home", params: {} });
  const [collapsed, setCollapsed] = uS(false);
  const [cmdOpen, setCmdOpen] = uS(false);
  const [wizard, setWizard] = uS(false);
  const [createSection, setCreateSection] = uS(null);
  const [manageSections, setManageSections] = uS(null);
  const [source, setSource] = uS(null);
  const [fileFilters, setFileFilters] = uS(null);
  const [editSection, setEditSection] = uS(null);
  const [emailAuto, setEmailAuto] = uS(false);
  const [notifRead, setNotifRead] = uS({});
  const [toasts, setToasts] = uS([]);

  const markNotifRead = uC((id) => setNotifRead((r) => ({ ...r, [id]: true })), []);
  const markAllNotif = uC(() => setNotifRead(() => { const o = {}; window.DB.notifications.forEach((n) => (o[n.id] = true)); return o; }), []);

  const navigate = uC((view, params = {}) => {
    setRoute({ view, params });
    const el = document.querySelector(".app-content");
    if (el && el.scrollTo) el.scrollTo(0, 0);
  }, []);

  const toast = uC((msg, kind = "") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  // ⌘K
  uE(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((o) => !o); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") { e.preventDefault(); setWizard(true); }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const ctx = {
    navigate, toast,
    openWizard: () => setWizard(true),
    openCreateSection: (d) => setCreateSection(d || {}),
    openManageSections: (d) => setManageSections(d || {}),
    openSource: (metric, value) => setSource({ metric, value }),
    openFileFilters: (cfg) => setFileFilters(cfg || {}),
    openEditSection: (s) => setEditSection(s || {}),
    openEmailAutomation: () => setEmailAuto(true),
    notifRead, markNotifRead, markAllNotif,
  };

  // breadcrumbs
  const crumbs = (() => {
    const v = route.view;
    if (v === "workspace") { const d = window.DB.dealById(route.params.id); return [{ label: "Deal Flow", view: "dealflow" }, { label: d ? d.name : "Deal", cur: true }]; }
    if (v === "sectorco") { const s = window.DB.sectors.find((x) => x.id === route.params.id); return [{ label: "Sector Intelligence", view: "sector" }, { label: s ? s.name : "Sector", cur: true }]; }
    return [{ label: VIEW_TITLES[v] || "Home", cur: true }];
  })();

  const activeNav = route.view === "workspace" ? "dealflow" : route.view === "sectorco" ? "sector" : route.view;
  const unread = window.DB.notifications.filter((n) => n.unread && !notifRead[n.id]).length;

  const renderView = () => {
    switch (route.view) {
      case "home": return <window.HomeView />;
      case "dealflow": return <window.DealFlowView params={route.params} />;
      case "workspace": return <window.WorkspaceView params={route.params} />;
      case "sector": return <window.SectorView />;
      case "sectorco": return <window.SectorCoView params={route.params} />;
      case "explore": return <window.ExploreLanding params={route.params} />;
      case "notifications": return <window.NotificationsView />;
      case "documents": return <window.DocumentsView params={route.params} />;
      case "memos": return <window.MemosView />;
      case "globalfiles": return <window.GlobalFilesView />;
      case "templates": return <TemplatesView />;
      case "settings": return <window.SettingsView params={route.params} />;
      default: return <window.HomeView />;
    }
  };
  const fullBleed = route.view === "workspace";

  return (
    <AppCtx.Provider value={ctx}>
      <div className="app">
        {/* sidebar */}
        <div className={"sidebar" + (collapsed ? " collapsed" : "")}>
          <div className="sb-top">
            <div className="sb-brand" onClick={() => navigate("home")}>
              <span className="sb-mark"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 18V8l5 4 3-6 3 6 5-4v10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              <div style={{ minWidth: 0 }}><div className="sb-name">Paragon Capital</div><div className="sb-ws">Deal OS</div></div>
            </div>
            <button className="btn btn-icon btn-sm" style={{ color: "#8ea0c4", background: "transparent" }} onClick={() => setCollapsed((c) => !c)}><Icon name={collapsed ? "chevRight" : "chevLeft"} size={15} /></button>
          </div>
          <div className="sb-nav scroll">
            {NAV.map((grp, gi) => (
              <div key={gi}>
                {grp.section && <div className="nav-sec-label">{grp.section}</div>}
                {grp.items.map((it) => (
                  <div key={it.id} className={"nav-item" + (activeNav === it.id ? " active" : "")} onClick={() => navigate(it.id)} title={it.label}>
                    <Icon name={it.icon} size={17} /><span>{it.label}</span>
                    {it.id === "notifications"
                      ? (unread > 0 && <span className="nav-badge red">{unread}</span>)
                      : (it.badge && <span className={"nav-badge" + (it.amber ? " amber" : "")}>{it.badge}</span>)}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="sb-foot">
            <div className={"nav-item" + (activeNav === "settings" ? " active" : "")} title="Settings" onClick={() => navigate("settings")}><Icon name="settings" size={17} /><span>Settings & Access</span></div>
            <div className="nav-item" title="Help"><Icon name="help" size={17} /><span>Help & Support</span></div>
            <div className="sb-user">
              <Avatar name="Alex Chen" color="#2f6bff" />
              <div className="sb-foot-text"><div className="nm">Alex Chen</div><div className="em">Partner · Paragon Capital</div></div>
              <Icon name="chevDown" size={14} style={{ color: "#8ea0c4", marginLeft: "auto" }} className="sb-foot-text" />
            </div>
          </div>
        </div>

        {/* main */}
        <div className="app-main">
          <div className="topbar">
            <div className="crumbs">
              {crumbs.map((c, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="sep">/</span>}
                  <span className={"crumb" + (c.cur ? " cur" : "")} onClick={() => c.view && navigate(c.view)}>{c.label}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="global-search" onClick={() => setCmdOpen(true)}>
              <Icon name="search" size={16} />
              <span style={{ flex: 1 }}>Type @ to jump to a deal, company or sector…</span>
              <span className="kbd">⌘K</span>
            </div>
            <window.NotificationBell />
            <Menu align="right" trigger={<button className="btn btn-primary btn-sm"><Icon name="plus" size={14} /> New <Icon name="chevDown" size={12} /></button>}
              items={[{ icon: "layers", text: "New Deal", onClick: () => setWizard(true) }, { icon: "sparkles", text: "Generate Memo", onClick: () => navigate("memos") }, { icon: "sector", text: "Sector Tracker", onClick: () => navigate("sector") }]} />
          </div>

          <div className={"app-content scroll" + (fullBleed ? " " : "")} style={fullBleed ? { padding: 0 } : {}}>
            {renderView()}
          </div>
        </div>
      </div>

      {/* overlays */}
      {cmdOpen && <window.CommandPalette onClose={() => setCmdOpen(false)} />}
      {wizard && <window.DealWizard onClose={() => setWizard(false)} />}
      {createSection && <window.CreateSectionModal deal={createSection} onClose={() => setCreateSection(null)} />}
      {manageSections && <window.ManageSectionsModal onClose={() => setManageSections(null)} />}
      {source && <window.SourceModal metric={source.metric} value={source.value} onClose={() => setSource(null)} />}
      {fileFilters && <window.FileFiltersDrawer cfg={fileFilters} onClose={() => setFileFilters(null)} />}
      {editSection && <window.EditSectionModal section={editSection} onClose={() => setEditSection(null)} />}
      {emailAuto && <window.EmailAutomationDrawer onClose={() => setEmailAuto(false)} />}

      {/* toasts */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <Icon name={t.kind === "ai" ? "sparkles" : t.kind === "flag" ? "flag" : t.kind === "check" ? "checkCircle" : "info"} size={16} style={{ color: t.kind === "ai" ? "#9db8ff" : t.kind === "flag" ? "#f8a5a5" : "#8fe0ac" }} />
            {t.msg}
          </div>
        ))}
      </div>
    </AppCtx.Provider>
  );
}

function TemplatesView() {
  const ctx = useContext(AppCtx);
  const tmpls = [
    { n: "Paragon IC Memo v3", d: "Full investment committee memo — 14 sections.", use: "Default" },
    { n: "One-Pager (house style)", d: "Single-page deal summary for partner reviews.", use: "" },
    { n: "LP Quarterly Format", d: "Portfolio update in LP-reporting layout.", use: "" },
    { n: "Standard Operating Model", d: "5-statement model template with comps tab.", use: "Model" },
  ];
  return (
    <div className="page page-wide">
      <PageHead title="Templates" sub="Define your house format once — every memo, model and tear sheet inherits it.">
        <button className="btn btn-primary"><Icon name="plus" size={15} /> New Template</button>
      </PageHead>
      <div className="grid gap-14" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {tmpls.map((t) => (
          <div key={t.n} className="card card-hover card-pad pointer" onClick={() => ctx.toast("Opening template editor", "")}>
            <div className="row between center mb-8">
              <div className="row gap-10 center"><span style={{ width: 36, height: 36, borderRadius: 9, background: "var(--violet-50)", color: "var(--violet-500)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="templates" size={17} /></span><span className="t-h3">{t.n}</span></div>
              {t.use && <span className="tag">{t.use}</span>}
            </div>
            <p className="t-body">{t.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

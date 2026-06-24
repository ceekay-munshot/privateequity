const {
  useState: uS,
  useEffect: uE,
  useCallback: uC
} = React;
const NAV = [{
  section: null,
  items: [{
    id: "home",
    label: "Home",
    icon: "home"
  }, {
    id: "dealflow",
    label: "Deal Flow",
    icon: "dealflow",
    badge: "6"
  }, {
    id: "notifications",
    label: "Notifications",
    icon: "bell"
  }]
}, {
  section: "Intelligence",
  items: [{
    id: "sector",
    label: "Sector Intelligence",
    icon: "sector"
  }, {
    id: "explore",
    label: "Explore",
    icon: "sparkles"
  }]
}, {
  section: "Work",
  items: [{
    id: "documents",
    label: "Documents",
    icon: "documents"
  }, {
    id: "globalfiles",
    label: "Global Files",
    icon: "database"
  }, {
    id: "memos",
    label: "Memos & Models",
    icon: "memos"
  }, {
    id: "templates",
    label: "Templates",
    icon: "templates"
  }]
}];
const VIEW_TITLES = {
  home: "Home",
  dealflow: "Deal Flow",
  notifications: "Notifications",
  sector: "Sector Intelligence",
  explore: "Explore",
  documents: "Documents",
  globalfiles: "Global Files",
  memos: "Memos & Models",
  templates: "Templates",
  settings: "Settings",
  workspace: "Deal Flow",
  sectorco: "Sector Intelligence"
};
function App() {
  const [route, setRoute] = uS({
    view: "home",
    params: {}
  });
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
  const markNotifRead = uC(id => setNotifRead(r => ({
    ...r,
    [id]: true
  })), []);
  const markAllNotif = uC(() => setNotifRead(() => {
    const o = {};
    window.DB.notifications.forEach(n => o[n.id] = true);
    return o;
  }), []);
  const navigate = uC((view, params = {}) => {
    setRoute({
      view,
      params
    });
    const el = document.querySelector(".app-content");
    if (el && el.scrollTo) el.scrollTo(0, 0);
  }, []);
  const toast = uC((msg, kind = "") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, {
      id,
      msg,
      kind
    }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  }, []);
  uE(() => {
    const fn = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setWizard(true);
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);
  const ctx = {
    navigate,
    toast,
    openWizard: () => setWizard(true),
    openCreateSection: d => setCreateSection(d || {}),
    openManageSections: d => setManageSections(d || {}),
    openSource: (metric, value) => setSource({
      metric,
      value
    }),
    openFileFilters: cfg => setFileFilters(cfg || {}),
    openEditSection: s => setEditSection(s || {}),
    openEmailAutomation: () => setEmailAuto(true),
    notifRead,
    markNotifRead,
    markAllNotif
  };
  const crumbs = (() => {
    const v = route.view;
    if (v === "workspace") {
      const d = window.DB.dealById(route.params.id);
      return [{
        label: "Deal Flow",
        view: "dealflow"
      }, {
        label: d ? d.name : "Deal",
        cur: true
      }];
    }
    if (v === "sectorco") {
      const s = window.DB.sectors.find(x => x.id === route.params.id);
      return [{
        label: "Sector Intelligence",
        view: "sector"
      }, {
        label: s ? s.name : "Sector",
        cur: true
      }];
    }
    return [{
      label: VIEW_TITLES[v] || "Home",
      cur: true
    }];
  })();
  const activeNav = route.view === "workspace" ? "dealflow" : route.view === "sectorco" ? "sector" : route.view;
  const unread = window.DB.notifications.filter(n => n.unread && !notifRead[n.id]).length;
  const renderView = () => {
    switch (route.view) {
      case "home":
        return React.createElement(window.HomeView, null);
      case "dealflow":
        return React.createElement(window.DealFlowView, {
          params: route.params
        });
      case "workspace":
        return React.createElement(window.WorkspaceView, {
          params: route.params
        });
      case "sector":
        return React.createElement(window.SectorView, null);
      case "sectorco":
        return React.createElement(window.SectorCoView, {
          params: route.params
        });
      case "explore":
        return React.createElement(window.ExploreLanding, {
          params: route.params
        });
      case "notifications":
        return React.createElement(window.NotificationsView, null);
      case "documents":
        return React.createElement(window.DocumentsView, {
          params: route.params
        });
      case "memos":
        return React.createElement(window.MemosView, null);
      case "globalfiles":
        return React.createElement(window.GlobalFilesView, null);
      case "templates":
        return React.createElement(TemplatesView, null);
      case "settings":
        return React.createElement(window.SettingsView, {
          params: route.params
        });
      default:
        return React.createElement(window.HomeView, null);
    }
  };
  const fullBleed = route.view === "workspace";
  return React.createElement(AppCtx.Provider, {
    value: ctx
  }, React.createElement("div", {
    className: "app"
  }, React.createElement("div", {
    className: "sidebar" + (collapsed ? " collapsed" : "")
  }, React.createElement("div", {
    className: "sb-top"
  }, React.createElement("div", {
    className: "sb-brand",
    onClick: () => navigate("home")
  }, React.createElement("span", {
    className: "sb-mark"
  }, React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none"
  }, React.createElement("path", {
    d: "M4 18V8l5 4 3-6 3 6 5-4v10",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "sb-name"
  }, "Paragon Capital"), React.createElement("div", {
    className: "sb-ws"
  }, "Deal OS"))), React.createElement("button", {
    className: "btn btn-icon btn-sm",
    style: {
      color: "#8ea0c4",
      background: "transparent"
    },
    onClick: () => setCollapsed(c => !c)
  }, React.createElement(Icon, {
    name: collapsed ? "chevRight" : "chevLeft",
    size: 15
  }))), React.createElement("div", {
    className: "sb-nav scroll"
  }, NAV.map((grp, gi) => React.createElement("div", {
    key: gi
  }, grp.section && React.createElement("div", {
    className: "nav-sec-label"
  }, grp.section), grp.items.map(it => React.createElement("div", {
    key: it.id,
    className: "nav-item" + (activeNav === it.id ? " active" : ""),
    onClick: () => navigate(it.id),
    title: it.label
  }, React.createElement(Icon, {
    name: it.icon,
    size: 17
  }), React.createElement("span", null, it.label), it.id === "notifications" ? unread > 0 && React.createElement("span", {
    className: "nav-badge red"
  }, unread) : it.badge && React.createElement("span", {
    className: "nav-badge" + (it.amber ? " amber" : "")
  }, it.badge)))))), React.createElement("div", {
    className: "sb-foot"
  }, React.createElement("div", {
    className: "nav-item" + (activeNav === "settings" ? " active" : ""),
    title: "Settings",
    onClick: () => navigate("settings")
  }, React.createElement(Icon, {
    name: "settings",
    size: 17
  }), React.createElement("span", null, "Settings & Access")), React.createElement("div", {
    className: "nav-item",
    title: "Help"
  }, React.createElement(Icon, {
    name: "help",
    size: 17
  }), React.createElement("span", null, "Help & Support")), React.createElement("div", {
    className: "sb-user"
  }, React.createElement(Avatar, {
    name: "Alex Chen",
    color: "#2f6bff"
  }), React.createElement("div", {
    className: "sb-foot-text"
  }, React.createElement("div", {
    className: "nm"
  }, "Alex Chen"), React.createElement("div", {
    className: "em"
  }, "Partner \xB7 Paragon Capital")), React.createElement(Icon, {
    name: "chevDown",
    size: 14,
    style: {
      color: "#8ea0c4",
      marginLeft: "auto"
    },
    className: "sb-foot-text"
  })))), React.createElement("div", {
    className: "app-main"
  }, React.createElement("div", {
    className: "topbar"
  }, React.createElement("div", {
    className: "crumbs"
  }, crumbs.map((c, i) => React.createElement(React.Fragment, {
    key: i
  }, i > 0 && React.createElement("span", {
    className: "sep"
  }, "/"), React.createElement("span", {
    className: "crumb" + (c.cur ? " cur" : ""),
    onClick: () => c.view && navigate(c.view)
  }, c.label)))), React.createElement("div", {
    className: "global-search",
    onClick: () => setCmdOpen(true)
  }, React.createElement(Icon, {
    name: "search",
    size: 16
  }), React.createElement("span", {
    style: {
      flex: 1
    }
  }, "Type @ to jump to a deal, company or sector\u2026"), React.createElement("span", {
    className: "kbd"
  }, "\u2318K")), React.createElement(window.NotificationBell, null), React.createElement(Menu, {
    align: "right",
    trigger: React.createElement("button", {
      className: "btn btn-primary btn-sm"
    }, React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " New ", React.createElement(Icon, {
      name: "chevDown",
      size: 12
    })),
    items: [{
      icon: "layers",
      text: "New Deal",
      onClick: () => setWizard(true)
    }, {
      icon: "sparkles",
      text: "Generate Memo",
      onClick: () => navigate("memos")
    }, {
      icon: "sector",
      text: "Sector Tracker",
      onClick: () => navigate("sector")
    }]
  })), React.createElement("div", {
    className: "app-content scroll" + (fullBleed ? " " : ""),
    style: fullBleed ? {
      padding: 0
    } : {}
  }, renderView()))), cmdOpen && React.createElement(window.CommandPalette, {
    onClose: () => setCmdOpen(false)
  }), wizard && React.createElement(window.DealWizard, {
    onClose: () => setWizard(false)
  }), createSection && React.createElement(window.CreateSectionModal, {
    deal: createSection,
    onClose: () => setCreateSection(null)
  }), manageSections && React.createElement(window.ManageSectionsModal, {
    onClose: () => setManageSections(null)
  }), source && React.createElement(window.SourceModal, {
    metric: source.metric,
    value: source.value,
    onClose: () => setSource(null)
  }), fileFilters && React.createElement(window.FileFiltersDrawer, {
    cfg: fileFilters,
    onClose: () => setFileFilters(null)
  }), editSection && React.createElement(window.EditSectionModal, {
    section: editSection,
    onClose: () => setEditSection(null)
  }), emailAuto && React.createElement(window.EmailAutomationDrawer, {
    onClose: () => setEmailAuto(false)
  }), React.createElement("div", {
    className: "toast-wrap"
  }, toasts.map(t => React.createElement("div", {
    key: t.id,
    className: "toast"
  }, React.createElement(Icon, {
    name: t.kind === "ai" ? "sparkles" : t.kind === "flag" ? "flag" : t.kind === "check" ? "checkCircle" : "info",
    size: 16,
    style: {
      color: t.kind === "ai" ? "#9db8ff" : t.kind === "flag" ? "#f8a5a5" : "#8fe0ac"
    }
  }), t.msg))));
}
function TemplatesView() {
  const ctx = useContext(AppCtx);
  const tmpls = [{
    n: "Paragon IC Memo v3",
    d: "Full investment committee memo — 14 sections.",
    use: "Default"
  }, {
    n: "One-Pager (house style)",
    d: "Single-page deal summary for partner reviews.",
    use: ""
  }, {
    n: "LP Quarterly Format",
    d: "Portfolio update in LP-reporting layout.",
    use: ""
  }, {
    n: "Standard Operating Model",
    d: "5-statement model template with comps tab.",
    use: "Model"
  }];
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement(PageHead, {
    title: "Templates",
    sub: "Define your house format once \u2014 every memo, model and tear sheet inherits it."
  }, React.createElement("button", {
    className: "btn btn-primary"
  }, React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " New Template")), React.createElement("div", {
    className: "grid gap-14",
    style: {
      gridTemplateColumns: "1fr 1fr"
    }
  }, tmpls.map(t => React.createElement("div", {
    key: t.n,
    className: "card card-hover card-pad pointer",
    onClick: () => ctx.toast("Opening template editor", "")
  }, React.createElement("div", {
    className: "row between center mb-8"
  }, React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 9,
      background: "var(--violet-50)",
      color: "var(--violet-500)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "templates",
    size: 17
  })), React.createElement("span", {
    className: "t-h3"
  }, t.n)), t.use && React.createElement("span", {
    className: "tag"
  }, t.use)), React.createElement("p", {
    className: "t-body"
  }, t.d)))));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
function WorkspaceView({
  params
}) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const d = db.dealById(params && params.id || "meridian") || db.deals[0];
  const [tab, setTab] = useState(params && params.tab || "tear");
  const [analysisOpen, setAnalysisOpen] = useState(true);
  const [exploreSeed, setExploreSeed] = useState(null);
  const openExplore = topic => {
    setExploreSeed(topic + "\u0000" + Date.now());
    setTab("explore");
  };
  const subnav = [{
    id: "tear",
    label: "Tear Sheet",
    icon: "fileText"
  }, {
    id: "explore",
    label: "Explore",
    icon: "search"
  }, {
    id: "analysis",
    label: "Analysis",
    icon: "sparkles",
    expand: true
  }, {
    id: "files",
    label: "Files",
    icon: "folder"
  }, {
    id: "settings",
    label: "Settings",
    icon: "settings"
  }];
  return React.createElement("div", {
    style: {
      display: "flex",
      height: "100%"
    }
  }, React.createElement("div", {
    style: {
      width: 210,
      flex: "none",
      borderRight: "1px solid var(--border)",
      background: "#fff",
      overflowY: "auto"
    },
    className: "scroll"
  }, React.createElement("div", {
    style: {
      padding: "16px 14px 10px"
    }
  }, React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement(LogoTile, {
    initials: d.initials,
    sector: d.sector,
    size: 34
  }), React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13
    },
    className: "truncate"
  }, d.name), React.createElement("div", {
    className: "t-small truncate"
  }, d.strategy)))), React.createElement("div", {
    style: {
      padding: "4px 8px"
    }
  }, subnav.map(s => React.createElement("div", {
    key: s.id
  }, React.createElement("div", {
    className: "row gap-10 center pointer",
    style: {
      padding: "8px 9px",
      borderRadius: 8,
      fontSize: 12.5,
      fontWeight: 500,
      color: tab === s.id ? "var(--blue-700)" : "var(--text-secondary)",
      background: tab === s.id ? "var(--blue-50)" : "transparent"
    },
    onClick: () => {
      setTab(s.id);
      if (s.expand) setAnalysisOpen(o => !o);
    }
  }, React.createElement(Icon, {
    name: s.icon,
    size: 15
  }), s.label, s.expand && React.createElement(Icon, {
    name: "chevDown",
    size: 13,
    style: {
      marginLeft: "auto",
      transform: analysisOpen ? "none" : "rotate(-90deg)",
      transition: "transform .18s"
    }
  })), s.expand && analysisOpen && React.createElement("div", {
    style: {
      paddingLeft: 14,
      marginBottom: 4
    }
  }, db.analyses.map(a => React.createElement("div", {
    key: a.name,
    className: "row gap-8 center pointer",
    style: {
      padding: "6px 9px",
      borderRadius: 7,
      fontSize: 12,
      color: "var(--text-secondary)"
    },
    onClick: () => ctx.toast("Opening " + a.name + " analysis", "ai")
  }, React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 2,
      background: a.status === "ready" ? "var(--green-500)" : "var(--amber-500)"
    }
  }), React.createElement("span", {
    className: "truncate"
  }, a.name))), React.createElement("div", {
    className: "row gap-8 center pointer",
    style: {
      padding: "6px 9px",
      borderRadius: 7,
      fontSize: 12,
      color: "var(--blue-600)",
      fontWeight: 540
    },
    onClick: () => ctx.openCreateSection(d)
  }, React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " Create new analysis")))))), React.createElement("div", {
    className: "app-main",
    style: {
      flex: 1,
      minWidth: 0
    }
  }, tab === "explore" ? React.createElement(window.ExploreView, {
    d: d,
    seed: exploreSeed ? exploreSeed.split("\u0000")[0] : null
  }) : React.createElement("div", {
    className: "app-content scroll",
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    className: "page",
    style: {
      maxWidth: 1240,
      paddingTop: 22
    }
  }, tab === "files" ? React.createElement(DealFilesPanel, null) : tab === "settings" ? React.createElement(SettingsPanel, {
    d: d
  }) : React.createElement(TearSheet, {
    d: d,
    onExplore: openExplore
  })))));
}
function TearSheet({
  d,
  onExplore
}) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const fin = db.financials[d.id] || db.financials.meridian;
  const ppl = db.people[d.id] || db.people.meridian;
  const [showPeople, setShowPeople] = useState(false);
  const shownPeople = showPeople ? ppl : ppl.slice(0, 2);
  return React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 300px",
      gap: 22,
      alignItems: "start"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "row gap-14",
    style: {
      alignItems: "flex-start",
      marginBottom: 22
    }
  }, React.createElement(LogoTile, {
    initials: d.initials,
    sector: d.sector,
    size: 52
  }), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "row gap-8 center wrap",
    style: {
      marginBottom: 6
    }
  }, React.createElement("h1", {
    className: "t-h1",
    style: {
      marginRight: 2
    }
  }, d.name), React.createElement(StatusPill, {
    status: d.status
  }), React.createElement("span", {
    className: "tag"
  }, d.strategy)), React.createElement("p", {
    className: "t-body",
    style: {
      marginBottom: 10,
      maxWidth: 620
    }
  }, d.desc), React.createElement("div", {
    className: "row gap-16 center wrap"
  }, React.createElement("span", {
    className: "row gap-6 center t-small"
  }, React.createElement(Icon, {
    name: "globe",
    size: 13,
    style: {
      color: "var(--text-muted)"
    }
  }), " ", d.website), React.createElement("span", {
    className: "row gap-6 center t-small"
  }, React.createElement(Icon, {
    name: "pin",
    size: 13,
    style: {
      color: "var(--text-muted)"
    }
  }), " ", d.hq), React.createElement("span", {
    className: "row gap-6 center t-small"
  }, React.createElement(Icon, {
    name: "layers",
    size: 13,
    style: {
      color: "var(--text-muted)"
    }
  }), " ", d.sector, " \xB7 ", d.sub))), React.createElement("div", {
    className: "row gap-8 center",
    style: {
      flex: "none"
    }
  }, React.createElement("button", {
    className: "btn btn-primary btn-sm nowrap",
    onClick: () => ctx.toast("Drafting screening memo from the IM + emails using your house template…", "ai")
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 13
  }), " Screening memo"), React.createElement(Menu, {
    align: "right",
    trigger: React.createElement("button", {
      className: "btn btn-icon btn-secondary btn-sm"
    }, React.createElement(Icon, {
      name: "more",
      size: 16
    })),
    items: [{
      icon: "external",
      text: "Visit website",
      onClick: () => ctx.toast("Opening " + d.website, "")
    }, {
      icon: "linkedin",
      text: "View on LinkedIn",
      onClick: () => ctx.toast("Opening LinkedIn", "")
    }, {
      icon: "bookmark",
      text: "Bookmark deal",
      onClick: () => ctx.toast("Deal bookmarked", "check")
    }, {
      sep: true
    }, {
      icon: "download",
      text: "Export to memo",
      onClick: () => ctx.navigate("memos")
    }]
  }))), React.createElement("div", {
    className: "col gap-16"
  }, React.createElement(ActionablesCard, {
    d: d
  }), React.createElement(SectionCard, {
    title: "Company Overview",
    icon: "building",
    iconColor: "#2f6bff",
    actions: React.createElement("span", {
      className: "tag",
      title: "Profile enriched from external data"
    }, React.createElement(Icon, {
      name: "sparkles",
      size: 10
    }), " Enriched")
  }, React.createElement("div", {
    className: "row gap-6 wrap",
    style: {
      marginBottom: 14
    }
  }, React.createElement("span", {
    className: "t-small text-muted"
  }, "Enriched by:"), React.createElement("span", {
    className: "tag"
  }, "PitchBook comps"), React.createElement("span", {
    className: "tag"
  }, "Broker research"), React.createElement("span", {
    className: "tag"
  }, "EU alt-data")), React.createElement("div", {
    className: "kv-grid"
  }, React.createElement(KV, {
    k: "Description"
  }, React.createElement("span", {
    style: {
      fontWeight: 440,
      fontSize: 13
    }
  }, d.desc)), React.createElement(KV, {
    k: "Headquarters"
  }, d.hq), React.createElement(KV, {
    k: "Sector"
  }, d.sector), React.createElement(KV, {
    k: "Employees"
  }, React.createElement(Prov, {
    value: d.employees,
    metric: "Employees",
    conf: "verified"
  })), React.createElement(KV, {
    k: "Founded"
  }, d.founded), React.createElement(KV, {
    k: "Regions Served"
  }, d.regions))), React.createElement(SectionCard, {
    title: "Deal Terms",
    icon: "scale",
    iconColor: "#7c5cfc"
  }, React.createElement("div", {
    className: "kv-grid"
  }, React.createElement(KV, {
    k: "Deal Structure"
  }, React.createElement("span", {
    style: {
      fontWeight: 440,
      fontSize: 13
    }
  }, "Majority recapitalization with management rollover and a co-investment sleeve.")), React.createElement(KV, {
    k: "Investment Amount"
  }, React.createElement(Prov, {
    value: "$" + d.ask + "M",
    metric: "Pre-money Valuation",
    conf: "estimated"
  })), React.createElement(KV, {
    k: "Investment Stage"
  }, d.stage), React.createElement(KV, {
    k: "Ownership %"
  }, React.createElement(Prov, {
    value: d.ownership != null ? d.ownership + "%" : "—",
    metric: "default",
    conf: "estimated"
  })), React.createElement(KV, {
    k: "Use of Proceeds"
  }, "Shareholder liquidity, M&A, intl. expansion"))), React.createElement(SectionCard, {
    title: "Financial & Valuation Highlights",
    icon: "trending",
    iconColor: "#16a34a"
  }, React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))",
      gap: 16
    }
  }, React.createElement(HiMetric, {
    k: "Pre-money Valuation",
    v: d.preMoney != null ? "$" + d.preMoney + "M" : "—",
    metric: "Pre-money Valuation",
    conf: "estimated",
    as: "2026"
  }), React.createElement(HiMetric, {
    k: "Post-money Valuation",
    v: d.postMoney != null ? "$" + d.postMoney + "M" : "—",
    metric: "default",
    conf: "estimated",
    as: "2026"
  }), React.createElement(HiMetric, {
    k: "Revenue",
    v: d.revenue != null ? "$" + d.revenue + "M" : "—",
    metric: "Revenue",
    conf: "verified",
    yoy: d.revYoY,
    as: "2022"
  }), React.createElement(HiMetric, {
    k: "EBITDA",
    v: d.ebitda != null ? "$" + d.ebitda + "M" : "—",
    metric: "EBITDA",
    conf: "verified",
    yoy: d.ebitdaYoY,
    as: "2022"
  }))), React.createElement(SectionCard, {
    title: "Financial Statements Summary",
    icon: "table",
    iconColor: "#2563eb",
    actions: React.createElement("span", {
      className: "tag"
    }, "USD millions")
  }, React.createElement(FinTable, {
    fin: fin,
    group: "P&L",
    rows: fin.pl
  }), React.createElement(FinTable, {
    fin: fin,
    group: "Balance Sheet",
    rows: fin.bs
  }), React.createElement(FinTable, {
    fin: fin,
    group: "Performance",
    rows: fin.perf,
    last: true
  })), React.createElement(SectionCard, {
    title: "Key People",
    icon: "users",
    iconColor: "#e08a00",
    actions: React.createElement("span", {
      className: "tag"
    }, ppl.length, " executives")
  }, React.createElement("div", {
    className: "grid gap-12",
    style: {
      gridTemplateColumns: "1fr 1fr"
    }
  }, shownPeople.map(p => React.createElement("div", {
    key: p.name,
    className: "card",
    style: {
      padding: 14
    }
  }, React.createElement("div", {
    className: "row gap-10 center mb-8"
  }, React.createElement(Avatar, {
    name: p.name,
    color: p.av,
    size: "avatar-lg"
  }), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "row gap-6 center"
  }, React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, p.name), React.createElement(Icon, {
    name: "linkedin",
    size: 13,
    style: {
      color: "var(--blue-500)"
    }
  })), React.createElement("div", {
    className: "t-small"
  }, p.title)), React.createElement("span", {
    className: "pill pill-neutral"
  }, p.exp, "y exp")), React.createElement("p", {
    className: "t-small",
    style: {
      lineHeight: 1.5,
      marginBottom: 8
    }
  }, p.bio), React.createElement("div", {
    className: "row gap-6 wrap"
  }, React.createElement("span", {
    className: "tag",
    style: {
      fontSize: 10
    }
  }, React.createElement(Icon, {
    name: "briefcase",
    size: 10
  }), " ", p.prev), React.createElement("span", {
    className: "tag",
    style: {
      fontSize: 10
    }
  }, p.edu))))), ppl.length > 2 && React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    style: {
      marginTop: 12
    },
    onClick: () => setShowPeople(s => !s)
  }, showPeople ? "Show less" : `Show ${ppl.length - 2} more`)))), React.createElement("div", null, React.createElement("div", {
    className: "card card-pad rail-panel"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("span", {
    className: "t-h3"
  }, "Quick Links"), React.createElement("span", {
    className: "tip",
    style: {
      display: "inline-flex"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 14,
    style: {
      color: "var(--violet-500)"
    }
  }), React.createElement("span", {
    className: "tip-bub",
    style: {
      width: 180,
      whiteSpace: "normal"
    }
  }, "Each opens a pre-seeded research session scoped to that topic"))), React.createElement("div", {
    className: "col",
    style: {
      gap: 2
    }
  }, db.quickLinks.map(q => {
    const meta = db.quickLinkMeta[q] || {};
    const conf = meta.status === "review" ? "review" : meta.status === "stale" ? "estimated" : "verified";
    return React.createElement("button", {
      key: q,
      className: "ql-item",
      onClick: () => onExplore(q)
    }, React.createElement("span", {
      className: "ql-dot conf-" + conf
    }), React.createElement("span", {
      className: "ql-main"
    }, React.createElement("span", {
      className: "ql-title"
    }, q), React.createElement("span", {
      className: "ql-meta"
    }, meta.fresh || "Not yet run")), React.createElement(Icon, {
      name: "arrowRight",
      size: 14,
      className: "ql-arrow"
    }));
  })), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    style: {
      width: "100%",
      justifyContent: "center",
      marginTop: 10
    },
    onClick: () => ctx.toast("Save the current Explore query to Quick Links", "")
  }, React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " Save a Q&A query")), React.createElement("div", {
    className: "card card-pad rail-panel"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("span", {
    className: "t-h3"
  }, "Tear Sheet"), React.createElement(Icon, {
    name: "settings",
    size: 14,
    style: {
      color: "var(--text-muted)"
    }
  })), React.createElement("div", {
    className: "col gap-8"
  }, React.createElement(RailBtn, {
    icon: "columns",
    label: "Layout controls"
  }), React.createElement(RailBtn, {
    icon: "layers",
    label: "Reorder sections"
  }), React.createElement(RailBtn, {
    icon: "grid",
    label: "Manage sections",
    badge: "9 available",
    onClick: () => ctx.openManageSections(d)
  }), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    style: {
      justifyContent: "center"
    },
    onClick: () => ctx.openCreateSection(d)
  }, React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " Create Section"), React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      justifyContent: "center"
    },
    onClick: () => ctx.toast("Refreshing all metrics across the tear sheet…", "ai")
  }, React.createElement(Icon, {
    name: "refresh",
    size: 13
  }), " Refresh All"))), React.createElement("div", {
    className: "card card-pad rail-panel"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("span", {
    className: "t-h3"
  }, "Deal Updates")), React.createElement("div", null, [{
    who: "Critic AI",
    what: "Verified EBITDA bridge against management model",
    t: "12m ago",
    c: "#16a34a",
    ic: "checkCircle"
  }, {
    who: "David Kim",
    what: "Updated 'Investment Returns' analysis",
    t: "2h ago",
    c: "#2f6bff",
    ic: "trending"
  }, {
    who: "Critic AI",
    what: "Flagged customer concentration risk",
    t: "5h ago",
    c: "#e08a00",
    ic: "flag"
  }].map((u, i) => React.createElement("div", {
    key: i,
    className: "feed-item",
    style: {
      borderBottom: i < 2 ? "1px solid var(--border)" : "none",
      paddingTop: i === 0 ? 0 : 10
    }
  }, React.createElement("span", {
    className: "feed-ic",
    style: {
      background: u.c + "1a",
      color: u.c,
      width: 26,
      height: 26
    }
  }, React.createElement(Icon, {
    name: u.ic,
    size: 13
  })), React.createElement("div", {
    className: "feed-main"
  }, React.createElement("div", {
    className: "feed-line",
    style: {
      fontSize: 12
    }
  }, u.what), React.createElement("div", {
    className: "feed-time"
  }, u.who, " \xB7 ", u.t))))))));
}
const ACTION_ICON = {
  call: "calendar",
  note: "fileText",
  task: "check"
};
function ActionablesCard({
  d
}) {
  const ctx = useContext(AppCtx);
  const [items, setItems] = useState(window.DB.actionsFor(d.id));
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState("call");
  const [text, setText] = useState("");
  const toggle = id => setItems(xs => xs.map(a => a.id === id ? {
    ...a,
    done: !a.done
  } : a));
  const add = () => {
    if (!text.trim()) return;
    setItems(xs => [...xs, {
      id: "n" + xs.length + Date.now(),
      type,
      text: text.trim(),
      due: "New",
      owner: "You",
      done: false
    }]);
    ctx.toast((type === "call" ? "Call" : type === "note" ? "Note" : "Task") + " added to actionables", "check");
    setText("");
    setAdding(false);
  };
  const open = items.filter(a => !a.done).length;
  return React.createElement(SectionCard, {
    title: "Next Steps & Actionables",
    icon: "check",
    iconColor: "#16a34a",
    actions: React.createElement("span", {
      className: "tag"
    }, open, " open"),
    menu: [{
      icon: "calendar",
      text: "Schedule banker call",
      onClick: () => {
        setType("call");
        setAdding(true);
      }
    }, {
      icon: "fileText",
      text: "Add pipeline note",
      onClick: () => {
        setType("note");
        setAdding(true);
      }
    }, {
      icon: "check",
      text: "Add task",
      onClick: () => {
        setType("task");
        setAdding(true);
      }
    }]
  }, items.length === 0 && !adding && React.createElement("p", {
    className: "t-body",
    style: {
      marginBottom: 12
    }
  }, "No next steps yet. Record what came out of your last discussion \u2014 a banker call, a note from the pipeline meeting, or a task."), React.createElement("div", {
    className: "col gap-8"
  }, items.map(a => React.createElement("div", {
    key: a.id,
    className: "row gap-10 center",
    style: {
      padding: "8px 10px",
      borderRadius: 8,
      border: "1px solid var(--border)",
      background: a.done ? "var(--bg-subtle)" : "#fff"
    }
  }, React.createElement("span", {
    className: "conf-dot",
    style: {
      width: 18,
      height: 18,
      borderRadius: 6,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: a.done ? "var(--green-500)" : "var(--bg-sunken)",
      color: a.done ? "#fff" : "var(--text-muted)",
      cursor: "pointer"
    },
    onClick: () => toggle(a.id)
  }, a.done ? React.createElement(Icon, {
    name: "check",
    size: 11
  }) : React.createElement(Icon, {
    name: ACTION_ICON[a.type],
    size: 11
  })), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 500,
      textDecoration: a.done ? "line-through" : "none",
      color: a.done ? "var(--text-muted)" : "var(--text-primary)"
    }
  }, a.text), React.createElement("div", {
    className: "t-small"
  }, a.owner, " \xB7 ", a.due)), React.createElement("span", {
    className: "tag",
    style: {
      fontSize: 10,
      textTransform: "capitalize"
    }
  }, a.type)))), adding ? React.createElement("div", {
    className: "row gap-8 center mt-12"
  }, React.createElement("select", {
    className: "select",
    style: {
      width: 110,
      height: 34
    },
    value: type,
    onChange: e => setType(e.target.value)
  }, React.createElement("option", {
    value: "call"
  }, "Call"), React.createElement("option", {
    value: "note"
  }, "Note"), React.createElement("option", {
    value: "task"
  }, "Task")), React.createElement("input", {
    className: "input",
    style: {
      height: 34
    },
    autoFocus: true,
    value: text,
    placeholder: "e.g. Banker call with Jefferies, Thu 2pm",
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") add();
      if (e.key === "Escape") setAdding(false);
    }
  }), React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: add
  }, "Add")) : React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    style: {
      marginTop: 12
    },
    onClick: () => setAdding(true)
  }, React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " Add next step"));
}
function RailBtn({
  icon,
  label,
  badge,
  onClick
}) {
  return React.createElement("div", {
    className: "row between center pointer",
    style: {
      padding: "7px 9px",
      borderRadius: 8,
      fontSize: 12.5,
      border: "1px solid var(--border)"
    },
    onClick: onClick,
    onMouseEnter: e => e.currentTarget.style.background = "var(--gray-50)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, React.createElement("span", {
    className: "row gap-9 center"
  }, React.createElement(Icon, {
    name: icon,
    size: 14,
    style: {
      color: "var(--text-secondary)"
    }
  }), label), badge && React.createElement("span", {
    className: "t-small"
  }, badge));
}
function HiMetric({
  k,
  v,
  metric,
  conf,
  yoy,
  as
}) {
  return React.createElement("div", {
    className: "card",
    style: {
      padding: 13
    }
  }, React.createElement("div", {
    className: "metric-label",
    style: {
      marginBottom: 6
    }
  }, k), React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 650
    }
  }, React.createElement(Prov, {
    value: v,
    metric: metric,
    conf: conf
  })), React.createElement("div", {
    className: "row gap-8 center",
    style: {
      marginTop: 6
    }
  }, yoy != null && React.createElement("span", {
    className: "metric-delta delta-up"
  }, React.createElement(Icon, {
    name: "arrowUp",
    size: 11
  }), " ", yoy, "% YoY"), React.createElement("span", {
    className: "t-small",
    style: {
      marginLeft: yoy != null ? 0 : "auto"
    }
  }, "as of ", as)));
}
function FinTable({
  fin,
  group,
  rows,
  last
}) {
  return React.createElement("div", {
    style: {
      marginBottom: last ? 0 : 8
    }
  }, React.createElement("table", {
    className: "dtable",
    style: {
      fontSize: 12.5
    }
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    style: {
      background: "transparent",
      borderBottom: "1px solid var(--border)",
      color: "var(--text-primary)",
      fontSize: 11,
      fontWeight: 640,
      textTransform: "none",
      letterSpacing: 0
    }
  }, group), fin.years.map(y => React.createElement("th", {
    key: y,
    className: "num",
    style: {
      background: "transparent",
      borderBottom: "1px solid var(--border)"
    }
  }, y)))), React.createElement("tbody", null, rows.map(r => React.createElement("tr", {
    key: r.k,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", {
    style: {
      padding: "8px 14px"
    }
  }, React.createElement("span", {
    className: "row gap-7 center"
  }, React.createElement(ConfDot, {
    level: r.conf
  }), r.k)), r.v.map((val, i) => React.createElement("td", {
    key: i,
    className: "num",
    style: {
      padding: "8px 14px",
      fontWeight: i === 0 ? 600 : 440,
      color: i === 0 ? "var(--text-primary)" : "var(--text-secondary)"
    }
  }, val.toFixed(1))))))));
}
function DealFilesPanel() {
  const db = window.DB;
  const [tab, setTab] = useState("files");
  return React.createElement("div", null, React.createElement("div", {
    className: "row between center mb-16"
  }, React.createElement("div", null, React.createElement("h1", {
    className: "t-h1"
  }, "Deal Files"), React.createElement("div", {
    className: "t-small"
  }, db.files.length, " files \xB7 29.1 MB \xB7 auto-extracted & indexed")), React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement(Seg, {
    value: tab,
    onChange: setTab,
    options: [{
      value: "files",
      label: "Files"
    }, {
      value: "datasets",
      label: "Datasets"
    }]
  }), React.createElement(Menu, {
    align: "right",
    trigger: React.createElement("button", {
      className: "btn btn-primary"
    }, React.createElement(Icon, {
      name: "plus",
      size: 15
    }), " Add Documents ", React.createElement(Icon, {
      name: "chevDown",
      size: 13
    })),
    items: [{
      icon: "upload",
      text: "Add Files"
    }, {
      icon: "folder",
      text: "Add Folder (with sync)"
    }]
  }))), React.createElement(FilesTable, {
    files: db.files
  }));
}
window.FilesTable = function FilesTable({
  files
}) {
  const ctx = useContext(AppCtx);
  const ICON = {
    pdf: "#dc2626",
    xls: "#16a34a",
    csv: "#16a34a",
    ppt: "#e08a00",
    doc: "#2f6bff"
  };
  return React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Name"), React.createElement("th", null, "Size"), React.createElement("th", null, "Status"), React.createElement("th", null, "Updated"), React.createElement("th", null, "Uploaded by"), React.createElement("th", {
    style: {
      width: 36
    }
  }))), React.createElement("tbody", null, files.map(f => React.createElement("tr", {
    key: f.name,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", null, React.createElement("span", {
    className: "row gap-10 center"
  }, React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: ICON[f.ftype] + "1a",
      color: ICON[f.ftype],
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "file",
    size: 15
  })), React.createElement("span", {
    style: {
      fontWeight: 540
    }
  }, f.name))), React.createElement("td", {
    className: "num t-small"
  }, f.size), React.createElement("td", null, React.createElement(StatusPill, {
    status: f.status
  })), React.createElement("td", {
    className: "t-small nowrap"
  }, f.updated), React.createElement("td", null, React.createElement("span", {
    className: "row gap-7 center"
  }, React.createElement(Avatar, {
    name: f.by,
    color: f.av,
    size: "avatar-sm"
  }), React.createElement("span", {
    className: "t-small"
  }, f.by))), React.createElement("td", null, React.createElement(Menu, {
    items: [{
      icon: "eye",
      text: "Open",
      onClick: () => ctx.openSource("default")
    }, {
      icon: "download",
      text: "Download"
    }, {
      sep: true
    }, {
      icon: "flag",
      text: "Remove",
      danger: true
    }]
  })))))));
};
function ExplorePanel({
  d
}) {
  return React.createElement(window.QueryBuilder, {
    embedded: true
  });
}
function SettingsPanel({
  d
}) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [restrict, setRestrict] = useState(true);
  return React.createElement("div", {
    style: {
      maxWidth: 820
    }
  }, React.createElement("div", {
    className: "row between center mb-16"
  }, React.createElement("div", null, React.createElement("h1", {
    className: "t-h1"
  }, "Deal settings"), React.createElement("div", {
    className: "t-small"
  }, "Access, team and export defaults for ", d.name, "."))), React.createElement("div", {
    className: "card card-pad mb-16"
  }, React.createElement("div", {
    className: "row between center"
  }, React.createElement("div", null, React.createElement("div", {
    className: "t-h3"
  }, "Restrict this deal by role"), React.createElement("p", {
    className: "t-small",
    style: {
      marginTop: 3
    }
  }, restrict ? "Only assigned members and partners can open this deal." : "Everyone in the firm can see this deal.")), React.createElement("div", {
    className: "toggle" + (restrict ? " on" : ""),
    onClick: () => {
      setRestrict(r => !r);
      ctx.toast(restrict ? "Deal now visible to everyone" : "Deal restricted to the team", "check");
    }
  }))), React.createElement("div", {
    className: "row between center mb-8"
  }, React.createElement("span", {
    className: "label"
  }, "Deal team"), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => ctx.toast("Member added to deal", "check")
  }, React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " Add member")), React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden",
      marginBottom: 16
    }
  }, db.team.slice(0, 4).map((m, i) => React.createElement("div", {
    key: m.name,
    className: "row between center",
    style: {
      padding: "11px 16px",
      borderBottom: i < 3 ? "1px solid var(--border)" : "none"
    }
  }, React.createElement("div", {
    className: "row gap-11 center"
  }, React.createElement(Avatar, {
    name: m.name,
    color: m.av
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 540,
      fontSize: 13
    }
  }, m.name), React.createElement("div", {
    className: "t-small"
  }, m.scope))), React.createElement("span", {
    className: "pill pill-neutral"
  }, m.role)))), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "col gap-12"
  }, React.createElement("div", {
    className: "row between center"
  }, React.createElement("span", {
    className: "t-small"
  }, "Auto-refresh metrics when new data arrives"), React.createElement("div", {
    className: "toggle on"
  })), React.createElement("div", {
    className: "divider"
  }), React.createElement("div", {
    className: "row between center"
  }, React.createElement("span", {
    className: "t-small"
  }, "Default export"), React.createElement("span", {
    className: "tag"
  }, "Paragon IC Memo v3")), React.createElement("div", {
    className: "divider"
  }), React.createElement("div", {
    className: "row between center"
  }, React.createElement("span", {
    className: "t-small"
  }, "Manage who sees what, firm-wide"), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => ctx.navigate("settings")
  }, "Open Access Control ", React.createElement(Icon, {
    name: "arrowRight",
    size: 12
  }))))));
}
window.WorkspaceView = WorkspaceView;
function ExploreView({
  d,
  seed
}) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [collapsed, setCollapsed] = useState(false);
  const [sessions, setSessions] = useState(db.exploreSessions);
  const [activeId, setActiveId] = useState("s1");
  const [threads, setThreads] = useState(() => ({
    s1: [seededTurn(d)]
  }));
  const [quant, setQuant] = useState(false);
  const [input, setInput] = useState("");
  const [scope, setScope] = useState({
    providers: {},
    web: false,
    files: db.files.length,
    global: 0
  });
  const threadRef = useRef(null);
  const active = sessions.find(s => s.id === activeId);
  const turns = threads[activeId] || [];
  useEffect(() => {
    if (!seed) return;
    const meta = db.quickLinkMeta[seed] || {};
    const existing = sessions.find(s => s.topic === seed);
    let id = existing ? existing.id : "ql-" + Date.now();
    if (!existing) {
      setSessions(prev => [{
        id,
        title: seed,
        group: "Today",
        updated: "just now",
        topic: seed
      }, ...prev]);
    }
    setActiveId(id);
    if (!threads[id]) runQuestion(meta.q || seed, id);
  }, [seed]);
  const scrollDown = () => setTimeout(() => {
    threadRef.current && (threadRef.current.scrollTop = threadRef.current.scrollHeight);
  }, 60);
  function runQuestion(text, sid) {
    const id = sid || activeId;
    const turnId = "t" + Date.now();
    const turn = {
      id: turnId,
      q: text,
      status: "reasoning",
      quant
    };
    setThreads(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), turn]
    }));
    scrollDown();
    const upd = patch => setThreads(prev => ({
      ...prev,
      [id]: (prev[id] || []).map(t => t.id === turnId ? {
        ...t,
        ...patch
      } : t)
    }));
    setTimeout(() => {
      upd({
        status: "delegating"
      });
      scrollDown();
    }, 900);
    setTimeout(() => {
      upd({
        status: "streaming"
      });
      scrollDown();
    }, 1900);
    setTimeout(() => {
      upd({
        status: "done"
      });
      scrollDown();
    }, 3000);
  }
  const send = () => {
    if (!input.trim()) return;
    runQuestion(input);
    setInput("");
  };
  const newSession = () => {
    const id = "n" + Date.now();
    setSessions(prev => [{
      id,
      title: "New research session",
      group: "Today",
      updated: "just now",
      topic: null
    }, ...prev]);
    setThreads(prev => ({
      ...prev,
      [id]: []
    }));
    setActiveId(id);
  };
  const grouped = ["Today", "Last 7 days", "Last 30 days"].map(g => ({
    g,
    items: sessions.filter(s => s.group === g)
  })).filter(x => x.items.length);
  const openFilters = () => ctx.openFileFilters({
    initialFiles: scope.files,
    initialGlobal: scope.global,
    onApply: res => setScope(s => ({
      ...s,
      files: res.files,
      global: res.global
    }))
  });
  return React.createElement("div", {
    style: {
      display: "flex",
      height: "100%",
      minHeight: 0
    }
  }, React.createElement("div", {
    style: {
      width: collapsed ? 0 : 246,
      flex: "none",
      borderRight: collapsed ? "none" : "1px solid var(--border)",
      background: "var(--bg-subtle)",
      overflow: "hidden",
      transition: "width .2s var(--ease)",
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("div", {
    style: {
      padding: "14px 12px 10px"
    }
  }, React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      width: "100%",
      justifyContent: "center"
    },
    onClick: newSession
  }, React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " Create New Session")), React.createElement("div", {
    className: "scroll",
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "0 8px 12px"
    }
  }, grouped.map(grp => React.createElement("div", {
    key: grp.g
  }, React.createElement("div", {
    className: "cmdk-group-label"
  }, grp.g), grp.items.map(s => React.createElement("div", {
    key: s.id,
    className: "row between center pointer",
    style: {
      padding: "8px 9px",
      borderRadius: 8,
      background: activeId === s.id ? "#fff" : "transparent",
      boxShadow: activeId === s.id ? "var(--sh-xs)" : "none",
      border: "1px solid " + (activeId === s.id ? "var(--border)" : "transparent")
    },
    onClick: () => setActiveId(s.id)
  }, React.createElement("span", {
    className: "row gap-8 center",
    style: {
      minWidth: 0
    }
  }, React.createElement(Icon, {
    name: "chat",
    size: 13,
    style: {
      color: activeId === s.id ? "var(--blue-600)" : "var(--text-muted)",
      flex: "none"
    }
  }), React.createElement("span", {
    className: "truncate",
    style: {
      fontSize: 12.5,
      fontWeight: activeId === s.id ? 560 : 460,
      color: "var(--text-primary)"
    }
  }, s.title)), React.createElement(Menu, {
    align: "right",
    items: [{
      icon: "edit",
      text: "Rename"
    }, {
      icon: "layers",
      text: "Duplicate"
    }, {
      sep: true
    }, {
      icon: "x",
      text: "Delete",
      danger: true
    }]
  }))))))), React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      background: "#fff"
    }
  }, React.createElement("div", {
    className: "row between center",
    style: {
      padding: "12px 18px",
      borderBottom: "1px solid var(--border)",
      flex: "none"
    }
  }, React.createElement("div", {
    className: "row gap-10 center",
    style: {
      minWidth: 0
    }
  }, React.createElement("button", {
    className: "btn btn-icon btn-ghost btn-sm",
    onClick: () => setCollapsed(c => !c)
  }, React.createElement(Icon, {
    name: collapsed ? "columns" : "chevLeft",
    size: 15
  })), React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "crumbs",
    style: {
      fontSize: 12.5
    }
  }, React.createElement("span", {
    className: "crumb"
  }, d.name), React.createElement("span", {
    className: "sep"
  }, "/"), React.createElement("span", {
    className: "crumb cur truncate"
  }, active ? active.title : "Research")), React.createElement("div", {
    className: "t-small"
  }, "Updated ", active ? active.updated : "—"))), React.createElement("div", {
    className: "row gap-6 center"
  }, React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, React.createElement(Icon, {
    name: "download",
    size: 13
  }), " Export"), React.createElement(Menu, {
    align: "right",
    items: [{
      icon: "edit",
      text: "Rename session"
    }, {
      icon: "download",
      text: "Export thread"
    }, {
      icon: "link",
      text: "Copy link"
    }, {
      sep: true
    }, {
      icon: "x",
      text: "Delete session",
      danger: true
    }]
  }))), React.createElement("div", {
    ref: threadRef,
    className: "scroll",
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "22px 0"
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: "0 auto",
      padding: "0 20px"
    }
  }, turns.length === 0 && React.createElement("div", {
    className: "empty-state",
    style: {
      padding: "50px 0"
    }
  }, React.createElement("span", {
    className: "empty-ic",
    style: {
      background: "var(--violet-50)",
      color: "var(--violet-500)"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 24
  })), React.createElement("div", null, React.createElement("div", {
    className: "t-h3"
  }, "Ask anything across this deal"), React.createElement("p", {
    className: "t-body",
    style: {
      maxWidth: 380,
      margin: "5px auto 0"
    }
  }, "Questions are answered by an agent over your in-scope documents and the firm's knowledge \u2014 every figure sourced and traceable."))), turns.map(t => React.createElement(ExpTurn, {
    key: t.id,
    turn: t,
    d: d
  })))), React.createElement(ExpComposer, {
    input: input,
    setInput: setInput,
    send: send,
    quant: quant,
    setQuant: setQuant,
    scope: scope,
    setScope: setScope,
    openFilters: openFilters,
    providers: db.dataProviders
  })));
}
function seededTurn(d) {
  return {
    id: "seed",
    status: "done",
    seeded: true,
    q: "Assess the company's strategic positioning and context:\n• Where does it sit in the value chain and competitive landscape?\n• What is the durability of its moat?\n• Key market tailwinds and the main risks to the thesis.",
    answer: "strategy"
  };
}
function ExpTurn({
  turn,
  d
}) {
  const [showReason, setShowReason] = useState(false);
  const [showDelegate, setShowDelegate] = useState(false);
  const done = turn.status === "done";
  return React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, React.createElement("div", {
    className: "row gap-10",
    style: {
      alignItems: "flex-start",
      marginBottom: 16
    }
  }, React.createElement(Avatar, {
    name: "Alex Chen",
    color: "#2f6bff"
  }), React.createElement("div", {
    className: "card",
    style: {
      padding: "11px 14px",
      background: "var(--bg-subtle)",
      borderColor: "var(--border)",
      flex: 1
    }
  }, React.createElement("p", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.55,
      whiteSpace: "pre-wrap",
      color: "var(--text-primary)"
    }
  }, turn.q))), React.createElement("div", {
    style: {
      paddingLeft: 38
    }
  }, React.createElement(TraceBlock, {
    icon: "sparkles",
    open: showReason,
    onToggle: () => setShowReason(o => !o),
    label: turn.status === "reasoning" ? "Reasoning…" : "Reasoned for a few seconds",
    active: turn.status === "reasoning"
  }, React.createElement("p", {
    className: "t-small",
    style: {
      lineHeight: 1.6
    }
  }, "Decomposing the brief into sub-questions: value-chain position, moat durability, market tailwinds and downside risks. Identifying the most relevant documents in scope (CIM \xA73 Market, management presentation, audited financials) and the firm's industry data on procedure volumes. Planning a retrieval pass per sub-question before synthesis.")), (turn.status === "delegating" || turn.status === "streaming" || done) && React.createElement(TraceBlock, {
    icon: "command",
    open: showDelegate,
    onToggle: () => setShowDelegate(o => !o),
    label: "Delegating to Deal Research agent",
    active: turn.status === "delegating"
  }, React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("span", {
    className: "pill pill-violet"
  }, React.createElement("span", {
    className: "dot"
  }), "deal-research"), React.createElement("span", {
    className: "t-small"
  }, "scoped to this deal's documents \xB7 running retrieval & cross-check"))), turn.status === "streaming" && React.createElement("div", {
    className: "row gap-8 center",
    style: {
      padding: "10px 0",
      color: "var(--violet-500)"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 15
  }), React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 540
    }
  }, "Generating answer\u2026"), React.createElement("span", {
    className: "exp-stream"
  })), done && (turn.quant ? React.createElement(QuantAnswer, null) : React.createElement(TextAnswer, {
    kind: turn.answer,
    d: d
  }))));
}
function TraceBlock({
  icon,
  label,
  active,
  open,
  onToggle,
  children
}) {
  return React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, React.createElement("div", {
    className: "row gap-7 center pointer",
    onClick: onToggle,
    style: {
      fontSize: 12,
      color: "var(--text-secondary)",
      padding: "4px 0"
    }
  }, React.createElement(Icon, {
    name: icon,
    size: 13,
    style: {
      color: active ? "var(--violet-500)" : "var(--text-muted)"
    }
  }), React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, label), active && React.createElement("span", {
    className: "exp-stream",
    style: {
      marginLeft: 2
    }
  }), React.createElement(Icon, {
    name: "chevDown",
    size: 12,
    style: {
      color: "var(--gray-400)",
      transform: open ? "none" : "rotate(-90deg)",
      transition: "transform .15s"
    }
  })), open && React.createElement("div", {
    style: {
      borderLeft: "2px solid var(--border)",
      paddingLeft: 12,
      marginLeft: 6,
      marginTop: 2
    }
  }, children));
}
function TextAnswer({
  kind,
  d
}) {
  return React.createElement("div", {
    className: "fade-cycle",
    style: {
      fontSize: 13.5,
      lineHeight: 1.65,
      color: "var(--text-primary)"
    }
  }, React.createElement("p", {
    style: {
      marginBottom: 10
    }
  }, React.createElement("strong", null, "Positioning."), " Meridian is the category leader in minimally-invasive orthopedic robotics, with an installed base of 1,200 systems anchoring a razor-and-blade model \u2014 ", React.createElement(Prov, {
    value: "62%",
    metric: "Revenue",
    conf: "verified"
  }), " of revenue is recurring consumables at ", React.createElement("strong", null, "91% gross retention"), " ", React.createElement(Cite, {
    n: 1
  }), ". It sits upstream of the ambulatory surgical-center shift, which is structurally favorable."), React.createElement("p", {
    style: {
      marginBottom: 10
    }
  }, React.createElement("strong", null, "Moat."), " Switching costs are high once a system is placed and surgeons are trained; the consumables lock-in and a 19-patent actuation portfolio ", React.createElement(Cite, {
    n: 2
  }), " protect share. The main vulnerability is concentration \u2014 the top-3 IDNs account for a meaningful share of placements."), React.createElement("p", {
    style: {
      marginBottom: 14
    }
  }, React.createElement("strong", null, "Tailwinds & risks."), " International is just 11% of revenue vs. ~40% for peers ", React.createElement(Cite, {
    n: 3
  }), ", a clear expansion lever. Key risks: reimbursement pressure on robotic procedures and customer concentration."), React.createElement("div", {
    className: "alert-row",
    style: {
      background: "var(--green-50)",
      borderColor: "var(--green-100)"
    }
  }, React.createElement("span", {
    className: "alert-ic",
    style: {
      background: "var(--green-100)",
      color: "var(--green-600)"
    }
  }, React.createElement(Icon, {
    name: "checkCircle",
    size: 16
  })), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 560
    }
  }, "Critic AI \xB7 all figures sourced"), React.createElement("div", {
    className: "t-small"
  }, "3 citations \xB7 cross-checked against CIM and audited financials. No discrepancy."))));
}
function QuantAnswer() {
  const q = window.DB.quantSample;
  return React.createElement("div", {
    className: "fade-cycle"
  }, React.createElement("div", {
    className: "row gap-7 center mb-12"
  }, React.createElement("span", {
    className: "pill pill-violet"
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 11
  }), " Quant Mode"), React.createElement("span", {
    className: "t-small"
  }, "Calculated over structured financials in scope \u2014 every cell traceable.")), React.createElement("div", {
    className: "card card-pad mb-12"
  }, React.createElement("div", {
    className: "metric-label mb-8"
  }, "Revenue ($M) \xB7 2020\u20132022"), React.createElement(BarChart, {
    series: q.series,
    color: "#7c5cfc",
    yfmt: v => "$" + v.toFixed(0)
  })), React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("table", {
    className: "dtable",
    style: {
      fontSize: 12.5
    }
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Computed metric"), React.createElement("th", {
    className: "num"
  }, "Value"), React.createElement("th", null, "Source"))), React.createElement("tbody", null, q.rows.map(r => React.createElement("tr", {
    key: r[0],
    style: {
      cursor: "default"
    }
  }, React.createElement("td", {
    style: {
      fontWeight: 540
    }
  }, r[0]), React.createElement("td", {
    className: "num",
    style: {
      fontWeight: 600
    }
  }, r[1]), React.createElement("td", null, React.createElement("span", {
    className: "row gap-6 center"
  }, React.createElement(ConfDot, {
    level: r[2]
  }), React.createElement(Cite, {
    n: 1
  })))))))));
}
function ExpComposer({
  input,
  setInput,
  send,
  quant,
  setQuant,
  scope,
  setScope,
  openFilters,
  providers
}) {
  const [srcOpen, setSrcOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!srcOpen) return;
    const fn = e => {
      if (ref.current && !ref.current.contains(e.target)) setSrcOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [srcOpen]);
  const activeProviders = providers.filter(p => scope.providers[p.id]);
  return React.createElement("div", {
    style: {
      flex: "none",
      borderTop: "1px solid var(--border)",
      padding: "12px 18px 14px",
      background: "#fff"
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: "0 auto"
    }
  }, React.createElement("div", {
    className: "row gap-7 center wrap",
    style: {
      marginBottom: 9
    }
  }, activeProviders.map(p => React.createElement("span", {
    key: p.id,
    className: "tag",
    style: {
      background: "var(--blue-50)",
      borderColor: "var(--blue-100)",
      color: "var(--blue-700)"
    }
  }, React.createElement(Icon, {
    name: "database",
    size: 11
  }), " ", p.name, React.createElement("span", {
    className: "pointer",
    style: {
      marginLeft: 2,
      display: "inline-flex"
    },
    onClick: () => setScope(s => ({
      ...s,
      providers: {
        ...s.providers,
        [p.id]: false
      }
    }))
  }, React.createElement(Icon, {
    name: "x",
    size: 11
  })))), React.createElement("span", {
    className: "tag pointer",
    onClick: openFilters
  }, React.createElement(Icon, {
    name: "folder",
    size: 11
  }), " ", scope.files, " files"), scope.global > 0 && React.createElement("span", {
    className: "tag pointer",
    onClick: openFilters
  }, React.createElement(Icon, {
    name: "globe",
    size: 11
  }), " ", scope.global, " global"), scope.web && React.createElement("span", {
    className: "tag",
    style: {
      background: "var(--green-50)",
      borderColor: "var(--green-100)",
      color: "var(--green-600)"
    }
  }, React.createElement(Icon, {
    name: "globe",
    size: 11
  }), " Web")), React.createElement("div", {
    className: "global-search active",
    style: {
      maxWidth: "none",
      height: "auto",
      minHeight: 46,
      padding: "8px 10px 8px 14px",
      alignItems: "flex-end",
      background: "#fff"
    }
  }, React.createElement("textarea", {
    value: input,
    onChange: e => setInput(e.target.value),
    rows: 1,
    onKeyDown: e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    placeholder: "Ask your documents, use @ to mention deals or files",
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      fontFamily: "inherit",
      fontSize: 14,
      color: "var(--text-primary)",
      resize: "none",
      lineHeight: 1.5,
      padding: "5px 0",
      maxHeight: 120
    }
  }), React.createElement("div", {
    className: "row gap-7 center",
    style: {
      position: "relative"
    },
    ref: ref
  }, React.createElement("button", {
    className: "btn btn-sm " + (quant ? "btn-navy" : "btn-ghost"),
    onClick: () => setQuant(q => !q),
    style: quant ? {} : {
      color: "var(--text-secondary)"
    }
  }, React.createElement(Icon, {
    name: "trending",
    size: 13
  }), " Quant Mode"), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setSrcOpen(o => !o)
  }, React.createElement(Icon, {
    name: "database",
    size: 13
  }), " Sources ", React.createElement(Icon, {
    name: "chevDown",
    size: 12
  })), React.createElement("button", {
    className: "btn btn-primary btn-icon btn-sm",
    onClick: send
  }, React.createElement(Icon, {
    name: "arrowUp",
    size: 15
  })), srcOpen && React.createElement(SourcesPopover, {
    scope: scope,
    setScope: setScope,
    providers: providers,
    openFilters: openFilters,
    onClose: () => setSrcOpen(false)
  })))));
}
function SourcesPopover({
  scope,
  setScope,
  providers,
  openFilters,
  onClose
}) {
  const ctx = useContext(AppCtx);
  const Row = ({
    icon,
    title,
    desc,
    right,
    onClick
  }) => React.createElement("div", {
    className: "row between center pointer",
    style: {
      padding: "9px 10px",
      borderRadius: 8
    },
    onClick: onClick,
    onMouseEnter: e => e.currentTarget.style.background = "var(--gray-100)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, React.createElement("span", {
    className: "row gap-9 center",
    style: {
      minWidth: 0
    }
  }, React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 7,
      background: "var(--bg-sunken)",
      color: "var(--text-secondary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, React.createElement(Icon, {
    name: icon,
    size: 14
  })), React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 540,
      display: "block"
    }
  }, title), desc && React.createElement("span", {
    className: "t-small truncate",
    style: {
      display: "block"
    }
  }, desc))), right);
  return React.createElement("div", {
    className: "menu",
    style: {
      bottom: "calc(100% + 8px)",
      right: 0,
      top: "auto",
      width: 320,
      padding: 7
    },
    onClick: e => e.stopPropagation()
  }, React.createElement("div", {
    className: "menu-label"
  }, "Internal Sources"), React.createElement(Row, {
    icon: "layers",
    title: "Deals",
    desc: "Include other deals in the search",
    right: React.createElement(Icon, {
      name: "chevRight",
      size: 14,
      style: {
        color: "var(--gray-400)"
      }
    }),
    onClick: () => ctx.toast("Pick deals to include…", "")
  }), React.createElement(Row, {
    icon: "folder",
    title: "Deal Files",
    desc: scope.files + " of this deal's files selected",
    right: React.createElement(Icon, {
      name: "chevRight",
      size: 14,
      style: {
        color: "var(--gray-400)"
      }
    }),
    onClick: () => {
      onClose();
      openFilters();
    }
  }), React.createElement(Row, {
    icon: "globe",
    title: "Global Files",
    desc: "Organization-wide thematic files",
    right: React.createElement(Icon, {
      name: "chevRight",
      size: 14,
      style: {
        color: "var(--gray-400)"
      }
    }),
    onClick: () => {
      onClose();
      openFilters();
    }
  }), React.createElement("div", {
    className: "menu-sep"
  }), React.createElement("div", {
    className: "menu-label"
  }, "External Sources"), React.createElement("div", {
    className: "t-small",
    style: {
      padding: "0 10px 6px",
      color: "var(--text-muted)"
    }
  }, "Off by default \u2014 your deal's documents are always searched first."), React.createElement(Row, {
    icon: "globe",
    title: "Web Sources",
    desc: "Search the web for recent information",
    right: React.createElement("div", {
      className: "toggle" + (scope.web ? " on" : ""),
      onClick: e => {
        e.stopPropagation();
        setScope(s => ({
          ...s,
          web: !s.web
        }));
      }
    })
  }), providers.map(p => React.createElement(Row, {
    key: p.id,
    icon: "database",
    title: p.name,
    desc: p.desc,
    right: React.createElement("span", {
      className: "row gap-7 center"
    }, React.createElement("button", {
      className: "prov-btn",
      onClick: e => {
        e.stopPropagation();
        ctx.toast("Configure " + p.name, "");
      }
    }, React.createElement(Icon, {
      name: "settings",
      size: 13
    })), React.createElement("div", {
      className: "toggle" + (scope.providers[p.id] ? " on" : ""),
      onClick: e => {
        e.stopPropagation();
        setScope(s => ({
          ...s,
          providers: {
            ...s.providers,
            [p.id]: !s.providers[p.id]
          }
        }));
      }
    }))
  })));
}
function FileFiltersDrawer({
  cfg,
  onClose
}) {
  const db = window.DB;
  const [tab, setTab] = useState("deal");
  const [q, setQ] = useState("");
  const [dealSel, setDealSel] = useState(() => Object.fromEntries(db.files.map(f => [f.name, true])));
  const [globalSel, setGlobalSel] = useState({});
  const [expanded, setExpanded] = useState({});
  const dealCount = Object.values(dealSel).filter(Boolean).length;
  const globalCount = Object.values(globalSel).filter(Boolean).length;
  const setAll = val => {
    if (tab === "deal") setDealSel(Object.fromEntries(db.files.map(f => [f.name, val])));else {
      const next = {};
      const walk = nodes => nodes.forEach(n => {
        next[n.name] = val;
        if (n.children) walk(n.children);
      });
      walk(db.globalFiles);
      setGlobalSel(next);
    }
  };
  const setExpandAll = val => {
    const next = {};
    const walk = nodes => nodes.forEach(n => {
      if (n.children) {
        next[n.name] = val;
        walk(n.children);
      }
    });
    walk(db.globalFiles);
    setExpanded(next);
  };
  const apply = () => {
    cfg.onApply && cfg.onApply({
      files: dealCount,
      global: globalCount
    });
    onClose();
  };
  return React.createElement(Drawer, {
    onClose: onClose
  }, React.createElement("div", {
    className: "modal-head"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "t-h2"
  }, "File Filters"), React.createElement("p", {
    className: "t-body"
  }, "Choose exactly which documents the AI reads.")), React.createElement("button", {
    className: "x-btn",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), React.createElement("div", {
    style: {
      padding: "12px 18px 0"
    }
  }, React.createElement(Seg, {
    value: tab,
    onChange: setTab,
    options: [{
      value: "deal",
      label: `Deal Files (${dealCount})`
    }, {
      value: "global",
      label: `Global Files (${globalCount})`
    }]
  }), React.createElement("div", {
    className: "global-search",
    style: {
      maxWidth: "none",
      height: 36,
      margin: "12px 0 10px"
    }
  }, React.createElement(Icon, {
    name: "search",
    size: 15
  }), React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search files and folders\u2026",
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      fontFamily: "inherit",
      fontSize: 13
    }
  })), React.createElement("div", {
    className: "row gap-4 center",
    style: {
      marginBottom: 6,
      flexWrap: "wrap"
    }
  }, React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => setAll(false)
  }, "Unselect all"), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => setAll(true)
  }, "Select all"), tab === "global" && React.createElement(React.Fragment, null, React.createElement("span", {
    style: {
      width: 1,
      height: 16,
      background: "var(--border)",
      margin: "0 4px"
    }
  }), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => setExpandAll(false)
  }, "Collapse"), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => setExpandAll(true)
  }, "Expand")))), React.createElement("div", {
    className: "scroll",
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "4px 14px 14px"
    }
  }, tab === "deal" ? db.files.filter(f => f.name.toLowerCase().includes(q.toLowerCase())).map(f => {
    const FC = {
      pdf: "#dc2626",
      xls: "#16a34a",
      csv: "#16a34a",
      ppt: "#e08a00",
      doc: "#2f6bff"
    };
    return React.createElement("label", {
      key: f.name,
      className: "row gap-10 center pointer",
      style: {
        padding: "8px 6px",
        borderRadius: 7
      },
      onMouseEnter: e => e.currentTarget.style.background = "var(--gray-50)",
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, React.createElement("input", {
      type: "checkbox",
      checked: !!dealSel[f.name],
      onChange: () => setDealSel(s => ({
        ...s,
        [f.name]: !s[f.name]
      })),
      style: {
        accentColor: "var(--blue-500)",
        width: 15,
        height: 15
      }
    }), React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: 6,
        background: (FC[f.ftype] || "#888") + "1a",
        color: FC[f.ftype] || "#888",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none"
      }
    }, React.createElement(Icon, {
      name: "file",
      size: 12
    })), React.createElement("span", {
      style: {
        fontSize: 12.5,
        flex: 1,
        minWidth: 0
      },
      className: "truncate"
    }, f.name));
  }) : db.globalFiles.map(node => React.createElement(FfNode, {
    key: node.name,
    node: node,
    depth: 0,
    sel: globalSel,
    setSel: setGlobalSel,
    expanded: expanded,
    setExpanded: setExpanded
  }))), React.createElement("div", {
    className: "modal-foot"
  }, React.createElement("span", {
    className: "t-small",
    style: {
      marginRight: "auto"
    }
  }, dealCount + globalCount, " sources in scope"), React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: apply
  }, "Apply scope")));
}
function FfNode({
  node,
  depth,
  sel,
  setSel,
  expanded,
  setExpanded
}) {
  const isFolder = node.kind === "folder" || node.children;
  const open = expanded[node.name];
  const FC = {
    pdf: "#dc2626",
    xls: "#16a34a",
    csv: "#16a34a",
    ppt: "#e08a00",
    doc: "#2f6bff"
  };
  const toggleSel = () => {
    setSel(s => {
      const val = !s[node.name];
      const next = {
        ...s,
        [node.name]: val
      };
      if (node.children) {
        const walk = nodes => nodes.forEach(n => {
          next[n.name] = val;
          if (n.children) walk(n.children);
        });
        walk(node.children);
      }
      return next;
    });
  };
  return React.createElement("div", null, React.createElement("div", {
    className: "row gap-8 center",
    style: {
      padding: "7px 6px",
      paddingLeft: 6 + depth * 18,
      borderRadius: 7
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--gray-50)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, isFolder ? React.createElement("button", {
    className: "prov-btn",
    onClick: () => setExpanded(s => ({
      ...s,
      [node.name]: !open
    })),
    style: {
      width: 16
    }
  }, React.createElement(Icon, {
    name: "chevRight",
    size: 12,
    style: {
      transform: open ? "rotate(90deg)" : "none",
      transition: "transform .15s"
    }
  })) : React.createElement("span", {
    style: {
      width: 16
    }
  }), React.createElement("input", {
    type: "checkbox",
    checked: !!sel[node.name],
    onChange: toggleSel,
    style: {
      accentColor: "var(--blue-500)",
      width: 15,
      height: 15
    }
  }), React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 6,
      background: isFolder ? "var(--bg-sunken)" : (FC[node.ftype] || "#888") + "1a",
      color: isFolder ? "var(--text-secondary)" : FC[node.ftype] || "#888",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, React.createElement(Icon, {
    name: isFolder ? "folder" : "file",
    size: 12
  })), React.createElement("span", {
    style: {
      fontSize: 12.5,
      flex: 1,
      minWidth: 0,
      fontWeight: isFolder ? 540 : 440
    },
    className: "truncate"
  }, node.name)), isFolder && open && node.children && node.children.map(c => React.createElement(FfNode, {
    key: c.name,
    node: c,
    depth: depth + 1,
    sel: sel,
    setSel: setSel,
    expanded: expanded,
    setExpanded: setExpanded
  })));
}
function ExploreLanding() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  return React.createElement("div", {
    className: "page",
    style: {
      maxWidth: 1000
    }
  }, React.createElement(PageHead, {
    title: "Explore",
    sub: "Ask anything against your indexed data \u2014 scope it to a single deal, a sector, or everything."
  }), React.createElement("div", {
    className: "mb-20"
  }, React.createElement("div", {
    className: "label mb-8"
  }, "Ask about a deal"), React.createElement("div", {
    className: "row gap-8 wrap"
  }, db.activeDeals().map(d => React.createElement("button", {
    key: d.id,
    className: "chip",
    onClick: () => ctx.navigate("workspace", {
      id: d.id,
      tab: "explore"
    })
  }, React.createElement(LogoTile, {
    initials: d.initials,
    sector: d.sector,
    size: 20
  }), " ", d.name)))), React.createElement("div", {
    className: "mb-20"
  }, React.createElement("div", {
    className: "label mb-8"
  }, "Ask about a sector"), React.createElement("div", {
    className: "row gap-8 wrap"
  }, db.sectors.map(s => React.createElement("button", {
    key: s.id,
    className: "chip",
    onClick: () => ctx.navigate("sectorco", {
      id: s.id,
      tab: "explore"
    })
  }, React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 5,
      background: s.color + "1a",
      color: s.color,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "sector",
    size: 11
  })), " ", s.name)))), React.createElement("div", {
    className: "divider mb-16"
  }), React.createElement("div", {
    className: "label mb-8"
  }, "\u2026or ask across everything"), React.createElement(window.QueryBuilder, {
    embedded: true
  }));
}
window.ExploreView = ExploreView;
window.ExploreLanding = ExploreLanding;
window.FileFiltersDrawer = FileFiltersDrawer;
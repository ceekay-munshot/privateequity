function CommandPalette({
  onClose
}) {
  const ctx = useContext(AppCtx);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);
  const go = (view, params) => {
    ctx.navigate(view, params);
    onClose();
  };
  const nav = [{
    group: "Go to",
    icon: "home",
    title: "Home",
    sub: "Overview & activity",
    action: () => go("home")
  }, {
    group: "Go to",
    icon: "dealflow",
    title: "Deal Flow",
    sub: "Inbound pipeline · 6 active",
    action: () => go("dealflow")
  }, {
    group: "Go to",
    icon: "sector",
    title: "Sector Intelligence",
    sub: "Tracked themes",
    action: () => go("sector")
  }, {
    group: "Go to",
    icon: "sparkles",
    title: "Explore",
    sub: "Ask against a deal or sector",
    action: () => go("explore")
  }, {
    group: "Go to",
    icon: "documents",
    title: "Documents",
    sub: "Files & query builder",
    action: () => go("documents")
  }, {
    group: "Go to",
    icon: "memos",
    title: "Memos & Models",
    sub: "Automation",
    action: () => go("memos")
  }, {
    group: "Go to",
    icon: "settings",
    title: "Settings & Access",
    sub: "Integrations & permissions",
    action: () => go("settings")
  }];
  const actions = [{
    group: "Actions",
    icon: "plus",
    title: "New deal",
    sub: "Add to pipeline",
    tag: "⌘N",
    action: () => {
      onClose();
      ctx.openWizard();
    }
  }, {
    group: "Actions",
    icon: "sparkles",
    title: "Generate screening memo",
    sub: "From emails + IM",
    action: () => go("memos")
  }, {
    group: "Actions",
    icon: "columns",
    title: "Open Weekly Review",
    sub: "Batch this week's deals",
    action: () => go("dealflow", {
      weekly: true
    })
  }, {
    group: "Actions",
    icon: "folder",
    title: "View archived deals",
    sub: "Deals you've passed",
    action: () => go("dealflow")
  }];
  const deals = window.DB.activeDeals().map(d => ({
    group: "Deals",
    icon: "layers",
    title: d.name,
    sub: d.sector + " · " + d.strategy,
    tag: d.fit ? "Fit " + d.fit : "",
    action: () => go("workspace", {
      id: d.id
    })
  }));
  const secs = window.DB.sectors.map(s => ({
    group: "Sectors",
    icon: "sector",
    title: s.name,
    sub: s.signals + " new signals",
    action: () => go("sectorco", {
      id: s.id
    })
  }));
  let all = [...nav, ...actions, ...deals, ...secs];
  if (q.trim()) {
    const t = q.toLowerCase();
    all = all.filter(i => (i.title + " " + i.sub + " " + i.group).toLowerCase().includes(t));
  }
  const groups = [];
  all.forEach(i => {
    let g = groups.find(x => x.name === i.group);
    if (!g) {
      g = {
        name: i.group,
        items: []
      };
      groups.push(g);
    }
    g.items.push(i);
  });
  const flat = groups.flatMap(g => g.items);
  useEffect(() => {
    setSel(0);
  }, [q]);
  const onKey = e => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel(s => Math.min(flat.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel(s => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flat[sel] && flat[sel].action();
    } else if (e.key === "Escape") onClose();
  };
  let idx = -1;
  return React.createElement("div", {
    className: "cmdk-overlay",
    onMouseDown: onClose
  }, React.createElement("div", {
    className: "cmdk",
    onMouseDown: e => e.stopPropagation()
  }, React.createElement("div", {
    className: "cmdk-input-row"
  }, React.createElement(Icon, {
    name: "search",
    size: 19,
    style: {
      color: "var(--text-muted)"
    }
  }), React.createElement("input", {
    ref: inputRef,
    className: "cmdk-input",
    placeholder: "Type @ to jump to a deal, company or sector, or search everything\u2026",
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: onKey
  }), React.createElement("span", {
    className: "kbd"
  }, "ESC")), React.createElement("div", {
    className: "cmdk-list scroll"
  }, flat.length === 0 && React.createElement("div", {
    style: {
      padding: "30px 14px",
      textAlign: "center",
      color: "var(--text-muted)",
      fontSize: 13
    }
  }, "No results for \u201C", q, "\u201D"), groups.map(g => React.createElement("div", {
    key: g.name
  }, React.createElement("div", {
    className: "cmdk-group-label"
  }, g.name), g.items.map(it => {
    idx++;
    const myIdx = idx;
    return React.createElement("div", {
      key: it.title,
      className: "cmdk-item" + (sel === myIdx ? " sel" : ""),
      onMouseEnter: () => setSel(myIdx),
      onClick: () => it.action()
    }, React.createElement("span", {
      className: "ci-ic"
    }, React.createElement(Icon, {
      name: it.icon,
      size: 15
    })), React.createElement("div", {
      className: "ci-main"
    }, React.createElement("div", {
      className: "ci-title"
    }, it.title), React.createElement("div", {
      className: "ci-sub"
    }, it.sub)), it.tag && React.createElement("span", {
      className: "ci-tag"
    }, it.tag));
  })))), React.createElement("div", {
    className: "cmdk-foot"
  }, React.createElement("span", {
    className: "hk"
  }, React.createElement("span", {
    className: "kbd"
  }, "\u2191"), React.createElement("span", {
    className: "kbd"
  }, "\u2193"), " navigate"), React.createElement("span", {
    className: "hk"
  }, React.createElement("span", {
    className: "kbd"
  }, "\u21B5"), " select"), React.createElement("span", {
    className: "hk",
    style: {
      marginLeft: "auto"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 12
  }), " AI-ranked"))));
}
window.CommandPalette = CommandPalette;
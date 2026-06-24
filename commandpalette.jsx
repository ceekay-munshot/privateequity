/* ============================================================
   Command palette (⌘K) → window.CommandPalette
   ============================================================ */
function CommandPalette({ onClose }) {
  const ctx = useContext(AppCtx);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const go = (view, params) => { ctx.navigate(view, params); onClose(); };

  const nav = [
    { group: "Go to", icon: "home", title: "Home", sub: "Overview & activity", action: () => go("home") },
    { group: "Go to", icon: "dealflow", title: "Deal Flow", sub: "Inbound pipeline · 6 active", action: () => go("dealflow") },
    { group: "Go to", icon: "sector", title: "Sector Intelligence", sub: "Tracked themes", action: () => go("sector") },
    { group: "Go to", icon: "sparkles", title: "Explore", sub: "Ask against a deal or sector", action: () => go("explore") },
    { group: "Go to", icon: "documents", title: "Documents", sub: "Files & query builder", action: () => go("documents") },
    { group: "Go to", icon: "memos", title: "Memos & Models", sub: "Automation", action: () => go("memos") },
    { group: "Go to", icon: "settings", title: "Settings & Access", sub: "Integrations & permissions", action: () => go("settings") },
  ];
  const actions = [
    { group: "Actions", icon: "plus", title: "New deal", sub: "Add to pipeline", tag: "⌘N", action: () => { onClose(); ctx.openWizard(); } },
    { group: "Actions", icon: "sparkles", title: "Generate screening memo", sub: "From emails + IM", action: () => go("memos") },
    { group: "Actions", icon: "columns", title: "Open Weekly Review", sub: "Batch this week's deals", action: () => go("dealflow", { weekly: true }) },
    { group: "Actions", icon: "folder", title: "View archived deals", sub: "Deals you've passed", action: () => go("dealflow") },
  ];
  const deals = window.DB.activeDeals().map((d) => ({
    group: "Deals", icon: "layers", title: d.name, sub: d.sector + " · " + d.strategy, tag: d.fit ? "Fit " + d.fit : "",
    action: () => go("workspace", { id: d.id }),
  }));
  const secs = window.DB.sectors.map((s) => ({
    group: "Sectors", icon: "sector", title: s.name, sub: s.signals + " new signals",
    action: () => go("sectorco", { id: s.id }),
  }));

  let all = [...nav, ...actions, ...deals, ...secs];
  if (q.trim()) {
    const t = q.toLowerCase();
    all = all.filter((i) => (i.title + " " + i.sub + " " + i.group).toLowerCase().includes(t));
  }
  const groups = [];
  all.forEach((i) => {
    let g = groups.find((x) => x.name === i.group);
    if (!g) { g = { name: i.group, items: [] }; groups.push(g); }
    g.items.push(i);
  });
  const flat = groups.flatMap((g) => g.items);
  useEffect(() => { setSel(0); }, [q]);

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(flat.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); flat[sel] && flat[sel].action(); }
    else if (e.key === "Escape") onClose();
  };

  let idx = -1;
  return (
    <div className="cmdk-overlay" onMouseDown={onClose}>
      <div className="cmdk" onMouseDown={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <Icon name="search" size={19} style={{ color: "var(--text-muted)" }} />
          <input ref={inputRef} className="cmdk-input" placeholder="Type @ to jump to a deal, company or sector, or search everything…"
            value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} />
          <span className="kbd">ESC</span>
        </div>
        <div className="cmdk-list scroll">
          {flat.length === 0 && <div style={{ padding: "30px 14px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No results for “{q}”</div>}
          {groups.map((g) => (
            <div key={g.name}>
              <div className="cmdk-group-label">{g.name}</div>
              {g.items.map((it) => {
                idx++;
                const myIdx = idx;
                return (
                  <div key={it.title} className={"cmdk-item" + (sel === myIdx ? " sel" : "")}
                    onMouseEnter={() => setSel(myIdx)} onClick={() => it.action()}>
                    <span className="ci-ic"><Icon name={it.icon} size={15} /></span>
                    <div className="ci-main">
                      <div className="ci-title">{it.title}</div>
                      <div className="ci-sub">{it.sub}</div>
                    </div>
                    {it.tag && <span className="ci-tag">{it.tag}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmdk-foot">
          <span className="hk"><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span className="hk"><span className="kbd">↵</span> select</span>
          <span className="hk" style={{ marginLeft: "auto" }}><Icon name="sparkles" size={12} /> AI-ranked</span>
        </div>
      </div>
    </div>
  );
}
window.CommandPalette = CommandPalette;

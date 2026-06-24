const STAGES = ["Triaging", "Screening", "IC Review", "Pursuing"];
function DealFlowView({
  params
}) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [view, setView] = useState(params && params.weekly ? "weekly" : "table");
  const [sort, setSort] = useState("fit");
  const [filters, setFilters] = useState({
    sector: "All",
    minFit: 0,
    status: "All"
  });
  const [overrides, setOverrides] = useState({});
  const [importOpen, setImportOpen] = useState(false);
  const eff = d => overrides[d.id] || d.status;
  const move = (d, to) => {
    setOverrides(o => ({
      ...o,
      [d.id]: to
    }));
    ctx.toast(d.name + " → " + (to === "Passed" ? "Archived" : to), to === "Passed" ? "flag" : "check");
  };
  const logAction = (d, label) => ctx.toast(label + " added to " + d.name + " actionables", "check");
  let deals = db.deals.filter(d => eff(d) !== "Passed");
  const archived = db.deals.filter(d => eff(d) === "Passed");
  if (filters.sector !== "All") deals = deals.filter(d => d.sector === filters.sector);
  if (filters.status !== "All") deals = deals.filter(d => eff(d) === filters.status);
  deals = deals.filter(d => d.fit >= filters.minFit);
  deals.sort((a, b) => sort === "fit" ? b.fit - a.fit : sort === "rev" ? (b.revenue || 0) - (a.revenue || 0) : new Date(b.received) - new Date(a.received));
  const sectors = ["All", ...Object.keys(db.SECTOR_COLOR)];
  const statuses = ["All", ...STAGES];
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement(PageHead, {
    title: "Deal Flow",
    sub: "A living pipeline \u2014 inbound opportunities ranked against your thesis. You see ~400 a year and act on ~10."
  }, React.createElement(Seg, {
    value: view,
    onChange: setView,
    options: [{
      value: "table",
      label: "Table",
      icon: "table"
    }, {
      value: "kanban",
      label: "Pipeline",
      icon: "columns"
    }, {
      value: "weekly",
      label: "Weekly Review",
      icon: "calendar"
    }, {
      value: "archived",
      label: "Archived",
      icon: "folder"
    }]
  }), React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => ctx.openWizard()
  }, React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " New Deal")), (view === "table" || view === "archived") && React.createElement("div", {
    className: "row gap-8 center mb-14",
    style: {
      justifyContent: "flex-end"
    }
  }, React.createElement("span", {
    className: "t-small",
    style: {
      marginRight: "auto"
    }
  }, view === "archived" ? archived.length + " archived" : deals.length + " active deals"), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setImportOpen(true)
  }, React.createElement(Icon, {
    name: "upload",
    size: 13
  }), " Import Excel"), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => ctx.toast("Exporting " + (view === "archived" ? archived.length : deals.length) + " rows to Paragon_Pipeline.xlsx", "check")
  }, React.createElement(Icon, {
    name: "download",
    size: 13
  }), " Export Excel")), view === "weekly" ? React.createElement(WeeklyReview, {
    deals: db.deals.filter(d => d.isNew)
  }) : view === "archived" ? React.createElement(ArchivedTable, {
    deals: archived,
    onRestore: d => move(d, "Screening")
  }) : React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "208px 1fr",
      gap: 20,
      alignItems: "start"
    }
  }, React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "row between center mb-12"
  }, React.createElement("span", {
    className: "t-h3"
  }, "Filters"), React.createElement(Icon, {
    name: "filter",
    size: 14,
    style: {
      color: "var(--text-muted)"
    }
  })), React.createElement(FilterGroup, {
    label: "Sector"
  }, sectors.map(s => React.createElement("label", {
    key: s,
    className: "row gap-8 center pointer",
    style: {
      padding: "5px 0",
      fontSize: 12.5
    }
  }, React.createElement("input", {
    type: "radio",
    checked: filters.sector === s,
    onChange: () => setFilters(f => ({
      ...f,
      sector: s
    })),
    style: {
      accentColor: "var(--blue-500)"
    }
  }), s !== "All" && React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: db.SECTOR_COLOR[s]
    }
  }), s))), React.createElement(FilterGroup, {
    label: "Min fit score · " + filters.minFit
  }, React.createElement("input", {
    type: "range",
    min: "0",
    max: "95",
    step: "5",
    value: filters.minFit,
    onChange: e => setFilters(f => ({
      ...f,
      minFit: +e.target.value
    })),
    style: {
      width: "100%",
      accentColor: "var(--blue-500)"
    }
  })), React.createElement(FilterGroup, {
    label: "Status"
  }, React.createElement("select", {
    className: "select",
    value: filters.status,
    onChange: e => setFilters(f => ({
      ...f,
      status: e.target.value
    }))
  }, statuses.map(s => React.createElement("option", {
    key: s
  }, s)))), React.createElement("div", {
    className: "divider",
    style: {
      margin: "4px 0 12px"
    }
  }), React.createElement("div", {
    className: "t-small",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, React.createElement("div", {
    className: "row between"
  }, React.createElement("span", {
    className: "text-muted"
  }, "Showing"), React.createElement("strong", {
    className: "num"
  }, deals.length, " deals")), React.createElement("div", {
    className: "row between"
  }, React.createElement("span", {
    className: "text-muted"
  }, "Avg fit"), React.createElement("strong", {
    className: "num"
  }, Math.round(deals.reduce((s, d) => s + d.fit, 0) / (deals.length || 1)))))), view === "table" ? React.createElement(DealTable, {
    deals: deals,
    sort: sort,
    setSort: setSort,
    eff: eff,
    move: move,
    logAction: logAction
  }) : React.createElement(KanbanBoard, {
    deals: deals,
    eff: eff,
    move: move,
    logAction: logAction
  })), importOpen && React.createElement(ExcelImportModal, {
    onClose: () => setImportOpen(false)
  }));
}
function FilterGroup({
  label,
  children
}) {
  return React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 7
    }
  }, label), children);
}
function dealMenu(ctx, d, move, logAction) {
  return [{
    icon: "eye",
    text: "Open workspace",
    onClick: () => ctx.navigate("workspace", {
      id: d.id
    })
  }, {
    icon: "sparkles",
    text: "Generate screening memo",
    onClick: () => ctx.navigate("memos")
  }, {
    label: "Move to stage"
  }, ...STAGES.map(s => ({
    icon: "arrowRight",
    text: s,
    onClick: () => move(d, s)
  })), {
    sep: true
  }, {
    icon: "calendar",
    text: "Schedule banker call",
    onClick: () => logAction(d, "Banker call")
  }, {
    icon: "fileText",
    text: "Log next step / note",
    onClick: () => logAction(d, "Next step")
  }, {
    sep: true
  }, {
    icon: "flag",
    text: "Pass & archive",
    danger: true,
    onClick: () => move(d, "Passed")
  }];
}
function DealTable({
  deals,
  sort,
  setSort,
  eff,
  move,
  logAction
}) {
  const ctx = useContext(AppCtx);
  const th = (key, label, cls = "") => React.createElement("th", {
    className: "sortable " + cls,
    onClick: () => setSort(key)
  }, React.createElement("span", {
    className: "row gap-4 center",
    style: {
      justifyContent: cls.includes("num") ? "flex-end" : "flex-start"
    }
  }, label, sort === key && React.createElement(Icon, {
    name: "chevDown",
    size: 12
  })));
  return React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("div", {
    className: "scroll",
    style: {
      overflowX: "auto"
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Company"), React.createElement("th", null, "Sector"), React.createElement("th", null, "Source"), th("date", "Received"), th("rev", "Revenue", "num"), React.createElement("th", {
    className: "num"
  }, "EBITDA"), React.createElement("th", {
    className: "num"
  }, "Ask"), th("fit", "Fit Score", "num"), React.createElement("th", null, "Status"), React.createElement("th", {
    style: {
      width: 36
    }
  }))), React.createElement("tbody", null, deals.map(d => React.createElement("tr", {
    key: d.id,
    className: d.isNew ? "row-new" : "",
    onClick: () => ctx.navigate("workspace", {
      id: d.id
    })
  }, React.createElement("td", null, React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement(LogoTile, {
    initials: d.initials,
    sector: d.sector,
    size: 30
  }), React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "row gap-6 center"
  }, React.createElement("span", {
    style: {
      fontWeight: 560
    }
  }, d.name), d.isNew && React.createElement("span", {
    className: "pill pill-new",
    style: {
      fontSize: 9,
      padding: "1px 6px"
    }
  }, "NEW")), React.createElement("div", {
    className: "t-small truncate",
    style: {
      maxWidth: 260
    }
  }, d.take)))), React.createElement("td", null, React.createElement("div", {
    style: {
      fontSize: 12.5
    }
  }, d.sector), React.createElement("div", {
    className: "t-small"
  }, d.sub)), React.createElement("td", null, React.createElement("div", {
    style: {
      fontSize: 12.5
    }
  }, d.source), React.createElement("div", {
    className: "t-small"
  }, d.sourceType)), React.createElement("td", {
    className: "t-small nowrap"
  }, fmtDate(d.received)), React.createElement("td", {
    className: "num"
  }, d.revenue != null ? "$" + d.revenue.toFixed(0) + "M" : "—"), React.createElement("td", {
    className: "num"
  }, d.ebitda != null ? "$" + d.ebitda.toFixed(1) + "M" : "—"), React.createElement("td", {
    className: "num"
  }, d.ask != null ? "$" + d.ask + "M" : "—"), React.createElement("td", {
    className: "num"
  }, React.createElement(FitBar, {
    score: d.fit
  })), React.createElement("td", null, React.createElement(StatusPill, {
    status: eff(d)
  })), React.createElement("td", {
    onClick: e => e.stopPropagation()
  }, React.createElement(Menu, {
    items: dealMenu(ctx, d, move, logAction)
  }))))))));
}
function KanbanBoard({
  deals,
  eff,
  move,
  logAction
}) {
  const ctx = useContext(AppCtx);
  const [dragId, setDragId] = useState(null);
  const [overStage, setOverStage] = useState(null);
  const drop = stage => {
    const d = deals.find(x => x.id === dragId);
    if (d && eff(d) !== stage) move(d, stage);
    setDragId(null);
    setOverStage(null);
  };
  return React.createElement("div", null, React.createElement("div", {
    className: "row gap-6 center mb-12 t-small",
    style: {
      color: "var(--text-muted)"
    }
  }, React.createElement(Icon, {
    name: "grid",
    size: 13
  }), " Drag a card to another column to move the deal between stages \u2014 or use the \u22EF menu."), React.createElement("div", {
    className: "scroll",
    style: {
      overflowX: "auto",
      paddingBottom: 8
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      minWidth: "min-content"
    }
  }, STAGES.map(stage => {
    const items = deals.filter(d => eff(d) === stage);
    const over = overStage === stage;
    return React.createElement("div", {
      key: stage,
      style: {
        width: 240,
        flex: "none"
      }
    }, React.createElement("div", {
      className: "row between center",
      style: {
        padding: "0 4px 10px"
      }
    }, React.createElement("div", {
      className: "row gap-6 center"
    }, React.createElement(StatusPill, {
      status: stage,
      dot: true
    }), React.createElement("span", {
      className: "num",
      style: {
        fontSize: 11,
        color: "var(--text-muted)",
        fontWeight: 600
      }
    }, items.length))), React.createElement("div", {
      className: "col gap-8 kanban-col" + (over ? " drop-over" : ""),
      style: {
        borderRadius: 10,
        padding: 8,
        minHeight: 150
      },
      onDragOver: e => {
        if (dragId != null) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          if (!over) setOverStage(stage);
        }
      },
      onDragLeave: e => {
        if (e.currentTarget === e.target) setOverStage(s => s === stage ? null : s);
      },
      onDrop: e => {
        e.preventDefault();
        drop(stage);
      }
    }, items.map(d => React.createElement("div", {
      key: d.id,
      className: "card card-hover kanban-card" + (dragId === d.id ? " dragging" : ""),
      style: {
        padding: 11
      },
      draggable: true,
      title: "Drag to move between stages",
      onDragStart: e => {
        setDragId(d.id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", d.id);
      },
      onDragEnd: () => {
        setDragId(null);
        setOverStage(null);
      },
      onClick: () => ctx.navigate("workspace", {
        id: d.id
      })
    }, React.createElement("div", {
      className: "row between center mb-8"
    }, React.createElement("div", {
      className: "row gap-7 center",
      style: {
        minWidth: 0
      }
    }, React.createElement("span", {
      className: "kanban-grip",
      "aria-hidden": "true"
    }), React.createElement(LogoTile, {
      initials: d.initials,
      sector: d.sector,
      size: 26
    }), React.createElement("span", {
      style: {
        fontWeight: 560,
        fontSize: 12.5
      },
      className: "truncate"
    }, d.name)), React.createElement("span", {
      onClick: e => e.stopPropagation()
    }, React.createElement(Menu, {
      items: dealMenu(ctx, d, move, logAction)
    }))), React.createElement("p", {
      className: "t-small",
      style: {
        lineHeight: 1.4,
        marginBottom: 9,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }
    }, d.take), React.createElement("div", {
      className: "row between center"
    }, React.createElement("span", {
      className: "tag",
      style: {
        fontSize: 10
      }
    }, d.sub), React.createElement(FitBar, {
      score: d.fit
    })))), items.length === 0 && React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "20px 0",
        color: over ? "var(--blue-600)" : "var(--gray-400)",
        fontSize: 11.5,
        fontWeight: over ? 560 : 400
      }
    }, over ? "Drop to move here" : "Drop deals here")));
  }))));
}
function ArchivedTable({
  deals,
  onRestore
}) {
  const ctx = useContext(AppCtx);
  if (deals.length === 0) return React.createElement("div", {
    className: "empty-state"
  }, React.createElement("span", {
    className: "empty-ic"
  }, React.createElement(Icon, {
    name: "folder",
    size: 26
  })), React.createElement("div", {
    className: "t-h3"
  }, "Nothing archived"), React.createElement("p", {
    className: "t-body"
  }, "Passed deals move here, out of your active pipeline."));
  return React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("div", {
    className: "row between center",
    style: {
      padding: "12px 16px",
      borderBottom: "1px solid var(--border)"
    }
  }, React.createElement("span", {
    className: "t-small"
  }, "Deals you've passed \u2014 kept for institutional memory, out of the active view.")), React.createElement("div", {
    className: "scroll",
    style: {
      overflowX: "auto"
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Company"), React.createElement("th", null, "Sector"), React.createElement("th", null, "Source"), React.createElement("th", null, "Reason passed"), React.createElement("th", null, "Passed"), React.createElement("th", {
    style: {
      width: 36
    }
  }))), React.createElement("tbody", null, deals.map(d => React.createElement("tr", {
    key: d.id,
    onClick: () => ctx.navigate("workspace", {
      id: d.id
    })
  }, React.createElement("td", null, React.createElement("span", {
    className: "row gap-10 center"
  }, React.createElement(LogoTile, {
    initials: d.initials,
    sector: d.sector,
    size: 30
  }), React.createElement("span", {
    style: {
      fontWeight: 540
    }
  }, d.name))), React.createElement("td", null, React.createElement("div", {
    style: {
      fontSize: 12.5
    }
  }, d.sector), React.createElement("div", {
    className: "t-small"
  }, d.sub)), React.createElement("td", {
    className: "t-small"
  }, d.source), React.createElement("td", {
    className: "t-small",
    style: {
      maxWidth: 280
    }
  }, d.passReason || "—"), React.createElement("td", {
    className: "t-small nowrap"
  }, d.passedDate ? fmtDate(d.passedDate) : "—"), React.createElement("td", {
    onClick: e => e.stopPropagation()
  }, React.createElement(Menu, {
    items: [{
      icon: "eye",
      text: "Open workspace",
      onClick: () => ctx.navigate("workspace", {
        id: d.id
      })
    }, {
      icon: "refresh",
      text: "Restore to pipeline",
      onClick: () => onRestore(d)
    }]
  }))))))));
}
function EmailAutomationDrawer({
  onClose
}) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [applied, setApplied] = useState({});
  const isApplied = (eid, i, base) => applied[eid + ":" + i] !== undefined ? applied[eid + ":" + i] : base;
  return React.createElement(Drawer, {
    onClose: onClose
  }, React.createElement("div", {
    className: "modal-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "row gap-8 center mb-4"
  }, React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "var(--blue-50)",
      color: "var(--blue-600)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "mail",
    size: 15
  })), React.createElement("h2", {
    className: "t-h2"
  }, "Email \u2192 Status")), React.createElement("p", {
    className: "t-body"
  }, "The AI read these emails and the \"next steps\" tables inside them.")), React.createElement("button", {
    className: "x-btn",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), React.createElement("div", {
    className: "modal-body scroll",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, db.inbox.map(e => React.createElement("div", {
    key: e.id,
    className: "card card-pad"
  }, React.createElement("div", {
    className: "row gap-10 center mb-8"
  }, React.createElement("span", {
    className: "feed-ic",
    style: {
      background: "var(--bg-sunken)",
      color: "var(--text-secondary)"
    }
  }, React.createElement(Icon, {
    name: "mail",
    size: 14
  })), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 560
    },
    className: "truncate"
  }, e.subject), React.createElement("div", {
    className: "t-small"
  }, e.from, " \xB7 ", e.time))), React.createElement("p", {
    className: "t-small",
    style: {
      fontStyle: "italic",
      marginBottom: 10
    }
  }, "\"", e.preview, "\""), React.createElement("div", {
    className: "label mb-8"
  }, "Detected next steps"), React.createElement("div", {
    className: "col gap-8"
  }, e.updates.map((u, i) => {
    const deal = db.dealById(u.deal);
    const on = isApplied(e.id, i, u.applied);
    return React.createElement("div", {
      key: i,
      className: "card",
      style: {
        padding: 11,
        background: "var(--bg-subtle)"
      }
    }, React.createElement("div", {
      className: "row between center mb-4"
    }, React.createElement("span", {
      style: {
        fontWeight: 540,
        fontSize: 12.5
      }
    }, deal ? deal.name : u.deal), u.from !== u.to ? React.createElement("span", {
      className: "row gap-5 center t-small"
    }, React.createElement(StatusPill, {
      status: u.from,
      dot: false
    }), React.createElement(Icon, {
      name: "arrowRight",
      size: 12,
      style: {
        color: "var(--text-muted)"
      }
    }), React.createElement(StatusPill, {
      status: u.to,
      dot: false
    })) : React.createElement("span", {
      className: "tag"
    }, "No status change")), React.createElement("div", {
      className: "t-small",
      style: {
        marginBottom: 8
      }
    }, u.step), on ? React.createElement("span", {
      className: "row gap-5 center",
      style: {
        color: "var(--green-600)",
        fontSize: 11.5,
        fontWeight: 560
      }
    }, React.createElement(Icon, {
      name: "checkCircle",
      size: 13
    }), " Applied automatically") : React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: () => {
        setApplied(p => ({
          ...p,
          [e.id + ":" + i]: true
        }));
        ctx.toast("Applied — " + (deal ? deal.name : u.deal) + " updated", "check");
      }
    }, React.createElement(Icon, {
      name: "check",
      size: 12
    }), " Apply update"));
  }))))), React.createElement("div", {
    className: "modal-foot"
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Close"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      onClose();
      ctx.toast("All email updates applied", "check");
    }
  }, React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Apply all")));
}
function ExcelImportModal({
  onClose
}) {
  const ctx = useContext(AppCtx);
  const cols = [{
    x: "Company",
    to: "Name",
    ok: true
  }, {
    x: "Sector",
    to: "Sector",
    ok: true
  }, {
    x: "Banker",
    to: "Source",
    ok: true
  }, {
    x: "Rev ($m)",
    to: "Revenue",
    ok: true
  }, {
    x: "EBITDA",
    to: "EBITDA",
    ok: true
  }, {
    x: "Stage",
    to: "Status",
    ok: true
  }, {
    x: "Notes",
    to: "Next step / note",
    ok: true
  }];
  return React.createElement(Modal, {
    onClose: onClose,
    size: "modal-lg"
  }, React.createElement("div", {
    className: "modal-head"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "t-h2"
  }, "Import Excel tracker"), React.createElement("p", {
    className: "t-body"
  }, "We detected your existing tracker. Columns are auto-mapped \u2014 review and import.")), React.createElement("button", {
    className: "x-btn",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    className: "card",
    style: {
      padding: 12,
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
      borderColor: "var(--green-100)",
      background: "var(--green-50)"
    }
  }, React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: "#fff",
      color: "var(--green-600)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "table",
    size: 15
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 540
    }
  }, "Paragon_Pipeline_Tracker.xlsx"), React.createElement("div", {
    className: "t-small"
  }, "1,240 rows \xB7 18 columns detected")), React.createElement("span", {
    className: "pill pill-ready"
  }, React.createElement("span", {
    className: "dot"
  }), "Parsed")), React.createElement("div", {
    className: "label mb-8"
  }, "Column mapping"), React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("table", {
    className: "dtable",
    style: {
      fontSize: 12.5
    }
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Excel column"), React.createElement("th", null, "Maps to"), React.createElement("th", null, "Status"))), React.createElement("tbody", null, cols.map(c => React.createElement("tr", {
    key: c.x,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", {
    className: "mono",
    style: {
      fontSize: 12
    }
  }, c.x), React.createElement("td", {
    style: {
      fontWeight: 540
    }
  }, c.to), React.createElement("td", null, React.createElement("span", {
    className: "row gap-5 center",
    style: {
      color: "var(--green-600)"
    }
  }, React.createElement(Icon, {
    name: "check",
    size: 13
  }), " Mapped")))))))), React.createElement("div", {
    className: "modal-foot"
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      onClose();
      ctx.toast("Imported 1,240 rows into the pipeline", "check");
    }
  }, React.createElement(Icon, {
    name: "upload",
    size: 14
  }), " Import 1,240 rows")));
}
function WeeklyReview({
  deals
}) {
  const ctx = useContext(AppCtx);
  const [idx, setIdx] = useState(0);
  const [decisions, setDecisions] = useState({});
  const d = deals[idx];
  const decide = verb => {
    setDecisions(p => ({
      ...p,
      [d.id]: verb
    }));
    ctx.toast(d.name + " → " + verb, verb === "Pass" ? "flag" : "check");
    if (idx < deals.length - 1) setTimeout(() => setIdx(i => i + 1), 250);
  };
  if (!d) return null;
  return React.createElement("div", null, React.createElement("div", {
    className: "row between center mb-16"
  }, React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement("span", {
    className: "t-small"
  }, "Monday triage \xB7 batching ", deals.length, " new deals into minutes, not hours.")), React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => ctx.toast("Weekly pipeline PDF generated & sent to the team", "check")
  }, React.createElement(Icon, {
    name: "download",
    size: 13
  }), " Weekly PDF"), React.createElement("span", {
    className: "num t-small"
  }, idx + 1, " / ", deals.length), React.createElement("button", {
    className: "btn btn-icon btn-secondary btn-sm",
    disabled: idx === 0,
    onClick: () => setIdx(i => Math.max(0, i - 1))
  }, React.createElement(Icon, {
    name: "chevLeft",
    size: 15
  })), React.createElement("button", {
    className: "btn btn-icon btn-secondary btn-sm",
    disabled: idx === deals.length - 1,
    onClick: () => setIdx(i => Math.min(deals.length - 1, i + 1))
  }, React.createElement(Icon, {
    name: "chevRight",
    size: 15
  })))), React.createElement("div", {
    className: "row gap-4 mb-16",
    style: {
      height: 4
    }
  }, deals.map((x, i) => React.createElement("div", {
    key: x.id,
    style: {
      flex: 1,
      borderRadius: 2,
      background: i === idx ? "var(--blue-500)" : decisions[x.id] ? decisions[x.id] === "Pass" ? "var(--red-300, #f8cfcf)" : "var(--green-300, #c8ecd7)" : "var(--gray-200)"
    }
  }))), React.createElement("div", {
    className: "card fade-cycle",
    key: d.id,
    style: {
      overflow: "hidden"
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr"
    }
  }, React.createElement("div", {
    style: {
      padding: 26,
      borderRight: "1px solid var(--border)"
    }
  }, React.createElement("div", {
    className: "row gap-14 center mb-16"
  }, React.createElement(LogoTile, {
    initials: d.initials,
    sector: d.sector,
    size: 52
  }), React.createElement("div", null, React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("h2", {
    className: "t-h1"
  }, d.name), React.createElement("span", {
    className: "pill pill-new"
  }, "NEW")), React.createElement("div", {
    className: "t-body"
  }, d.desc))), React.createElement("div", {
    className: "row gap-8 wrap mb-16"
  }, React.createElement("span", {
    className: "tag"
  }, d.sector, " \xB7 ", d.sub), React.createElement("span", {
    className: "tag"
  }, d.strategy), React.createElement("span", {
    className: "tag"
  }, React.createElement(Icon, {
    name: "mail",
    size: 11
  }), " via ", d.source), React.createElement("span", {
    className: "tag"
  }, React.createElement(Icon, {
    name: "pin",
    size: 11
  }), " ", d.geo)), React.createElement("div", {
    className: "card-pad",
    style: {
      background: "var(--blue-50)",
      borderRadius: 10,
      border: "1px solid var(--blue-100)"
    }
  }, React.createElement("div", {
    className: "row gap-7 center mb-8"
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 14,
    style: {
      color: "var(--blue-600)"
    }
  }), React.createElement("span", {
    className: "label",
    style: {
      color: "var(--blue-700)"
    }
  }, "AI Take")), React.createElement("p", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.6,
      color: "var(--text-primary)"
    }
  }, d.thesis)), React.createElement("div", {
    className: "card-pad",
    style: {
      marginTop: 12,
      background: "var(--bg-subtle)",
      borderRadius: 10,
      border: "1px solid var(--border)"
    }
  }, React.createElement("div", {
    className: "row gap-7 center mb-8"
  }, React.createElement(Icon, {
    name: "mail",
    size: 13,
    style: {
      color: "var(--text-muted)"
    }
  }), React.createElement("span", {
    className: "label"
  }, "Banker email context")), React.createElement("p", {
    style: {
      fontSize: 12.5,
      lineHeight: 1.55,
      color: "var(--text-secondary)",
      fontStyle: "italic"
    }
  }, "\"", d.source, " reaching out on a proprietary basis ahead of broad launch. Management open to a partnership structure. First-round bids targeted for early Q3. Happy to set up a call.\""))), React.createElement("div", {
    style: {
      padding: 26,
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("span", {
    className: "label",
    style: {
      marginBottom: 12
    }
  }, "Extracted metrics"), React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: "1fr 1fr",
      gap: 14,
      marginBottom: 18
    }
  }, React.createElement(WRMetric, {
    label: "Revenue",
    v: d.revenue != null ? "$" + d.revenue + "M" : "—",
    sub: d.revYoY ? "+" + d.revYoY + "% YoY" : ""
  }), React.createElement(WRMetric, {
    label: "EBITDA",
    v: d.ebitda != null ? "$" + d.ebitda + "M" : "—",
    sub: d.ebitdaYoY ? "+" + d.ebitdaYoY + "% YoY" : ""
  }), React.createElement(WRMetric, {
    label: "Ask / Valuation",
    v: d.ask != null ? "$" + d.ask + "M" : "—",
    sub: d.revenue ? (d.ask / d.revenue).toFixed(1) + "x rev" : ""
  }), React.createElement(WRMetric, {
    label: "Employees",
    v: d.employees,
    sub: "Founded " + d.founded
  })), React.createElement("div", {
    className: "row between center mb-12",
    style: {
      padding: "12px 0",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)"
    }
  }, React.createElement("span", {
    className: "label"
  }, "Thesis fit"), React.createElement("div", {
    style: {
      width: 140
    }
  }, React.createElement(FitBar, {
    score: d.fit
  }))), React.createElement("div", {
    style: {
      flex: 1
    }
  }), decisions[d.id] && React.createElement("div", {
    className: "row gap-7 center mb-12",
    style: {
      color: decisions[d.id] === "Pass" ? "var(--red-600)" : "var(--green-600)",
      fontSize: 12.5,
      fontWeight: 560
    }
  }, React.createElement(Icon, {
    name: "checkCircle",
    size: 15
  }), " Decision recorded: ", decisions[d.id]), React.createElement("div", {
    className: "grid gap-8",
    style: {
      gridTemplateColumns: "1fr 1fr 1fr"
    }
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => decide("Pass")
  }, React.createElement(Icon, {
    name: "x",
    size: 14
  }), " Pass"), React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => decide("Discuss")
  }, React.createElement(Icon, {
    name: "users",
    size: 14
  }), " Discuss"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => decide("Pursue")
  }, React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Pursue")), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      marginTop: 10,
      justifyContent: "center"
    },
    onClick: () => ctx.navigate("workspace", {
      id: d.id
    })
  }, "Open full workspace ", React.createElement(Icon, {
    name: "arrowRight",
    size: 13
  }))))));
}
function WRMetric({
  label,
  v,
  sub
}) {
  return React.createElement("div", null, React.createElement("div", {
    className: "metric-label",
    style: {
      marginBottom: 4
    }
  }, label), React.createElement("div", {
    className: "num",
    style: {
      fontSize: 19,
      fontWeight: 650
    }
  }, v), sub && React.createElement("div", {
    className: "metric-delta delta-up",
    style: {
      marginTop: 2
    }
  }, sub));
}
function fmtDate(s) {
  const d = new Date(s);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}
window.DealFlowView = DealFlowView;
window.EmailAutomationDrawer = EmailAutomationDrawer;
window.fmtDate = fmtDate;
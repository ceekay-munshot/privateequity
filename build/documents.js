function DocumentsView({
  params
}) {
  const db = window.DB;
  const [tab, setTab] = useState(params && params.tab || "files");
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement(PageHead, {
    title: "Documents",
    sub: "Every file, indexed and queryable \u2014 across deals and companies."
  }), React.createElement("div", {
    className: "mb-16"
  }, React.createElement(Seg, {
    value: tab,
    onChange: setTab,
    options: [{
      value: "files",
      label: "Deal Files",
      icon: "folder"
    }, {
      value: "query",
      label: "Document Query",
      icon: "search"
    }, {
      value: "clauses",
      label: "Key Clauses",
      icon: "scale"
    }, {
      value: "sources",
      label: "Ingestion Sources",
      icon: "api"
    }]
  })), tab === "files" && React.createElement(FilesTab, null), tab === "query" && React.createElement(window.QueryBuilder, null), tab === "clauses" && React.createElement(KeyClauses, null), tab === "sources" && React.createElement(IngestionSources, null));
}
function FilesTab() {
  const db = window.DB;
  const ctx = useContext(AppCtx);
  const [sync, setSync] = useState(true);
  const [showFolder, setShowFolder] = useState(false);
  return React.createElement("div", null, React.createElement("div", {
    className: "row between center mb-14"
  }, React.createElement("div", {
    className: "t-small"
  }, db.files.length, " files \xB7 29.1 MB"), React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement("div", {
    className: "global-search",
    style: {
      width: 240,
      height: 34
    }
  }, React.createElement(Icon, {
    name: "search",
    size: 15
  }), React.createElement("input", {
    placeholder: "Search files\u2026",
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      fontFamily: "inherit",
      fontSize: 13
    }
  })), React.createElement(Menu, {
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
      text: "Add Folder",
      onClick: () => setShowFolder(true)
    }]
  }))), React.createElement(window.FilesTable, {
    files: db.files
  }), showFolder && React.createElement(Modal, {
    onClose: () => setShowFolder(false)
  }, React.createElement("div", {
    className: "modal-head"
  }, React.createElement("h2", {
    className: "t-h2"
  }, "Add Folder"), React.createElement("button", {
    className: "x-btn",
    onClick: () => setShowFolder(false)
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), React.createElement("div", {
    className: "modal-body"
  }, React.createElement("div", {
    style: {
      border: "2px dashed var(--border-strong)",
      borderRadius: 12,
      padding: 32,
      textAlign: "center",
      background: "var(--bg-subtle)",
      marginBottom: 14
    }
  }, React.createElement("span", {
    className: "empty-ic",
    style: {
      margin: "0 auto 10px"
    }
  }, React.createElement(Icon, {
    name: "folder",
    size: 22
  })), React.createElement("div", {
    className: "t-h3"
  }, "Drop a folder here"), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    style: {
      margin: "10px auto 0"
    }
  }, "Select Folder")), React.createElement("p", {
    className: "t-small mb-16"
  }, "Supported: PDF, CSV, XLS, XLSX, XLSM, TXT, DOC, DOCX, PPT, PPTX"), React.createElement("div", {
    className: "card",
    style: {
      padding: 13,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 540
    }
  }, "Enable Folder Sync"), React.createElement("div", {
    className: "t-small"
  }, "Keeps the folder continuously synced. Supported in Chrome, Edge & Opera.")), React.createElement("div", {
    className: "toggle" + (sync ? " on" : ""),
    onClick: () => setSync(s => !s)
  }))), React.createElement("div", {
    className: "modal-foot"
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setShowFolder(false)
  }, "Cancel"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setShowFolder(false);
      ctx.toast("Folder uploading & syncing…", "ai");
    }
  }, React.createElement(Icon, {
    name: "upload",
    size: 14
  }), " Upload Folder"))));
}
function QueryBuilder({
  embedded
}) {
  const ctx = useContext(AppCtx);
  const [scope, setScope] = useState("loan documents");
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const examples = ["What was the interest rate and key covenants in this facility?", "What was the lead investor's stance in the pre-Series A round?", "Compare the change-of-control clauses across these three companies"];
  const ask = text => {
    const query = text || q;
    if (!query.trim()) return;
    setQ(query);
    setLoading(true);
    setAnswer(null);
    setTimeout(() => {
      setLoading(false);
      setAnswer(query.toLowerCase().includes("compare"));
    }, 1100);
  };
  return React.createElement("div", {
    style: {
      maxWidth: embedded ? "none" : 880
    }
  }, !embedded && React.createElement("div", {
    className: "row gap-10 center mb-14"
  }, React.createElement("span", {
    className: "label"
  }, "Scope"), React.createElement("select", {
    className: "select",
    style: {
      width: 220
    },
    value: scope,
    onChange: e => setScope(e.target.value)
  }, React.createElement("option", null, "loan documents"), React.createElement("option", null, "Meridian Surgical"), React.createElement("option", null, "3 selected companies"), React.createElement("option", null, "all documents")), React.createElement("span", {
    className: "t-small"
  }, "Conversational Q&A over your indexed corpus.")), React.createElement("div", {
    className: "card card-pad",
    style: {
      marginBottom: 16
    }
  }, React.createElement("div", {
    className: "global-search active",
    style: {
      maxWidth: "none",
      height: 46,
      background: "#fff"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 18,
    style: {
      color: "var(--violet-500)"
    }
  }), React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: e => e.key === "Enter" && ask(),
    placeholder: "Ask anything about these documents\u2026",
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      fontFamily: "inherit",
      fontSize: 14.5,
      color: "var(--text-primary)"
    }
  }), React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => ask()
  }, "Ask ", React.createElement(Icon, {
    name: "arrowRight",
    size: 13
  }))), React.createElement("div", {
    className: "row gap-8 wrap mt-12"
  }, examples.map(ex => React.createElement("button", {
    key: ex,
    className: "chip",
    style: {
      fontSize: 12
    },
    onClick: () => ask(ex)
  }, ex)))), loading && React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "row gap-8 center mb-12",
    style: {
      color: "var(--violet-500)"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 15
  }), " ", React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 540
    }
  }, "Reading documents & extracting citations\u2026")), React.createElement("div", {
    className: "skel",
    style: {
      height: 9,
      marginBottom: 8
    }
  }), React.createElement("div", {
    className: "skel",
    style: {
      height: 9,
      width: "85%",
      marginBottom: 8
    }
  }), React.createElement("div", {
    className: "skel",
    style: {
      height: 9,
      width: "60%"
    }
  })), answer === false && React.createElement("div", {
    className: "card card-pad fade-cycle"
  }, React.createElement("div", {
    className: "label mb-8"
  }, "Answer"), React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      marginBottom: 14
    }
  }, "The facility carries a floating rate of ", React.createElement(Prov, {
    value: "SOFR + 425bps",
    metric: "default",
    conf: "verified"
  }), " with a 0.50% floor. Two financial maintenance covenants apply: a maximum ", React.createElement("strong", null, "Net Leverage of 4.75x"), " ", React.createElement(Cite, {
    n: 1
  }), " stepping down to 4.25x, and a minimum ", React.createElement("strong", null, "Fixed-Charge Coverage of 1.50x"), " ", React.createElement(Cite, {
    n: 2
  }), ". A springing covenant is tested only when revolver utilization exceeds 35%."), React.createElement("div", {
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
  }, "Critic AI \xB7 verified"), React.createElement("div", {
    className: "t-small"
  }, "Both covenant figures cross-checked against the credit agreement (pp. 84, 86). No discrepancy.")))), answer === true && React.createElement("div", {
    className: "card card-pad fade-cycle"
  }, React.createElement("div", {
    className: "label mb-12"
  }, "Side-by-side comparison \xB7 Change-of-control clauses"), React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Provision"), React.createElement("th", null, "Meridian"), React.createElement("th", null, "Northwind"), React.createElement("th", null, "Cobalt"))), React.createElement("tbody", null, [["CoC trigger", "&gt;50% voting", "&gt;50% voting", "&gt;33% voting"], ["Acceleration", "Mandatory prepay", "Lender option", "Mandatory prepay"], ["Prepay premium", "101%", "102% → 101%", "Par"], ["Board consent", "Required", "Not required", "Required"]].map((r, i) => React.createElement("tr", {
    key: i,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", {
    style: {
      fontWeight: 540
    }
  }, r[0]), r.slice(1).map((c, j) => React.createElement("td", {
    key: j
  }, React.createElement("span", {
    className: "row gap-6 center",
    dangerouslySetInnerHTML: {
      __html: c
    }
  }))))))), React.createElement("div", {
    className: "row gap-6 center mt-12"
  }, React.createElement(Cite, {
    n: 1
  }), React.createElement(Cite, {
    n: 2
  }), React.createElement(Cite, {
    n: 3
  }), React.createElement("span", {
    className: "t-small"
  }, "Each cell links to the source clause & page."))));
}
function KeyClauses() {
  const rows = [{
    co: "Meridian Surgical",
    rate: "SOFR + 425",
    lev: "4.75x",
    fcc: "1.50x",
    coc: ">50%",
    exit: "Drag at 2x"
  }, {
    co: "Northwind Logistics",
    rate: "SOFR + 375",
    lev: "5.00x",
    fcc: "1.25x",
    coc: ">50%",
    exit: "Tag/Drag"
  }, {
    co: "Cobalt Cloud",
    rate: "SOFR + 500",
    lev: "4.25x",
    fcc: "1.75x",
    coc: ">33%",
    exit: "Drag at 2.5x"
  }, {
    co: "Harborstone Foods",
    rate: "Fixed 7.2%",
    lev: "4.00x",
    fcc: "1.50x",
    coc: ">50%",
    exit: "Put @ yr5"
  }];
  return React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden",
      maxWidth: 980
    }
  }, React.createElement("div", {
    className: "row between center",
    style: {
      padding: "12px 16px",
      borderBottom: "1px solid var(--border)"
    }
  }, React.createElement("span", {
    className: "t-small"
  }, "A fixed set of key clauses extracted per document \u2014 compare across companies at a glance."), React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, React.createElement(Icon, {
    name: "download",
    size: 13
  }), " Export")), React.createElement("div", {
    className: "scroll",
    style: {
      overflowX: "auto"
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Company"), React.createElement("th", null, "Interest Rate"), React.createElement("th", null, "Max Leverage"), React.createElement("th", null, "Min FCC"), React.createElement("th", null, "CoC Trigger"), React.createElement("th", null, "Exit Terms"))), React.createElement("tbody", null, rows.map(r => React.createElement("tr", {
    key: r.co,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", {
    style: {
      fontWeight: 560
    }
  }, r.co), React.createElement("td", null, React.createElement("span", {
    className: "row gap-6 center"
  }, React.createElement(ConfDot, {
    level: "verified"
  }), React.createElement("span", {
    className: "num"
  }, r.rate))), React.createElement("td", {
    className: "num"
  }, r.lev), React.createElement("td", {
    className: "num"
  }, r.fcc), React.createElement("td", {
    className: "num"
  }, r.coc), React.createElement("td", {
    className: "t-small"
  }, r.exit)))))));
}
function IngestionSources() {
  const db = window.DB;
  const ctx = useContext(AppCtx);
  return React.createElement("div", {
    style: {
      maxWidth: 800
    }
  }, React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14,
      padding: "14px 16px",
      display: "flex",
      gap: 12,
      alignItems: "center",
      borderColor: "var(--blue-200)",
      background: "linear-gradient(90deg, var(--blue-50), #fff 70%)"
    }
  }, React.createElement("span", {
    className: "feed-ic",
    style: {
      background: "var(--blue-100)",
      color: "var(--blue-600)"
    }
  }, React.createElement(Icon, {
    name: "mail",
    size: 16
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 560
    }
  }, "Deal intake"), React.createElement("div", {
    className: "t-small"
  }, "Everything forwarded to ", React.createElement("strong", {
    style: {
      color: "var(--text-secondary)"
    }
  }, db.intakeEmail), " is ingested, indexed and filed to the right deal. Deals only change stage when you move them.")), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => ctx.navigate("settings")
  }, "Access control ", React.createElement(Icon, {
    name: "arrowRight",
    size: 13
  }))), React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, db.ingestion.map((s, i) => React.createElement("div", {
    key: s.name,
    className: "row between center",
    style: {
      padding: "13px 16px",
      borderBottom: i < db.ingestion.length - 1 ? "1px solid var(--border)" : "none"
    }
  }, React.createElement("div", {
    className: "row gap-12 center"
  }, React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: "var(--bg-sunken)",
      color: "var(--text-secondary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: s.icon,
    size: 16
  })), React.createElement("div", null, React.createElement("div", {
    className: "row gap-7 center"
  }, React.createElement("span", {
    style: {
      fontWeight: 540,
      fontSize: 13
    }
  }, s.name), s.category && React.createElement("span", {
    className: "tag",
    style: {
      fontSize: 10
    }
  }, s.category)), React.createElement("div", {
    className: "t-small"
  }, s.detail))), React.createElement("div", {
    className: "row gap-14 center"
  }, React.createElement("span", {
    className: "t-small num"
  }, s.sync), React.createElement(StatusPill, {
    status: s.status
  }), React.createElement(Menu, {
    items: [{
      icon: "refresh",
      text: "Sync now"
    }, {
      icon: "settings",
      text: "Configure"
    }, {
      sep: true
    }, {
      icon: "x",
      text: s.status === "Paused" ? "Resume" : "Pause"
    }]
  }))))), React.createElement("div", {
    className: "row gap-10 center",
    style: {
      marginTop: 14
    }
  }, React.createElement("button", {
    className: "btn btn-secondary"
  }, React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " Connect a source"), React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => ctx.navigate("settings")
  }, React.createElement(Icon, {
    name: "shield",
    size: 14
  }), " Access control")));
}
window.DocumentsView = DocumentsView;
window.QueryBuilder = QueryBuilder;
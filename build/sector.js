function SectorView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement(PageHead, {
    title: "Sector Intelligence",
    sub: "An always-on aggregation layer \u2014 the firehose of news, broker reports & filings turned into tracked, alerting views."
  }, React.createElement("button", {
    className: "btn btn-secondary"
  }, React.createElement(Icon, {
    name: "bell",
    size: 15
  }), " Manage alerts"), React.createElement("button", {
    className: "btn btn-primary"
  }, React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " Track Sector")), React.createElement("div", {
    className: "grid gap-16",
    style: {
      gridTemplateColumns: "1fr 1fr"
    }
  }, db.sectors.map(s => React.createElement("div", {
    key: s.id,
    className: "card card-hover card-pad pointer",
    onClick: () => ctx.navigate("sectorco", {
      id: s.id
    })
  }, React.createElement("div", {
    className: "row between center mb-12"
  }, React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: s.color + "1a",
      color: s.color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "sector",
    size: 20
  })), React.createElement("div", null, React.createElement("div", {
    className: "t-h3"
  }, s.name), React.createElement("div", {
    className: "t-small"
  }, s.note))), React.createElement("span", {
    className: "pill pill-new"
  }, React.createElement("span", {
    className: "dot"
  }), s.signals, " new")), React.createElement("div", {
    className: "row between center",
    style: {
      paddingTop: 12,
      borderTop: "1px solid var(--border)"
    }
  }, React.createElement("span", {
    className: "row gap-6 center t-small"
  }, React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "var(--green-500)"
    }
  }), " Updated ", s.fresh), React.createElement("span", {
    className: "row gap-5 center t-small",
    style: {
      color: "var(--blue-600)",
      fontWeight: 540
    }
  }, "Open briefing ", React.createElement(Icon, {
    name: "arrowRight",
    size: 13
  })))))));
}
function SectorCoView({
  params
}) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const id = params && params.id || "pharma";
  const sector = db.sectors.find(s => s.id === id) || db.sectors[0];
  const brief = db.briefing[id] || db.briefing.pharma;
  const [tab, setTab] = useState(params && params.tab || "briefing");
  const showPharma = id === "pharma";
  const showMemory = !!sector.memory;
  const mem = db.institutional[id];
  const tenders = db.tenders.filter(t => t.sector === id);
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement("div", {
    className: "row gap-10 center mb-16"
  }, React.createElement("button", {
    className: "btn btn-icon btn-secondary btn-sm",
    onClick: () => ctx.navigate("sector")
  }, React.createElement(Icon, {
    name: "chevLeft",
    size: 15
  })), React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: sector.color + "1a",
      color: sector.color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "sector",
    size: 19
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("h1", {
    className: "t-h1"
  }, sector.name), React.createElement("div", {
    className: "t-body"
  }, sector.note, " \xB7 multi-year thematic horizon")), React.createElement("span", {
    className: "pill pill-ready"
  }, React.createElement("span", {
    className: "dot"
  }), "Live \xB7 ", sector.fresh)), React.createElement("div", {
    className: "mb-16"
  }, React.createElement(Seg, {
    value: tab,
    onChange: setTab,
    options: [{
      value: "briefing",
      label: "Briefing",
      icon: "fileText"
    }, {
      value: "signals",
      label: "Signals & Alerts",
      icon: "bell"
    }, ...(tenders.length ? [{
      value: "tenders",
      label: "Tenders & Policy",
      icon: "scale"
    }] : []), ...(showPharma ? [{
      value: "trackers",
      label: "Trackers",
      icon: "grid"
    }] : []), ...(showMemory ? [{
      value: "memory",
      label: "Institutional Memory",
      icon: "database"
    }] : []), {
      value: "explore",
      label: "Explore",
      icon: "sparkles"
    }, {
      value: "sources",
      label: "Sources",
      icon: "database"
    }]
  })), tab === "briefing" && React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 300px",
      gap: 20,
      alignItems: "start"
    }
  }, React.createElement("div", {
    className: "col gap-12"
  }, brief.map((b, i) => React.createElement("div", {
    key: i,
    className: "card card-hover card-pad"
  }, React.createElement("div", {
    className: "row between center mb-8"
  }, React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("span", {
    className: "pill " + (b.sentiment === "opportunity" ? "pill-ready" : "pill-neutral"),
    style: {
      fontSize: 10
    }
  }, b.topic), React.createElement("span", {
    className: "t-small"
  }, b.date)), React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("span", {
    className: "tag",
    style: {
      fontSize: 10
    }
  }, React.createElement(Icon, {
    name: "layers",
    size: 10
  }), " ", b.count, " sources bundled"), React.createElement(Menu, {
    items: [{
      icon: "bell",
      text: "Set alert on this topic"
    }, {
      icon: "sourceDoc",
      text: "View all sources"
    }, {
      icon: "sparkles",
      text: "Summarize for memo",
      onClick: () => ctx.toast("Adding to research note…", "ai")
    }]
  }))), React.createElement("h3", {
    className: "t-h3",
    style: {
      marginBottom: 6,
      lineHeight: 1.35
    }
  }, b.title), React.createElement("p", {
    className: "t-body",
    style: {
      marginBottom: 10
    }
  }, b.summary), React.createElement("div", {
    className: "row gap-6 wrap"
  }, b.sources.map(s => React.createElement("span", {
    key: s,
    className: "cite-chip"
  }, React.createElement(Icon, {
    name: "globe",
    size: 9
  }), " ", s)))))), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Sentiment Tracker"), React.createElement(Icon, {
    name: "chat",
    size: 14,
    style: {
      color: "var(--text-muted)"
    }
  })), React.createElement("p", {
    className: "t-small mb-12"
  }, "Product sentiment scraped from forums, Reddit & customer channels."), React.createElement("div", {
    className: "row gap-16 center mb-12"
  }, React.createElement("div", null, React.createElement("div", {
    className: "metric-label"
  }, "Net positive"), React.createElement("div", {
    className: "num",
    style: {
      fontSize: 22,
      fontWeight: 660,
      color: "var(--green-600)"
    }
  }, "+54")), React.createElement("div", {
    className: "metric-delta delta-up"
  }, React.createElement(Icon, {
    name: "arrowUp",
    size: 11
  }), " +9 vs last month")), React.createElement(SentimentChart, {
    data: db.sentiment
  }))), tab === "signals" && React.createElement("div", {
    className: "col gap-10",
    style: {
      maxWidth: 760
    }
  }, [{
    sev: "warn",
    ic: "alert",
    t: "Government notifies expanded PLI scheme for API manufacturing",
    d: "Relevant to 2 watchlist names · published 3h ago",
    tag: "Policy"
  }, {
    sev: "",
    ic: "trending",
    t: "New tender floated: state procurement of oncology biosimilars",
    d: "Tender portal · closes in 21 days",
    tag: "Tender"
  }, {
    sev: "",
    ic: "pkg",
    t: "Funding round: clinical-skincare challenger raises Series C at 6x fwd revenue",
    d: "Direct comp to Lumen Skincare diligence",
    tag: "Funding"
  }, {
    sev: "warn",
    ic: "calendar",
    t: "Patent cliff: Zelbrava ($7.2B) loses exclusivity Q3 2027",
    d: "Opportunity window opening for biosimilar entrants",
    tag: "Patent"
  }].map((a, i) => React.createElement("div", {
    key: i,
    className: "alert-row " + a.sev
  }, React.createElement("span", {
    className: "alert-ic",
    style: {
      background: a.sev === "warn" ? "var(--amber-100)" : "var(--blue-100)",
      color: a.sev === "warn" ? "var(--amber-600)" : "var(--blue-600)"
    }
  }, React.createElement(Icon, {
    name: a.ic,
    size: 16
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    className: "row gap-8 center mb-4"
  }, React.createElement("span", {
    style: {
      fontWeight: 560,
      fontSize: 13
    }
  }, a.t)), React.createElement("div", {
    className: "t-small"
  }, a.d)), React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("span", {
    className: "tag"
  }, a.tag), React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, React.createElement(Icon, {
    name: "bell",
    size: 12
  }), " Alert"))))), tab === "trackers" && showPharma && React.createElement("div", {
    className: "col gap-16"
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Drug Launch Tracker"), React.createElement("span", {
    className: "tag"
  }, "cross-company pricing")), React.createElement("table", {
    className: "dtable",
    style: {
      fontSize: 12
    }
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Drug"), React.createElement("th", null, "Molecule"), React.createElement("th", {
    className: "num"
  }, "Price"), React.createElement("th", {
    className: "num"
  }, "vs comp"), React.createElement("th", null, "Status"))), React.createElement("tbody", null, db.drugLaunch.map(d => React.createElement("tr", {
    key: d.drug,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", null, React.createElement("div", {
    style: {
      fontWeight: 560
    }
  }, d.drug), React.createElement("div", {
    className: "t-small"
  }, d.company)), React.createElement("td", {
    className: "t-small"
  }, d.molecule), React.createElement("td", {
    className: "num"
  }, "$", d.price.toLocaleString()), React.createElement("td", {
    className: "num"
  }, React.createElement("span", {
    style: {
      color: d.price < d.comp ? "var(--green-600)" : "var(--red-600)",
      fontWeight: 560
    }
  }, d.price < d.comp ? "−" : "+", Math.abs(Math.round((d.price / d.comp - 1) * 100)), "%")), React.createElement("td", null, React.createElement(StatusPill, {
    status: d.status,
    dot: false
  }))))))), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Patent Cliff Calendar"), React.createElement(Icon, {
    name: "calendar",
    size: 14,
    style: {
      color: "var(--text-muted)"
    }
  })), React.createElement("p", {
    className: "t-small mb-12"
  }, "Upcoming expiries \u2014 opportunity window highlighted."), React.createElement("div", {
    className: "col gap-12"
  }, db.patentCliff.map(d => React.createElement("div", {
    key: d.drug
  }, React.createElement("div", {
    className: "row between center mb-4"
  }, React.createElement("span", {
    className: "row gap-7 center"
  }, React.createElement("span", {
    style: {
      fontWeight: 560,
      fontSize: 12.5
    }
  }, d.drug), React.createElement("span", {
    className: "t-small"
  }, d.company)), React.createElement("span", {
    className: "row gap-8 center"
  }, React.createElement("span", {
    className: "num t-small"
  }, "$", d.sales, "B"), React.createElement("span", {
    className: "tag",
    style: {
      fontSize: 10
    }
  }, d.expiry))), React.createElement("div", {
    className: "fit-track",
    style: {
      width: "100%",
      height: 7
    }
  }, React.createElement("div", {
    className: "fit-fill",
    style: {
      width: d.window * 100 + "%",
      background: "linear-gradient(90deg, var(--amber-500), var(--red-500))"
    }
  })))))))), tab === "tenders" && React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden",
      maxWidth: 820
    }
  }, React.createElement("div", {
    className: "row between center",
    style: {
      padding: "12px 16px",
      borderBottom: "1px solid var(--border)"
    }
  }, React.createElement("span", {
    className: "t-small"
  }, "Government tenders & policy movements tracked from tender portals and gazettes."), React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, React.createElement(Icon, {
    name: "bell",
    size: 12
  }), " Alert on new")), React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Tender / Policy"), React.createElement("th", null, "Body"), React.createElement("th", {
    className: "num"
  }, "Value"), React.createElement("th", null, "Closes"), React.createElement("th", null, "Status"))), React.createElement("tbody", null, tenders.map((t, i) => React.createElement("tr", {
    key: i,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", {
    style: {
      fontWeight: 540
    }
  }, t.title), React.createElement("td", {
    className: "t-small"
  }, t.body), React.createElement("td", {
    className: "num"
  }, t.value), React.createElement("td", {
    className: "t-small"
  }, t.closes), React.createElement("td", null, React.createElement(StatusPill, {
    status: t.status === "Open" ? "On Track" : "Filed",
    dot: false
  }))))))), tab === "memory" && mem && React.createElement("div", {
    className: "col gap-16"
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Analyst Coverage"), React.createElement("span", {
    className: "tag"
  }, "historical record")), React.createElement("div", {
    className: "col gap-10 mt-8"
  }, mem.coverage.map(c => React.createElement("div", {
    key: c.name,
    className: "row between center"
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 540
    }
  }, c.name), React.createElement("div", {
    className: "t-small"
  }, c.note)), React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, React.createElement("div", {
    className: "t-small"
  }, c.analyst), React.createElement("div", {
    className: "t-small num"
  }, "since ", c.since)))))), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Market Share Trend"), React.createElement(Icon, {
    name: "trending",
    size: 14,
    style: {
      color: "var(--text-muted)"
    }
  })), React.createElement("div", {
    className: "row gap-16 center mb-12 mt-8"
  }, React.createElement("div", null, React.createElement("div", {
    className: "metric-label"
  }, "Latest share"), React.createElement("div", {
    className: "num",
    style: {
      fontSize: 22,
      fontWeight: 660
    }
  }, mem.marketShare[mem.marketShare.length - 1].v, "%")), React.createElement("div", {
    className: "metric-delta delta-up"
  }, React.createElement(Icon, {
    name: "arrowUp",
    size: 11
  }), " +", (mem.marketShare[mem.marketShare.length - 1].v - mem.marketShare[0].v).toFixed(1), "pp since ", mem.marketShare[0].p)), React.createElement(BarChart, {
    series: mem.marketShare,
    color: sector.color,
    yfmt: v => v.toFixed(0) + "%",
    h: 150
  }))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 16
    }
  }, React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("div", {
    className: "rail-panel-head",
    style: {
      padding: "13px 16px"
    }
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Comparables"), React.createElement("span", {
    className: "tag"
  }, "refreshed quarterly")), React.createElement("table", {
    className: "dtable",
    style: {
      fontSize: 12.5
    }
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Company"), React.createElement("th", {
    className: "num"
  }, "P/B"), React.createElement("th", {
    className: "num"
  }, "P/E"), React.createElement("th", {
    className: "num"
  }, "Combined ratio"))), React.createElement("tbody", null, mem.comps.map(c => React.createElement("tr", {
    key: c.co,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", {
    style: {
      fontWeight: 540
    }
  }, c.co), React.createElement("td", {
    className: "num"
  }, c.pb), React.createElement("td", {
    className: "num"
  }, c.pe), React.createElement("td", {
    className: "num"
  }, c.combined)))))), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Cap Table"), React.createElement(Icon, {
    name: "users",
    size: 14,
    style: {
      color: "var(--text-muted)"
    }
  })), React.createElement("div", {
    className: "col gap-10 mt-8"
  }, mem.capTable.map(h => React.createElement("div", {
    key: h.holder
  }, React.createElement("div", {
    className: "row between center mb-4"
  }, React.createElement("span", {
    style: {
      fontSize: 12
    }
  }, h.holder), React.createElement("span", {
    className: "num t-small",
    style: {
      fontWeight: 600
    }
  }, h.pct, "%")), React.createElement("div", {
    className: "fit-track",
    style: {
      width: "100%",
      height: 6
    }
  }, React.createElement("div", {
    className: "fit-fill",
    style: {
      width: h.pct + "%",
      background: sector.color
    }
  })))))))), tab === "explore" && React.createElement("div", {
    style: {
      maxWidth: 900
    }
  }, React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14,
      padding: "11px 16px",
      display: "flex",
      gap: 10,
      alignItems: "center",
      borderColor: "var(--violet-50)",
      background: "var(--violet-50)"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 15,
    style: {
      color: "var(--violet-500)"
    }
  }), React.createElement("span", {
    className: "t-small",
    style: {
      color: "var(--text-primary)"
    }
  }, "Ask questions against everything tracked in ", React.createElement("strong", null, sector.name), " \u2014 briefings, signals, comps and filings.")), React.createElement(window.QueryBuilder, {
    embedded: true
  })), tab === "sources" && React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden",
      maxWidth: 760
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Source"), React.createElement("th", null, "Type"), React.createElement("th", null, "Status"), React.createElement("th", {
    style: {
      width: 36
    }
  }))), React.createElement("tbody", null, db.sectorSources.map(s => React.createElement("tr", {
    key: s.name,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", null, React.createElement("span", {
    className: "row gap-9 center"
  }, React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 7,
      background: "var(--bg-sunken)",
      color: "var(--text-secondary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "database",
    size: 14
  })), React.createElement("span", {
    style: {
      fontWeight: 540
    }
  }, s.name))), React.createElement("td", null, React.createElement("span", {
    className: "tag"
  }, s.type)), React.createElement("td", null, React.createElement(StatusPill, {
    status: s.status
  })), React.createElement("td", null, React.createElement(Menu, {
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
      text: "Disconnect",
      danger: true
    }]
  }))))))));
}
function SentimentChart({
  data
}) {
  const w = 260,
    h = 90,
    pad = 6;
  const x = i => pad + i / (data.length - 1) * (w - pad * 2);
  const y = v => pad + (1 - v / 100) * (h - pad * 2);
  const pos = data.map((d, i) => (i ? "L" : "M") + x(i) + " " + y(d.pos)).join(" ");
  const neg = data.map((d, i) => (i ? "L" : "M") + x(i) + " " + y(d.neg)).join(" ");
  return React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${w} ${h}`,
    style: {
      display: "block"
    }
  }, React.createElement("path", {
    d: pos,
    fill: "none",
    stroke: "var(--green-500)",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), React.createElement("path", {
    d: neg,
    fill: "none",
    stroke: "var(--red-500)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeDasharray: "3 3",
    opacity: "0.7"
  }), React.createElement("circle", {
    cx: x(data.length - 1),
    cy: y(data[data.length - 1].pos),
    r: "3",
    fill: "var(--green-500)"
  }));
}
window.SectorView = SectorView;
window.SectorCoView = SectorCoView;
function MemosView() {
  const [tab, setTab] = useState("generate");
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement(PageHead, {
    title: "Memos & Models",
    sub: "Turn a deal's emails, IM and documents into your firm's own deliverables \u2014 what's a 3\u20134 day analyst job, in minutes."
  }), React.createElement("div", {
    className: "mb-16"
  }, React.createElement(Seg, {
    value: tab,
    onChange: setTab,
    options: [{
      value: "generate",
      label: "Generate",
      icon: "sparkles"
    }, {
      value: "model",
      label: "Model",
      icon: "table"
    }, {
      value: "comps",
      label: "Comparables",
      icon: "scale"
    }, {
      value: "velocity",
      label: "E-com Velocity",
      icon: "cart"
    }]
  })), tab === "generate" && React.createElement(GenerateTab, null), tab === "model" && React.createElement(ModelTab, null), tab === "comps" && React.createElement(CompsTab, null), tab === "velocity" && React.createElement(VelocityTab, null));
}
function GenerateTab() {
  const ctx = useContext(AppCtx);
  const [deal, setDeal] = useState("Meridian Surgical");
  const [output, setOutput] = useState("Screening Memo");
  const [tmpl, setTmpl] = useState("Paragon IC Memo v3");
  const [running, setRunning] = useState(false);
  const outputs = [{
    k: "Screening Memo",
    ic: "fileText"
  }, {
    k: "Investment Memo",
    ic: "documents"
  }, {
    k: "One-Pager",
    ic: "file"
  }, {
    k: "Tear Sheet",
    ic: "grid"
  }];
  const run = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 2200);
  };
  return React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: 20,
      alignItems: "start"
    }
  }, React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "label mb-8"
  }, "1 \xB7 Source deal"), React.createElement("select", {
    className: "select mb-16",
    value: deal,
    onChange: e => setDeal(e.target.value)
  }, window.DB.deals.map(d => React.createElement("option", {
    key: d.id
  }, d.name))), React.createElement("div", {
    className: "label mb-8"
  }, "2 \xB7 Output"), React.createElement("div", {
    className: "grid gap-10 mb-16",
    style: {
      gridTemplateColumns: "repeat(4,1fr)"
    }
  }, outputs.map(o => React.createElement("div", {
    key: o.k,
    className: "card card-hover pointer",
    style: {
      padding: 12,
      textAlign: "center",
      borderColor: output === o.k ? "var(--blue-500)" : "var(--border)",
      boxShadow: output === o.k ? "0 0 0 3px var(--blue-50)" : "var(--sh-xs)"
    },
    onClick: () => setOutput(o.k)
  }, React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: "var(--blue-50)",
      color: "var(--blue-600)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 7px"
    }
  }, React.createElement(Icon, {
    name: o.ic,
    size: 16
  })), React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 540
    }
  }, o.k)))), React.createElement("div", {
    className: "row gap-8 center mb-16",
    style: {
      padding: "9px 12px",
      borderRadius: 9,
      background: "var(--violet-50)",
      border: "1px solid #e3d9fd"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 14,
    style: {
      color: "var(--violet-500)",
      flex: "none"
    }
  }), React.createElement("span", {
    className: "t-small",
    style: {
      color: "var(--text-primary)"
    }
  }, "Screening memos & one-pagers are auto-drafted by reading the deal's emails + IM against your house template.")), React.createElement("div", {
    className: "label mb-8"
  }, "3 \xB7 Format template"), React.createElement("div", {
    className: "row gap-10 mb-16"
  }, React.createElement("select", {
    className: "select",
    value: tmpl,
    onChange: e => setTmpl(e.target.value)
  }, ["Paragon IC Memo v3", "One-Pager (house style)", "Screening Memo (1-page)"].map(t => React.createElement("option", {
    key: t
  }, t))), React.createElement("button", {
    className: "btn btn-secondary nowrap",
    onClick: () => ctx.navigate("templates")
  }, React.createElement(Icon, {
    name: "templates",
    size: 14
  }), " Manage")), React.createElement("div", {
    className: "label mb-8"
  }, "4 \xB7 Data scope"), React.createElement("div", {
    className: "row gap-8 wrap mb-16"
  }, React.createElement("span", {
    className: "tag"
  }, React.createElement(Icon, {
    name: "check",
    size: 11,
    style: {
      color: "var(--green-500)"
    }
  }), " Deal files (7)"), React.createElement("span", {
    className: "tag"
  }, React.createElement(Icon, {
    name: "check",
    size: 11,
    style: {
      color: "var(--green-500)"
    }
  }), " PitchBook comps"), React.createElement("span", {
    className: "tag",
    style: {
      opacity: 0.5
    }
  }, "+ Add source")), React.createElement("div", {
    className: "row gap-10 center",
    style: {
      paddingTop: 14,
      borderTop: "1px solid var(--border)"
    }
  }, React.createElement("label", {
    className: "row gap-7 center t-small pointer"
  }, React.createElement("input", {
    type: "checkbox",
    style: {
      accentColor: "var(--blue-500)"
    }
  }), " Auto-regenerate when new data arrives"), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      marginLeft: "auto"
    },
    onClick: run,
    disabled: running
  }, running ? React.createElement(React.Fragment, null, React.createElement(Icon, {
    name: "sparkles",
    size: 15
  }), " Generating\u2026") : React.createElement(React.Fragment, null, React.createElement(Icon, {
    name: "sparkles",
    size: 15
  }), " Generate ", output))), running && React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, React.createElement("div", {
    className: "skel",
    style: {
      height: 9,
      marginBottom: 8
    }
  }), React.createElement("div", {
    className: "skel",
    style: {
      height: 9,
      width: "78%",
      marginBottom: 8
    }
  }), React.createElement("div", {
    className: "skel",
    style: {
      height: 9,
      width: "54%"
    }
  }))), React.createElement("div", {
    className: "col gap-16"
  }, React.createElement("div", {
    className: "card card-pad",
    style: {
      borderColor: "var(--blue-200)",
      background: "linear-gradient(180deg, var(--blue-50), #fff 70%)"
    }
  }, React.createElement("div", {
    className: "row gap-8 center mb-8"
  }, React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "var(--blue-100)",
      color: "var(--blue-600)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "calendar",
    size: 15
  })), React.createElement("h3", {
    className: "t-h3"
  }, "Weekly Output")), React.createElement("p", {
    className: "t-small mb-12"
  }, "An automated weekly pipeline pack (PDF) \u2014 new deals, status moves and decisions \u2014 ready to send to the team for Monday's meeting."), React.createElement("button", {
    className: "btn btn-primary btn-sm",
    style: {
      width: "100%",
      justifyContent: "center"
    },
    onClick: () => ctx.toast("Weekly pipeline PDF generated & sent to the team", "check")
  }, React.createElement(Icon, {
    name: "download",
    size: 13
  }), " Generate & send weekly PDF"), React.createElement("div", {
    className: "row gap-6 center mt-12 t-small",
    style: {
      color: "var(--text-muted)"
    }
  }, React.createElement(Icon, {
    name: "check",
    size: 12,
    style: {
      color: "var(--green-500)"
    }
  }), " Auto-runs every Monday 7:00 AM")), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Generated Library")), [{
    n: "Meridian — Screening Memo",
    t: "Verified",
    time: "2h ago",
    c: "verified"
  }, {
    n: "Northwind — One-Pager",
    t: "Needs Review",
    time: "1d ago",
    c: "review"
  }, {
    n: "Cobalt — Tear Sheet",
    t: "Verified",
    time: "3d ago",
    c: "verified"
  }].map((g, i) => React.createElement("div", {
    key: i,
    className: "row between center pointer",
    style: {
      padding: "10px 0",
      borderBottom: i < 2 ? "1px solid var(--border)" : "none"
    },
    onClick: () => ctx.toast("Opening " + g.n, "")
  }, React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 7,
      background: "var(--red-50)",
      color: "var(--red-500)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "fileText",
    size: 14
  })), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 540
    }
  }, g.n), React.createElement("div", {
    className: "t-small"
  }, g.time))), React.createElement("span", {
    className: "row gap-5 center"
  }, React.createElement(ConfDot, {
    level: g.c
  }), React.createElement("span", {
    className: "t-small"
  }, g.t)))))));
}
function ModelTab() {
  return React.createElement("div", {
    className: "card card-pad",
    style: {
      maxWidth: 980
    }
  }, React.createElement("div", {
    className: "row between center mb-16"
  }, React.createElement("div", null, React.createElement("h3", {
    className: "t-h3"
  }, "Model \u2014 Meridian vs. listed comps"), React.createElement("p", {
    className: "t-small"
  }, "Banker's model mapped into your standard template. Rows matched across files even when named differently.")), React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, React.createElement(Icon, {
    name: "upload",
    size: 13
  }), " Upload model")), React.createElement("div", {
    className: "scroll",
    style: {
      overflowX: "auto"
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Metric"), React.createElement("th", {
    className: "num"
  }, "Meridian (deal)"), React.createElement("th", {
    className: "num"
  }, "Comp A"), React.createElement("th", {
    className: "num"
  }, "Comp B"), React.createElement("th", {
    className: "num"
  }, "Comp C"), React.createElement("th", null, "Check"))), React.createElement("tbody", null, [["Revenue growth", "24%", "18%", "15%", "21%", "verified"], ["EBITDA margin", "27.1%", "24.0%", "29.5%", "22.8%", "verified"], ["Recurring mix", "62%", "55%", "71%", "48%", "verified"], ["EV / Revenue", "6.2x", "5.8x", "7.1x", "5.2x", "estimated"], ["EV / EBITDA", "23.9x", "21.0x", "24.5x", "19.8x", "review"], ["Rule of 40", "51", "42", "45", "44", "verified"]].map((r, i) => React.createElement("tr", {
    key: i,
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
      fontWeight: 600,
      background: "var(--blue-50)"
    }
  }, r[1]), React.createElement("td", {
    className: "num"
  }, r[2]), React.createElement("td", {
    className: "num"
  }, r[3]), React.createElement("td", {
    className: "num"
  }, r[4]), React.createElement("td", null, React.createElement("span", {
    className: "row gap-5 center"
  }, React.createElement(ConfDot, {
    level: r[5]
  }), React.createElement("span", {
    className: "t-small"
  }, r[5] === "review" ? "Discrepancy" : r[5] === "estimated" ? "Estimated" : "OK")))))))), React.createElement("div", {
    className: "alert-row warn mt-16"
  }, React.createElement("span", {
    className: "alert-ic",
    style: {
      background: "var(--amber-100)",
      color: "var(--amber-600)"
    }
  }, React.createElement(Icon, {
    name: "alert",
    size: 16
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 560
    }
  }, "Critic AI flagged 1 discrepancy"), React.createElement("div", {
    className: "t-small"
  }, "EV/EBITDA of 23.9x uses management's adj. EBITDA; the audited figure implies 26.4x. ", React.createElement("span", {
    style: {
      color: "var(--blue-600)",
      fontWeight: 540,
      cursor: "pointer"
    }
  }, "Drill through to source \u2192")))));
}
function CompsTab() {
  const rows = [{
    co: "Meridian Surgical",
    type: "Private (deal)",
    rev: "142",
    growth: "24%",
    evrev: "6.2x",
    evebitda: "23.9x",
    live: false
  }, {
    co: "Intuitive (proxy)",
    type: "Public",
    rev: "7,120",
    growth: "14%",
    evrev: "11.4x",
    evebitda: "34.0x",
    live: false
  }, {
    co: "Globus Medical",
    type: "Public",
    rev: "2,510",
    growth: "19%",
    evrev: "4.9x",
    evebitda: "18.2x",
    live: false
  }, {
    co: "OrthoFix transaction",
    type: "M&A · just printed",
    rev: "—",
    growth: "—",
    evrev: "5.1x",
    evebitda: "—",
    live: true
  }];
  return React.createElement("div", {
    style: {
      maxWidth: 980
    }
  }, React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14,
      padding: "11px 16px",
      display: "flex",
      gap: 10,
      alignItems: "center",
      borderColor: "var(--green-100)",
      background: "var(--green-50)"
    }
  }, React.createElement(Icon, {
    name: "trending",
    size: 15,
    style: {
      color: "var(--green-600)"
    }
  }), React.createElement("span", {
    className: "t-small",
    style: {
      color: "var(--text-primary)"
    }
  }, "Auto-updated 14m ago \u2014 ", React.createElement("strong", null, "OrthoFix"), " transaction printed at 5.1x revenue, pulled from the deals feed.")), React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Company"), React.createElement("th", null, "Type"), React.createElement("th", {
    className: "num"
  }, "Revenue $M"), React.createElement("th", {
    className: "num"
  }, "Growth"), React.createElement("th", {
    className: "num"
  }, "EV/Rev"), React.createElement("th", {
    className: "num"
  }, "EV/EBITDA"))), React.createElement("tbody", null, rows.map(r => React.createElement("tr", {
    key: r.co,
    className: r.live ? "row-new" : "",
    style: {
      cursor: "default"
    }
  }, React.createElement("td", null, React.createElement("span", {
    className: "row gap-7 center",
    style: {
      fontWeight: 540
    }
  }, r.co, r.live && React.createElement("span", {
    className: "pill pill-new",
    style: {
      fontSize: 9
    }
  }, "NEW"))), React.createElement("td", null, React.createElement("span", {
    className: "tag"
  }, r.type)), React.createElement("td", {
    className: "num"
  }, r.rev), React.createElement("td", {
    className: "num"
  }, r.growth), React.createElement("td", {
    className: "num"
  }, r.live ? React.createElement("span", {
    className: "row gap-5 center",
    style: {
      justifyContent: "flex-end"
    }
  }, r.evrev, React.createElement(Cite, {
    n: 1
  })) : r.evrev), React.createElement("td", {
    className: "num"
  }, r.evebitda)))))));
}
function VelocityTab() {
  const brands = [{
    b: "Lumen Skincare",
    mine: true,
    mrp: 38,
    disc: 12,
    stock: 94,
    trend: [40, 44, 48, 52, 58, 63, 69, 76]
  }, {
    b: "Glowe",
    mine: false,
    mrp: 34,
    disc: 28,
    stock: 71,
    trend: [55, 52, 50, 48, 47, 45, 44, 42]
  }, {
    b: "Aera Beauty",
    mine: false,
    mrp: 42,
    disc: 8,
    stock: 88,
    trend: [30, 33, 35, 38, 41, 44, 47, 50]
  }];
  return React.createElement("div", {
    style: {
      maxWidth: 880
    }
  }, React.createElement("p", {
    className: "t-small mb-16"
  }, "Marketplace velocity scraped from Amazon, Nykaa & Flipkart \u2014 MRP, discount depth and in-stock over time. Your tracked investments are flagged."), React.createElement("div", {
    className: "col gap-12"
  }, brands.map(b => React.createElement("div", {
    key: b.b,
    className: "card card-pad",
    style: {
      borderColor: b.mine ? "var(--blue-200)" : "var(--border)"
    }
  }, React.createElement("div", {
    className: "row between center mb-12"
  }, React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 13.5
    }
  }, b.b), b.mine && React.createElement("span", {
    className: "pill pill-screening",
    style: {
      fontSize: 10
    }
  }, React.createElement("span", {
    className: "dot"
  }), "Tracked")), React.createElement(Sparkline, {
    data: b.trend,
    color: b.mine ? "#2f6bff" : "#7c8597",
    w: 120,
    h: 32
  })), React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 14
    }
  }, React.createElement(VStat, {
    k: "Avg MRP",
    v: "$" + b.mrp
  }), React.createElement(VStat, {
    k: "Discount depth",
    v: b.disc + "%",
    warn: b.disc > 20
  }), React.createElement(VStat, {
    k: "In-stock",
    v: b.stock + "%"
  }))))));
}
function VStat({
  k,
  v,
  warn
}) {
  return React.createElement("div", null, React.createElement("div", {
    className: "metric-label",
    style: {
      marginBottom: 3
    }
  }, k), React.createElement("div", {
    className: "num",
    style: {
      fontSize: 17,
      fontWeight: 620,
      color: warn ? "var(--amber-600)" : "var(--text-primary)"
    }
  }, v));
}
window.MemosView = MemosView;
function PortfolioView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const totalRev = db.portfolio.reduce((s, p) => s + p.revenue, 0);
  const watch = db.portfolio.filter(p => p.status === "Watch").length;
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement(PageHead, {
    title: "Portfolio",
    sub: "Live monitoring of companies you own \u2014 built from recurring MIS data, recency-aware."
  }, React.createElement("button", {
    className: "btn btn-secondary"
  }, React.createElement(Icon, {
    name: "download",
    size: 15
  }), " Export"), React.createElement("button", {
    className: "btn btn-primary"
  }, React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " Add Company")), React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 14,
      marginBottom: 22
    }
  }, React.createElement(MiniStat, {
    label: "Companies",
    value: "4",
    sub: "across 4 sectors",
    color: "#2f6bff",
    icon: "portfolio"
  }), React.createElement(MiniStat, {
    label: "Aggregate Revenue",
    value: "$" + totalRev + "M",
    sub: "+16% blended YoY",
    color: "#16a34a",
    icon: "trending",
    up: true
  }), React.createElement(MiniStat, {
    label: "Blended MOIC",
    value: "1.9x",
    sub: "unrealized",
    color: "#7c5cfc",
    icon: "pkg"
  }), React.createElement(MiniStat, {
    label: "Need Attention",
    value: watch,
    sub: "covenant watch",
    color: "#e08a00",
    icon: "alert"
  })), React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Company"), React.createElement("th", null, "Own %"), React.createElement("th", {
    className: "num"
  }, "Revenue"), React.createElement("th", {
    className: "num"
  }, "EBITDA"), React.createElement("th", {
    className: "num"
  }, "Growth"), React.createElement("th", null, "Trend"), React.createElement("th", null, "Covenant"), React.createElement("th", null, "Status"), React.createElement("th", {
    style: {
      width: 36
    }
  }))), React.createElement("tbody", null, db.portfolio.map(p => React.createElement("tr", {
    key: p.id,
    onClick: () => ctx.navigate("portfolioco", {
      id: p.id
    })
  }, React.createElement("td", null, React.createElement("span", {
    className: "row gap-10 center"
  }, React.createElement(LogoTile, {
    initials: p.initials,
    sector: p.sector,
    size: 30
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 560
    }
  }, p.name), React.createElement("div", {
    className: "t-small"
  }, p.sub)))), React.createElement("td", {
    className: "num"
  }, p.own, "%"), React.createElement("td", {
    className: "num"
  }, "$", p.revenue, "M"), React.createElement("td", {
    className: "num"
  }, "$", p.ebitda, "M"), React.createElement("td", {
    className: "num"
  }, React.createElement("span", {
    className: p.growth >= 15 ? "delta-up" : "",
    style: {
      fontWeight: 560,
      color: p.growth >= 15 ? "var(--green-600)" : p.growth < 10 ? "var(--amber-600)" : "var(--text-secondary)"
    }
  }, "+", p.growth, "%")), React.createElement("td", null, React.createElement(Sparkline, {
    data: p.spark,
    color: db.SECTOR_COLOR[p.sector]
  })), React.createElement("td", null, p.covenant.ok ? React.createElement("span", {
    className: "pill pill-ready",
    style: {
      fontSize: 10
    }
  }, React.createElement("span", {
    className: "dot"
  }), p.covenant.value, "x ok") : React.createElement("span", {
    className: "pill pill-flagged",
    style: {
      fontSize: 10
    }
  }, React.createElement("span", {
    className: "dot"
  }), p.covenant.value, "x tight")), React.createElement("td", null, React.createElement(StatusPill, {
    status: p.status
  })), React.createElement("td", {
    onClick: e => e.stopPropagation()
  }, React.createElement(Menu, {
    items: [{
      icon: "eye",
      text: "Open monitoring",
      onClick: () => ctx.navigate("portfolioco", {
        id: p.id
      })
    }, {
      icon: "sparkles",
      text: "Generate board pack",
      onClick: () => ctx.navigate("memos")
    }, {
      icon: "bell",
      text: "Configure alerts"
    }]
  }))))))));
}
function MiniStat({
  label,
  value,
  sub,
  color,
  icon,
  up
}) {
  return React.createElement("div", {
    className: "card card-pad metric-card"
  }, React.createElement("div", {
    className: "row between center"
  }, React.createElement("span", {
    className: "metric-label"
  }, label), React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: color + "1a",
      color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: icon,
    size: 15
  }))), React.createElement("div", {
    className: "metric-value"
  }, value), React.createElement("div", {
    className: "metric-delta",
    style: {
      color: up ? "var(--green-600)" : "var(--text-muted)"
    }
  }, up && React.createElement(Icon, {
    name: "arrowUp",
    size: 11
  }), sub));
}
function PortfolioCoView({
  params
}) {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const p = db.portfolioById(params && params.id || "forge") || db.portfolio[1];
  const mis = db.misSeries[p.id] || db.misSeries.forge;
  const timeline = db.misTimeline[p.id] || db.misTimeline.forge;
  const [period, setPeriod] = useState("quarterly");
  const [metric, setMetric] = useState("revenue");
  const series = mis[metric];
  const latest = series[series.length - 1];
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement("div", {
    className: "row gap-10 center mb-16"
  }, React.createElement("button", {
    className: "btn btn-icon btn-secondary btn-sm",
    onClick: () => ctx.navigate("portfolio")
  }, React.createElement(Icon, {
    name: "chevLeft",
    size: 15
  })), React.createElement(LogoTile, {
    initials: p.initials,
    sector: p.sector,
    size: 40
  }), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement("h1", {
    className: "t-h1"
  }, p.name), React.createElement(StatusPill, {
    status: p.status
  })), React.createElement("div", {
    className: "t-body"
  }, p.desc, " \xB7 ", p.own, "% owned \xB7 invested ", p.invested)), React.createElement("span", {
    className: "pill pill-ready"
  }, React.createElement(Icon, {
    name: "clock",
    size: 11
  }), " Latest: ", p.period)), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: 20,
      alignItems: "start"
    }
  }, React.createElement("div", {
    className: "col gap-16"
  }, React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "row between center mb-16"
  }, React.createElement(Seg, {
    value: metric,
    onChange: setMetric,
    options: [{
      value: "revenue",
      label: "Revenue"
    }, {
      value: "ebitda",
      label: "EBITDA"
    }, {
      value: "margin",
      label: "Margin %"
    }]
  }), React.createElement(Seg, {
    value: period,
    onChange: setPeriod,
    options: [{
      value: "monthly",
      label: "Monthly"
    }, {
      value: "quarterly",
      label: "Quarterly"
    }]
  })), React.createElement("div", {
    className: "row gap-24 center mb-16"
  }, React.createElement("div", null, React.createElement("div", {
    className: "metric-label",
    style: {
      marginBottom: 3
    }
  }, metric === "margin" ? "Margin" : metric === "ebitda" ? "EBITDA" : "Revenue", " \xB7 ", latest.p), React.createElement("div", {
    className: "num",
    style: {
      fontSize: 26,
      fontWeight: 660
    }
  }, metric === "margin" ? latest.v + "%" : "$" + latest.v + "M")), React.createElement("div", {
    style: {
      paddingLeft: 24,
      borderLeft: "1px solid var(--border)"
    }
  }, React.createElement("div", {
    className: "metric-label",
    style: {
      marginBottom: 3
    }
  }, "vs prior period"), React.createElement("div", {
    className: "metric-delta",
    style: {
      fontSize: 14,
      color: latest.v >= series[series.length - 2].v ? "var(--green-600)" : "var(--red-600)"
    }
  }, latest.v >= series[series.length - 2].v ? "▲" : "▼", " ", Math.abs(latest.v - series[series.length - 2].v).toFixed(1), metric === "margin" ? "pp" : "M")), React.createElement("div", {
    className: "tag",
    style: {
      marginLeft: "auto"
    }
  }, React.createElement(Icon, {
    name: "info",
    size: 11
  }), " AI answers from the most recent period")), React.createElement(LineChart, {
    series: series,
    color: db.SECTOR_COLOR[p.sector],
    yfmt: v => metric === "margin" ? v.toFixed(0) + "%" : "$" + v.toFixed(0)
  })), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head",
    style: {
      paddingBottom: 12
    }
  }, React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Interactions & MIS Calls"), React.createElement("span", {
    className: "tag"
  }, timeline.length)), React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, React.createElement(Icon, {
    name: "upload",
    size: 13
  }), " Upload transcript")), React.createElement("p", {
    className: "t-small mb-16"
  }, "Every founder call & email \u2014 AI-summarized, capturing the \"why this, why not that\" decisions. Searchable institutional memory."), React.createElement("div", {
    style: {
      position: "relative",
      paddingLeft: 26
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      left: 9,
      top: 6,
      bottom: 6,
      width: 2,
      background: "var(--border)"
    }
  }), timeline.map((t, i) => React.createElement("div", {
    key: i,
    style: {
      position: "relative",
      marginBottom: i < timeline.length - 1 ? 18 : 0
    }
  }, React.createElement("span", {
    style: {
      position: "absolute",
      left: -26,
      top: 2,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: t.kind === "call" ? "var(--blue-50)" : "var(--gray-100)",
      border: "2px solid #fff",
      boxShadow: "0 0 0 1px var(--border)",
      color: t.kind === "call" ? "var(--blue-600)" : "var(--text-muted)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: t.kind === "call" ? "chat" : "mail",
    size: 11
  })), React.createElement("div", {
    className: "card",
    style: {
      padding: 13
    }
  }, React.createElement("div", {
    className: "row between center mb-4"
  }, React.createElement("span", {
    style: {
      fontWeight: 560,
      fontSize: 13
    }
  }, t.title), React.createElement("span", {
    className: "t-small nowrap"
  }, t.date)), React.createElement("div", {
    className: "t-small mb-8"
  }, t.who), React.createElement("p", {
    className: "t-small",
    style: {
      lineHeight: 1.55,
      color: "var(--text-secondary)"
    }
  }, t.summary), React.createElement("div", {
    className: "row gap-6 mt-8 wrap"
  }, t.tags.map(tg => React.createElement("span", {
    key: tg,
    className: "tag",
    style: {
      fontSize: 10
    }
  }, tg))))))))), React.createElement("div", {
    className: "col gap-16"
  }, React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Covenant Watch"), React.createElement(Icon, {
    name: "shield",
    size: 15,
    style: {
      color: p.covenant.ok ? "var(--green-500)" : "var(--amber-500)"
    }
  })), React.createElement("div", {
    className: "alert-row " + (p.covenant.ok ? "" : "warn"),
    style: {
      marginBottom: 12
    }
  }, React.createElement("span", {
    className: "alert-ic",
    style: {
      background: p.covenant.ok ? "var(--green-100)" : "var(--amber-100)",
      color: p.covenant.ok ? "var(--green-600)" : "var(--amber-600)"
    }
  }, React.createElement(Icon, {
    name: p.covenant.ok ? "checkCircle" : "alert",
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
  }, p.covenant.name), React.createElement("div", {
    className: "t-small"
  }, p.covenant.ok ? "Within threshold" : "Approaching covenant"))), React.createElement("div", {
    className: "row between center mb-4"
  }, React.createElement("span", {
    className: "t-small"
  }, "Current"), React.createElement("span", {
    className: "num",
    style: {
      fontWeight: 600
    }
  }, p.covenant.value, "x")), React.createElement("div", {
    className: "fit-track",
    style: {
      width: "100%",
      height: 8,
      marginBottom: 6
    }
  }, React.createElement("div", {
    className: "fit-fill",
    style: {
      width: Math.min(100, p.covenant.value / p.covenant.threshold * 100) + "%",
      background: p.covenant.ok ? "var(--green-500)" : "var(--amber-500)"
    }
  })), React.createElement("div", {
    className: "row between"
  }, React.createElement("span", {
    className: "t-small"
  }, "Threshold"), React.createElement("span", {
    className: "num t-small"
  }, p.covenant.threshold, "x"))), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Key Metrics"), React.createElement("span", {
    className: "tag"
  }, "as of ", p.period)), React.createElement("div", {
    className: "col",
    style: {
      gap: 0
    }
  }, [["Revenue (LTM)", "$" + p.revenue + "M", "verified"], ["EBITDA", "$" + p.ebitda + "M", "verified"], ["EBITDA margin", (p.ebitda / p.revenue * 100).toFixed(1) + "%", "verified"], ["YoY growth", "+" + p.growth + "%", "verified"], ["Unrealized MOIC", p.moic + "x", "estimated"]].map(([k, v, c], i) => React.createElement("div", {
    key: k,
    className: "row between center",
    style: {
      padding: "9px 0",
      borderBottom: i < 4 ? "1px solid var(--border)" : "none"
    }
  }, React.createElement("span", {
    className: "row gap-7 center"
  }, React.createElement(ConfDot, {
    level: c
  }), React.createElement("span", {
    className: "t-small",
    style: {
      color: "var(--text-secondary)"
    }
  }, k)), React.createElement("span", {
    className: "num",
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, v))))), React.createElement("button", {
    className: "btn btn-secondary",
    style: {
      justifyContent: "center"
    },
    onClick: () => ctx.navigate("sectorco", {
      id: "industrials"
    })
  }, React.createElement(Icon, {
    name: "sector",
    size: 14
  }), " View sector intelligence"))));
}
window.PortfolioView = PortfolioView;
window.PortfolioCoView = PortfolioCoView;
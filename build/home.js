function HomeView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const active = db.activeDeals();
  const inDiligence = active.filter(d => ["IC Review", "Pursuing"].includes(d.status)).length;
  const stats = [{
    label: "Active Deals",
    value: String(active.length),
    delta: "+3 this week",
    up: true,
    icon: "dealflow",
    color: "#2f6bff",
    view: "dealflow"
  }, {
    label: "In Diligence",
    value: String(inDiligence),
    delta: "IC review & pursuing",
    up: true,
    icon: "target",
    color: "#16a34a",
    view: "dealflow"
  }, {
    label: "Sectors Tracked",
    value: String(db.sectors.length),
    delta: "40 new signals",
    up: true,
    icon: "sector",
    color: "#7c5cfc",
    view: "sector"
  }, {
    label: "Needs Review",
    value: "8",
    delta: "AI-flagged items",
    up: false,
    icon: "flag",
    color: "#e08a00",
    view: "dealflow"
  }];
  const recent = active.filter(d => ["Screening", "IC Review", "Triaging", "Pursuing"].includes(d.status)).slice(0, 5);
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? recent : recent.slice(0, 3);
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement(PageHead, {
    title: "Welcome back, Alex",
    sub: "Here's what's moved across your pipeline and sectors today."
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => ctx.navigate("dealflow", {
      weekly: true
    })
  }, React.createElement(Icon, {
    name: "columns",
    size: 15
  }), " Weekly Review"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => ctx.openWizard()
  }, React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " New Deal")), React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 14,
      marginBottom: 22
    }
  }, stats.map(s => React.createElement("div", {
    key: s.label,
    className: "card card-pad card-hover metric-card pointer",
    onClick: () => ctx.navigate(s.view)
  }, React.createElement("div", {
    className: "row between center"
  }, React.createElement("span", {
    className: "metric-label"
  }, s.label), React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: s.color + "1a",
      color: s.color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: s.icon,
    size: 16
  }))), React.createElement("div", {
    className: "metric-value"
  }, s.value), React.createElement("div", {
    className: "metric-delta " + (s.up ? "delta-up" : ""),
    style: !s.up ? {
      color: "var(--text-muted)"
    } : {}
  }, s.up && React.createElement(Icon, {
    name: "arrowUp",
    size: 12
  }), s.delta)))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: 22,
      alignItems: "start"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "row between center mb-12"
  }, React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement("h2", {
    className: "t-h2"
  }, "Recent Deals"), React.createElement("span", {
    className: "tag"
  }, recent.length, " active")), React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => ctx.navigate("dealflow")
  }, "View all ", React.createElement(Icon, {
    name: "arrowRight",
    size: 13
  }))), React.createElement("div", {
    className: "col gap-12"
  }, shown.map(d => React.createElement(DealHomeCard, {
    key: d.id,
    d: d
  }))), recent.length > 3 && React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    style: {
      marginTop: 12
    },
    onClick: () => setShowAll(s => !s)
  }, showAll ? "Show less" : `Show ${recent.length - 3} more deals`)), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "rail-panel-head",
    style: {
      paddingBottom: 6
    }
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Recent Activity"), React.createElement(Icon, {
    name: "bell",
    size: 15,
    style: {
      color: "var(--text-muted)"
    }
  })), React.createElement("div", null, db.activity.map((a, i) => React.createElement("div", {
    key: i,
    className: "feed-item",
    style: {
      borderBottom: i < db.activity.length - 1 ? "1px solid var(--border)" : "none"
    }
  }, React.createElement("span", {
    className: "feed-ic",
    style: {
      background: a.color + "1a",
      color: a.color
    }
  }, React.createElement(Icon, {
    name: a.type === "file" ? "upload" : a.type === "flag" ? "flag" : a.type === "deal" ? "layers" : a.type === "status" ? "refresh" : a.type === "section" ? "sparkles" : "trending",
    size: 14
  })), React.createElement("div", {
    className: "feed-main"
  }, React.createElement("div", {
    className: "feed-line"
  }, React.createElement("strong", {
    style: {
      fontWeight: 560
    }
  }, a.deal), " \u2014 ", a.name), React.createElement("div", {
    className: "feed-time"
  }, a.user, " \xB7 ", a.time))))))));
}
function DealHomeCard({
  d
}) {
  const ctx = useContext(AppCtx);
  const [hover, setHover] = useState(false);
  return React.createElement("div", {
    className: "card card-hover pointer",
    style: {
      padding: 16
    },
    onClick: () => ctx.navigate("workspace", {
      id: d.id
    }),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, React.createElement("div", {
    className: "row gap-14",
    style: {
      alignItems: "flex-start"
    }
  }, React.createElement(LogoTile, {
    initials: d.initials,
    sector: d.sector,
    size: 42
  }), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "row between center",
    style: {
      marginBottom: 5
    }
  }, React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("span", {
    className: "t-h3"
  }, d.name), React.createElement("span", {
    className: "tag"
  }, d.dealType), React.createElement("span", {
    className: "pill pill-screening",
    style: {
      fontSize: 10.5
    }
  }, d.strategy)), React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement(StatusPill, {
    status: d.status
  }), React.createElement(Menu, {
    items: [{
      icon: "eye",
      text: "Open workspace",
      onClick: () => ctx.navigate("workspace", {
        id: d.id
      })
    }, {
      icon: "sparkles",
      text: "Generate memo",
      onClick: () => ctx.navigate("memos")
    }, {
      sep: true
    }, {
      icon: "flag",
      text: "Pass on deal",
      danger: true,
      onClick: () => ctx.toast("Marked as passed", "flag")
    }]
  }))), React.createElement("p", {
    style: {
      fontSize: 12.5,
      lineHeight: 1.5,
      color: "var(--text-secondary)",
      marginBottom: 10,
      maxHeight: hover ? 200 : 38,
      overflow: "hidden",
      transition: "max-height .3s var(--ease)"
    }
  }, React.createElement("span", {
    style: {
      fontWeight: 560,
      color: "var(--text-primary)"
    }
  }, "AI thesis \xB7 "), hover ? d.thesis : d.take), React.createElement("div", {
    className: "row between center"
  }, React.createElement("div", {
    className: "row gap-16 center"
  }, d.revenue != null && React.createElement(Metric, {
    label: "Revenue",
    v: "$" + d.revenue + "M"
  }), d.ebitda != null && React.createElement(Metric, {
    label: "EBITDA",
    v: "$" + d.ebitda + "M"
  }), d.ask != null && React.createElement(Metric, {
    label: "Ask",
    v: "$" + d.ask + "M"
  })), React.createElement("div", {
    className: "row gap-10 center"
  }, React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 9.5,
      color: "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      fontWeight: 600
    }
  }, "Fit"), React.createElement(FitBar, {
    score: d.fit
  })))))));
}
function Metric({
  label,
  v
}) {
  return React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 9.5,
      color: "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      fontWeight: 600
    }
  }, label), React.createElement("div", {
    className: "num",
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, v));
}
window.HomeView = HomeView;
const AppCtx = React.createContext({});
window.AppCtx = AppCtx;
const {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback
} = React;
const STATUS_CLASS = {
  Ready: "pill-ready",
  Verified: "pill-verified",
  Processing: "pill-processing",
  "Needs Review": "pill-review",
  Flagged: "pill-flagged",
  New: "pill-new",
  Triaging: "pill-triaging",
  Screening: "pill-screening",
  "IC Review": "pill-ic",
  Passed: "pill-passed",
  Pursuing: "pill-pursuing",
  "On Track": "pill-ready",
  Watch: "pill-review",
  Outperform: "pill-verified",
  Connected: "pill-ready",
  Syncing: "pill-processing",
  Paused: "pill-neutral",
  Launched: "pill-ready",
  Filed: "pill-screening",
  "Phase III": "pill-violet"
};
function StatusPill({
  status,
  dot = true
}) {
  const cls = STATUS_CLASS[status] || "pill-neutral";
  return React.createElement("span", {
    className: "pill " + cls
  }, dot && React.createElement("span", {
    className: "dot"
  }), status);
}
window.StatusPill = StatusPill;
function FitBar({
  score
}) {
  const color = score >= 85 ? "var(--green-500)" : score >= 75 ? "var(--blue-500)" : score >= 65 ? "var(--amber-500)" : "var(--gray-400)";
  return React.createElement("div", {
    className: "fit-bar"
  }, React.createElement("div", {
    className: "fit-track"
  }, React.createElement("div", {
    className: "fit-fill",
    style: {
      width: score + "%",
      background: color
    }
  })), React.createElement("span", {
    className: "fit-num",
    style: {
      color
    }
  }, score));
}
window.FitBar = FitBar;
function Avatar({
  name,
  color = "#2f6bff",
  size = ""
}) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(s => s[0]).join("").toUpperCase();
  return React.createElement("span", {
    className: "avatar " + size,
    style: {
      background: color
    }
  }, initials);
}
function LogoTile({
  initials,
  sector,
  size = 38
}) {
  const c = window.DB.logoColor(sector);
  return React.createElement("span", {
    className: "logo-tile",
    style: {
      background: c.bg,
      color: c.fg,
      width: size,
      height: size,
      fontSize: size * 0.37
    }
  }, initials);
}
window.Avatar = Avatar;
window.LogoTile = LogoTile;
const CONF_LABEL = {
  verified: "Verified from source",
  estimated: "AI-estimated",
  review: "Needs review"
};
function ConfDot({
  level = "verified"
}) {
  return React.createElement("span", {
    className: "tip",
    style: {
      display: "inline-flex"
    }
  }, React.createElement("span", {
    className: "conf-dot conf-" + level
  }), React.createElement("span", {
    className: "tip-bub"
  }, CONF_LABEL[level]));
}
window.ConfDot = ConfDot;
function Menu({
  items,
  align = "right",
  trigger,
  always = false
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const fn = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);
  return React.createElement("span", {
    ref: ref,
    style: {
      position: "relative",
      display: "inline-flex"
    }
  }, trigger ? React.cloneElement(trigger, {
    onClick: e => {
      e.stopPropagation();
      setOpen(o => !o);
    }
  }) : React.createElement("button", {
    className: "ovf-btn" + (always ? " always" : ""),
    onClick: e => {
      e.stopPropagation();
      setOpen(o => !o);
    }
  }, React.createElement(Icon, {
    name: "more",
    size: 16
  })), open && React.createElement("div", {
    className: "menu",
    style: {
      top: "calc(100% + 4px)",
      [align]: 0
    },
    onClick: e => e.stopPropagation()
  }, items.map((it, i) => it.sep ? React.createElement("div", {
    key: i,
    className: "menu-sep"
  }) : it.label ? React.createElement("div", {
    key: i,
    className: "menu-label"
  }, it.label) : React.createElement("div", {
    key: i,
    className: "menu-item" + (it.danger ? " danger" : ""),
    onClick: () => {
      setOpen(false);
      it.onClick && it.onClick();
    }
  }, it.icon && React.createElement(Icon, {
    name: it.icon,
    size: 14
  }), React.createElement("span", null, it.text)))));
}
window.Menu = Menu;
function Prov({
  value,
  metric = "default",
  conf = "verified",
  className = "",
  strong = false
}) {
  const ctx = useContext(AppCtx);
  const [overridden, setOverridden] = useState(false);
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const menuItems = [{
    icon: "sourceDoc",
    text: "View source documents",
    onClick: () => ctx.openSource(metric, val)
  }, {
    icon: "override",
    text: "Override with manual value",
    onClick: () => setEditing(true)
  }, {
    icon: "refresh",
    text: "Refresh with AI guidance",
    onClick: () => ctx.toast("Re-running extraction for " + metric + "…", "ai")
  }, {
    sep: true
  }, {
    icon: "flag",
    text: "Report data issue",
    danger: true,
    onClick: () => ctx.toast("Issue reported to the deal team", "flag")
  }, {
    label: "Updated 2h ago · Critic AI"
  }];
  if (editing) {
    return React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6
      }
    }, React.createElement("input", {
      className: "input",
      style: {
        height: 26,
        width: 90,
        fontSize: 12
      },
      value: val,
      autoFocus: true,
      onChange: e => setVal(e.target.value),
      onKeyDown: e => {
        if (e.key === "Enter") {
          setEditing(false);
          setOverridden(true);
          ctx.toast("Override saved — marked analyst-confirmed", "check");
        }
        if (e.key === "Escape") {
          setEditing(false);
          setVal(value);
        }
      }
    }), React.createElement("button", {
      className: "prov-btn",
      onClick: () => {
        setEditing(false);
        setOverridden(true);
        ctx.toast("Override saved — marked analyst-confirmed", "check");
      }
    }, React.createElement(Icon, {
      name: "check",
      size: 13
    })));
  }
  return React.createElement("span", {
    className: "prov " + className,
    style: strong ? {
      fontWeight: 600
    } : {}
  }, React.createElement(ConfDot, {
    level: overridden ? "verified" : conf
  }), React.createElement("span", {
    className: "num"
  }, val), overridden && React.createElement("span", {
    className: "tag",
    style: {
      fontSize: 9,
      padding: "1px 5px"
    }
  }, "edited"), React.createElement("span", {
    className: "prov-actions"
  }, React.createElement("button", {
    className: "prov-btn",
    title: "Refresh",
    onClick: () => ctx.toast("Refreshing " + metric + "…", "ai")
  }, React.createElement(Icon, {
    name: "refresh",
    size: 11
  })), React.createElement(Menu, {
    align: "left",
    items: menuItems,
    trigger: React.createElement("button", {
      className: "prov-btn"
    }, React.createElement(Icon, {
      name: "more",
      size: 12
    }))
  })));
}
window.Prov = Prov;
function Cite({
  n = 1,
  metric = "default",
  onClick
}) {
  const ctx = useContext(AppCtx);
  return React.createElement("span", {
    className: "cite-chip",
    onClick: e => {
      e.stopPropagation();
      (onClick || (() => ctx.openSource(metric)))();
    }
  }, React.createElement(Icon, {
    name: "sourceDoc",
    size: 9
  }), " ", n);
}
window.Cite = Cite;
function Sparkline({
  data,
  color = "#2f6bff",
  w = 84,
  h = 26,
  fill = true
}) {
  const min = Math.min(...data),
    max = Math.max(...data),
    rng = max - min || 1;
  const pts = data.map((v, i) => [i / (data.length - 1) * w, h - 3 - (v - min) / rng * (h - 6)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${w} ${h} L 0 ${h} Z`;
  const id = "sg" + Math.random().toString(36).slice(2, 7);
  return React.createElement("svg", {
    width: w,
    height: h,
    className: "sparkline"
  }, fill && React.createElement("defs", null, React.createElement("linearGradient", {
    id: id,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: color,
    stopOpacity: "0.18"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: color,
    stopOpacity: "0"
  }))), fill && React.createElement("path", {
    d: area,
    fill: `url(#${id})`
  }), React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement("circle", {
    cx: pts[pts.length - 1][0],
    cy: pts[pts.length - 1][1],
    r: "2",
    fill: color
  }));
}
window.Sparkline = Sparkline;
function LineChart({
  series,
  w = 560,
  h = 200,
  color = "#2f6bff",
  yfmt = v => v
}) {
  const pad = {
    l: 38,
    r: 14,
    t: 14,
    b: 26
  };
  const vals = series.map(d => d.v);
  const min = Math.min(...vals) * 0.96,
    max = Math.max(...vals) * 1.04,
    rng = max - min || 1;
  const x = i => pad.l + i / (series.length - 1) * (w - pad.l - pad.r);
  const y = v => pad.t + (1 - (v - min) / rng) * (h - pad.t - pad.b);
  const line = series.map((d, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(d.v).toFixed(1)).join(" ");
  const area = line + ` L ${x(series.length - 1)} ${h - pad.b} L ${x(0)} ${h - pad.b} Z`;
  const ticks = 4;
  const id = "lg" + Math.random().toString(36).slice(2, 7);
  return React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${w} ${h}`,
    style: {
      display: "block"
    }
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: id,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: color,
    stopOpacity: "0.16"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: color,
    stopOpacity: "0"
  }))), Array.from({
    length: ticks + 1
  }).map((_, i) => {
    const gv = min + rng * i / ticks;
    const gy = y(gv);
    return React.createElement("g", {
      key: i
    }, React.createElement("line", {
      x1: pad.l,
      y1: gy,
      x2: w - pad.r,
      y2: gy,
      stroke: "var(--border)",
      strokeWidth: "1"
    }), React.createElement("text", {
      x: pad.l - 7,
      y: gy + 3,
      textAnchor: "end",
      fontSize: "9.5",
      fill: "var(--text-muted)",
      className: "num"
    }, yfmt(gv)));
  }), React.createElement("path", {
    d: area,
    fill: `url(#${id})`
  }), React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), series.map((d, i) => React.createElement("circle", {
    key: i,
    cx: x(i),
    cy: y(d.v),
    r: i === series.length - 1 ? 3.5 : 0,
    fill: color
  })), series.map((d, i) => React.createElement("text", {
    key: i,
    x: x(i),
    y: h - 8,
    textAnchor: "middle",
    fontSize: "9.5",
    fill: "var(--text-muted)"
  }, d.p)));
}
window.LineChart = LineChart;
function BarChart({
  series,
  w = 560,
  h = 200,
  color = "#2f6bff",
  yfmt = v => v
}) {
  const pad = {
    l: 38,
    r: 14,
    t: 14,
    b: 26
  };
  const vals = series.map(d => d.v);
  const max = Math.max(...vals) * 1.1,
    min = 0,
    rng = max - min || 1;
  const bw = (w - pad.l - pad.r) / series.length;
  const y = v => pad.t + (1 - (v - min) / rng) * (h - pad.t - pad.b);
  return React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${w} ${h}`,
    style: {
      display: "block"
    }
  }, Array.from({
    length: 5
  }).map((_, i) => {
    const gv = max * i / 4;
    const gy = y(gv);
    return React.createElement("g", {
      key: i
    }, React.createElement("line", {
      x1: pad.l,
      y1: gy,
      x2: w - pad.r,
      y2: gy,
      stroke: "var(--border)",
      strokeWidth: "1"
    }), React.createElement("text", {
      x: pad.l - 7,
      y: gy + 3,
      textAnchor: "end",
      fontSize: "9.5",
      fill: "var(--text-muted)",
      className: "num"
    }, yfmt(gv)));
  }), series.map((d, i) => {
    const bh = h - pad.b - y(d.v);
    return React.createElement("g", {
      key: i
    }, React.createElement("rect", {
      x: pad.l + bw * i + bw * 0.22,
      y: y(d.v),
      width: bw * 0.56,
      height: Math.max(bh, 0),
      rx: "2.5",
      fill: i === series.length - 1 ? color : color + "9c"
    }), React.createElement("text", {
      x: pad.l + bw * i + bw / 2,
      y: h - 8,
      textAnchor: "middle",
      fontSize: "9.5",
      fill: "var(--text-muted)"
    }, d.p));
  }));
}
window.BarChart = BarChart;
function Modal({
  children,
  onClose,
  size = ""
}) {
  useEffect(() => {
    const fn = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);
  return React.createElement("div", {
    className: "overlay center",
    onMouseDown: onClose
  }, React.createElement("div", {
    className: "modal " + size,
    onMouseDown: e => e.stopPropagation()
  }, children));
}
function Drawer({
  children,
  onClose
}) {
  useEffect(() => {
    const fn = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);
  return React.createElement("div", {
    className: "overlay right",
    onMouseDown: onClose
  }, React.createElement("div", {
    className: "drawer",
    onMouseDown: e => e.stopPropagation()
  }, children));
}
window.Modal = Modal;
window.Drawer = Drawer;
function SectionCard({
  title,
  icon,
  iconColor = "#2f6bff",
  actions,
  children,
  menu
}) {
  const ctx = useContext(AppCtx);
  const defaultMenu = [{
    icon: "sparkles",
    text: "Explore further",
    onClick: () => ctx.toast("Opening deep-dive on " + title + "…", "ai")
  }, {
    icon: "edit",
    text: "Edit section configuration",
    onClick: () => ctx.openEditSection({
      name: title
    })
  }, {
    icon: "sourceDoc",
    text: "View source documents",
    onClick: () => ctx.openSource(title)
  }, {
    icon: "refresh",
    text: "Refresh all metrics",
    onClick: () => ctx.toast("Refreshing all metrics in " + title + "…", "ai")
  }, {
    sep: true
  }, {
    icon: "flag",
    text: "Report data issue",
    danger: true,
    onClick: () => ctx.toast("Issue reported", "flag")
  }];
  return React.createElement("div", {
    className: "section-card"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("span", {
    className: "ic",
    style: {
      background: iconColor + "1a",
      color: iconColor
    }
  }, React.createElement(Icon, {
    name: icon,
    size: 15
  })), React.createElement("span", {
    className: "ttl"
  }, title), React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, actions, React.createElement(Menu, {
    items: menu || defaultMenu
  }))), React.createElement("div", {
    className: "section-body"
  }, children));
}
window.SectionCard = SectionCard;
function KV({
  k,
  children
}) {
  return React.createElement("div", {
    className: "kv"
  }, React.createElement("span", {
    className: "k"
  }, k), React.createElement("span", {
    className: "v"
  }, children));
}
window.KV = KV;
function PageHead({
  title,
  sub,
  children
}) {
  return React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", null, React.createElement("h1", {
    className: "t-display"
  }, title), sub && React.createElement("p", {
    className: "t-body",
    style: {
      marginTop: 4
    }
  }, sub)), children && React.createElement("div", {
    className: "row gap-10 center"
  }, children));
}
window.PageHead = PageHead;
function Seg({
  value,
  onChange,
  options
}) {
  return React.createElement("div", {
    className: "seg"
  }, options.map(o => React.createElement("div", {
    key: o.value,
    className: "seg-item" + (value === o.value ? " active" : ""),
    onClick: () => onChange(o.value)
  }, o.icon && React.createElement(Icon, {
    name: o.icon,
    size: 14
  }), o.label)));
}
window.Seg = Seg;
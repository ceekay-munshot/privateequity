function EditSectionModal({
  section,
  onClose
}) {
  const ctx = useContext(AppCtx);
  const name = section && section.name || "Custom Section";
  const [groupName, setGroupName] = useState(name);
  const [web, setWeb] = useState(false);
  const [instr, setInstr] = useState("Extract all historical funding rounds — date, amount raised, round type, pre/post-money valuation — and present as a timeline chart with round types annotated and valuation on a secondary axis.");
  const [metrics, setMetrics] = useState([{
    id: "m1",
    display: "Funding timeline",
    type: "Chart",
    ai: "Line+marker chart. X-axis: round close date (Date). Y-axis (left): amount raised (Currency, $M). Secondary Y-axis: post-money valuation (Currency, $M). Annotate each marker with the round type."
  }, {
    id: "m2",
    display: "Rounds table",
    type: "Table",
    ai: "Columns: Date (human-readable), Round type, Amount raised (rounded, $M), Lead investor, Post-money ($M), Notes. One row per round, newest first."
  }, {
    id: "m3",
    display: "Total raised to date",
    type: "Currency",
    ai: "Sum of all primary capital raised across rounds, in $M. Exclude secondary transactions."
  }]);
  const addMetric = () => setMetrics(m => [...m, {
    id: "m" + Date.now(),
    display: "",
    type: "Text",
    ai: ""
  }]);
  const delMetric = id => setMetrics(m => m.filter(x => x.id !== id));
  const upd = (id, patch) => setMetrics(m => m.map(x => x.id === id ? {
    ...x,
    ...patch
  } : x));
  return React.createElement(Modal, {
    onClose: onClose,
    size: "modal-lg"
  }, React.createElement("div", {
    className: "modal-head"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "t-h2"
  }, "Edit Custom Section"), React.createElement("p", {
    className: "t-body"
  }, "Modify the configuration for \u201C", name, "\u201D. Update prompts, RAG queries, and individual metrics within the group.")), React.createElement("button", {
    className: "x-btn",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), React.createElement("div", {
    className: "modal-body scroll",
    style: {
      maxHeight: "64vh",
      background: "var(--bg-subtle)"
    }
  }, React.createElement("div", {
    className: "card card-pad",
    style: {
      marginBottom: 16
    }
  }, React.createElement("div", {
    className: "label mb-8"
  }, "Group Name"), React.createElement("input", {
    className: "input mb-16",
    value: groupName,
    onChange: e => setGroupName(e.target.value)
  }), React.createElement("div", {
    className: "row between center",
    style: {
      padding: "10px 12px",
      border: "1px solid var(--border)",
      borderRadius: 9,
      marginBottom: 14
    }
  }, React.createElement("span", {
    className: "row gap-9 center"
  }, React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 7,
      background: "var(--green-50)",
      color: "var(--green-600)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "globe",
    size: 14
  })), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 540
    }
  }, "Enable web search for additional context"), React.createElement("div", {
    className: "t-small"
  }, "Supplement document extraction with recent web results"))), React.createElement("div", {
    className: "toggle" + (web ? " on" : ""),
    onClick: () => setWeb(w => !w)
  })), React.createElement("div", {
    className: "row gap-6 center mb-8"
  }, React.createElement("span", {
    className: "label",
    style: {
      margin: 0
    }
  }, "Additional Instructions"), React.createElement("span", {
    className: "tip",
    style: {
      display: "inline-flex"
    }
  }, React.createElement(Icon, {
    name: "info",
    size: 13,
    style: {
      color: "var(--gray-400)"
    }
  }), React.createElement("span", {
    className: "tip-bub",
    style: {
      width: 230,
      whiteSpace: "normal",
      textAlign: "left"
    }
  }, "Group-level RAG query \u2014 tells the AI what to pull across the section and how to present it."))), React.createElement("textarea", {
    className: "textarea",
    rows: 3,
    value: instr,
    onChange: e => setInstr(e.target.value)
  })), React.createElement("div", {
    className: "row between center mb-12"
  }, React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("h3", {
    className: "t-h3"
  }, "Metrics to Extract"), React.createElement("span", {
    className: "tag"
  }, metrics.length)), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: addMetric
  }, React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " Add Metric")), React.createElement("div", {
    className: "col gap-10"
  }, metrics.map((m, i) => React.createElement(EsMetricCard, {
    key: m.id,
    m: m,
    i: i,
    upd: upd,
    del: () => delMetric(m.id),
    canDel: metrics.length > 1
  }))), React.createElement("div", {
    className: "row gap-8 center",
    style: {
      marginTop: 14,
      color: "var(--text-muted)",
      padding: "0 2px"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 14
  }), React.createElement("span", {
    className: "t-small"
  }, "Each metric is a tightly-scoped, individually-instructed task \u2014 narrow prompts per metric keep extraction accurate and avoid hallucination."))), React.createElement("div", {
    className: "modal-foot"
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      onClose();
      ctx.toast("Section configuration saved", "check");
    }
  }, React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Save Section")));
}
const ES_TYPES = ["Chart", "Table", "Text", "Number", "Currency", "Date"];
const ES_TYPE_ICON = {
  Chart: "trending",
  Table: "table",
  Text: "fileText",
  Number: "scale",
  Currency: "scale",
  Date: "calendar"
};
function EsMetricCard({
  m,
  i,
  upd,
  del,
  canDel
}) {
  return React.createElement("div", {
    className: "card",
    style: {
      padding: 14
    }
  }, React.createElement("div", {
    className: "row gap-10",
    style: {
      alignItems: "flex-start"
    }
  }, React.createElement("div", {
    className: "col center",
    style: {
      gap: 4,
      paddingTop: 2
    }
  }, React.createElement(Icon, {
    name: "columns",
    size: 14,
    style: {
      color: "var(--gray-400)",
      cursor: "grab"
    }
  }), React.createElement("span", {
    className: "num",
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "var(--text-muted)"
    }
  }, "#", i + 1)), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "grid gap-12 mb-12",
    style: {
      gridTemplateColumns: "1fr 180px"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "label mb-4"
  }, "Display Name"), React.createElement("input", {
    className: "input",
    value: m.display,
    placeholder: "e.g. Funding timeline",
    onChange: e => upd(m.id, {
      display: e.target.value
    })
  })), React.createElement("div", null, React.createElement("div", {
    className: "row gap-5 center mb-4"
  }, React.createElement("span", {
    className: "label",
    style: {
      margin: 0
    }
  }, "Data Type"), React.createElement("span", {
    className: "tip",
    style: {
      display: "inline-flex"
    }
  }, React.createElement(Icon, {
    name: "info",
    size: 12,
    style: {
      color: "var(--gray-400)"
    }
  }), React.createElement("span", {
    className: "tip-bub"
  }, "How this metric is rendered"))), React.createElement("div", {
    className: "select-wrap",
    style: {
      position: "relative"
    }
  }, React.createElement("select", {
    className: "select",
    value: m.type,
    onChange: e => upd(m.id, {
      type: e.target.value
    })
  }, ES_TYPES.map(t => React.createElement("option", {
    key: t
  }, t)))))), React.createElement("div", {
    className: "label mb-4"
  }, "AI Instructions"), React.createElement("textarea", {
    className: "textarea",
    rows: 3,
    value: m.ai,
    placeholder: "Per-metric extraction & rendering spec\u2026",
    onChange: e => upd(m.id, {
      ai: e.target.value
    })
  })), React.createElement("button", {
    className: "btn btn-icon btn-ghost btn-sm",
    disabled: !canDel,
    style: !canDel ? {
      opacity: 0.4
    } : {},
    onClick: del
  }, React.createElement(Icon, {
    name: "flag",
    size: 14,
    style: {
      color: "var(--red-500)"
    }
  }))));
}
window.EditSectionModal = EditSectionModal;
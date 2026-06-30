function DealWizard({
  onClose
}) {
  const ctx = useContext(AppCtx);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    kind: "Company",
    invType: "PE Direct",
    name: "",
    sector: "Healthcare",
    geo: "",
    source: "",
    size: "",
    stage: "Stage 1"
  });
  const steps = ["Deal Type", "Deal Details", "Documents", "Complete"];
  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  const next = () => setStep(s => Math.min(3, s + 1));
  return React.createElement(Modal, {
    onClose: onClose,
    size: "modal-lg"
  }, React.createElement("div", {
    className: "modal-head"
  }, React.createElement("h2", {
    className: "t-h2"
  }, "New Deal"), React.createElement("button", {
    className: "x-btn",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), React.createElement("div", {
    style: {
      padding: "16px 20px",
      borderBottom: "1px solid var(--border)"
    }
  }, React.createElement("div", {
    className: "stepbar"
  }, steps.map((s, i) => React.createElement("div", {
    key: s,
    className: "step" + (i < step ? " done" : i === step ? " cur" : ""),
    style: {
      flex: i === steps.length - 1 ? "none" : 1
    }
  }, React.createElement("span", {
    className: "step-dot"
  }, i < step ? React.createElement(Icon, {
    name: "check",
    size: 13
  }) : i + 1), React.createElement("span", {
    className: "step-lbl"
  }, s), i < steps.length - 1 && React.createElement("span", {
    className: "step-line"
  }))))), React.createElement("div", {
    className: "modal-body",
    style: {
      minHeight: 280
    }
  }, step === 0 && React.createElement("div", null, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 10
    }
  }, "Deal type"), React.createElement("div", {
    className: "grid gap-12",
    style: {
      gridTemplateColumns: "1fr 1fr",
      marginBottom: 20
    }
  }, [{
    k: "Company",
    ic: "building",
    d: "A direct investment into an operating business."
  }, {
    k: "Fund",
    ic: "layers",
    d: "A primary commitment or co-invest into a fund."
  }].map(o => React.createElement("div", {
    key: o.k,
    className: "card card-hover pointer",
    style: {
      padding: 16,
      borderColor: form.kind === o.k ? "var(--blue-500)" : "var(--border)",
      boxShadow: form.kind === o.k ? "0 0 0 3px var(--blue-50)" : "var(--sh-xs)"
    },
    onClick: () => set("kind", o.k)
  }, React.createElement("div", {
    className: "row between center mb-8"
  }, React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 9,
      background: "var(--blue-50)",
      color: "var(--blue-600)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: o.ic,
    size: 18
  })), React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      border: "2px solid " + (form.kind === o.k ? "var(--blue-500)" : "var(--border-strong)"),
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, form.kind === o.k && React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: "var(--blue-500)"
    }
  }))), React.createElement("div", {
    className: "t-h3"
  }, o.k), React.createElement("p", {
    className: "t-small",
    style: {
      marginTop: 3
    }
  }, o.d)))), React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 8
    }
  }, "Investment type"), React.createElement("select", {
    className: "select",
    value: form.invType,
    onChange: e => set("invType", e.target.value)
  }, ["PE Direct", "Fund Primary", "Co-invest", "Secondary"].map(t => React.createElement("option", {
    key: t
  }, t)))), step === 1 && React.createElement("div", {
    className: "grid gap-14",
    style: {
      gridTemplateColumns: "1fr 1fr"
    }
  }, React.createElement(Field, {
    label: "Company / Fund name",
    full: true
  }, React.createElement("input", {
    className: "input",
    placeholder: "e.g. Meridian Surgical",
    value: form.name,
    onChange: e => set("name", e.target.value)
  })), React.createElement(Field, {
    label: "Sector"
  }, React.createElement("select", {
    className: "select",
    value: form.sector,
    onChange: e => set("sector", e.target.value)
  }, Object.keys(window.DB.SECTOR_COLOR).map(s => React.createElement("option", {
    key: s
  }, s)))), React.createElement(Field, {
    label: "Geography"
  }, React.createElement("input", {
    className: "input",
    placeholder: "e.g. Boston, MA",
    value: form.geo,
    onChange: e => set("geo", e.target.value)
  })), React.createElement(Field, {
    label: "Source / banker"
  }, React.createElement("input", {
    className: "input",
    placeholder: "e.g. Jefferies",
    value: form.source,
    onChange: e => set("source", e.target.value)
  })), React.createElement(Field, {
    label: "Deal size ($M)"
  }, React.createElement("input", {
    className: "input",
    placeholder: "e.g. 920",
    value: form.size,
    onChange: e => set("size", e.target.value)
  })), React.createElement(Field, {
    label: "Stage",
    full: true
  }, React.createElement("select", {
    className: "select",
    value: form.stage,
    onChange: e => set("stage", e.target.value)
  }, ["Stage 1", "Stage 2", "Stage 3", "Stage 4"].map(s => React.createElement("option", {
    key: s
  }, s))))), step === 2 && React.createElement("div", null, React.createElement("div", {
    style: {
      border: "2px dashed var(--border-strong)",
      borderRadius: 12,
      padding: 36,
      textAlign: "center",
      background: "var(--bg-subtle)"
    }
  }, React.createElement("span", {
    className: "empty-ic",
    style: {
      margin: "0 auto 12px"
    }
  }, React.createElement(Icon, {
    name: "upload",
    size: 24
  })), React.createElement("div", {
    className: "t-h3"
  }, "Drag & drop the teaser, IM or model"), React.createElement("p", {
    className: "t-small",
    style: {
      margin: "5px auto 14px",
      maxWidth: 340
    }
  }, "The AI will auto-extract key metrics \u2014 revenue, EBITDA, valuation and management \u2014 straight from the deck."), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    style: {
      margin: "0 auto"
    }
  }, React.createElement(Icon, {
    name: "folder",
    size: 13
  }), " Browse files")), React.createElement("div", {
    className: "card",
    style: {
      marginTop: 14,
      padding: 12,
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: "var(--red-50)",
      color: "var(--red-500)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "file",
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
  }, "Teaser_Deck.pdf"), React.createElement("div", {
    className: "t-small"
  }, "4.2 MB \xB7 extracting metrics\u2026")), React.createElement("div", {
    className: "skel",
    style: {
      width: 60,
      height: 8
    }
  }))), step === 3 && React.createElement("div", {
    className: "empty-state",
    style: {
      padding: "20px 0"
    }
  }, React.createElement("span", {
    style: {
      width: 60,
      height: 60,
      borderRadius: "50%",
      background: "var(--green-50)",
      color: "var(--green-500)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "checkCircle",
    size: 32
  })), React.createElement("div", null, React.createElement("div", {
    className: "t-h2"
  }, form.name || "New deal", " added to pipeline"), React.createElement("p", {
    className: "t-body",
    style: {
      marginTop: 5
    }
  }, "Metrics extracted and an AI fit score is being calculated.")))), React.createElement("div", {
    className: "modal-foot"
  }, step > 0 && step < 3 && React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => setStep(s => s - 1),
    style: {
      marginRight: "auto"
    }
  }, React.createElement(Icon, {
    name: "chevLeft",
    size: 14
  }), " Back"), React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), step < 3 ? React.createElement("button", {
    className: "btn btn-primary",
    onClick: next
  }, step === 2 ? "Finish" : "Next", " ", React.createElement(Icon, {
    name: "arrowRight",
    size: 14
  })) : React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      onClose();
      ctx.navigate("workspace", {
        id: "meridian"
      });
    }
  }, "Open workspace ", React.createElement(Icon, {
    name: "arrowRight",
    size: 14
  }))));
}
function Field({
  label,
  children,
  full
}) {
  return React.createElement("div", {
    style: full ? {
      gridColumn: "1 / -1"
    } : {}
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 7
    }
  }, label), children);
}
function CreateSectionModal({
  deal,
  onClose
}) {
  const ctx = useContext(AppCtx);
  const [text, setText] = useState("");
  const [gen, setGen] = useState(false);
  const examples = ["Track buyout performance with revenue-growth charts, EBITDA progression and an operational KPIs table", "Create a debt analysis section with leverage-ratio charts, an amortization schedule and covenant-compliance table", "Monitor company transformation with before/after metric charts, value-creation initiatives and a management-team table", "Build an exit-readiness analysis with valuation-multiple charts, comparable transactions and a strategic-buyer table"];
  const generate = () => {
    setGen(true);
    setTimeout(() => {
      onClose();
      ctx.toast("New section generated and added to the tear sheet", "ai");
    }, 1600);
  };
  return React.createElement(Modal, {
    onClose: onClose,
    size: "modal-lg"
  }, React.createElement("div", {
    className: "modal-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "row gap-8 center mb-4"
  }, React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "var(--violet-50)",
      color: "var(--violet-500)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 15
  })), React.createElement("h2", {
    className: "t-h2"
  }, "Create Section")), React.createElement("p", {
    className: "t-body"
  }, "Use AI to describe what metrics you need and generate a complete custom section automatically.")), React.createElement("button", {
    className: "x-btn",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), React.createElement("div", {
    className: "modal-body"
  }, gen ? React.createElement("div", {
    className: "empty-state"
  }, React.createElement("span", {
    className: "empty-ic",
    style: {
      background: "var(--violet-50)",
      color: "var(--violet-500)"
    }
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 24
  })), React.createElement("div", {
    className: "t-h3"
  }, "Generating your section\u2026"), React.createElement("div", {
    style: {
      width: 220
    }
  }, React.createElement("div", {
    className: "skel",
    style: {
      height: 8,
      marginBottom: 8
    }
  }), React.createElement("div", {
    className: "skel",
    style: {
      height: 8,
      width: "70%",
      margin: "0 auto"
    }
  }))) : React.createElement("div", null, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 8
    }
  }, "Describe your metrics"), React.createElement("textarea", {
    className: "textarea",
    rows: 4,
    maxLength: 1000,
    placeholder: "e.g., Track IRR, MOIC and cash flows for this PE investment, including quarterly performance charts and a detailed cash-flow table\u2026",
    value: text,
    onChange: e => setText(e.target.value)
  }), React.createElement("div", {
    className: "row end"
  }, React.createElement("span", {
    className: "t-small num",
    style: {
      marginTop: 5
    }
  }, text.length, "/1000")), React.createElement("div", {
    className: "label",
    style: {
      margin: "12px 0 9px"
    }
  }, deal && deal.strategy ? deal.strategy.toUpperCase() : "PE DIRECT", " examples"), React.createElement("div", {
    className: "grid gap-8",
    style: {
      gridTemplateColumns: "1fr 1fr"
    }
  }, examples.map(ex => React.createElement("button", {
    key: ex,
    className: "chip",
    onClick: () => setText(ex)
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 13,
    style: {
      color: "var(--violet-500)",
      flex: "none"
    }
  }), " ", ex))))), !gen && React.createElement("div", {
    className: "modal-foot"
  }, React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), React.createElement("button", {
    className: "btn btn-primary",
    disabled: !text.trim(),
    style: !text.trim() ? {
      opacity: 0.5,
      cursor: "not-allowed"
    } : {},
    onClick: generate
  }, React.createElement(Icon, {
    name: "sparkles",
    size: 14
  }), " Generate Metrics ", React.createElement(Icon, {
    name: "arrowRight",
    size: 14
  }))));
}
function ManageSectionsModal({
  onClose
}) {
  const ctx = useContext(AppCtx);
  const [tab, setTab] = useState("user");
  const [q, setQ] = useState("");
  const userSections = [{
    name: "IRR & Cash Flow Tracker",
    count: 8,
    desc: "Quarterly IRR, MOIC and cash-flow waterfall.",
    on: true
  }, {
    name: "Customer Cohorts",
    count: 5,
    desc: "Retention, NRR and concentration analysis.",
    on: true
  }, {
    name: "Debt & Covenants",
    count: 6,
    desc: "Leverage ratios and covenant compliance.",
    on: false
  }];
  const builtIn = [{
    name: "Company Overview",
    count: 6,
    desc: "Description, HQ, sector, headcount.",
    on: true
  }, {
    name: "Deal Terms",
    count: 5,
    desc: "Structure, amount, ownership, use of proceeds.",
    on: true
  }, {
    name: "Financial & Valuation Highlights",
    count: 4,
    desc: "Valuation and headline financials.",
    on: true
  }, {
    name: "Financial Statements Summary",
    count: 12,
    desc: "Multi-year P&L, balance sheet, cash flow.",
    on: true
  }, {
    name: "Key People",
    count: 4,
    desc: "Executive team profiles.",
    on: true
  }, {
    name: "Competitive Landscape",
    count: 7,
    desc: "Peer positioning and market share.",
    on: false
  }];
  const list = tab === "user" ? userSections : builtIn;
  const filtered = list.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
  const [states, setStates] = useState({});
  const isOn = s => states[s.name] !== undefined ? states[s.name] : s.on;
  const enabled = [...userSections, ...builtIn].filter(s => isOn(s)).length;
  return React.createElement(Modal, {
    onClose: onClose,
    size: "modal-lg"
  }, React.createElement("div", {
    className: "modal-head"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "t-h2"
  }, "Manage Dashboard Sections"), React.createElement("p", {
    className: "t-body"
  }, "Enable or disable sections for this project. Enabled sections appear in your dashboard.")), React.createElement("button", {
    className: "x-btn",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), React.createElement("div", {
    style: {
      padding: "14px 20px 0",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, React.createElement(Seg, {
    value: tab,
    onChange: setTab,
    options: [{
      value: "user",
      label: `User Sections (${userSections.length})`
    }, {
      value: "builtin",
      label: `Built-in Sections (${builtIn.length})`
    }]
  }), React.createElement("div", {
    className: "global-search",
    style: {
      flex: 1,
      height: 34
    }
  }, React.createElement(Icon, {
    name: "search",
    size: 15
  }), React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search sections\u2026",
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      fontFamily: "inherit",
      fontSize: 13
    }
  }))), React.createElement("div", {
    className: "modal-body scroll",
    style: {
      maxHeight: 380,
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, filtered.map(s => React.createElement("div", {
    key: s.name,
    className: "card",
    style: {
      padding: 13,
      display: "flex",
      alignItems: "center",
      gap: 13
    }
  }, React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "row gap-8 center mb-4"
  }, React.createElement("span", {
    style: {
      fontWeight: 560,
      fontSize: 13
    }
  }, s.name), React.createElement("span", {
    className: "tag",
    style: {
      fontSize: 10
    }
  }, s.count, " metrics")), React.createElement("p", {
    className: "t-small"
  }, s.desc)), React.createElement("button", {
    className: "btn btn-icon btn-ghost btn-sm",
    onClick: () => ctx.openEditSection(s)
  }, React.createElement(Icon, {
    name: "edit",
    size: 14
  })), React.createElement("div", {
    className: "toggle" + (isOn(s) ? " on" : ""),
    onClick: () => setStates(p => ({
      ...p,
      [s.name]: !isOn(s)
    }))
  })))), React.createElement("div", {
    className: "modal-foot",
    style: {
      justifyContent: "space-between"
    }
  }, React.createElement("span", {
    className: "t-small"
  }, enabled, " of ", userSections.length + builtIn.length, " groups enabled"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: onClose
  }, "Done")));
}
window.DealWizard = DealWizard;
window.CreateSectionModal = CreateSectionModal;
window.ManageSectionsModal = ManageSectionsModal;
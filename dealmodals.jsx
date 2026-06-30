/* ============================================================
   Deal modals → window.DealWizard, CreateSectionModal, ManageSectionsModal
   ============================================================ */
function DealWizard({ onClose }) {
  const ctx = useContext(AppCtx);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ kind: "Company", invType: "PE Direct", name: "", sector: "Healthcare", geo: "", source: "", size: "", stage: "Stage 1" });
  const steps = ["Deal Type", "Deal Details", "Documents", "Complete"];
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const next = () => setStep((s) => Math.min(3, s + 1));

  return (
    <Modal onClose={onClose} size="modal-lg">
      <div className="modal-head">
        <h2 className="t-h2">New Deal</h2>
        <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      {/* stepbar */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div className="stepbar">
          {steps.map((s, i) => (
            <div key={s} className={"step" + (i < step ? " done" : i === step ? " cur" : "")} style={{ flex: i === steps.length - 1 ? "none" : 1 }}>
              <span className="step-dot">{i < step ? <Icon name="check" size={13} /> : i + 1}</span>
              <span className="step-lbl">{s}</span>
              {i < steps.length - 1 && <span className="step-line"></span>}
            </div>
          ))}
        </div>
      </div>
      <div className="modal-body" style={{ minHeight: 280 }}>
        {step === 0 && (
          <div>
            <div className="label" style={{ marginBottom: 10 }}>Deal type</div>
            <div className="grid gap-12" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 20 }}>
              {[{ k: "Company", ic: "building", d: "A direct investment into an operating business." }, { k: "Fund", ic: "layers", d: "A primary commitment or co-invest into a fund." }].map((o) => (
                <div key={o.k} className="card card-hover pointer" style={{ padding: 16, borderColor: form.kind === o.k ? "var(--blue-500)" : "var(--border)", boxShadow: form.kind === o.k ? "0 0 0 3px var(--blue-50)" : "var(--sh-xs)" }} onClick={() => set("kind", o.k)}>
                  <div className="row between center mb-8">
                    <span style={{ width: 36, height: 36, borderRadius: 9, background: "var(--blue-50)", color: "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={o.ic} size={18} /></span>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid " + (form.kind === o.k ? "var(--blue-500)" : "var(--border-strong)"), display: "flex", alignItems: "center", justifyContent: "center" }}>{form.kind === o.k && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--blue-500)" }}></span>}</span>
                  </div>
                  <div className="t-h3">{o.k}</div>
                  <p className="t-small" style={{ marginTop: 3 }}>{o.d}</p>
                </div>
              ))}
            </div>
            <div className="label" style={{ marginBottom: 8 }}>Investment type</div>
            <select className="select" value={form.invType} onChange={(e) => set("invType", e.target.value)}>
              {["PE Direct", "Fund Primary", "Co-invest", "Secondary"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-14" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Company / Fund name" full><input className="input" placeholder="e.g. Meridian Surgical" value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Sector"><select className="select" value={form.sector} onChange={(e) => set("sector", e.target.value)}>{Object.keys(window.DB.SECTOR_COLOR).map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Geography"><input className="input" placeholder="e.g. Boston, MA" value={form.geo} onChange={(e) => set("geo", e.target.value)} /></Field>
            <Field label="Source / banker"><input className="input" placeholder="e.g. Jefferies" value={form.source} onChange={(e) => set("source", e.target.value)} /></Field>
            <Field label="Deal size ($M)"><input className="input" placeholder="e.g. 920" value={form.size} onChange={(e) => set("size", e.target.value)} /></Field>
            <Field label="Stage" full><select className="select" value={form.stage} onChange={(e) => set("stage", e.target.value)}>{["Stage 1", "Stage 2", "Stage 3", "Stage 4"].map((s) => <option key={s}>{s}</option>)}</select></Field>
          </div>
        )}
        {step === 2 && (
          <div>
            <div style={{ border: "2px dashed var(--border-strong)", borderRadius: 12, padding: 36, textAlign: "center", background: "var(--bg-subtle)" }}>
              <span className="empty-ic" style={{ margin: "0 auto 12px" }}><Icon name="upload" size={24} /></span>
              <div className="t-h3">Drag & drop the teaser, IM or model</div>
              <p className="t-small" style={{ margin: "5px auto 14px", maxWidth: 340 }}>The AI will auto-extract key metrics — revenue, EBITDA, valuation and management — straight from the deck.</p>
              <button className="btn btn-secondary btn-sm" style={{ margin: "0 auto" }}><Icon name="folder" size={13} /> Browse files</button>
            </div>
            <div className="card" style={{ marginTop: 14, padding: 12, display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ width: 30, height: 30, borderRadius: 7, background: "var(--red-50)", color: "var(--red-500)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="file" size={15} /></span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 540 }}>Teaser_Deck.pdf</div><div className="t-small">4.2 MB · extracting metrics…</div></div>
              <div className="skel" style={{ width: 60, height: 8 }}></div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="empty-state" style={{ padding: "20px 0" }}>
            <span style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--green-50)", color: "var(--green-500)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="checkCircle" size={32} /></span>
            <div><div className="t-h2">{form.name || "New deal"} added to pipeline</div><p className="t-body" style={{ marginTop: 5 }}>Metrics extracted and an AI fit score is being calculated.</p></div>
          </div>
        )}
      </div>
      <div className="modal-foot">
        {step > 0 && step < 3 && <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)} style={{ marginRight: "auto" }}><Icon name="chevLeft" size={14} /> Back</button>}
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        {step < 3 ? <button className="btn btn-primary" onClick={next}>{step === 2 ? "Finish" : "Next"} <Icon name="arrowRight" size={14} /></button>
          : <button className="btn btn-primary" onClick={() => { onClose(); ctx.navigate("workspace", { id: "meridian" }); }}>Open workspace <Icon name="arrowRight" size={14} /></button>}
      </div>
    </Modal>
  );
}
function Field({ label, children, full }) {
  return <div style={full ? { gridColumn: "1 / -1" } : {}}><div className="label" style={{ marginBottom: 7 }}>{label}</div>{children}</div>;
}

/* ---------- Create Section (AI builder) ---------- */
function CreateSectionModal({ deal, onClose }) {
  const ctx = useContext(AppCtx);
  const [text, setText] = useState("");
  const [gen, setGen] = useState(false);
  const examples = [
    "Track buyout performance with revenue-growth charts, EBITDA progression and an operational KPIs table",
    "Create a debt analysis section with leverage-ratio charts, an amortization schedule and covenant-compliance table",
    "Monitor company transformation with before/after metric charts, value-creation initiatives and a management-team table",
    "Build an exit-readiness analysis with valuation-multiple charts, comparable transactions and a strategic-buyer table",
  ];
  const generate = () => { setGen(true); setTimeout(() => { onClose(); ctx.toast("New section generated and added to the tear sheet", "ai"); }, 1600); };
  return (
    <Modal onClose={onClose} size="modal-lg">
      <div className="modal-head">
        <div>
          <div className="row gap-8 center mb-4"><span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--violet-50)", color: "var(--violet-500)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="sparkles" size={15} /></span><h2 className="t-h2">Create Section</h2></div>
          <p className="t-body">Use AI to describe what metrics you need and generate a complete custom section automatically.</p>
        </div>
        <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div className="modal-body">
        {gen ? (
          <div className="empty-state">
            <span className="empty-ic" style={{ background: "var(--violet-50)", color: "var(--violet-500)" }}><Icon name="sparkles" size={24} /></span>
            <div className="t-h3">Generating your section…</div>
            <div style={{ width: 220 }}><div className="skel" style={{ height: 8, marginBottom: 8 }}></div><div className="skel" style={{ height: 8, width: "70%", margin: "0 auto" }}></div></div>
          </div>
        ) : (
          <div>
            <div className="label" style={{ marginBottom: 8 }}>Describe your metrics</div>
            <textarea className="textarea" rows={4} maxLength={1000} placeholder="e.g., Track IRR, MOIC and cash flows for this PE investment, including quarterly performance charts and a detailed cash-flow table…" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="row end"><span className="t-small num" style={{ marginTop: 5 }}>{text.length}/1000</span></div>
            <div className="label" style={{ margin: "12px 0 9px" }}>{(deal && deal.strategy ? deal.strategy.toUpperCase() : "PE DIRECT")} examples</div>
            <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {examples.map((ex) => <button key={ex} className="chip" onClick={() => setText(ex)}><Icon name="sparkles" size={13} style={{ color: "var(--violet-500)", flex: "none" }} /> {ex}</button>)}
            </div>
          </div>
        )}
      </div>
      {!gen && <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!text.trim()} style={!text.trim() ? { opacity: 0.5, cursor: "not-allowed" } : {}} onClick={generate}><Icon name="sparkles" size={14} /> Generate Metrics <Icon name="arrowRight" size={14} /></button>
      </div>}
    </Modal>
  );
}

/* ---------- Manage Sections ---------- */
function ManageSectionsModal({ onClose }) {
  const ctx = useContext(AppCtx);
  const [tab, setTab] = useState("user");
  const [q, setQ] = useState("");
  const userSections = [
    { name: "IRR & Cash Flow Tracker", count: 8, desc: "Quarterly IRR, MOIC and cash-flow waterfall.", on: true },
    { name: "Customer Cohorts", count: 5, desc: "Retention, NRR and concentration analysis.", on: true },
    { name: "Debt & Covenants", count: 6, desc: "Leverage ratios and covenant compliance.", on: false },
  ];
  const builtIn = [
    { name: "Company Overview", count: 6, desc: "Description, HQ, sector, headcount.", on: true },
    { name: "Deal Terms", count: 5, desc: "Structure, amount, ownership, use of proceeds.", on: true },
    { name: "Financial & Valuation Highlights", count: 4, desc: "Valuation and headline financials.", on: true },
    { name: "Financial Statements Summary", count: 12, desc: "Multi-year P&L, balance sheet, cash flow.", on: true },
    { name: "Key People", count: 4, desc: "Executive team profiles.", on: true },
    { name: "Competitive Landscape", count: 7, desc: "Peer positioning and market share.", on: false },
  ];
  const list = tab === "user" ? userSections : builtIn;
  const filtered = list.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  const [states, setStates] = useState({});
  const isOn = (s) => states[s.name] !== undefined ? states[s.name] : s.on;
  const enabled = [...userSections, ...builtIn].filter((s) => isOn(s)).length;

  return (
    <Modal onClose={onClose} size="modal-lg">
      <div className="modal-head">
        <div><h2 className="t-h2">Manage Dashboard Sections</h2><p className="t-body">Enable or disable sections for this project. Enabled sections appear in your dashboard.</p></div>
        <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div style={{ padding: "14px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <Seg value={tab} onChange={setTab} options={[{ value: "user", label: `User Sections (${userSections.length})` }, { value: "builtin", label: `Built-in Sections (${builtIn.length})` }]} />
        <div className="global-search" style={{ flex: 1, height: 34 }}>
          <Icon name="search" size={15} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sections…" style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: "inherit", fontSize: 13 }} />
        </div>
      </div>
      <div className="modal-body scroll" style={{ maxHeight: 380, display: "flex", flexDirection: "column", gap: 9 }}>
        {filtered.map((s) => (
          <div key={s.name} className="card" style={{ padding: 13, display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row gap-8 center mb-4"><span style={{ fontWeight: 560, fontSize: 13 }}>{s.name}</span><span className="tag" style={{ fontSize: 10 }}>{s.count} metrics</span></div>
              <p className="t-small">{s.desc}</p>
            </div>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={() => ctx.openEditSection(s)}><Icon name="edit" size={14} /></button>
            <div className={"toggle" + (isOn(s) ? " on" : "")} onClick={() => setStates((p) => ({ ...p, [s.name]: !isOn(s) }))}></div>
          </div>
        ))}
      </div>
      <div className="modal-foot" style={{ justifyContent: "space-between" }}>
        <span className="t-small">{enabled} of {userSections.length + builtIn.length} groups enabled</span>
        <button className="btn btn-primary" onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
}
window.DealWizard = DealWizard;
window.CreateSectionModal = CreateSectionModal;
window.ManageSectionsModal = ManageSectionsModal;

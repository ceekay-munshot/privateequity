/* ============================================================
   Memo & Model Automation + Comparables → window.MemosView
   ============================================================ */
function MemosView() {
  const [tab, setTab] = useState("generate");
  return (
    <div className="page page-wide">
      <PageHead title="Memos & Models" sub="Turn a deal's emails, IM and documents into your firm's own deliverables — what's a 3–4 day analyst job, in minutes." />
      <div className="mb-16"><Seg value={tab} onChange={setTab} options={[
        { value: "generate", label: "Generate", icon: "sparkles" },
        { value: "model", label: "Model", icon: "table" },
        { value: "comps", label: "Comparables", icon: "scale" },
        { value: "velocity", label: "E-com Velocity", icon: "cart" },
      ]} /></div>
      {tab === "generate" && <GenerateTab />}
      {tab === "model" && <ModelTab />}
      {tab === "comps" && <CompsTab />}
      {tab === "velocity" && <VelocityTab />}
    </div>
  );
}

function GenerateTab() {
  const ctx = useContext(AppCtx);
  const [deal, setDeal] = useState("Meridian Surgical");
  const [output, setOutput] = useState("Screening Memo");
  const [tmpl, setTmpl] = useState("Paragon IC Memo v3");
  const [running, setRunning] = useState(false);
  const outputs = [{ k: "Screening Memo", ic: "fileText" }, { k: "Investment Memo", ic: "documents" }, { k: "One-Pager", ic: "file" }, { k: "Tear Sheet", ic: "grid" }];
  const run = () => { setRunning(true); setTimeout(() => setRunning(false), 2200); };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
      <div className="card card-pad">
        <div className="label mb-8">1 · Source deal</div>
        <select className="select mb-16" value={deal} onChange={(e) => setDeal(e.target.value)}>{window.DB.deals.map((d) => <option key={d.id}>{d.name}</option>)}</select>

        <div className="label mb-8">2 · Output</div>
        <div className="grid gap-10 mb-16" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          {outputs.map((o) => (
            <div key={o.k} className="card card-hover pointer" style={{ padding: 12, textAlign: "center", borderColor: output === o.k ? "var(--blue-500)" : "var(--border)", boxShadow: output === o.k ? "0 0 0 3px var(--blue-50)" : "var(--sh-xs)" }} onClick={() => setOutput(o.k)}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue-50)", color: "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 7px" }}><Icon name={o.ic} size={16} /></span>
              <div style={{ fontSize: 12, fontWeight: 540 }}>{o.k}</div>
            </div>
          ))}
        </div>

        <div className="row gap-8 center mb-16" style={{ padding: "9px 12px", borderRadius: 9, background: "var(--violet-50)", border: "1px solid #e3d9fd" }}>
          <Icon name="sparkles" size={14} style={{ color: "var(--violet-500)", flex: "none" }} />
          <span className="t-small" style={{ color: "var(--text-primary)" }}>Screening memos & one-pagers are auto-drafted by reading the deal's emails + IM against your house template.</span>
        </div>

        <div className="label mb-8">3 · Format template</div>
        <div className="row gap-10 mb-16">
          <select className="select" value={tmpl} onChange={(e) => setTmpl(e.target.value)}>{["Paragon IC Memo v3", "One-Pager (house style)", "Screening Memo (1-page)"].map((t) => <option key={t}>{t}</option>)}</select>
          <button className="btn btn-secondary nowrap" onClick={() => ctx.navigate("templates")}><Icon name="templates" size={14} /> Manage</button>
        </div>

        <div className="label mb-8">4 · Data scope</div>
        <div className="row gap-8 wrap mb-16">
          <span className="tag"><Icon name="check" size={11} style={{ color: "var(--green-500)" }} /> Deal files (7)</span>
          <span className="tag"><Icon name="check" size={11} style={{ color: "var(--green-500)" }} /> PitchBook comps</span>
          <span className="tag" style={{ opacity: 0.5 }}>+ Add source</span>
        </div>

        <div className="row gap-10 center" style={{ paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <label className="row gap-7 center t-small pointer"><input type="checkbox" style={{ accentColor: "var(--blue-500)" }} /> Auto-regenerate when new data arrives</label>
          <button className="btn btn-primary" style={{ marginLeft: "auto" }} onClick={run} disabled={running}>{running ? <><Icon name="sparkles" size={15} /> Generating…</> : <><Icon name="sparkles" size={15} /> Generate {output}</>}</button>
        </div>
        {running && <div style={{ marginTop: 14 }}><div className="skel" style={{ height: 9, marginBottom: 8 }}></div><div className="skel" style={{ height: 9, width: "78%", marginBottom: 8 }}></div><div className="skel" style={{ height: 9, width: "54%" }}></div></div>}
      </div>

      <div className="col gap-16">
        {/* automated weekly output */}
        <div className="card card-pad" style={{ borderColor: "var(--blue-200)", background: "linear-gradient(180deg, var(--blue-50), #fff 70%)" }}>
          <div className="row gap-8 center mb-8"><span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--blue-100)", color: "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="calendar" size={15} /></span><h3 className="t-h3">Weekly Output</h3></div>
          <p className="t-small mb-12">An automated weekly pipeline pack (PDF) — new deals, status moves and decisions — ready to send to the team for Monday's meeting.</p>
          <button className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => ctx.toast("Weekly pipeline PDF generated & sent to the team", "check")}><Icon name="download" size={13} /> Generate & send weekly PDF</button>
          <div className="row gap-6 center mt-12 t-small" style={{ color: "var(--text-muted)" }}><Icon name="check" size={12} style={{ color: "var(--green-500)" }} /> Auto-runs every Monday 7:00 AM</div>
        </div>

        <div className="card card-pad">
          <div className="rail-panel-head"><h3 className="t-h3">Generated Library</h3></div>
          {[
            { n: "Meridian — Screening Memo", t: "Verified", time: "2h ago", c: "verified" },
            { n: "Northwind — One-Pager", t: "Needs Review", time: "1d ago", c: "review" },
            { n: "Cobalt — Tear Sheet", t: "Verified", time: "3d ago", c: "verified" },
          ].map((g, i) => (
            <div key={i} className="row between center pointer" style={{ padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }} onClick={() => ctx.toast("Opening " + g.n, "")}>
              <div className="row gap-10 center"><span style={{ width: 28, height: 28, borderRadius: 7, background: "var(--red-50)", color: "var(--red-500)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="fileText" size={14} /></span><div><div style={{ fontSize: 12.5, fontWeight: 540 }}>{g.n}</div><div className="t-small">{g.time}</div></div></div>
              <span className="row gap-5 center"><ConfDot level={g.c} /><span className="t-small">{g.t}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModelTab() {
  return (
    <div className="card card-pad" style={{ maxWidth: 980 }}>
      <div className="row between center mb-16">
        <div><h3 className="t-h3">Model — Meridian vs. listed comps</h3><p className="t-small">Banker's model mapped into your standard template. Rows matched across files even when named differently.</p></div>
        <button className="btn btn-secondary btn-sm"><Icon name="upload" size={13} /> Upload model</button>
      </div>
      <div className="scroll" style={{ overflowX: "auto" }}>
        <table className="dtable">
          <thead><tr><th>Metric</th><th className="num">Meridian (deal)</th><th className="num">Comp A</th><th className="num">Comp B</th><th className="num">Comp C</th><th>Check</th></tr></thead>
          <tbody>
            {[
              ["Revenue growth", "24%", "18%", "15%", "21%", "verified"],
              ["EBITDA margin", "27.1%", "24.0%", "29.5%", "22.8%", "verified"],
              ["Recurring mix", "62%", "55%", "71%", "48%", "verified"],
              ["EV / Revenue", "6.2x", "5.8x", "7.1x", "5.2x", "estimated"],
              ["EV / EBITDA", "23.9x", "21.0x", "24.5x", "19.8x", "review"],
              ["Rule of 40", "51", "42", "45", "44", "verified"],
            ].map((r, i) => (
              <tr key={i} style={{ cursor: "default" }}>
                <td style={{ fontWeight: 540 }}>{r[0]}</td>
                <td className="num" style={{ fontWeight: 600, background: "var(--blue-50)" }}>{r[1]}</td>
                <td className="num">{r[2]}</td><td className="num">{r[3]}</td><td className="num">{r[4]}</td>
                <td><span className="row gap-5 center"><ConfDot level={r[5]} /><span className="t-small">{r[5] === "review" ? "Discrepancy" : r[5] === "estimated" ? "Estimated" : "OK"}</span></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="alert-row warn mt-16">
        <span className="alert-ic" style={{ background: "var(--amber-100)", color: "var(--amber-600)" }}><Icon name="alert" size={16} /></span>
        <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 560 }}>Critic AI flagged 1 discrepancy</div><div className="t-small">EV/EBITDA of 23.9x uses management's adj. EBITDA; the audited figure implies 26.4x. <span style={{ color: "var(--blue-600)", fontWeight: 540, cursor: "pointer" }}>Drill through to source →</span></div></div>
      </div>
    </div>
  );
}

function CompsTab() {
  const rows = [
    { co: "Meridian Surgical", type: "Private (deal)", rev: "142", growth: "24%", evrev: "6.2x", evebitda: "23.9x", live: false },
    { co: "Intuitive (proxy)", type: "Public", rev: "7,120", growth: "14%", evrev: "11.4x", evebitda: "34.0x", live: false },
    { co: "Globus Medical", type: "Public", rev: "2,510", growth: "19%", evrev: "4.9x", evebitda: "18.2x", live: false },
    { co: "OrthoFix transaction", type: "M&A · just printed", rev: "—", growth: "—", evrev: "5.1x", evebitda: "—", live: true },
  ];
  return (
    <div style={{ maxWidth: 980 }}>
      <div className="card" style={{ marginBottom: 14, padding: "11px 16px", display: "flex", gap: 10, alignItems: "center", borderColor: "var(--green-100)", background: "var(--green-50)" }}>
        <Icon name="trending" size={15} style={{ color: "var(--green-600)" }} />
        <span className="t-small" style={{ color: "var(--text-primary)" }}>Auto-updated 14m ago — <strong>OrthoFix</strong> transaction printed at 5.1x revenue, pulled from the deals feed.</span>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <table className="dtable">
          <thead><tr><th>Company</th><th>Type</th><th className="num">Revenue $M</th><th className="num">Growth</th><th className="num">EV/Rev</th><th className="num">EV/EBITDA</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.co} className={r.live ? "row-new" : ""} style={{ cursor: "default" }}>
                <td><span className="row gap-7 center" style={{ fontWeight: 540 }}>{r.co}{r.live && <span className="pill pill-new" style={{ fontSize: 9 }}>NEW</span>}</span></td>
                <td><span className="tag">{r.type}</span></td>
                <td className="num">{r.rev}</td><td className="num">{r.growth}</td>
                <td className="num">{r.live ? <span className="row gap-5 center" style={{ justifyContent: "flex-end" }}>{r.evrev}<Cite n={1} /></span> : r.evrev}</td>
                <td className="num">{r.evebitda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VelocityTab() {
  const brands = [
    { b: "Lumen Skincare", mine: true, mrp: 38, disc: 12, stock: 94, trend: [40, 44, 48, 52, 58, 63, 69, 76] },
    { b: "Glowe", mine: false, mrp: 34, disc: 28, stock: 71, trend: [55, 52, 50, 48, 47, 45, 44, 42] },
    { b: "Aera Beauty", mine: false, mrp: 42, disc: 8, stock: 88, trend: [30, 33, 35, 38, 41, 44, 47, 50] },
  ];
  return (
    <div style={{ maxWidth: 880 }}>
      <p className="t-small mb-16">Marketplace velocity scraped from Amazon, Nykaa & Flipkart — MRP, discount depth and in-stock over time. Your tracked investments are flagged.</p>
      <div className="col gap-12">
        {brands.map((b) => (
          <div key={b.b} className="card card-pad" style={{ borderColor: b.mine ? "var(--blue-200)" : "var(--border)" }}>
            <div className="row between center mb-12">
              <div className="row gap-8 center"><span style={{ fontWeight: 600, fontSize: 13.5 }}>{b.b}</span>{b.mine && <span className="pill pill-screening" style={{ fontSize: 10 }}><span className="dot"></span>Tracked</span>}</div>
              <Sparkline data={b.trend} color={b.mine ? "#2f6bff" : "#7c8597"} w={120} h={32} />
            </div>
            <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              <VStat k="Avg MRP" v={"$" + b.mrp} />
              <VStat k="Discount depth" v={b.disc + "%"} warn={b.disc > 20} />
              <VStat k="In-stock" v={b.stock + "%"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function VStat({ k, v, warn }) {
  return <div><div className="metric-label" style={{ marginBottom: 3 }}>{k}</div><div className="num" style={{ fontSize: 17, fontWeight: 620, color: warn ? "var(--amber-600)" : "var(--text-primary)" }}>{v}</div></div>;
}
window.MemosView = MemosView;

/* ============================================================
   Edit Custom Section — deep metric authoring
   window.EditSectionModal
   ============================================================ */
function EditSectionModal({ section, onClose }) {
  const ctx = useContext(AppCtx);
  const name = (section && section.name) || "Custom Section";
  const [groupName, setGroupName] = useState(name);
  const [web, setWeb] = useState(false);
  const [instr, setInstr] = useState("Extract all historical funding rounds — date, amount raised, round type, pre/post-money valuation — and present as a timeline chart with round types annotated and valuation on a secondary axis.");
  const [metrics, setMetrics] = useState([
    { id: "m1", display: "Funding timeline", type: "Chart", ai: "Line+marker chart. X-axis: round close date (Date). Y-axis (left): amount raised (Currency, $M). Secondary Y-axis: post-money valuation (Currency, $M). Annotate each marker with the round type." },
    { id: "m2", display: "Rounds table", type: "Table", ai: "Columns: Date (human-readable), Round type, Amount raised (rounded, $M), Lead investor, Post-money ($M), Notes. One row per round, newest first." },
    { id: "m3", display: "Total raised to date", type: "Currency", ai: "Sum of all primary capital raised across rounds, in $M. Exclude secondary transactions." },
  ]);

  const addMetric = () => setMetrics((m) => [...m, { id: "m" + Date.now(), display: "", type: "Text", ai: "" }]);
  const delMetric = (id) => setMetrics((m) => m.filter((x) => x.id !== id));
  const upd = (id, patch) => setMetrics((m) => m.map((x) => x.id === id ? { ...x, ...patch } : x));

  return (
    <Modal onClose={onClose} size="modal-lg">
      <div className="modal-head">
        <div>
          <h2 className="t-h2">Edit Custom Section</h2>
          <p className="t-body">Modify the configuration for “{name}”. Update prompts, RAG queries, and individual metrics within the group.</p>
        </div>
        <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div className="modal-body scroll" style={{ maxHeight: "64vh", background: "var(--bg-subtle)" }}>
        {/* group config */}
        <div className="card card-pad" style={{ marginBottom: 16 }}>
          <div className="label mb-8">Group Name</div>
          <input className="input mb-16" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <div className="row between center" style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 9, marginBottom: 14 }}>
            <span className="row gap-9 center"><span style={{ width: 28, height: 28, borderRadius: 7, background: "var(--green-50)", color: "var(--green-600)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="globe" size={14} /></span><div><div style={{ fontSize: 12.5, fontWeight: 540 }}>Enable web search for additional context</div><div className="t-small">Supplement document extraction with recent web results</div></div></span>
            <div className={"toggle" + (web ? " on" : "")} onClick={() => setWeb((w) => !w)}></div>
          </div>
          <div className="row gap-6 center mb-8">
            <span className="label" style={{ margin: 0 }}>Additional Instructions</span>
            <span className="tip" style={{ display: "inline-flex" }}><Icon name="info" size={13} style={{ color: "var(--gray-400)" }} /><span className="tip-bub" style={{ width: 230, whiteSpace: "normal", textAlign: "left" }}>Group-level RAG query — tells the AI what to pull across the section and how to present it.</span></span>
          </div>
          <textarea className="textarea" rows={3} value={instr} onChange={(e) => setInstr(e.target.value)} />
        </div>

        {/* metrics */}
        <div className="row between center mb-12">
          <div className="row gap-8 center"><h3 className="t-h3">Metrics to Extract</h3><span className="tag">{metrics.length}</span></div>
          <button className="btn btn-secondary btn-sm" onClick={addMetric}><Icon name="plus" size={13} /> Add Metric</button>
        </div>
        <div className="col gap-10">
          {metrics.map((m, i) => <EsMetricCard key={m.id} m={m} i={i} upd={upd} del={() => delMetric(m.id)} canDel={metrics.length > 1} />)}
        </div>

        <div className="row gap-8 center" style={{ marginTop: 14, color: "var(--text-muted)", padding: "0 2px" }}>
          <Icon name="sparkles" size={14} />
          <span className="t-small">Each metric is a tightly-scoped, individually-instructed task — narrow prompts per metric keep extraction accurate and avoid hallucination.</span>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => { onClose(); ctx.toast("Section configuration saved", "check"); }}><Icon name="check" size={14} /> Save Section</button>
      </div>
    </Modal>
  );
}

const ES_TYPES = ["Chart", "Table", "Text", "Number", "Currency", "Date"];
const ES_TYPE_ICON = { Chart: "trending", Table: "table", Text: "fileText", Number: "scale", Currency: "scale", Date: "calendar" };

function EsMetricCard({ m, i, upd, del, canDel }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="row gap-10" style={{ alignItems: "flex-start" }}>
        <div className="col center" style={{ gap: 4, paddingTop: 2 }}>
          <Icon name="columns" size={14} style={{ color: "var(--gray-400)", cursor: "grab" }} />
          <span className="num" style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>#{i + 1}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="grid gap-12 mb-12" style={{ gridTemplateColumns: "1fr 180px" }}>
            <div>
              <div className="label mb-4">Display Name</div>
              <input className="input" value={m.display} placeholder="e.g. Funding timeline" onChange={(e) => upd(m.id, { display: e.target.value })} />
            </div>
            <div>
              <div className="row gap-5 center mb-4"><span className="label" style={{ margin: 0 }}>Data Type</span><span className="tip" style={{ display: "inline-flex" }}><Icon name="info" size={12} style={{ color: "var(--gray-400)" }} /><span className="tip-bub">How this metric is rendered</span></span></div>
              <div className="select-wrap" style={{ position: "relative" }}>
                <select className="select" value={m.type} onChange={(e) => upd(m.id, { type: e.target.value })}>{ES_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
              </div>
            </div>
          </div>
          <div className="label mb-4">AI Instructions</div>
          <textarea className="textarea" rows={3} value={m.ai} placeholder="Per-metric extraction & rendering spec…" onChange={(e) => upd(m.id, { ai: e.target.value })} />
        </div>
        <button className="btn btn-icon btn-ghost btn-sm" disabled={!canDel} style={!canDel ? { opacity: 0.4 } : {}} onClick={del}><Icon name="flag" size={14} style={{ color: "var(--red-500)" }} /></button>
      </div>
    </div>
  );
}
window.EditSectionModal = EditSectionModal;

/* ============================================================
   Provenance & fact-check — Source modal + inline PDF viewer
   window.SourceModal
   ============================================================ */
function SourceModal({ metric, value, onClose }) {
  const list = window.DB.sources[metric] || window.DB.sources.default;
  const [active, setActive] = useState(null); // index of open file
  const [zoom, setZoom] = useState(100);

  if (active !== null) {
    const s = list[active];
    return (
      <div className="overlay center" onMouseDown={onClose}>
        <div className="modal modal-xl" onMouseDown={(e) => e.stopPropagation()} style={{ height: "86vh", maxHeight: "86vh" }}>
          <div className="modal-head">
            <div className="row gap-10 center">
              <button className="x-btn" onClick={() => setActive(null)}><Icon name="chevLeft" size={18} /></button>
              <div>
                <div className="t-h3">{s.doc}</div>
                <div className="t-small">Page {s.page} · {s.type}</div>
              </div>
            </div>
            <div className="row gap-8 center">
              <div className="seg">
                <div className="seg-item" onClick={() => setZoom((z) => Math.max(60, z - 10))}><Icon name="zoomOut" size={14} /></div>
                <div className="seg-item active num" style={{ minWidth: 48, justifyContent: "center" }}>{zoom}%</div>
                <div className="seg-item" onClick={() => setZoom((z) => Math.min(160, z + 10))}><Icon name="zoomIn" size={14} /></div>
              </div>
              <button className="btn btn-secondary btn-sm"><Icon name="search" size={13} /> Search</button>
              <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
            {/* PDF page */}
            <div className="scroll" style={{ flex: 1, overflow: "auto", background: "var(--bg-sunken)", padding: 24, display: "flex", justifyContent: "center" }}>
              <FakePdfPage doc={s} zoom={zoom} />
            </div>
            {/* citation rail */}
            <div className="scroll" style={{ width: 320, flex: "none", borderLeft: "1px solid var(--border)", overflow: "auto", padding: 16, background: "#fff" }}>
              <div className="label" style={{ marginBottom: 10 }}>Supporting citation</div>
              <div className="card card-pad" style={{ marginBottom: 14, borderColor: "var(--blue-200)", background: "var(--blue-50)" }}>
                <div className="row between center mb-8">
                  <span className="tag" style={{ background: "#fff" }}><Icon name="file" size={11} /> Page {s.page}</span>
                  <ConfDot level="verified" />
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--text-primary)" }}>“{s.excerpt}”</p>
              </div>
              {value && (
                <div className="kv" style={{ marginBottom: 14 }}>
                  <span className="k">Extracted value</span>
                  <span className="v num" style={{ fontSize: 18, fontWeight: 650 }}>{value}</span>
                </div>
              )}
              <div className="label" style={{ marginBottom: 8 }}>Critic AI review</div>
              <div className="alert-row" style={{ background: "var(--green-50)", borderColor: "var(--green-100)" }}>
                <span className="alert-ic" style={{ background: "var(--green-100)", color: "var(--green-600)" }}><Icon name="checkCircle" size={16} /></span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 560 }}>Cross-checked · consistent</div>
                  <div className="t-small">Value matches across 2 documents. No discrepancy found.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal onClose={onClose} size="modal-lg">
      <div className="modal-head">
        <div>
          <div className="row gap-8 center mb-8">
            <span className="ic" style={{ width: 30, height: 30, borderRadius: 8, background: "var(--blue-50)", color: "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="sourceDoc" size={16} /></span>
            <h2 className="t-h2">Source Information</h2>
          </div>
          <p className="t-body"><strong style={{ color: "var(--text-primary)", fontWeight: 560 }}>{metric === "default" ? "This value" : metric}</strong> was determined using the following {list.length} source{list.length > 1 ? "s" : ""}.</p>
        </div>
        <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map((s, i) => (
          <div key={i} className="card card-pad card-hover" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span className="logo-tile" style={{ background: "var(--red-50)", color: "var(--red-500)", borderRadius: 8 }}><Icon name="file" size={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row between center" style={{ marginBottom: 4 }}>
                <span className="t-h3">{s.doc}</span>
                <span className="tag">{s.type}</span>
              </div>
              <div className="t-small" style={{ marginBottom: 8 }}>Page {s.page}</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--text-secondary)", borderLeft: "2px solid var(--blue-200)", paddingLeft: 10 }}>“{s.excerpt}”</p>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ flex: "none" }} onClick={() => setActive(i)}><Icon name="eye" size={13} /> View file</button>
          </div>
        ))}
        <div className="row gap-8 center" style={{ padding: "4px 2px", color: "var(--text-muted)" }}>
          <Icon name="info" size={14} />
          <span className="t-small">Every figure links back to a sourced quote. A human can always override.</span>
        </div>
      </div>
    </Modal>
  );
}

/* a stylized PDF page with the cited line highlighted */
function FakePdfPage({ doc, zoom }) {
  const lines = [
    { w: "62%" }, { w: "88%" }, { w: "80%" }, { w: "40%", gap: true },
    { w: "70%", head: true }, { w: "92%" }, { w: "85%" },
    { w: "100%", cite: true }, { w: "78%", cite: true },
    { w: "55%", gap: true }, { w: "90%" }, { w: "83%" }, { w: "94%" }, { w: "48%" },
    { w: "72%", head: true }, { w: "96%" }, { w: "88%" }, { w: "60%" },
  ];
  return (
    <div style={{ width: 612 * (zoom / 100), background: "#fff", boxShadow: "var(--sh-md)", borderRadius: 4, padding: 54, flexShrink: 0, transformOrigin: "top center" }}>
      <div className="row between center" style={{ marginBottom: 22, paddingBottom: 12, borderBottom: "1px solid var(--gray-200)" }}>
        <div className="num" style={{ fontSize: 10, color: "var(--gray-400)", letterSpacing: "0.1em" }}>CONFIDENTIAL</div>
        <div className="num" style={{ fontSize: 10, color: "var(--gray-400)" }}>{doc.doc} · p.{doc.page}</div>
      </div>
      {lines.map((l, i) => (
        l.head ? (
          <div key={i} style={{ height: 11, width: l.w, background: "var(--gray-700)", borderRadius: 2, margin: "22px 0 12px", opacity: 0.85 }}></div>
        ) : l.cite ? (
          <div key={i} style={{ height: 8, width: l.w, background: "var(--amber-100)", borderRadius: 2, margin: "7px 0", boxShadow: "0 0 0 3px var(--amber-50)" }}></div>
        ) : (
          <div key={i} style={{ height: 7, width: l.w, background: "var(--gray-200)", borderRadius: 2, margin: l.gap ? "7px 0 20px" : "7px 0" }}></div>
        )
      ))}
      <div style={{ marginTop: 24, padding: 14, border: "1px dashed var(--amber-500)", borderRadius: 8, background: "var(--amber-50)" }}>
        <div className="row gap-6 center" style={{ marginBottom: 6 }}>
          <Icon name="target" size={13} style={{ color: "var(--amber-600)" }} />
          <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--amber-600)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Cited passage</span>
        </div>
        <p style={{ fontSize: 11.5, lineHeight: 1.5, color: "var(--text-primary)" }}>“{doc.excerpt}”</p>
      </div>
    </div>
  );
}
window.SourceModal = SourceModal;

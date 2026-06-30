/* ============================================================
   Notification center → window.NotificationBell, NotificationsView
   Unified inbox surfaced in the top-bar bell and the sidebar.
   Read-state + email-drawer open are lifted to AppCtx.
   ============================================================ */
const NOTIF_META = {
  deal:     { icon: "layers",     color: "#7c5cfc", label: "New deal" },
  flag:     { icon: "flag",       color: "#e08a00", label: "Metric flag" },
  stage:    { icon: "arrowRight",  color: "#2f6bff", label: "Stage change" },
  pipeline: { icon: "columns",    color: "#16a34a", label: "Pipeline" },
};

function runNotif(ctx, n) {
  ctx.markNotifRead(n.id);
  const a = n.action;
  if (!a) return;
  const [t, id] = a.split(":");
  if (t === "deal") ctx.navigate("workspace", { id });
  else if (t === "sector") ctx.navigate("sectorco", { id });
  else if (t === "view") ctx.navigate(id);
}

function notifUnread(ctx) {
  return window.DB.notifications.filter((n) => n.unread && !ctx.notifRead[n.id]);
}

/* ---------- Top-bar bell + popover ---------- */
function NotificationBell() {
  const ctx = useContext(AppCtx);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);
  const items = window.DB.notifications;
  const unread = notifUnread(ctx).length;
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button className="btn btn-icon btn-ghost tip" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        <Icon name="bell" size={18} />
        {unread > 0 && <span className="notif-badge">{unread}</span>}
        {!open && <span className="tip-bub">Notifications</span>}
      </button>
      {open && (
        <div className="menu notif-pop" style={{ top: "calc(100% + 8px)", right: 0 }} onClick={(e) => e.stopPropagation()}>
          <div className="notif-pop-head">
            <span className="t-h3">Notifications</span>
            {unread > 0 && <button className="notif-link" onClick={() => ctx.markAllNotif()}>Mark all read</button>}
          </div>
          <div className="notif-pop-list scroll">
            {items.slice(0, 6).map((n) => {
              const m = NOTIF_META[n.kind] || NOTIF_META.system;
              const isUnread = n.unread && !ctx.notifRead[n.id];
              return (
                <div key={n.id} className={"notif-item" + (isUnread ? " unread" : "")} onClick={() => { runNotif(ctx, n); setOpen(false); }}>
                  <span className="notif-ic" style={{ background: m.color + "1a", color: m.color }}><Icon name={m.icon} size={14} /></span>
                  <span className="notif-body">
                    <span className="notif-title">{n.title}</span>
                    <span className="notif-detail">{n.detail}</span>
                    <span className="notif-time">{n.time}</span>
                  </span>
                  {isUnread && <span className="notif-unread-dot"></span>}
                </div>
              );
            })}
          </div>
          <div className="notif-pop-foot" onClick={() => { setOpen(false); ctx.navigate("notifications"); }}>
            View all notifications <Icon name="arrowRight" size={13} />
          </div>
        </div>
      )}
    </span>
  );
}

/* ---------- Full notifications view (sidebar) ---------- */
function NotificationsView() {
  const ctx = useContext(AppCtx);
  const [filter, setFilter] = useState("all");
  const items = window.DB.notifications;
  const shown = filter === "unread" ? items.filter((n) => n.unread && !ctx.notifRead[n.id]) : items;
  const unread = notifUnread(ctx).length;
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <PageHead title="Notifications" sub="Deal-flow activity — new deals, metric flags, stage changes and pipeline updates.">
        {unread > 0 && <button className="btn btn-secondary" onClick={() => ctx.markAllNotif()}><Icon name="check" size={14} /> Mark all read</button>}
      </PageHead>
      <div className="row between center mb-16">
        <Seg value={filter} onChange={setFilter} options={[{ value: "all", label: "All" }, { value: "unread", label: `Unread${unread ? " · " + unread : ""}` }]} />
        <span className="t-small">{shown.length} item{shown.length === 1 ? "" : "s"}</span>
      </div>
      {shown.length === 0 ? (
        <div className="empty-state"><span className="empty-ic"><Icon name="checkCircle" size={26} /></span><div className="t-h3">You're all caught up</div><p className="t-body">No unread notifications.</p></div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          {shown.map((n, i) => {
            const m = NOTIF_META[n.kind] || NOTIF_META.system;
            const isUnread = n.unread && !ctx.notifRead[n.id];
            return (
              <div key={n.id} className={"notif-row" + (isUnread ? " unread" : "")} style={{ borderBottom: i < shown.length - 1 ? "1px solid var(--border)" : "none" }} onClick={() => runNotif(ctx, n)}>
                <span className="notif-ic" style={{ background: m.color + "1a", color: m.color }}><Icon name={m.icon} size={15} /></span>
                <div className="notif-body">
                  <div className="row gap-8 center"><span className="notif-title">{n.title}</span><span className="tag" style={{ fontSize: 10 }}>{m.label}</span></div>
                  <span className="notif-detail">{n.detail}</span>
                  <span className="notif-time">{n.time}</span>
                </div>
                <div className="row gap-8 center" style={{ flex: "none" }}>
                  {isUnread && <span className="notif-unread-dot"></span>}
                  <Icon name="arrowRight" size={14} style={{ color: "var(--gray-300)" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

window.NotificationBell = NotificationBell;
window.NotificationsView = NotificationsView;

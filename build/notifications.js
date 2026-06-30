const NOTIF_META = {
  deal: {
    icon: "layers",
    color: "#7c5cfc",
    label: "New deal"
  },
  flag: {
    icon: "flag",
    color: "#e08a00",
    label: "Metric flag"
  },
  stage: {
    icon: "arrowRight",
    color: "#2f6bff",
    label: "Stage change"
  },
  pipeline: {
    icon: "columns",
    color: "#16a34a",
    label: "Pipeline"
  }
};
function runNotif(ctx, n) {
  ctx.markNotifRead(n.id);
  const a = n.action;
  if (!a) return;
  const [t, id] = a.split(":");
  if (t === "deal") ctx.navigate("workspace", {
    id
  });else if (t === "sector") ctx.navigate("sectorco", {
    id
  });else if (t === "view") ctx.navigate(id);
}
function notifUnread(ctx) {
  return window.DB.notifications.filter(n => n.unread && !ctx.notifRead[n.id]);
}
function NotificationBell() {
  const ctx = useContext(AppCtx);
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
  const items = window.DB.notifications;
  const unread = notifUnread(ctx).length;
  return React.createElement("span", {
    ref: ref,
    style: {
      position: "relative",
      display: "inline-flex"
    }
  }, React.createElement("button", {
    className: "btn btn-icon btn-ghost tip",
    onClick: () => setOpen(o => !o),
    "aria-label": "Notifications"
  }, React.createElement(Icon, {
    name: "bell",
    size: 18
  }), unread > 0 && React.createElement("span", {
    className: "notif-badge"
  }, unread), !open && React.createElement("span", {
    className: "tip-bub"
  }, "Notifications")), open && React.createElement("div", {
    className: "menu notif-pop",
    style: {
      top: "calc(100% + 8px)",
      right: 0
    },
    onClick: e => e.stopPropagation()
  }, React.createElement("div", {
    className: "notif-pop-head"
  }, React.createElement("span", {
    className: "t-h3"
  }, "Notifications"), unread > 0 && React.createElement("button", {
    className: "notif-link",
    onClick: () => ctx.markAllNotif()
  }, "Mark all read")), React.createElement("div", {
    className: "notif-pop-list scroll"
  }, items.slice(0, 6).map(n => {
    const m = NOTIF_META[n.kind] || NOTIF_META.system;
    const isUnread = n.unread && !ctx.notifRead[n.id];
    return React.createElement("div", {
      key: n.id,
      className: "notif-item" + (isUnread ? " unread" : ""),
      onClick: () => {
        runNotif(ctx, n);
        setOpen(false);
      }
    }, React.createElement("span", {
      className: "notif-ic",
      style: {
        background: m.color + "1a",
        color: m.color
      }
    }, React.createElement(Icon, {
      name: m.icon,
      size: 14
    })), React.createElement("span", {
      className: "notif-body"
    }, React.createElement("span", {
      className: "notif-title"
    }, n.title), React.createElement("span", {
      className: "notif-detail"
    }, n.detail), React.createElement("span", {
      className: "notif-time"
    }, n.time)), isUnread && React.createElement("span", {
      className: "notif-unread-dot"
    }));
  })), React.createElement("div", {
    className: "notif-pop-foot",
    onClick: () => {
      setOpen(false);
      ctx.navigate("notifications");
    }
  }, "View all notifications ", React.createElement(Icon, {
    name: "arrowRight",
    size: 13
  }))));
}
function NotificationsView() {
  const ctx = useContext(AppCtx);
  const [filter, setFilter] = useState("all");
  const items = window.DB.notifications;
  const shown = filter === "unread" ? items.filter(n => n.unread && !ctx.notifRead[n.id]) : items;
  const unread = notifUnread(ctx).length;
  return React.createElement("div", {
    className: "page",
    style: {
      maxWidth: 760
    }
  }, React.createElement(PageHead, {
    title: "Notifications",
    sub: "Deal-flow activity \u2014 new deals, metric flags, stage changes and pipeline updates."
  }, unread > 0 && React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => ctx.markAllNotif()
  }, React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Mark all read")), React.createElement("div", {
    className: "row between center mb-16"
  }, React.createElement(Seg, {
    value: filter,
    onChange: setFilter,
    options: [{
      value: "all",
      label: "All"
    }, {
      value: "unread",
      label: `Unread${unread ? " · " + unread : ""}`
    }]
  }), React.createElement("span", {
    className: "t-small"
  }, shown.length, " item", shown.length === 1 ? "" : "s")), shown.length === 0 ? React.createElement("div", {
    className: "empty-state"
  }, React.createElement("span", {
    className: "empty-ic"
  }, React.createElement(Icon, {
    name: "checkCircle",
    size: 26
  })), React.createElement("div", {
    className: "t-h3"
  }, "You're all caught up"), React.createElement("p", {
    className: "t-body"
  }, "No unread notifications.")) : React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, shown.map((n, i) => {
    const m = NOTIF_META[n.kind] || NOTIF_META.system;
    const isUnread = n.unread && !ctx.notifRead[n.id];
    return React.createElement("div", {
      key: n.id,
      className: "notif-row" + (isUnread ? " unread" : ""),
      style: {
        borderBottom: i < shown.length - 1 ? "1px solid var(--border)" : "none"
      },
      onClick: () => runNotif(ctx, n)
    }, React.createElement("span", {
      className: "notif-ic",
      style: {
        background: m.color + "1a",
        color: m.color
      }
    }, React.createElement(Icon, {
      name: m.icon,
      size: 15
    })), React.createElement("div", {
      className: "notif-body"
    }, React.createElement("div", {
      className: "row gap-8 center"
    }, React.createElement("span", {
      className: "notif-title"
    }, n.title), React.createElement("span", {
      className: "tag",
      style: {
        fontSize: 10
      }
    }, m.label)), React.createElement("span", {
      className: "notif-detail"
    }, n.detail), React.createElement("span", {
      className: "notif-time"
    }, n.time)), React.createElement("div", {
      className: "row gap-8 center",
      style: {
        flex: "none"
      }
    }, isUnread && React.createElement("span", {
      className: "notif-unread-dot"
    }), React.createElement(Icon, {
      name: "arrowRight",
      size: 14,
      style: {
        color: "var(--gray-300)"
      }
    })));
  })));
}
window.NotificationBell = NotificationBell;
window.NotificationsView = NotificationsView;
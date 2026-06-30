function SettingsView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [tab, setTab] = useState("workspace");
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement(PageHead, {
    title: "Settings & Access",
    sub: "Configure your workspace, connected data sources and who can see what."
  }), React.createElement("div", {
    className: "mb-16"
  }, React.createElement(Seg, {
    value: tab,
    onChange: setTab,
    options: [{
      value: "workspace",
      label: "Workspace",
      icon: "building"
    }, {
      value: "integrations",
      label: "Integrations",
      icon: "api"
    }, {
      value: "access",
      label: "Access Control",
      icon: "shield"
    }]
  })), tab === "workspace" && React.createElement(WorkspaceSettings, null), tab === "integrations" && React.createElement(IntegrationsSettings, null), tab === "access" && React.createElement(AccessSettings, null));
}
function WorkspaceSettings() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  return React.createElement("div", {
    className: "grid gap-16",
    style: {
      gridTemplateColumns: "1fr 1fr",
      maxWidth: 980
    }
  }, React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "label mb-8"
  }, "Firm"), React.createElement("input", {
    className: "input mb-16",
    defaultValue: db.firm
  }), React.createElement("div", {
    className: "label mb-8"
  }, "Deal intake email \xB7 source of truth"), React.createElement("div", {
    className: "row gap-8 center"
  }, React.createElement("input", {
    className: "input",
    readOnly: true,
    value: db.intakeEmail,
    style: {
      fontFamily: "var(--font-mono)"
    }
  }), React.createElement("button", {
    className: "btn btn-secondary nowrap",
    onClick: () => ctx.toast("Copied " + db.intakeEmail, "check")
  }, React.createElement(Icon, {
    name: "link",
    size: 14
  }), " Copy")), React.createElement("p", {
    className: "t-small mt-8"
  }, "Teasers, IMs and memos forwarded here are ingested, indexed and filed to the right deal. Stage changes stay manual.")), React.createElement("div", {
    className: "card card-pad"
  }, React.createElement("div", {
    className: "label mb-8"
  }, "Defaults"), React.createElement("div", {
    className: "col gap-12"
  }, React.createElement("div", {
    className: "row between center"
  }, React.createElement("span", {
    className: "t-small"
  }, "Default memo template"), React.createElement("span", {
    className: "tag"
  }, "Paragon IC Memo v3")), React.createElement("div", {
    className: "divider"
  }), React.createElement("div", {
    className: "row between center"
  }, React.createElement("span", {
    className: "t-small"
  }, "Auto-generate weekly pipeline PDF"), React.createElement("div", {
    className: "toggle on"
  })), React.createElement("div", {
    className: "divider"
  }), React.createElement("div", {
    className: "row between center"
  }, React.createElement("span", {
    className: "t-small"
  }, "Hide empty fields on tear sheets"), React.createElement("div", {
    className: "toggle on"
  })), React.createElement("div", {
    className: "divider"
  }), React.createElement("div", {
    className: "row between center"
  }, React.createElement("span", {
    className: "t-small"
  }, "Data residency"), React.createElement("span", {
    className: "tag"
  }, "EU + US")))));
}
function IntegrationsSettings() {
  const db = window.DB;
  const ctx = useContext(AppCtx);
  const IC = {
    mail: "mail",
    folder: "folder",
    chat: "chat",
    api: "api",
    table: "table",
    globe: "globe"
  };
  const cats = ["Email", "Documents", "External data"];
  return React.createElement("div", {
    style: {
      maxWidth: 820
    }
  }, React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 16,
      padding: "14px 16px",
      display: "flex",
      gap: 12,
      alignItems: "center",
      borderColor: "var(--blue-200)",
      background: "linear-gradient(90deg, var(--blue-50), #fff 70%)"
    }
  }, React.createElement("span", {
    className: "feed-ic",
    style: {
      background: "var(--blue-100)",
      color: "var(--blue-600)"
    }
  }, React.createElement(Icon, {
    name: "database",
    size: 16
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 560
    }
  }, "Connected data sources"), React.createElement("div", {
    className: "t-small"
  }, "Intake mailboxes, document stores and market-data providers feeding the pipeline. Stage changes are always made manually.")), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => ctx.navigate("documents", {
      tab: "sources"
    })
  }, "Ingestion sources ", React.createElement(Icon, {
    name: "arrowRight",
    size: 13
  }))), cats.map(cat => React.createElement("div", {
    key: cat,
    style: {
      marginBottom: 18
    }
  }, React.createElement("div", {
    className: "label mb-8"
  }, cat), React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, db.ingestion.filter(s => s.category === cat).map((s, i, arr) => React.createElement("div", {
    key: s.name,
    className: "row between center",
    style: {
      padding: "13px 16px",
      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none"
    }
  }, React.createElement("div", {
    className: "row gap-12 center"
  }, React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: "var(--bg-sunken)",
      color: "var(--text-secondary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: IC[s.icon] || "api",
    size: 16
  })), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 540,
      fontSize: 13
    }
  }, s.name), React.createElement("div", {
    className: "t-small"
  }, s.detail))), React.createElement("div", {
    className: "row gap-12 center"
  }, React.createElement("span", {
    className: "t-small num"
  }, s.sync), React.createElement(StatusPill, {
    status: s.status
  }))))))), React.createElement("button", {
    className: "btn btn-secondary"
  }, React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " Connect a source"));
}
function AccessSettings() {
  const db = window.DB;
  const ctx = useContext(AppCtx);
  const [restrict, setRestrict] = useState(true);
  return React.createElement("div", {
    style: {
      maxWidth: 980
    }
  }, React.createElement("div", {
    className: "card card-pad mb-16"
  }, React.createElement("div", {
    className: "row between center"
  }, React.createElement("div", null, React.createElement("div", {
    className: "t-h3"
  }, "Restrict views by role"), React.createElement("p", {
    className: "t-small",
    style: {
      marginTop: 3
    }
  }, restrict ? "Each member sees only the deals and sectors in their scope." : "Everyone sees the same view — all deals and sectors.")), React.createElement("div", {
    className: "toggle" + (restrict ? " on" : ""),
    onClick: () => {
      setRestrict(r => !r);
      ctx.toast(restrict ? "Everyone now sees the same view" : "Views restricted by role", "check");
    }
  }))), React.createElement("div", {
    className: "label mb-8"
  }, "Role permissions"), React.createElement("div", {
    className: "card mb-16",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Role"), React.createElement("th", null, "Deals"), React.createElement("th", null, "Sectors"), React.createElement("th", null, "Memos"), React.createElement("th", null, "Settings"))), React.createElement("tbody", null, db.roles.map(r => React.createElement("tr", {
    key: r.role,
    style: {
      cursor: "default"
    }
  }, React.createElement("td", {
    style: {
      fontWeight: 560
    }
  }, r.role), React.createElement("td", {
    className: "t-small"
  }, restrict ? r.deals : "All"), React.createElement("td", {
    className: "t-small"
  }, restrict ? r.sectors : "All"), React.createElement("td", {
    className: "t-small"
  }, r.memos), React.createElement("td", {
    className: "t-small"
  }, r.settings)))))), React.createElement("div", {
    className: "row between center mb-8"
  }, React.createElement("span", {
    className: "label"
  }, "Team members"), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => ctx.toast("Invite sent", "check")
  }, React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " Invite member")), React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, db.team.map((m, i) => React.createElement("div", {
    key: m.name,
    className: "row between center",
    style: {
      padding: "12px 16px",
      borderBottom: i < db.team.length - 1 ? "1px solid var(--border)" : "none"
    }
  }, React.createElement("div", {
    className: "row gap-11 center"
  }, React.createElement(Avatar, {
    name: m.name,
    color: m.av
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 540,
      fontSize: 13
    }
  }, m.name), React.createElement("div", {
    className: "t-small"
  }, restrict ? m.scope : "All deals & sectors"))), React.createElement("div", {
    className: "row gap-12 center"
  }, React.createElement("span", {
    className: "pill pill-neutral"
  }, m.role), React.createElement(Menu, {
    items: [{
      icon: "edit",
      text: "Change role"
    }, {
      icon: "eye",
      text: "View as this member"
    }, {
      sep: true
    }, {
      icon: "x",
      text: "Remove",
      danger: true
    }]
  }))))));
}
window.SettingsView = SettingsView;
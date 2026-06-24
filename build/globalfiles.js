function GlobalFilesView() {
  const ctx = useContext(AppCtx);
  const db = window.DB;
  const [active, setActive] = useState(db.globalFiles[0].id);
  const [expanded, setExpanded] = useState({
    [db.globalFiles[0].id]: true
  });
  const folder = db.globalFiles.find(f => f.id === active) || db.globalFiles[0];
  const FC = {
    pdf: "#dc2626",
    xls: "#16a34a",
    csv: "#16a34a",
    ppt: "#e08a00",
    doc: "#2f6bff"
  };
  const countFiles = node => (node.children || []).reduce((s, c) => s + (c.children ? countFiles(c) : 1), 0);
  return React.createElement("div", {
    className: "page page-wide"
  }, React.createElement(PageHead, {
    title: "Global Files",
    sub: "The firm's organization-wide, thematic knowledge \u2014 curated once, reusable as a source in any deal's research and tear-sheet extraction."
  }, React.createElement("button", {
    className: "btn btn-secondary"
  }, React.createElement(Icon, {
    name: "users",
    size: 15
  }), " Sharing"), React.createElement("button", {
    className: "btn btn-primary"
  }, React.createElement(Icon, {
    name: "upload",
    size: 15
  }), " Upload")), React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 16,
      padding: "11px 16px",
      display: "flex",
      gap: 10,
      alignItems: "center",
      borderColor: "var(--blue-200)",
      background: "var(--blue-50)"
    }
  }, React.createElement(Icon, {
    name: "info",
    size: 16,
    style: {
      color: "var(--blue-600)"
    }
  }), React.createElement("span", {
    className: "t-small",
    style: {
      color: "var(--text-primary)"
    }
  }, "Distinct from ", React.createElement("strong", null, "deal files"), " (scoped to one transaction). Global files are durable, firm-wide knowledge \u2014 industry data, country research, ILPA templates, knowledge graphs \u2014 pullable into any Explore session.")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "300px 1fr",
      gap: 20,
      alignItems: "start"
    }
  }, React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, React.createElement("div", {
    className: "row between center",
    style: {
      padding: "11px 14px",
      borderBottom: "1px solid var(--border)"
    }
  }, React.createElement("span", {
    className: "t-h3"
  }, "Shared Folders"), React.createElement("span", {
    className: "tag"
  }, db.globalFiles.length)), React.createElement("div", {
    style: {
      padding: 8
    }
  }, db.globalFiles.map(f => React.createElement("div", {
    key: f.id
  }, React.createElement("div", {
    className: "row between center pointer",
    style: {
      padding: "8px 9px",
      borderRadius: 8,
      background: active === f.id ? "var(--blue-50)" : "transparent"
    },
    onClick: () => {
      setActive(f.id);
      setExpanded(s => ({
        ...s,
        [f.id]: !s[f.id]
      }));
    }
  }, React.createElement("span", {
    className: "row gap-8 center",
    style: {
      minWidth: 0
    }
  }, React.createElement(Icon, {
    name: "chevRight",
    size: 12,
    style: {
      color: "var(--gray-400)",
      transform: expanded[f.id] ? "rotate(90deg)" : "none",
      transition: "transform .15s"
    }
  }), React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 7,
      background: active === f.id ? "var(--blue-100)" : "var(--bg-sunken)",
      color: active === f.id ? "var(--blue-600)" : "var(--text-secondary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, React.createElement(Icon, {
    name: "folder",
    size: 14
  })), React.createElement("span", {
    className: "truncate",
    style: {
      fontSize: 12.5,
      fontWeight: active === f.id ? 560 : 480
    }
  }, f.name)), f.shared && React.createElement("span", {
    className: "tip",
    style: {
      display: "inline-flex"
    }
  }, React.createElement(Icon, {
    name: "users",
    size: 13,
    style: {
      color: "var(--gray-400)"
    }
  }), React.createElement("span", {
    className: "tip-bub"
  }, "Shared with team"))), expanded[f.id] && (f.children || []).map(c => React.createElement("div", {
    key: c.name,
    className: "row gap-8 center",
    style: {
      padding: "5px 9px 5px 30px",
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 5,
      background: c.children ? "var(--bg-sunken)" : (FC[c.ftype] || "#888") + "1a",
      color: c.children ? "var(--text-muted)" : FC[c.ftype] || "#888",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, React.createElement(Icon, {
    name: c.children ? "folder" : "file",
    size: 10
  })), React.createElement("span", {
    className: "truncate"
  }, c.name))))))), React.createElement("div", {
    className: "card"
  }, React.createElement("div", {
    className: "row between center",
    style: {
      padding: "14px 18px",
      borderBottom: "1px solid var(--border)"
    }
  }, React.createElement("div", {
    className: "row gap-12 center"
  }, React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: "var(--blue-50)",
      color: "var(--blue-600)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "folder",
    size: 20
  })), React.createElement("div", null, React.createElement("div", {
    className: "t-h2"
  }, folder.name), React.createElement("div", {
    className: "t-small"
  }, countFiles(folder), " files \xB7 owner ", folder.owner, " \xB7 updated ", folder.updated))), React.createElement("div", {
    className: "row gap-7 center"
  }, React.createElement("span", {
    className: "pill pill-screening"
  }, React.createElement(Icon, {
    name: "users",
    size: 11
  }), " Shared with team"), React.createElement(Menu, {
    align: "right",
    items: [{
      icon: "upload",
      text: "Upload here"
    }, {
      icon: "folder",
      text: "New subfolder"
    }, {
      icon: "edit",
      text: "Tag / theme"
    }, {
      icon: "users",
      text: "Manage permissions"
    }, {
      sep: true
    }, {
      icon: "x",
      text: "Archive folder",
      danger: true
    }]
  }))), React.createElement("div", {
    style: {
      padding: 8
    }
  }, React.createElement("table", {
    className: "dtable"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Name"), React.createElement("th", null, "Owner"), React.createElement("th", null, "Updated"), React.createElement("th", null, "Sharing"), React.createElement("th", {
    style: {
      width: 36
    }
  }))), React.createElement("tbody", null, (folder.children || []).map(c => React.createElement("tr", {
    key: c.name,
    onClick: () => ctx.openSource("default")
  }, React.createElement("td", null, React.createElement("span", {
    className: "row gap-10 center"
  }, React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 7,
      background: c.children ? "var(--bg-sunken)" : (FC[c.ftype] || "#888") + "1a",
      color: c.children ? "var(--text-secondary)" : FC[c.ftype] || "#888",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: c.children ? "folder" : "file",
    size: 14
  })), React.createElement("span", {
    style: {
      fontWeight: 540
    }
  }, c.name), c.children && React.createElement("span", {
    className: "tag",
    style: {
      fontSize: 10
    }
  }, countFiles(c), " files"))), React.createElement("td", {
    className: "t-small"
  }, folder.owner), React.createElement("td", {
    className: "t-small nowrap"
  }, c.updated || folder.updated), React.createElement("td", null, React.createElement("span", {
    className: "row gap-5 center t-small"
  }, React.createElement(Icon, {
    name: "users",
    size: 12,
    style: {
      color: "var(--green-500)"
    }
  }), " Team")), React.createElement("td", {
    onClick: e => e.stopPropagation()
  }, React.createElement(Menu, {
    items: [{
      icon: "sparkles",
      text: "Use in Explore",
      onClick: () => ctx.toast("Added to research scope", "ai")
    }, {
      icon: "download",
      text: "Download"
    }, {
      icon: "edit",
      text: "Tag / theme"
    }, {
      sep: true
    }, {
      icon: "x",
      text: "Remove",
      danger: true
    }]
  }))))))))));
}
window.GlobalFilesView = GlobalFilesView;
function SourceModal({
  metric,
  value,
  onClose
}) {
  const list = window.DB.sources[metric] || window.DB.sources.default;
  const [active, setActive] = useState(null);
  const [zoom, setZoom] = useState(100);
  if (active !== null) {
    const s = list[active];
    return React.createElement("div", {
      className: "overlay center",
      onMouseDown: onClose
    }, React.createElement("div", {
      className: "modal modal-xl",
      onMouseDown: e => e.stopPropagation(),
      style: {
        height: "86vh",
        maxHeight: "86vh"
      }
    }, React.createElement("div", {
      className: "modal-head"
    }, React.createElement("div", {
      className: "row gap-10 center"
    }, React.createElement("button", {
      className: "x-btn",
      onClick: () => setActive(null)
    }, React.createElement(Icon, {
      name: "chevLeft",
      size: 18
    })), React.createElement("div", null, React.createElement("div", {
      className: "t-h3"
    }, s.doc), React.createElement("div", {
      className: "t-small"
    }, "Page ", s.page, " \xB7 ", s.type))), React.createElement("div", {
      className: "row gap-8 center"
    }, React.createElement("div", {
      className: "seg"
    }, React.createElement("div", {
      className: "seg-item",
      onClick: () => setZoom(z => Math.max(60, z - 10))
    }, React.createElement(Icon, {
      name: "zoomOut",
      size: 14
    })), React.createElement("div", {
      className: "seg-item active num",
      style: {
        minWidth: 48,
        justifyContent: "center"
      }
    }, zoom, "%"), React.createElement("div", {
      className: "seg-item",
      onClick: () => setZoom(z => Math.min(160, z + 10))
    }, React.createElement(Icon, {
      name: "zoomIn",
      size: 14
    }))), React.createElement("button", {
      className: "btn btn-secondary btn-sm"
    }, React.createElement(Icon, {
      name: "search",
      size: 13
    }), " Search"), React.createElement("button", {
      className: "x-btn",
      onClick: onClose
    }, React.createElement(Icon, {
      name: "x",
      size: 18
    })))), React.createElement("div", {
      style: {
        display: "flex",
        flex: 1,
        minHeight: 0
      }
    }, React.createElement("div", {
      className: "scroll",
      style: {
        flex: 1,
        overflow: "auto",
        background: "var(--bg-sunken)",
        padding: 24,
        display: "flex",
        justifyContent: "center"
      }
    }, React.createElement(FakePdfPage, {
      doc: s,
      zoom: zoom
    })), React.createElement("div", {
      className: "scroll",
      style: {
        width: 320,
        flex: "none",
        borderLeft: "1px solid var(--border)",
        overflow: "auto",
        padding: 16,
        background: "#fff"
      }
    }, React.createElement("div", {
      className: "label",
      style: {
        marginBottom: 10
      }
    }, "Supporting citation"), React.createElement("div", {
      className: "card card-pad",
      style: {
        marginBottom: 14,
        borderColor: "var(--blue-200)",
        background: "var(--blue-50)"
      }
    }, React.createElement("div", {
      className: "row between center mb-8"
    }, React.createElement("span", {
      className: "tag",
      style: {
        background: "#fff"
      }
    }, React.createElement(Icon, {
      name: "file",
      size: 11
    }), " Page ", s.page), React.createElement(ConfDot, {
      level: "verified"
    })), React.createElement("p", {
      style: {
        fontSize: 13,
        lineHeight: 1.55,
        color: "var(--text-primary)"
      }
    }, "\u201C", s.excerpt, "\u201D")), value && React.createElement("div", {
      className: "kv",
      style: {
        marginBottom: 14
      }
    }, React.createElement("span", {
      className: "k"
    }, "Extracted value"), React.createElement("span", {
      className: "v num",
      style: {
        fontSize: 18,
        fontWeight: 650
      }
    }, value)), React.createElement("div", {
      className: "label",
      style: {
        marginBottom: 8
      }
    }, "Critic AI review"), React.createElement("div", {
      className: "alert-row",
      style: {
        background: "var(--green-50)",
        borderColor: "var(--green-100)"
      }
    }, React.createElement("span", {
      className: "alert-ic",
      style: {
        background: "var(--green-100)",
        color: "var(--green-600)"
      }
    }, React.createElement(Icon, {
      name: "checkCircle",
      size: 16
    })), React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 560
      }
    }, "Cross-checked \xB7 consistent"), React.createElement("div", {
      className: "t-small"
    }, "Value matches across 2 documents. No discrepancy found.")))))));
  }
  return React.createElement(Modal, {
    onClose: onClose,
    size: "modal-lg"
  }, React.createElement("div", {
    className: "modal-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "row gap-8 center mb-8"
  }, React.createElement("span", {
    className: "ic",
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: "var(--blue-50)",
      color: "var(--blue-600)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name: "sourceDoc",
    size: 16
  })), React.createElement("h2", {
    className: "t-h2"
  }, "Source Information")), React.createElement("p", {
    className: "t-body"
  }, React.createElement("strong", {
    style: {
      color: "var(--text-primary)",
      fontWeight: 560
    }
  }, metric === "default" ? "This value" : metric), " was determined using the following ", list.length, " source", list.length > 1 ? "s" : "", ".")), React.createElement("button", {
    className: "x-btn",
    onClick: onClose
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), React.createElement("div", {
    className: "modal-body",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, list.map((s, i) => React.createElement("div", {
    key: i,
    className: "card card-pad card-hover",
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start"
    }
  }, React.createElement("span", {
    className: "logo-tile",
    style: {
      background: "var(--red-50)",
      color: "var(--red-500)",
      borderRadius: 8
    }
  }, React.createElement(Icon, {
    name: "file",
    size: 18
  })), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "row between center",
    style: {
      marginBottom: 4
    }
  }, React.createElement("span", {
    className: "t-h3"
  }, s.doc), React.createElement("span", {
    className: "tag"
  }, s.type)), React.createElement("div", {
    className: "t-small",
    style: {
      marginBottom: 8
    }
  }, "Page ", s.page), React.createElement("p", {
    style: {
      fontSize: 12.5,
      lineHeight: 1.55,
      color: "var(--text-secondary)",
      borderLeft: "2px solid var(--blue-200)",
      paddingLeft: 10
    }
  }, "\u201C", s.excerpt, "\u201D")), React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    style: {
      flex: "none"
    },
    onClick: () => setActive(i)
  }, React.createElement(Icon, {
    name: "eye",
    size: 13
  }), " View file"))), React.createElement("div", {
    className: "row gap-8 center",
    style: {
      padding: "4px 2px",
      color: "var(--text-muted)"
    }
  }, React.createElement(Icon, {
    name: "info",
    size: 14
  }), React.createElement("span", {
    className: "t-small"
  }, "Every figure links back to a sourced quote. A human can always override."))));
}
function FakePdfPage({
  doc,
  zoom
}) {
  const lines = [{
    w: "62%"
  }, {
    w: "88%"
  }, {
    w: "80%"
  }, {
    w: "40%",
    gap: true
  }, {
    w: "70%",
    head: true
  }, {
    w: "92%"
  }, {
    w: "85%"
  }, {
    w: "100%",
    cite: true
  }, {
    w: "78%",
    cite: true
  }, {
    w: "55%",
    gap: true
  }, {
    w: "90%"
  }, {
    w: "83%"
  }, {
    w: "94%"
  }, {
    w: "48%"
  }, {
    w: "72%",
    head: true
  }, {
    w: "96%"
  }, {
    w: "88%"
  }, {
    w: "60%"
  }];
  return React.createElement("div", {
    style: {
      width: 612 * (zoom / 100),
      background: "#fff",
      boxShadow: "var(--sh-md)",
      borderRadius: 4,
      padding: 54,
      flexShrink: 0,
      transformOrigin: "top center"
    }
  }, React.createElement("div", {
    className: "row between center",
    style: {
      marginBottom: 22,
      paddingBottom: 12,
      borderBottom: "1px solid var(--gray-200)"
    }
  }, React.createElement("div", {
    className: "num",
    style: {
      fontSize: 10,
      color: "var(--gray-400)",
      letterSpacing: "0.1em"
    }
  }, "CONFIDENTIAL"), React.createElement("div", {
    className: "num",
    style: {
      fontSize: 10,
      color: "var(--gray-400)"
    }
  }, doc.doc, " \xB7 p.", doc.page)), lines.map((l, i) => l.head ? React.createElement("div", {
    key: i,
    style: {
      height: 11,
      width: l.w,
      background: "var(--gray-700)",
      borderRadius: 2,
      margin: "22px 0 12px",
      opacity: 0.85
    }
  }) : l.cite ? React.createElement("div", {
    key: i,
    style: {
      height: 8,
      width: l.w,
      background: "var(--amber-100)",
      borderRadius: 2,
      margin: "7px 0",
      boxShadow: "0 0 0 3px var(--amber-50)"
    }
  }) : React.createElement("div", {
    key: i,
    style: {
      height: 7,
      width: l.w,
      background: "var(--gray-200)",
      borderRadius: 2,
      margin: l.gap ? "7px 0 20px" : "7px 0"
    }
  })), React.createElement("div", {
    style: {
      marginTop: 24,
      padding: 14,
      border: "1px dashed var(--amber-500)",
      borderRadius: 8,
      background: "var(--amber-50)"
    }
  }, React.createElement("div", {
    className: "row gap-6 center",
    style: {
      marginBottom: 6
    }
  }, React.createElement(Icon, {
    name: "target",
    size: 13,
    style: {
      color: "var(--amber-600)"
    }
  }), React.createElement("span", {
    style: {
      fontSize: 10.5,
      fontWeight: 600,
      color: "var(--amber-600)",
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, "Cited passage")), React.createElement("p", {
    style: {
      fontSize: 11.5,
      lineHeight: 1.5,
      color: "var(--text-primary)"
    }
  }, "\u201C", doc.excerpt, "\u201D")));
}
window.SourceModal = SourceModal;
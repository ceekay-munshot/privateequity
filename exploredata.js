/* ============================================================
   Phase 8 data — augments window.DB
   Explore sessions · Global Files tree · Quant sample · Sources
   ============================================================ */
(function () {
  const DB = window.DB;

  // ---- Explore sessions (grouped by recency) ----
  DB.exploreSessions = [
    { id: "s1", title: "Company Strategic Positioning and Context", group: "Today", updated: "less than a minute ago", topic: "Strategy & Market Assessment" },
    { id: "s2", title: "Financial Data & Capital Structure", group: "Today", updated: "18 minutes ago", topic: "Financial Performance & Capital Structure" },
    { id: "s3", title: "Comparable Company Analysis", group: "Last 7 days", updated: "2 days ago", topic: null },
    { id: "s4", title: "Financial Projection and Assumptions", group: "Last 7 days", updated: "4 days ago", topic: null },
    { id: "s5", title: "Management & Governance review", group: "Last 30 days", updated: "12 days ago", topic: "Management & Governance" },
  ];

  // ---- Quick Links → pre-seeded Explore topics with freshness ----
  DB.quickLinkMeta = {
    "Strategy & Market Assessment": { fresh: "Run 2h ago", status: "ready", q: "Assess the company's strategic positioning: TAM and growth, competitive moat, share trajectory, and the key market tailwinds and risks." },
    "Management & Governance": { fresh: "Run 1d ago", status: "ready", q: "Evaluate the management team and governance: track record, depth below the CEO, board composition, incentive alignment and any key-person risk." },
    "Financial Performance & Capital Structure": { fresh: "Run 18m ago", status: "ready", q: "Summarize financial performance and capital structure: revenue/EBITDA trajectory, margins, working capital, debt, leverage and covenant headroom." },
    "Legal & Contractual Risk": { fresh: "Not yet run", status: "stale", q: "Identify legal and contractual risks: material contracts, change-of-control provisions, litigation, IP ownership and regulatory exposure." },
    "Operational & Commercial Validation": { fresh: "Run 5h ago", status: "ready", q: "Validate the operational and commercial story: customer concentration, retention/churn, unit economics, sales pipeline and supply chain." },
    "Fraud Risk & Red Flags": { fresh: "Run 3d ago", status: "review", q: "Scan for fraud risk and red flags: revenue recognition, related-party transactions, cash vs. accrual divergence and any inconsistencies across documents." },
  };

  // ---- Connected external data providers (Sources dropdown) ----
  DB.dataProviders = [
    { id: "preqin", name: "Preqin Alts Database", desc: "Alternative-investments fund & deal data", on: true },
    { id: "pitchbook", name: "PitchBook", desc: "Private-market comps & multiples", on: true },
    { id: "capiq", name: "Capital IQ", desc: "Public comps & filings", on: false },
  ];

  // ---- Quant mode sample (traceable calc) ----
  DB.quantSample = {
    series: [{ p: "2020", v: 96.2 }, { p: "2021", v: 114.5 }, { p: "2022", v: 142.0 }],
    rows: [
      ["Revenue CAGR (20–22)", "21.5%", "verified"],
      ["EBITDA margin (22)", "27.1%", "verified"],
      ["Rule of 40", "51.1", "estimated"],
      ["Implied EV / Revenue", "6.2x", "verified"],
    ],
  };

  // ---- Global Files: thematic, firm-wide shared library ----
  DB.globalFiles = [
    { id: "ilpa", name: "ILPA", owner: "Compliance", updated: "3d ago", shared: true, kind: "folder", children: [
      { name: "ILPA Reporting Template v2.xlsx", kind: "file", ftype: "xls", updated: "3d ago" },
      { name: "Capital Call Notice (standard).docx", kind: "file", ftype: "doc", updated: "1mo ago" },
      { name: "Fee Reporting", kind: "folder", children: [
        { name: "Management Fee Schedule.xlsx", kind: "file", ftype: "xls" },
        { name: "Carry Waterfall.xlsx", kind: "file", ftype: "xls" },
      ]},
    ]},
    { id: "pedata", name: "PE Data", owner: "Research", updated: "6h ago", shared: true, kind: "folder", children: [
      { name: "Global PE Multiples 2026.csv", kind: "file", ftype: "csv", updated: "6h ago" },
      { name: "Buyout Deal Comps.xlsx", kind: "file", ftype: "xls", updated: "2d ago" },
      { name: "Fundraising Trends.pdf", kind: "file", ftype: "pdf", updated: "1w ago" },
    ]},
    { id: "alts", name: "Alts Evaluation", owner: "Alex Chen", updated: "1d ago", shared: true, kind: "folder", children: [
      { name: "Manager Scorecard Framework.pdf", kind: "file", ftype: "pdf" },
      { name: "DPI / TVPI Benchmarks.xlsx", kind: "file", ftype: "xls" },
    ]},
    { id: "indo", name: "Indonesia Economy", owner: "Research", updated: "5d ago", shared: true, kind: "folder", children: [
      { name: "Macro Outlook 2026.pdf", kind: "file", ftype: "pdf" },
      { name: "Consumer Demographics.csv", kind: "file", ftype: "csv" },
      { name: "Sector Surveys", kind: "folder", children: [
        { name: "Healthcare Penetration.pdf", kind: "file", ftype: "pdf" },
        { name: "Quick-Commerce Adoption.pdf", kind: "file", ftype: "pdf" },
      ]},
    ]},
    { id: "industry", name: "Industry Data Files", owner: "Sofia Reyes", updated: "9h ago", shared: true, kind: "folder", children: [
      { name: "Medtech Procedure Volumes.xlsx", kind: "file", ftype: "xls" },
      { name: "Freight Rate Index.csv", kind: "file", ftype: "csv" },
      { name: "Personal-Care Velocity.csv", kind: "file", ftype: "csv" },
    ]},
    { id: "kg", name: "Knowledge Graphs (Graph ML)", owner: "Data Science", updated: "2w ago", shared: true, kind: "folder", children: [
      { name: "Ownership Graph.graphml", kind: "file", ftype: "doc" },
      { name: "Supplier Network.graphml", kind: "file", ftype: "doc" },
    ]},
  ];
})();

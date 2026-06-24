/* ============================================================
   MUNSHOT — Mock data (plain JS, attached to window.DB)
   ============================================================ */
(function () {
  // ---- helpers ----
  const SECTOR_COLOR = {
    Healthcare: "#16a34a",
    Consumer: "#e08a00",
    Industrials: "#2563eb",
    Technology: "#7c5cfc",
    Energy: "#0e9488",
    Financials: "#be123c",
  };
  const logoColor = (s) => ({
    bg: (SECTOR_COLOR[s] || "#2f6bff") + "1a",
    fg: SECTOR_COLOR[s] || "#2f6bff",
  });

  // ---- DEAL FLOW (pipeline) ----
  const deals = [
    {
      id: "meridian",
      name: "Meridian Surgical",
      initials: "MS",
      sector: "Healthcare",
      sub: "Medical Devices",
      desc: "Minimally-invasive surgical robotics platform for orthopedic procedures.",
      source: "Jefferies",
      sourceType: "Sell-side bank",
      received: "2026-06-12",
      revenue: 142.0,
      ebitda: 38.5,
      ask: 920,
      fit: 91,
      status: "Screening",
      strategy: "PE Direct",
      dealType: "Company",
      stage: "Screening",
      geo: "Boston, MA",
      hq: "Boston, Massachusetts, USA",
      website: "meridiansurgical.com",
      employees: 480,
      founded: 2014,
      regions: "North America, EU",
      take: "Category-leading margins (27% EBITDA), but customer concentration in top-3 IDNs is a flag.",
      thesis:
        "Meridian sits at the intersection of two secular tailwinds — the shift to ambulatory surgical centers and robotic-assisted orthopedics. The installed base of 1,200 systems creates a razor-and-blade recurring revenue engine (62% of revenue is consumables) with 91% gross retention. Our thesis is a buy-and-build: consolidate three adjacent single-use instrument makers, push international (currently 11% of revenue vs. 40% for peers), and expand the recurring mix to 70%+. Key risks: reimbursement pressure on robotic procedures and concentration in the top-3 hospital systems.",
      isNew: true,
      ownership: 60,
      preMoney: 880,
      postMoney: 1100,
      revYoY: 24,
      ebitdaYoY: 31,
    },
    {
      id: "northwind",
      name: "Northwind Logistics",
      initials: "NL",
      sector: "Industrials",
      sub: "Supply Chain Tech",
      desc: "Asset-light freight brokerage with an AI-driven load-matching network.",
      source: "Harris Williams",
      sourceType: "Sell-side bank",
      received: "2026-06-11",
      revenue: 318.0,
      ebitda: 41.2,
      ask: 640,
      fit: 84,
      status: "IC Review",
      strategy: "PE Direct",
      dealType: "Company",
      stage: "IC Review",
      geo: "Chicago, IL",
      hq: "Chicago, Illinois, USA",
      website: "northwindlogistics.com",
      employees: 1240,
      founded: 2009,
      regions: "North America",
      take: "Strong network effects and 13% take-rate, but cyclical freight exposure warrants a downside case.",
      thesis:
        "Northwind has built a defensible two-sided marketplace with 28,000 carriers and 4,100 shippers. The AI matching engine has lifted take-rate from 9% to 13% over three years. We see a clear path to margin expansion via automation of the brokerage desk (currently 38% of opex) and cross-sell of managed transportation. The freight cycle is the central risk — we underwrite a trough-to-peak EBITDA range and stress the leverage accordingly.",
      isNew: true,
      ownership: 75,
      preMoney: 600,
      postMoney: 720,
      revYoY: 18,
      ebitdaYoY: 12,
    },
    {
      id: "lumen",
      name: "Lumen Skincare",
      initials: "LS",
      sector: "Consumer",
      sub: "Personal Care",
      desc: "DTC-first clinical skincare brand with fast-growing marketplace velocity.",
      source: "Raymond James",
      sourceType: "Sell-side bank",
      received: "2026-06-10",
      revenue: 88.5,
      ebitda: 14.1,
      ask: 310,
      fit: 78,
      status: "Triaging",
      strategy: "PE Direct",
      dealType: "Company",
      stage: "Triaging",
      geo: "Los Angeles, CA",
      hq: "Los Angeles, California, USA",
      website: "lumenskincare.com",
      employees: 210,
      founded: 2018,
      regions: "North America, UK",
      take: "Explosive 47% growth and strong Nykaa/Amazon velocity; CAC trend is the question to underwrite.",
      thesis:
        "Lumen has cracked the clinical-efficacy positioning in a crowded DTC market, with a 4.7-star average across 38,000 reviews and best-in-class repeat rates (54% reorder within 90 days). Retail expansion into Sephora and Ulta is just beginning. We like the asset as a platform for a multi-brand personal-care roll-up. The diligence focus is marketing efficiency — paid CAC has risen 22% YoY and we need to validate the contribution-margin story at scale.",
      isNew: true,
      ownership: 55,
      preMoney: 290,
      postMoney: 360,
      revYoY: 47,
      ebitdaYoY: 38,
    },
    {
      id: "cobalt",
      name: "Cobalt Cloud",
      initials: "CC",
      sector: "Technology",
      sub: "Vertical SaaS",
      desc: "Practice-management SaaS for multi-site veterinary groups.",
      source: "William Blair",
      sourceType: "Sell-side bank",
      received: "2026-06-09",
      revenue: 64.0,
      ebitda: 9.6,
      ask: 480,
      fit: 88,
      status: "Screening",
      strategy: "PE Direct",
      dealType: "Company",
      stage: "Screening",
      geo: "Austin, TX",
      hq: "Austin, Texas, USA",
      website: "cobaltcloud.com",
      employees: 320,
      founded: 2016,
      regions: "North America",
      take: "Rule-of-50 SaaS in a consolidating end market; net retention of 118% is the standout.",
      thesis:
        "Cobalt is the system-of-record for 3,400 veterinary practices, with 118% net revenue retention and an expanding payments attach (now 19% of revenue). The veterinary services market is consolidating rapidly, and Cobalt's data moat compounds with every site. We underwrite continued upsell of payments, inventory, and an emerging insurance-claims module. Primary risk is platform consolidation by a strategic.",
      isNew: false,
      ownership: 70,
      preMoney: 450,
      postMoney: 560,
      revYoY: 33,
      ebitdaYoY: 41,
    },
    {
      id: "vantage",
      name: "Vantage Payments",
      initials: "VP",
      sector: "Financials",
      sub: "Fintech Infrastructure",
      desc: "Embedded payments & treasury API for B2B marketplaces.",
      source: "Qatalyst",
      sourceType: "Sell-side bank",
      received: "2026-06-06",
      revenue: 96.0,
      ebitda: -4.2,
      ask: 720,
      fit: 64,
      status: "Passed",
      strategy: "PE Direct",
      dealType: "Company",
      stage: "Passed",
      geo: "New York, NY",
      hq: "New York, New York, USA",
      website: "vantagepay.com",
      employees: 410,
      founded: 2019,
      regions: "North America, EU",
      take: "Impressive growth but still burning; valuation at 7.5x revenue is rich for the risk.",
      thesis:
        "Vantage has strong product-market fit in embedded B2B payments but remains unprofitable with a 7.5x revenue ask. We passed at this valuation given the path-to-profitability uncertainty and competitive intensity from incumbents.",
      isNew: false,
      ownership: null,
      preMoney: 700,
      postMoney: 820,
      revYoY: 61,
      ebitdaYoY: null,
      passReason: "Valuation discipline — 7.5x revenue too rich vs. burn",
      passedDate: "2026-06-09",
    },
    {
      id: "harborstone",
      name: "Harborstone Foods",
      initials: "HF",
      sector: "Consumer",
      sub: "Packaged Food",
      desc: "Better-for-you frozen meals with strong club-channel penetration.",
      source: "Houlihan Lokey",
      sourceType: "Sell-side bank",
      received: "2026-06-05",
      revenue: 204.0,
      ebitda: 27.5,
      ask: 380,
      fit: 69,
      status: "Pursuing",
      strategy: "PE Direct",
      dealType: "Company",
      stage: "Pursuing",
      geo: "Minneapolis, MN",
      hq: "Minneapolis, Minnesota, USA",
      website: "harborstonefoods.com",
      employees: 680,
      founded: 2012,
      regions: "North America",
      take: "Defensive category with retailer concentration; margin is below the better-for-you peer set.",
      thesis:
        "Harborstone has carved a defensible niche in better-for-you frozen, with strong velocity at Costco and Sam's Club. EBITDA margin of 13.5% trails the 18% peer median, which we see as a value-creation lever via procurement and network optimization. Retailer concentration (62% top-2) is the central risk.",
      isNew: false,
      ownership: 80,
      preMoney: 360,
      postMoney: 420,
      revYoY: 14,
      ebitdaYoY: 9,
    },
    {
      id: "silverpeak",
      name: "Silverpeak Diagnostics",
      initials: "SD",
      sector: "Healthcare",
      sub: "Diagnostics",
      desc: "Decentralized molecular diagnostics for infectious disease panels.",
      source: "Centerview",
      sourceType: "Sell-side bank",
      received: "2026-06-03",
      revenue: 71.0,
      ebitda: 11.8,
      ask: 290,
      fit: 81,
      status: "Screening",
      strategy: "PE Direct",
      dealType: "Company",
      stage: "Screening",
      geo: "San Diego, CA",
      hq: "San Diego, California, USA",
      website: "silverpeakdx.com",
      employees: 290,
      founded: 2015,
      regions: "North America, APAC",
      take: "Recurring test-cartridge model with a sticky installed base; reimbursement mix is the swing factor.",
      thesis:
        "Silverpeak's decentralized PCR platform has an installed base of 2,800 analyzers generating recurring cartridge revenue (71% of total). The post-pandemic normalization is behind it and the respiratory + STI panels are growing double digits. We underwrite menu expansion and international placement. Reimbursement mix shift is the key sensitivity.",
      isNew: false,
      ownership: 65,
      preMoney: 270,
      postMoney: 330,
      revYoY: 21,
      ebitdaYoY: 26,
    },
    {
      id: "brightline",
      name: "Brightline Robotics",
      initials: "BR",
      sector: "Industrials",
      sub: "Warehouse Automation",
      desc: "Autonomous mobile robots for mid-market warehouse fulfillment.",
      source: "Lincoln International",
      sourceType: "Sell-side bank",
      received: "2026-05-22",
      revenue: 58.0,
      ebitda: 3.1,
      ask: 410,
      fit: 58,
      status: "Passed",
      strategy: "PE Direct",
      dealType: "Company",
      stage: "Passed",
      geo: "Pittsburgh, PA",
      hq: "Pittsburgh, Pennsylvania, USA",
      website: "brightlinerobotics.com",
      employees: 240,
      founded: 2017,
      regions: "North America",
      take: "Hardware margins and a crowded ARM field; capital intensity didn't fit the thesis.",
      thesis:
        "Brightline has solid technology but competes in a crowded autonomous-mobile-robot field with hardware-level gross margins. The capital intensity and limited software attach didn't fit our asset-light thesis. Passed after first screen.",
      isNew: false,
      ownership: null,
      preMoney: 390,
      postMoney: null,
      revYoY: 44,
      ebitdaYoY: null,
      passReason: "Capital intensity & crowded ARM field; off-thesis",
      passedDate: "2026-05-28",
    },
    {
      id: "cedarmark",
      name: "Cedarmark Dental",
      initials: "CD",
      sector: "Healthcare",
      sub: "Dental Services (DSO)",
      desc: "Multi-state dental support organization rolling up suburban practices.",
      source: "Provident",
      sourceType: "Sell-side bank",
      received: "2026-05-15",
      revenue: 132.0,
      ebitda: 18.4,
      ask: 295,
      fit: 61,
      status: "Passed",
      strategy: "PE Direct",
      dealType: "Company",
      stage: "Passed",
      geo: "Columbus, OH",
      hq: "Columbus, Ohio, USA",
      website: "cedarmarkdental.com",
      employees: 1120,
      founded: 2013,
      regions: "North America",
      take: "Integration risk across 40 acquired practices; same-store growth flat.",
      thesis:
        "Cedarmark is a sizeable DSO but same-store growth has gone flat and integration debt is high across 40+ acquired practices. We've seen the DSO playbook compress at exit. Passed at IC pre-read.",
      isNew: false,
      ownership: null,
      preMoney: 280,
      postMoney: null,
      revYoY: 11,
      ebitdaYoY: 7,
      passReason: "Flat same-store growth; DSO multiple compression risk",
      passedDate: "2026-05-20",
    },
  ];

  // financial statements for a deal (Meridian) — used in tear sheet
  const financials = {
    meridian: {
      years: [2022, 2021, 2020],
      pl: [
        { k: "Revenue", v: [142.0, 114.5, 96.2], conf: "verified" },
        { k: "Gross Profit", v: [101.6, 80.2, 65.4], conf: "verified" },
        { k: "EBITDA", v: [38.5, 29.4, 22.1], conf: "verified" },
        { k: "Net Income", v: [21.3, 15.1, 9.8], conf: "estimated" },
      ],
      bs: [
        { k: "Cash & Equivalents", v: [54.2, 41.0, 33.6], conf: "verified" },
        { k: "Current Assets", v: [118.4, 96.1, 78.2], conf: "verified" },
        { k: "Total Assets", v: [286.0, 241.3, 198.7], conf: "verified" },
        { k: "Total Debt", v: [62.0, 70.5, 58.0], conf: "estimated" },
        { k: "Shareholders' Equity", v: [174.5, 138.2, 112.0], conf: "verified" },
      ],
      perf: [{ k: "Operating Cash Flow", v: [34.8, 26.2, 18.9], conf: "estimated" }],
    },
  };

  // key people for Meridian
  const people = {
    meridian: [
      { name: "Dr. Elena Voss", title: "Founder & CEO", exp: 22, av: "#2f6bff", bio: "Orthopedic surgeon turned operator. Founded Meridian after 12 years at the Hospital for Special Surgery.", prev: "HSS, Stryker", edu: "MD, Johns Hopkins" },
      { name: "Marcus Tan", title: "Chief Financial Officer", exp: 18, av: "#16a34a", bio: "Scaled two medtech businesses through IPO. CPA with deep capital-markets relationships.", prev: "Intuitive Surgical, KKR", edu: "MBA, Wharton" },
      { name: "Priya Desai", title: "Chief Commercial Officer", exp: 16, av: "#e08a00", bio: "Built the global commercial org at a $2B device company. Expert in IDN contracting.", prev: "Medtronic, Boston Scientific", edu: "BS, MIT" },
      { name: "James O'Connor", title: "VP Engineering", exp: 14, av: "#7c5cfc", bio: "Robotics and controls leader. Holds 19 patents in surgical actuation.", prev: "Auris Health, Google X", edu: "PhD, Stanford" },
    ],
  };

  // citation sources used by provenance modal
  const sources = {
    "Revenue": [
      { doc: "Meridian_CIM_2026.pdf", page: 24, excerpt: "Total revenue for fiscal year 2022 was $142.0M, representing 24% growth over the prior year driven by consumables expansion and 140 net new system placements.", type: "CIM" },
      { doc: "Meridian_Audited_FS_2022.pdf", page: 4, excerpt: "Net revenues … $142,031 thousand … (2021: $114,492 thousand).", type: "Audited Financials" },
    ],
    "EBITDA": [
      { doc: "Meridian_CIM_2026.pdf", page: 31, excerpt: "Adjusted EBITDA of $38.5M (27.1% margin) reflects operating leverage in the consumables business and disciplined G&A.", type: "CIM" },
      { doc: "Meridian_MgmtModel_v4.xlsx", page: 1, excerpt: "Adjusted EBITDA bridge: Reported EBITDA $34.2M + one-time legal $2.1M + stock comp $2.2M = $38.5M.", type: "Management Model" },
    ],
    "Pre-money Valuation": [
      { doc: "Jefferies_ProcessLetter.pdf", page: 2, excerpt: "The Company is seeking proposals based on an enterprise value of approximately $880M, implying 6.2x LTM revenue.", type: "Process Letter" },
    ],
    "Employees": [
      { doc: "Meridian_CIM_2026.pdf", page: 12, excerpt: "As of March 2026, Meridian employed 480 full-time staff across R&D (140), Commercial (190), Operations (110), and G&A (40).", type: "CIM" },
    ],
    "default": [
      { doc: "Meridian_CIM_2026.pdf", page: 18, excerpt: "Supporting figure extracted from the confidential information memorandum provided by the sell-side advisor.", type: "CIM" },
    ],
  };

  // recent activity feed (home)
  const activity = [
    { type: "section", deal: "Meridian Surgical", name: "Generated 'Market Opportunity' analysis", user: "You", color: "#7c5cfc", time: "12m ago" },
    { type: "file", deal: "Northwind Logistics", name: "Uploaded Q1-2026 Management Accounts.xlsx", user: "Sofia Reyes", color: "#2f6bff", time: "44m ago" },
    { type: "flag", deal: "Lumen Skincare", name: "CAC trend flagged — needs review", user: "Critic AI", color: "#e08a00", time: "1h ago" },
    { type: "analysis", deal: "Cobalt Cloud", name: "Created 'Investment Returns' analysis", user: "David Kim", color: "#16a34a", time: "2h ago" },
    { type: "status", deal: "Northwind Logistics", name: "Auto-moved Screening → IC Review from banker email", user: "Email automation", color: "#2f6bff", time: "3h ago" },
    { type: "deal", deal: "Silverpeak Diagnostics", name: "New deal ingested from deals@paragon.com", user: "Auto-intake", color: "#2f6bff", time: "5h ago" },
  ];

  // ---- PORTFOLIO ----
  const portfolio = [
    {
      id: "verda", name: "Verda Health", initials: "VH", sector: "Healthcare", sub: "Value-Based Care",
      own: 64, invested: "Mar 2023", revenue: 412, ebitda: 71, growth: 19, status: "On Track",
      moic: 1.8, period: "Q1 2026",
      spark: [38, 42, 45, 51, 56, 60, 64, 71],
      covenant: { name: "Net Leverage", value: 3.1, threshold: 4.0, ok: true },
      desc: "Multi-state value-based primary care network.",
    },
    {
      id: "forge", name: "Forge Industrial", initials: "FI", sector: "Industrials", sub: "Precision Components",
      own: 82, invested: "Aug 2021", revenue: 286, ebitda: 48, growth: 7, status: "Watch",
      moic: 2.1, period: "Q1 2026",
      spark: [44, 46, 47, 49, 50, 49, 48, 48],
      covenant: { name: "Net Leverage", value: 4.6, threshold: 4.75, ok: false },
      desc: "Precision-machined components for aerospace & defense.",
    },
    {
      id: "bloom", name: "Bloom Beauty Co.", initials: "BB", sector: "Consumer", sub: "Color Cosmetics",
      own: 71, invested: "Jun 2024", revenue: 158, ebitda: 24, growth: 34, status: "Outperform",
      moic: 1.5, period: "Q1 2026",
      spark: [12, 15, 17, 19, 21, 22, 23, 24],
      covenant: { name: "Fixed Charge Cov.", value: 1.9, threshold: 1.5, ok: true },
      desc: "Masstige color cosmetics with strong marketplace velocity.",
    },
    {
      id: "quanta", name: "Quanta Compute", initials: "QC", sector: "Technology", sub: "Data Infrastructure",
      own: 58, invested: "Nov 2022", revenue: 224, ebitda: 52, growth: 28, status: "On Track",
      moic: 2.4, period: "Q1 2026",
      spark: [30, 34, 38, 42, 45, 48, 50, 52],
      covenant: { name: "Net Leverage", value: 2.8, threshold: 4.5, ok: true },
      desc: "GPU-dense colocation and managed compute for AI workloads.",
    },
  ];

  // MIS time series for a portfolio company (Forge)
  const misSeries = {
    forge: {
      revenue: [{ p: "Q2'24", v: 64 }, { p: "Q3'24", v: 68 }, { p: "Q4'24", v: 71 }, { p: "Q1'25", v: 69 }, { p: "Q2'25", v: 72 }, { p: "Q3'25", v: 70 }, { p: "Q4'25", v: 73 }, { p: "Q1'26", v: 72 }],
      ebitda: [{ p: "Q2'24", v: 11.4 }, { p: "Q3'24", v: 12.1 }, { p: "Q4'24", v: 12.6 }, { p: "Q1'25", v: 11.8 }, { p: "Q2'25", v: 12.3 }, { p: "Q3'25", v: 11.6 }, { p: "Q4'25", v: 12.4 }, { p: "Q1'26", v: 12.0 }],
      margin: [{ p: "Q2'24", v: 17.8 }, { p: "Q3'24", v: 17.8 }, { p: "Q4'24", v: 17.7 }, { p: "Q1'25", v: 17.1 }, { p: "Q2'25", v: 17.1 }, { p: "Q3'25", v: 16.6 }, { p: "Q4'25", v: 17.0 }, { p: "Q1'26", v: 16.7 }],
    },
  };

  const misTimeline = {
    forge: [
      { kind: "call", title: "Q1 FY26 founder review call", date: "Jun 9, 2026", who: "CEO + CFO", summary: "Discussed margin compression from a defense-contract pricing reset. Management chose to absorb the hit to protect the relationship rather than re-price (which would have risked a re-compete). Backlog remains strong at 1.4x revenue. Decision: hold pricing, accelerate the Mexicali automation line to recover 120bps by Q4.", tags: ["Margin", "Decision"] },
      { kind: "email", title: "Covenant headroom note", date: "May 28, 2026", who: "CFO email", summary: "CFO flagged net leverage at 4.6x vs. 4.75x covenant. Proposed a $12M revolver paydown from Q2 cash to restore headroom. Treasury confirmed liquidity supports it.", tags: ["Covenant", "Liquidity"] },
      { kind: "call", title: "Operations deep-dive", date: "May 14, 2026", who: "COO", summary: "Reviewed the automation capex plan. Why Mexicali over Monterrey: lower logistics cost to the Texas customer cluster and an existing workforce. Payback modeled at 2.1 years.", tags: ["Capex"] },
      { kind: "email", title: "April MIS pack received", date: "May 6, 2026", who: "Auto-forward", summary: "Monthly management accounts auto-ingested. Revenue $24.1M (in line), EBITDA margin 16.5% (-20bps vs plan). No covenant trips. Auto-summarized and indexed.", tags: ["MIS"] },
    ],
  };

  // ---- SECTORS ----
  const sectors = [
    { id: "pharma", name: "Pharma & Life Sciences", signals: 14, fresh: "8m ago", color: "#16a34a", note: "Patent cliff + PLI scheme activity" },
    { id: "consumer", name: "Consumer & Personal Care", signals: 9, fresh: "22m ago", color: "#e08a00", note: "D2C velocity, quick-commerce shift" },
    { id: "industrials", name: "Industrials & Supply Chain", signals: 6, fresh: "1h ago", color: "#2563eb", note: "Reshoring, freight cycle" },
    { id: "energy", name: "Energy Transition", signals: 11, fresh: "34m ago", color: "#0e9488", note: "Storage economics, grid policy" },
    { id: "insurance", name: "Insurance & Specialty Risk", signals: 7, fresh: "12m ago", color: "#be123c", note: "Analyst coverage, comps & cap tables", memory: true },
  ];

  const briefing = {
    pharma: [
      { topic: "Patent Cliff", title: "Three blockbuster biologics face 2027–2028 LOE; biosimilar pipelines accelerating", sources: ["Evaluate", "BioPharma Dive", "Company filings"], count: 6, date: "Today, 9:12 AM", sentiment: "opportunity", summary: "A cluster of biologics representing ~$34B in combined sales lose exclusivity over the next 24 months. At least 9 biosimilar developers have filed or signaled filings. Window for fill-finish and CDMO capacity plays is opening." },
      { topic: "Policy", title: "Government notifies expanded PLI incentives for domestic API manufacturing", sources: ["Gov. Gazette", "Reuters", "ICRA"], count: 4, date: "Today, 7:40 AM", sentiment: "opportunity", summary: "The latest production-linked incentive notification widens eligible API categories and lifts the outlay ceiling. Several mid-market formulators are likely beneficiaries; relevant to two names on our watchlist." },
      { topic: "M&A", title: "Strategic acquires specialty injectables maker at 14x EBITDA", sources: ["Bloomberg", "Press release"], count: 3, date: "Yesterday", sentiment: "neutral", summary: "Sets a fresh comp for the sterile injectables space at 14x LTM EBITDA, above the 11x trailing median. Reprices several assets in our comps set." },
    ],
    consumer: [
      { topic: "Channel Shift", title: "Quick-commerce now 18% of urban personal-care volume; modern trade decelerating", sources: ["NielsenIQ", "Broker note", "Company calls"], count: 5, date: "Today, 8:05 AM", sentiment: "neutral", summary: "Quick-commerce continues to take share in metros, compressing the discovery advantage of legacy brands. Velocity data shows challenger brands over-indexing on these platforms." },
      { topic: "Funding", title: "Clinical-skincare challenger raises Series C at 6x forward revenue", sources: ["TechCrunch", "Cap-table data"], count: 2, date: "Today, 6:30 AM", sentiment: "opportunity", summary: "Validates the clinical-efficacy positioning thesis and sets a private comp directly relevant to the Lumen Skincare diligence." },
    ],
    insurance: [
      { topic: "Regulation", title: "Regulator raises minimum solvency margin for specialty MGAs", sources: ["Regulator notice", "Broker note"], count: 4, date: "Today, 8:40 AM", sentiment: "neutral", summary: "Higher capital requirements pressure sub-scale MGAs and create consolidation opportunities. Two names on our specialty-risk watchlist would be natural acquirers." },
      { topic: "M&A", title: "Specialty insurer acquired at 1.9x book / 11x earnings", sources: ["Bloomberg", "Press release"], count: 3, date: "Yesterday", sentiment: "neutral", summary: "Sets a fresh public comp at 1.9x tangible book and 11x earnings, slightly above the trailing median. Reprices our specialty-risk comp set." },
    ],
  };

  // ---- GOVERNMENT TENDERS / POLICY TRACKER ----
  const tenders = [
    { title: "State procurement — oncology biosimilars", body: "Ministry of Health", value: "$120M", closes: "21 days", status: "Open", sector: "pharma" },
    { title: "Grid-scale storage capacity auction (Round 4)", body: "National Energy Authority", value: "$340M", closes: "9 days", status: "Open", sector: "energy" },
    { title: "Defense precision-components framework", body: "Dept. of Defense", value: "$85M", closes: "Closed", status: "Awarded", sector: "industrials" },
    { title: "Public health diagnostics panel supply", body: "State Health Dept.", value: "$54M", closes: "33 days", status: "Open", sector: "pharma" },
  ];

  // ---- INSTITUTIONAL MEMORY (e.g. Insurance) ----
  const institutional = {
    insurance: {
      coverage: [
        { name: "Coastal Specialty Re", analyst: "Priya N.", since: "2021", note: "Covered through 2 renewal cycles", trend: "up" },
        { name: "Meridian MGA Group", analyst: "Tom B.", since: "2022", note: "Passed in 2023; re-engaged 2026", trend: "flat" },
        { name: "Harbor Mutual Holdings", analyst: "Priya N.", since: "2020", note: "Reference relationship w/ CFO", trend: "up" },
      ],
      comps: [
        { co: "Coastal Specialty Re", pb: "1.9x", pe: "11.2x", combined: "91%", year: "2026" },
        { co: "Harbor Mutual", pb: "1.4x", pe: "9.6x", combined: "96%", year: "2026" },
        { co: "Sector median", pb: "1.6x", pe: "10.4x", combined: "94%", year: "2026" },
      ],
      capTable: [
        { holder: "Founder & mgmt", pct: 34 },
        { holder: "Growth equity (Series B)", pct: 28 },
        { holder: "Strategic reinsurer", pct: 19 },
        { holder: "ESOP / employees", pct: 12 },
        { holder: "Other", pct: 7 },
      ],
      marketShare: [
        { p: "2021", v: 6.2 }, { p: "2022", v: 7.1 }, { p: "2023", v: 7.9 },
        { p: "2024", v: 8.6 }, { p: "2025", v: 9.4 }, { p: "2026", v: 10.3 },
      ],
    },
  };

  // ---- ACCESS CONTROL / PERMISSIONS ----
  const team = [
    { name: "Alex Chen", role: "Partner", av: "#2f6bff", scope: "All deals & sectors" },
    { name: "Sofia Reyes", role: "Principal", av: "#16a34a", scope: "Healthcare, Industrials" },
    { name: "David Kim", role: "Associate", av: "#e08a00", scope: "Assigned deals only" },
    { name: "Maya Iyer", role: "Analyst", av: "#7c5cfc", scope: "Assigned deals only" },
    { name: "Jordan Webb", role: "IC Member", av: "#be123c", scope: "Read-only · IC stage+" },
  ];
  const roles = [
    { role: "Partner", deals: "All", sectors: "All", memos: "Create & approve", settings: "Manage" },
    { role: "Principal", deals: "Sector-scoped", sectors: "Assigned", memos: "Create", settings: "View" },
    { role: "Associate", deals: "Assigned", sectors: "Assigned", memos: "Create draft", settings: "—" },
    { role: "Analyst", deals: "Assigned", sectors: "Assigned", memos: "Draft", settings: "—" },
    { role: "IC Member", deals: "IC stage+", sectors: "All", memos: "Review", settings: "—" },
  ];

  // ---- NOTIFICATIONS (unified inbox: bell + sidebar hub) ----
  const notifications = [
    { id: "n1", kind: "email", title: "Email moved Northwind to IC Review", detail: "Banker email \"next steps\" table parsed — Screening → IC Review.", time: "2h ago", unread: true, action: "email" },
    { id: "n2", kind: "flag", title: "Critic AI flagged a metric", detail: "Lumen Skincare — CAC trend needs review before screening.", time: "1h ago", unread: true, action: "deal:lumen" },
    { id: "n3", kind: "deal", title: "New deal ingested", detail: "Silverpeak Diagnostics arrived via deals@paragon.com.", time: "5h ago", unread: true, action: "deal:silverpeak" },
    { id: "n4", kind: "alert", title: "New government tender", detail: "Oncology biosimilars procurement — closes in 21 days.", time: "3h ago", unread: false, action: "sector:pharma" },
    { id: "n5", kind: "email", title: "Pipeline meeting actions applied", detail: "3 status updates detected from Monday's pipeline email.", time: "1d ago", unread: false, action: "email" },
    { id: "n6", kind: "alert", title: "Patent cliff approaching", detail: "Zelbrava ($7.2B) loses exclusivity Q3 2027.", time: "1d ago", unread: false, action: "sector:pharma" },
    { id: "n7", kind: "deal", title: "Deal archived", detail: "Cedarmark Dental was passed and moved to Archived.", time: "2d ago", unread: false, action: "view:dealflow" },
  ];

  const drugLaunch = [
    { drug: "Onvexa", company: "Helix Bio", molecule: "Anti-IL23 mAb", price: 4820, comp: 5100, status: "Launched" },
    { drug: "Temravir", company: "Northstar Pharma", molecule: "NS5A inhibitor", price: 3110, comp: 2980, status: "Launched" },
    { drug: "Calidex", company: "Verda Health", molecule: "SGLT2 + DPP4", price: 410, comp: 520, status: "Filed" },
    { drug: "Pyralin", company: "Helix Bio", molecule: "Kinase inhibitor", price: 8900, comp: 9400, status: "Phase III" },
  ];

  const patentCliff = [
    { drug: "Zelbrava", company: "GlobalRx", sales: 7.2, expiry: "Q3 2027", window: 0.55 },
    { drug: "Imuneta", company: "Cordant", sales: 5.8, expiry: "Q1 2028", window: 0.72 },
    { drug: "Vasclear", company: "Northstar Pharma", sales: 4.1, expiry: "Q4 2027", window: 0.4 },
    { drug: "Dermavex", company: "Helix Bio", sales: 3.3, expiry: "Q2 2028", window: 0.85 },
  ];

  const sentiment = [
    { p: "W1", pos: 62, neg: 38 }, { p: "W2", pos: 58, neg: 42 }, { p: "W3", pos: 66, neg: 34 },
    { p: "W4", pos: 71, neg: 29 }, { p: "W5", pos: 68, neg: 32 }, { p: "W6", pos: 74, neg: 26 },
    { p: "W7", pos: 70, neg: 30 }, { p: "W8", pos: 77, neg: 23 },
  ];

  const sectorSources = [
    { name: "Evaluate Pharma", type: "Paid", status: "Connected" },
    { name: "Government Gazette RSS", type: "Free", status: "Connected" },
    { name: "Broker Research (Jefferies, Blair)", type: "Paid", status: "Connected" },
    { name: "Expert Network Transcripts", type: "Paid", status: "Connected" },
    { name: "Reddit / Forums Scraper", type: "Scraped", status: "Connected" },
    { name: "Tender Portal Monitor", type: "API", status: "Syncing" },
  ];

  // ---- INGESTION SOURCES (settings) ----
  const ingestion = [
    { name: "Deal Intake Inbox", detail: "deals@paragon.com · source of truth · auto-forward", icon: "mail", status: "Connected", sync: "Live", category: "Email" },
    { name: "Email → Status automation", detail: "AI reads 'next steps' tables and updates deal status", icon: "mail", status: "Connected", sync: "Live", category: "Email" },
    { name: "Dropbox — /Deal Flow (private)", detail: "Folder sync · 1,204 files · private deal data", icon: "folder", status: "Connected", sync: "2m ago", category: "Documents" },
    { name: "Google Drive — Diligence", detail: "Folder sync · 856 files", icon: "folder", status: "Connected", sync: "8m ago", category: "Documents" },
    { name: "Excel Deal Tracker", detail: "Import / export .xlsx · 1,240 rows", icon: "table", status: "Connected", sync: "Manual", category: "Documents" },
    { name: "WhatsApp Connector", detail: "Banker & intermediary forwards", icon: "chat", status: "Connected", sync: "14m ago", category: "Email" },
    { name: "PitchBook API", detail: "Data provider · comps & multiples", icon: "api", status: "Connected", sync: "1h ago", category: "External data" },
    { name: "Broker Research (Jefferies, Blair)", detail: "Paid subscriptions · research notes", icon: "api", status: "Connected", sync: "1h ago", category: "External data" },
    { name: "Alternate Data — EU Providers", detail: "European registries & alt-data feeds", icon: "globe", status: "Connected", sync: "3h ago", category: "External data" },
    { name: "Telegram Deal Channels", detail: "3 channels monitored", icon: "chat", status: "Paused", sync: "—", category: "Email" },
  ];

  // ---- EMAIL → STATUS AUTOMATION (parsed "next steps" tables) ----
  const inbox = [
    {
      id: "e1", from: "Daniel Mehta · Jefferies", subject: "RE: Meridian — process update & next steps", time: "2h ago",
      preview: "As discussed, here are the next steps for the names we're running…",
      updates: [
        { deal: "meridian", from: "Screening", to: "IC Review", step: "Management call scheduled Thu — IC pre-read due Fri", applied: true },
      ],
    },
    {
      id: "e2", from: "Sofia Reyes · Internal", subject: "Pipeline meeting — actions", time: "1d ago",
      preview: "Notes + next steps from Monday's pipeline meeting (table attached)…",
      updates: [
        { deal: "northwind", from: "Screening", to: "IC Review", step: "Draft IC memo; confirm freight downside case", applied: true },
        { deal: "lumen", from: "Triaging", to: "Screening", step: "Request CAC cohort data from banker", applied: true },
        { deal: "cobalt", from: "Screening", to: "Screening", step: "Schedule reference calls w/ 3 vet groups", applied: false },
      ],
    },
  ];

  // ---- ACTIONABLES / NEXT STEPS (per deal) ----
  const actions = {
    meridian: [
      { id: "a1", type: "call", text: "Banker call with Jefferies (process & timeline)", due: "Thu 2:00 PM", owner: "Alex Chen", done: false },
      { id: "a2", type: "note", text: "Pipeline meeting: top-3 IDN concentration is the key flag to underwrite", due: "Logged", owner: "You", done: true },
      { id: "a3", type: "task", text: "Request customer cohort file (2020–2026)", due: "Tomorrow", owner: "David Kim", done: false },
    ],
    northwind: [
      { id: "a1", type: "task", text: "Draft IC memo from CIM + management model", due: "Fri", owner: "Sofia Reyes", done: false },
      { id: "a2", type: "call", text: "Expert call on freight-cycle downside", due: "Next week", owner: "Alex Chen", done: false },
    ],
    lumen: [
      { id: "a1", type: "task", text: "Request CAC cohort data from Raymond James", due: "This week", owner: "You", done: false },
      { id: "a2", type: "note", text: "Validate contribution margin at scale before screening memo", due: "Logged", owner: "You", done: false },
    ],
    cobalt: [
      { id: "a1", type: "call", text: "Reference calls with 3 multi-site vet groups", due: "Next week", owner: "David Kim", done: false },
    ],
  };

  // ---- DEAL FILES ----
  const files = [
    { name: "Meridian_CIM_2026.pdf", size: "8.4 MB", status: "Ready", updated: "Jun 12, 2026", by: "Sofia Reyes", av: "#2f6bff", ftype: "pdf" },
    { name: "Meridian_Audited_FS_2022.pdf", size: "2.1 MB", status: "Ready", updated: "Jun 12, 2026", by: "Sofia Reyes", av: "#2f6bff", ftype: "pdf" },
    { name: "Meridian_MgmtModel_v4.xlsx", size: "1.7 MB", status: "Ready", updated: "Jun 11, 2026", by: "David Kim", av: "#16a34a", ftype: "xls" },
    { name: "Jefferies_ProcessLetter.pdf", size: "640 KB", status: "Ready", updated: "Jun 10, 2026", by: "You", av: "#e08a00", ftype: "pdf" },
    { name: "Customer_Cohorts_2020-2026.csv", size: "3.2 MB", status: "Processing", updated: "Jun 13, 2026", by: "David Kim", av: "#16a34a", ftype: "csv" },
    { name: "Mgmt_Presentation.pptx", size: "12.1 MB", status: "Ready", updated: "Jun 9, 2026", by: "Sofia Reyes", av: "#2f6bff", ftype: "ppt" },
    { name: "Quality_of_Earnings_Draft.docx", size: "890 KB", status: "Ready", updated: "Jun 8, 2026", by: "You", av: "#e08a00", ftype: "doc" },
  ];

  const analyses = [
    { name: "Market Opportunity", icon: "target", status: "ready" },
    { name: "Investment Returns", icon: "trending", status: "ready" },
    { name: "Organization Structure", icon: "org", status: "ready" },
    { name: "Competitive Landscape", icon: "grid", status: "processing" },
  ];

  const quickLinks = [
    "Strategy & Market Assessment",
    "Management & Governance",
    "Financial Performance & Capital Structure",
    "Legal & Contractual Risk",
    "Operational & Commercial Validation",
    "Fraud Risk & Red Flags",
  ];

  window.DB = {
    deals, financials, people, sources, activity, portfolio, misSeries, misTimeline,
    sectors, briefing, drugLaunch, patentCliff, sentiment, sectorSources, ingestion, files, analyses, quickLinks,
    inbox, actions, tenders, institutional, team, roles, notifications,
    firm: "Paragon Capital", intakeEmail: "deals@paragon.com",
    SECTOR_COLOR, logoColor,
    activeDeals: () => deals.filter((d) => d.status !== "Passed"),
    archivedDeals: () => deals.filter((d) => d.status === "Passed"),
    actionsFor: (id) => actions[id] || [],
    dealById: (id) => deals.find((d) => d.id === id),
    portfolioById: (id) => portfolio.find((p) => p.id === id),
  };
})();

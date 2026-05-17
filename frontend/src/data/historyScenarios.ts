import type { EconomicVariables, HistoryScenario, HistoryTimelinePoint } from "../types/economy";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type HistorySeed = {
  id: string;
  title: string;
  era: string;
  region: string;
  category: HistoryScenario["category"];
  severity: HistoryScenario["severity"];
  context: string;
  historianBrief: string;
  variables: EconomicVariables;
  events: string[];
  policies: string[];
  consequences: HistoryScenario["consequences"];
  ticker: string[];
  parallels: string[];
  stress: number;
};

function buildTimeline(seed: HistorySeed): HistoryTimelinePoint[] {
  return seed.events.map((event, index) => {
    const t = index + 1;
    const wave = Math.sin(index * 0.9);
    const deterioration = seed.stress * (t / seed.events.length);
    const recovery = index > seed.events.length * 0.62 ? (index - seed.events.length * 0.62) * 4 : 0;
    const gdp = clamp(104 - deterioration * 0.55 + recovery + wave * 2.8 + seed.variables.consumerConfidence * 0.05, 24, 155);
    const inflation = clamp(seed.variables.inflation + deterioration * 0.24 + seed.variables.tariffs * 0.06 - recovery * 0.15 + wave * 0.6, -8, 95);
    const employment = clamp(96 - seed.variables.unemployment * 1.5 - deterioration * 0.32 + recovery * 0.45 + wave * 1.6, 12, 105);
    const debt = clamp(42 + seed.variables.governmentSpending * 0.9 + deterioration * 0.72 - seed.variables.taxRate * 0.28 + t * 1.8, 10, 240);
    const currency = clamp(seed.variables.currencyStrength - deterioration * 0.45 + seed.variables.interestRate * 0.5 + recovery * 0.4 + wave * 1.4, 0, 110);
    const publicTrust = clamp(seed.variables.consumerConfidence - deterioration * 0.5 + recovery * 0.45, 0, 100);
    const socialStability = clamp(95 - deterioration * 0.62 - seed.variables.unemployment * 1.2 - inflation * 0.35 + recovery * 0.55, 0, 100);
    const crisisIntensity = clamp(seed.stress * 0.38 + deterioration * 0.48 - recovery * 0.5, 0, 100);

    return {
      month: `T${t}`,
      monthIndex: t,
      year: event.split(":")[0],
      event: event.replace(/^.*?:\s*/, ""),
      policy: seed.policies[index % seed.policies.length],
      gdp: Number(gdp.toFixed(1)),
      inflation: Number(inflation.toFixed(1)),
      employment: Number(employment.toFixed(1)),
      debt: Number(debt.toFixed(1)),
      purchasingPower: Number(clamp(116 - inflation * 1.2 + employment * 0.25 - deterioration * 0.18, 0, 145).toFixed(1)),
      currency: Number(currency.toFixed(1)),
      marketConfidence: Number(clamp(publicTrust * 0.5 + currency * 0.28 + gdp * 0.18 - crisisIntensity * 0.35, 0, 100).toFixed(1)),
      costOfLiving: Number(clamp(88 + inflation * 2.1 + seed.variables.tariffs * 0.5 + deterioration * 0.3, 45, 260).toFixed(1)),
      socialStability: Number(socialStability.toFixed(1)),
      publicTrust: Number(publicTrust.toFixed(1)),
      crisisIntensity: Number(crisisIntensity.toFixed(1)),
      fearGreed: Number(clamp(100 - crisisIntensity + wave * 6, 0, 100).toFixed(1)),
      centralBankCredibility: Number(clamp(85 - inflation * 0.8 - deterioration * 0.22 + seed.variables.interestRate * 0.6, 0, 100).toFixed(1)),
      populationPressure: Number(clamp(seed.variables.unemployment * 1.6 + deterioration * 0.4 + inflation * 0.28, 0, 100).toFixed(1))
    };
  });
}

const seeds: HistorySeed[] = [
  {
    id: "rome",
    title: "Fall of the Roman Empire",
    era: "235-476 CE",
    region: "Mediterranean",
    category: "Civilization",
    severity: "Extreme",
    stress: 88,
    context: "A long civilizational breakdown shaped by currency debasement, military overspending, political fragmentation, population decline, and trade insecurity.",
    historianBrief: "Rome shows how fiscal pressure can become institutional pressure. Debasing currency financed short-term survival, but it weakened trust, prices, tax collection, and military cohesion.",
    variables: { interestRate: 7, inflation: 13, tariffs: 22, minimumWage: 8, governmentSpending: 76, unemployment: 15, consumerConfidence: 20, currencyStrength: 24, taxRate: 45 },
    events: ["235: Crisis of the Third Century begins", "260: Coinage debasement accelerates", "284: Diocletian imposes price controls", "330: Capital shifts toward Constantinople", "376: Gothic migration pressures frontier", "410: Rome is sacked", "455: Western tax base fragments", "476: Western imperial authority collapses"],
    policies: ["Mint more coinage", "Raise provincial taxes", "Cap prices", "Expand military payroll", "Negotiate frontier settlements"],
    consequences: [
      { trigger: "Military overspending", chain: ["debased currency", "inflation", "tax resistance", "weaker army funding"], outcome: "state capacity erodes" },
      { trigger: "Trade instability", chain: ["grain shortages", "urban stress", "migration pressure", "political fragmentation"], outcome: "regional economies detach" }
    ],
    ticker: ["ROME: Grain shortages worsen across southern provinces", "ROME: Silver content in coinage falls again", "ROME: Frontier defense costs exceed tax receipts", "ROME: Merchants demand payment in kind"],
    parallels: ["Weimar Germany", "Soviet collapse", "Argentine debt crises"]
  },
  {
    id: "black-death",
    title: "Black Death",
    era: "1347-1353",
    region: "Europe and Asia",
    category: "Shock",
    severity: "Extreme",
    stress: 82,
    context: "A demographic catastrophe that reduced labor supply, shifted bargaining power toward workers, disrupted trade, and changed the structure of medieval economies.",
    historianBrief: "The plague was a supply shock and labor-market shock at once. Scarce workers could demand higher wages, while land values and feudal obligations weakened.",
    variables: { interestRate: 5, inflation: 9, tariffs: 12, minimumWage: 24, governmentSpending: 34, unemployment: 6, consumerConfidence: 14, currencyStrength: 45, taxRate: 31 },
    events: ["1347: Plague reaches Mediterranean ports", "1348: Mortality surges across cities", "1349: Labor shortages intensify", "1351: Wage controls are attempted", "1353: Trade routes begin reopening", "1360: Land rents remain depressed"],
    policies: ["Quarantine ports", "Freeze wages", "Tax estates", "Rebuild trade routes"],
    consequences: [{ trigger: "Population collapse", chain: ["labor scarcity", "higher wages", "landlord pressure", "social bargaining shifts"], outcome: "feudal labor systems weaken" }],
    ticker: ["EUROPE: Labor scarcity pushes wages higher", "VENICE: Port quarantines disrupt trade", "LONDON: Authorities attempt wage controls", "PARIS: Food prices swing as supply chains fracture"],
    parallels: ["COVID supply shock", "postwar labor shortages", "demographic aging"]
  },
  {
    id: "industrial-revolution",
    title: "Industrial Revolution",
    era: "1760-1840",
    region: "Britain",
    category: "Transformation",
    severity: "High",
    stress: 48,
    context: "A productivity revolution driven by mechanization, coal, factories, finance, transport, and urban labor migration.",
    historianBrief: "Industrialization shows the upside and cost of productivity shocks: output rose, prices of manufactured goods fell, but cities absorbed severe labor and health strain.",
    variables: { interestRate: 4, inflation: 4, tariffs: 8, minimumWage: 10, governmentSpending: 29, unemployment: 8, consumerConfidence: 67, currencyStrength: 72, taxRate: 22 },
    events: ["1760: Textile mechanization spreads", "1781: Steam power becomes commercially useful", "1801: Urban population accelerates", "1815: Postwar adjustment strains workers", "1830: Railways reshape markets", "1840: Factory productivity compounds"],
    policies: ["Protect patents", "Finance canals", "Expand railways", "Reform factory labor"],
    consequences: [{ trigger: "Mechanization", chain: ["higher productivity", "urban migration", "wage pressure", "new consumer markets"], outcome: "modern growth regime emerges" }],
    ticker: ["BRITAIN: Mill output reaches new high", "MANCHESTER: Urban rents surge near factories", "LONDON: Investors rotate into rail finance", "BRITAIN: Productivity gains pressure artisan labor"],
    parallels: ["Rise of China", "Tech expansion era", "AI productivity shock"]
  },
  {
    id: "great-depression",
    title: "Great Depression",
    era: "1929-1939",
    region: "United States",
    category: "Crisis",
    severity: "Extreme",
    stress: 90,
    context: "A financial crash became a demand collapse, banking crisis, deflationary spiral, and mass unemployment event.",
    historianBrief: "The Great Depression shows how falling demand and falling prices can reinforce each other. When banks fail and incomes collapse, lower prices do not automatically restore growth.",
    variables: { interestRate: 6, inflation: -2, tariffs: 35, minimumWage: 8, governmentSpending: 36, unemployment: 25, consumerConfidence: 8, currencyStrength: 60, taxRate: 18 },
    events: ["1929: Stock market crash", "1930: Bank failures spread", "1931: Deflation deepens", "1933: New Deal begins", "1935: Work programs expand", "1937: Recovery stumbles", "1939: War demand changes outlook"],
    policies: ["Defend gold parity", "Raise tariffs", "Deposit insurance", "Public works stimulus", "Monetary easing"],
    consequences: [{ trigger: "Banking collapse", chain: ["credit contraction", "business failures", "unemployment spike", "deflation"], outcome: "demand spiral intensifies" }],
    ticker: ["UNITED STATES: Banks suspend withdrawals in several states", "WALL STREET: Equity confidence remains fragile", "WASHINGTON: Public works spending expands", "UNITED STATES: Deflation pressure weighs on wages"],
    parallels: ["2008 Financial Crisis", "Japan Lost Decades", "COVID demand shock"]
  },
  {
    id: "weimar",
    title: "Hyperinflation in Weimar Germany",
    era: "1921-1923",
    region: "Germany",
    category: "Crisis",
    severity: "Extreme",
    stress: 96,
    context: "War debt, reparations, fiscal deficits, and money creation destroyed currency credibility and household savings.",
    historianBrief: "Weimar demonstrates that money creation becomes dangerous when the public stops believing currency will hold value. Prices then chase expectations, not just current supply.",
    variables: { interestRate: 15, inflation: 28, tariffs: 18, minimumWage: 11, governmentSpending: 82, unemployment: 12, consumerConfidence: 5, currencyStrength: 4, taxRate: 36 },
    events: ["1921: Reparations pressure grows", "1922: Printing accelerates", "1923: Ruhr occupation shocks production", "1923: Prices reset daily", "1923: Rentenmark introduced", "1924: Currency stabilizes"],
    policies: ["Print to finance deficits", "Index wages", "Introduce new currency", "Restore fiscal discipline"],
    consequences: [{ trigger: "Excessive money printing", chain: ["currency collapse", "hyperinflation", "savings wiped out", "social unrest"], outcome: "monetary regime reset" }],
    ticker: ["WEIMAR: Currency printing accelerates overnight", "BERLIN: Shops reprice goods by the hour", "WEIMAR: Wage payments move to daily schedules", "BERLIN: New currency plan leaks to market desks"],
    parallels: ["Argentina", "Rome currency debasement", "Zimbabwe inflation"]
  },
  {
    id: "oil-crisis",
    title: "Oil Crisis of the 1970s",
    era: "1973-1980",
    region: "Global",
    category: "Shock",
    severity: "High",
    stress: 76,
    context: "Energy supply shocks pushed inflation higher while slowing growth, creating a stagflation problem that standard demand tools struggled to solve.",
    historianBrief: "The oil crisis reveals why supply shocks are hard: raising rates can cool inflation but cannot produce more oil, while stimulus can worsen price pressure.",
    variables: { interestRate: 10, inflation: 12, tariffs: 10, minimumWage: 15, governmentSpending: 47, unemployment: 8, consumerConfidence: 30, currencyStrength: 54, taxRate: 29 },
    events: ["1973: Oil embargo begins", "1974: Energy prices surge", "1975: Recession pressure spreads", "1979: Second oil shock arrives", "1980: Central banks turn restrictive", "1982: Inflation begins easing"],
    policies: ["Fuel rationing", "Rate hikes", "Energy conservation", "Strategic reserves"],
    consequences: [{ trigger: "Oil supply shock", chain: ["energy prices rise", "production costs climb", "inflation persists", "growth slows"], outcome: "stagflation regime appears" }],
    ticker: ["GLOBAL: Energy prices surge after supply shock", "UNITED STATES: Inflation expectations rise", "EUROPE: Industrial margins squeezed by fuel costs", "CENTRAL BANKS: Rate path turns restrictive"],
    parallels: ["COVID inflation", "commodity dependency crises", "sanctions shock"]
  },
  {
    id: "dot-com",
    title: "Dot-com Bubble",
    era: "1995-2002",
    region: "United States",
    category: "Bubble",
    severity: "High",
    stress: 62,
    context: "Internet optimism drove extreme equity valuations before profits, cash flow, and business models caught up.",
    historianBrief: "Asset bubbles often start with a real technology story. The danger comes when price momentum replaces business fundamentals as the main investment logic.",
    variables: { interestRate: 5.5, inflation: 2.6, tariffs: 4, minimumWage: 13, governmentSpending: 33, unemployment: 4, consumerConfidence: 86, currencyStrength: 78, taxRate: 25 },
    events: ["1995: Internet IPO wave begins", "1998: Valuations detach from earnings", "1999: Retail speculation accelerates", "2000: Nasdaq peaks", "2001: Capital dries up", "2002: Survivors consolidate"],
    policies: ["Easy capital access", "IPO expansion", "Accounting scrutiny", "Rate cuts after crash"],
    consequences: [{ trigger: "Speculative capital", chain: ["asset prices rise", "fear of missing out", "weak firms get funded", "confidence snaps"], outcome: "market correction cleans excess" }],
    ticker: ["NASDAQ: Internet shares open sharply higher", "SILICON VALLEY: Cash burn concerns widen", "WALL STREET: IPO pipeline overheats", "NASDAQ: Profitless tech names sell off"],
    parallels: ["Tulip Mania", "South Sea Bubble", "crypto cycles"]
  },
  {
    id: "japan-lost",
    title: "Japanese Lost Decades",
    era: "1991-2010",
    region: "Japan",
    category: "Crisis",
    severity: "High",
    stress: 70,
    context: "A property and equity bubble burst into slow growth, deflation, weak credit creation, and rising public debt.",
    historianBrief: "Japan shows that low interest rates alone may not restart growth when balance sheets are damaged and expectations become deflationary.",
    variables: { interestRate: 0.3, inflation: 0.1, tariffs: 4, minimumWage: 14, governmentSpending: 63, unemployment: 5.2, consumerConfidence: 36, currencyStrength: 69, taxRate: 30 },
    events: ["1991: Asset bubble bursts", "1995: Banks carry bad loans", "1998: Deflation psychology sets in", "2001: Quantitative easing begins", "2008: Global crisis hits exports", "2010: Debt remains elevated"],
    policies: ["Zero-rate policy", "Bank recapitalization", "Fiscal packages", "Quantitative easing"],
    consequences: [{ trigger: "Balance sheet damage", chain: ["weak lending", "low investment", "deflation expectations", "public stimulus dependence"], outcome: "long stagnation" }],
    ticker: ["JAPAN: Deflation concerns continue for 8th consecutive quarter", "TOKYO: Property values remain under pressure", "BOJ: Ultra-low-rate policy continues", "JAPAN: Public debt climbs after stimulus package"],
    parallels: ["Great Depression", "post-2008 deleveraging", "aging economy stress"]
  },
  {
    id: "soviet-collapse",
    title: "Collapse of the Soviet Union",
    era: "1985-1991",
    region: "Eurasia",
    category: "Civilization",
    severity: "Extreme",
    stress: 86,
    context: "A planned economy faced productivity stagnation, fiscal strain, shortages, political liberalization, and institutional collapse.",
    historianBrief: "The Soviet collapse illustrates that production systems need price signals, trust, and adaptive institutions. Shortages can become political crises when legitimacy is already weak.",
    variables: { interestRate: 8, inflation: 18, tariffs: 26, minimumWage: 9, governmentSpending: 78, unemployment: 11, consumerConfidence: 12, currencyStrength: 18, taxRate: 48 },
    events: ["1985: Reform agenda begins", "1987: Shortages intensify", "1989: Eastern bloc fractures", "1990: Fiscal crisis deepens", "1991: Union authority collapses", "1992: Price liberalization shock"],
    policies: ["Partial liberalization", "State enterprise support", "Currency controls", "Price liberalization"],
    consequences: [{ trigger: "Institutional mistrust", chain: ["shortages", "parallel markets", "currency flight", "political fragmentation"], outcome: "planned system collapses" }],
    ticker: ["MOSCOW: Shortages deepen across consumer goods", "SOVIET UNION: Republics demand fiscal control", "MOSCOW: Currency confidence deteriorates", "EURASIA: State enterprises miss production targets"],
    parallels: ["Rome fragmentation", "currency crises", "transition economies"]
  },
  {
    id: "rise-china",
    title: "Rise of China",
    era: "1978-2020",
    region: "China",
    category: "Transformation",
    severity: "Moderate",
    stress: 44,
    context: "Market reforms, export-led manufacturing, infrastructure investment, urbanization, and global trade integration created one of history's largest growth episodes.",
    historianBrief: "China shows how productivity, trade access, capital formation, and urban labor migration can compound for decades, while debt and property imbalances accumulate later.",
    variables: { interestRate: 4, inflation: 4.5, tariffs: 6, minimumWage: 16, governmentSpending: 52, unemployment: 4.8, consumerConfidence: 78, currencyStrength: 70, taxRate: 25 },
    events: ["1978: Reform and opening begins", "1992: Market reforms deepen", "2001: WTO entry accelerates exports", "2008: Stimulus expands infrastructure", "2015: Rebalancing concerns rise", "2020: Supply chains become strategic"],
    policies: ["Special economic zones", "Export incentives", "Infrastructure stimulus", "Industrial policy"],
    consequences: [{ trigger: "Export-led reform", chain: ["factory investment", "urban migration", "income growth", "global supply integration"], outcome: "rapid catch-up growth" }],
    ticker: ["CHINA: Export orders climb after trade integration", "SHENZHEN: Factory investment accelerates", "BEIJING: Infrastructure package supports growth", "GLOBAL: Supply chain dependency debate intensifies"],
    parallels: ["Industrial Revolution", "post-WWII boom", "tech expansion era"]
  },
  {
    id: "bretton-woods",
    title: "Bretton Woods Collapse",
    era: "1971-1973",
    region: "Global",
    category: "Transformation",
    severity: "High",
    stress: 66,
    context: "The dollar-gold system ended as external imbalances and inflation pressure made fixed convertibility unsustainable.",
    historianBrief: "Bretton Woods shows how exchange-rate regimes depend on credibility. When promises become inconsistent with domestic policy, markets test the anchor.",
    variables: { interestRate: 6, inflation: 6, tariffs: 12, minimumWage: 14, governmentSpending: 49, unemployment: 6, consumerConfidence: 43, currencyStrength: 48, taxRate: 28 },
    events: ["1968: Gold pool pressure builds", "1971: Dollar convertibility suspended", "1972: Realignment attempts continue", "1973: Major currencies float", "1974: Inflation volatility rises"],
    policies: ["Capital controls", "Suspend convertibility", "Currency realignment", "Floating exchange rates"],
    consequences: [{ trigger: "Fixed-rate credibility loss", chain: ["gold outflows", "market pressure", "policy conflict", "currency regime reset"], outcome: "modern floating FX system emerges" }],
    ticker: ["WASHINGTON: Gold convertibility suspended", "GLOBAL FX: Currency desks price new volatility", "EUROPE: Realignment talks continue", "MARKETS: Dollar anchor credibility questioned"],
    parallels: ["currency pegs", "emerging-market crises", "Eurozone stress"]
  },
  {
    id: "postwar-boom",
    title: "Post-WWII Economic Boom",
    era: "1945-1973",
    region: "North America, Europe, Japan",
    category: "Transformation",
    severity: "Moderate",
    stress: 36,
    context: "Reconstruction, productivity growth, stable institutions, household formation, and expanding trade drove a long boom.",
    historianBrief: "The postwar boom shows how reconstruction demand, productivity, demographics, and credible institutions can reinforce each other for decades.",
    variables: { interestRate: 3.5, inflation: 3, tariffs: 7, minimumWage: 18, governmentSpending: 41, unemployment: 3.5, consumerConfidence: 82, currencyStrength: 76, taxRate: 30 },
    events: ["1945: Reconstruction begins", "1948: Marshall Plan capital flows", "1955: Consumer durables boom", "1960: Trade expands", "1968: Inflation pressure appears", "1973: Oil shock ends the regime"],
    policies: ["Reconstruction finance", "Trade liberalization", "Housing support", "Education investment"],
    consequences: [{ trigger: "Reconstruction investment", chain: ["capital formation", "higher productivity", "rising wages", "consumer demand"], outcome: "broad middle-class expansion" }],
    ticker: ["EUROPE: Reconstruction demand lifts output", "UNITED STATES: Household formation boosts consumption", "JAPAN: Manufacturing productivity rises", "GLOBAL: Trade volumes expand under stable institutions"],
    parallels: ["Industrial Revolution", "Rise of China", "green reconstruction scenarios"]
  }
];

export const historyScenarios: HistoryScenario[] = seeds.map((seed) => ({
  ...seed,
  timeline: buildTimeline(seed)
}));

export const economyLessons = [
  {
    title: "Why inflation happens",
    formula: "INFLATION ↑ + WAGES ↑ + PRODUCTIVITY ↓",
    result: "inflation pressure increases",
    chain: ["demand outruns supply", "firms lift prices", "wages chase prices", "expectations reset"],
    confidence: 86,
    example: "1970s stagflation; COVID supply constraints",
    theory: ["Phillips Curve", "Keynesian demand pressure", "Federal Reserve education"],
    sources: ["Federal Reserve", "IMF inflation research", "OECD price outlooks"],
    explanation: "If pay and demand rise faster than output per worker, firms often protect margins by raising prices."
  },
  {
    title: "Why high rates slow growth",
    formula: "HIGH INTEREST RATES ↑",
    result: "borrowing falls and hiring weakens",
    chain: ["loans cost more", "investment slows", "consumer credit cools", "hiring weakens"],
    confidence: 91,
    example: "Volcker disinflation; 2022-2024 tightening cycle",
    theory: ["Monetary policy transmission", "IS-LM intuition", "Central bank reaction functions"],
    sources: ["Federal Reserve", "ECB monetary policy primers", "BIS annual reports"],
    explanation: "Higher rates make future projects harder to justify, so firms and households delay spending."
  },
  {
    title: "Money printing and currency trust",
    formula: "MONEY PRINTING ↑ + LOW TRUST",
    result: "currency weakens and real assets surge",
    chain: ["currency supply expands", "trust falls", "people buy goods", "prices jump"],
    confidence: 83,
    example: "Weimar Germany; Roman currency debasement",
    theory: ["Quantity theory of money", "Monetarist theory", "Fiscal dominance"],
    sources: ["IMF working papers", "economic history literature", "World Bank macro notes"],
    explanation: "When people expect money to lose value, they spend it quickly, which can accelerate inflation."
  },
  {
    title: "Supply versus demand",
    formula: "WAR + SUPPLY SHOCK",
    result: "inflation spikes and shortages emerge",
    chain: ["inputs vanish", "production costs rise", "shelves thin out", "prices spike"],
    confidence: 88,
    example: "1970s oil crisis; pandemic logistics disruption",
    theory: ["Aggregate supply shocks", "cost-push inflation", "terms-of-trade shock"],
    sources: ["World Bank commodity outlooks", "IMF World Economic Outlook", "OECD supply-chain analysis"],
    explanation: "Supply shocks are painful because demand tools cannot instantly create missing energy, grain, chips, or shipping capacity."
  },
  {
    title: "Asset bubbles",
    formula: "LOW RATES + CHEAP CREDIT",
    result: "asset bubbles become more likely",
    chain: ["credit expands", "risk appetite rises", "prices outrun cash flow", "confidence snaps"],
    confidence: 78,
    example: "Dot-com bubble; housing boom before 2008",
    theory: ["Minsky financial instability", "Austrian credit-cycle view", "behavioral finance"],
    sources: ["BIS credit cycle research", "Federal Reserve financial stability reports", "economic history papers"],
    explanation: "A good story can become dangerous when investors stop asking whether future profits justify today's prices."
  },
  {
    title: "Government debt",
    formula: "DEBT ↑ + WEAK GROWTH",
    result: "fiscal instability risk increases",
    chain: ["interest costs rise", "budget space shrinks", "confidence weakens", "risk premium climbs"],
    confidence: 81,
    example: "Argentina debt crises; Eurozone sovereign stress",
    theory: ["Debt sustainability", "primary balance", "sovereign risk premium"],
    sources: ["IMF debt sustainability framework", "World Bank debt statistics", "OECD fiscal outlooks"],
    explanation: "Debt is easier to carry when the economy grows faster than borrowing costs. Weak growth reverses that math."
  },
  {
    title: "Tariffs and trade",
    formula: "HIGH TARIFFS ↑",
    result: "imports fall, prices rise, trade slows",
    chain: ["import costs rise", "consumer prices lift", "retaliation risk grows", "trade volume falls"],
    confidence: 79,
    example: "Smoot-Hawley tariff; recent trade-war episodes",
    theory: ["comparative advantage", "trade elasticity", "deadweight loss"],
    sources: ["World Bank trade research", "WTO data", "economic history papers"],
    explanation: "Tariffs can protect some producers, but consumers often pay through higher prices and less choice."
  }
];

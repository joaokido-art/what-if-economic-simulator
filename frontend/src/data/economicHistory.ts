export type EconomicEra =
  | "Pre-Money Exchange"
  | "Ancient Economies"
  | "Medieval Trade and Banking"
  | "Mercantilism"
  | "Industrial Capitalism"
  | "Managed Capitalism"
  | "Global Financial Era"
  | "Digital and AI Economy";

export type Metric = { label: string; value: number; tooltip: string; color: "blue" | "gold" | "green" | "pink" };

export type EraCard = {
  name: EconomicEra;
  date: string;
  system: string;
  money: string;
  institutions: string;
  risk: string;
  examples: string;
  transition: string;
};

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  era: EconomicEra;
  summary: string;
  cause: string;
  immediateEffect: string;
  longTermImpact: string;
  causeChain: string[];
  metrics: Metric[];
  previous?: string;
  next?: string;
  gained: string[];
  lost: string[];
  changedNext: string;
  modernParallel: string;
  sources: string[];
};

export type Thinker = {
  name: string;
  dates: string;
  school: string;
  coreIdea: string;
  respondingTo: string;
  policyPlaybook: string;
  simulatorReaction: string;
  criticism: string;
  modernExample: string;
  sources: string[];
};

export type ButterflyEffect = {
  trigger: string;
  initialShock: string;
  chain: string[];
  affectedGroups: string;
  indicators: string[];
  spillovers: string;
  lesson: string;
  sources: string[];
};

export const eraCards: EraCard[] = [
  {
    name: "Pre-Money Exchange",
    date: "c. 10,000-3,000 BCE",
    system: "barter, gift exchange, temple accounting",
    money: "grain, livestock, labor obligations",
    institutions: "villages, kinship networks, storage houses",
    risk: "poor record-keeping, limited trade scale",
    examples: "early farming settlements, grain storage, reciprocal labor",
    transition: "cities needed accounting systems"
  },
  {
    name: "Ancient Economies",
    date: "c. 3,000 BCE-500 CE",
    system: "palace economies, taxation, coinage, trade routes",
    money: "silver, grain, coinage",
    institutions: "temples, palaces, tax offices, mints, armies",
    risk: "war finance, tax pressure, debasement",
    examples: "Mesopotamia, Lydia, Rome, Han China",
    transition: "empire fragmentation and regional trade networks"
  },
  {
    name: "Medieval Trade and Banking",
    date: "c. 500-1500",
    system: "feudal obligations, merchant networks, early banking",
    money: "coinage, bills of exchange, credit ledgers",
    institutions: "manors, guilds, merchant houses, fairs, banks",
    risk: "famine, plague, fragmented authority",
    examples: "Silk Road, Italian banking families, Champagne fairs",
    transition: "long-distance trade and urban merchants"
  },
  {
    name: "Mercantilism",
    date: "c. 1500-1750",
    system: "colonial trade, chartered monopolies, bullion accumulation",
    money: "gold, silver, bills of exchange",
    institutions: "empires, chartered companies, navies, customs houses",
    risk: "monopoly abuse, colonial extraction, war debt",
    examples: "Dutch East India Company, Atlantic trade, Spanish silver",
    transition: "joint-stock finance and industrial technology"
  },
  {
    name: "Industrial Capitalism",
    date: "c. 1750-1914",
    system: "factories, wage labor, railroads, mass production",
    money: "gold standard, banknotes",
    institutions: "factories, banks, stock exchanges, rail companies, unions",
    risk: "inequality, labor unrest, financial panics",
    examples: "Industrial Revolution, railroads, gold standard",
    transition: "global war and mass state intervention"
  },
  {
    name: "Managed Capitalism",
    date: "c. 1914-1971",
    system: "welfare states, central banking, fiscal policy",
    money: "fiat currencies linked partly to gold through Bretton Woods",
    institutions: "central banks, welfare states, IMF, World Bank, treasuries",
    risk: "depression, war debt, inflation, unemployment",
    examples: "Great Depression, Keynesian policy, Bretton Woods",
    transition: "end of dollar-gold convertibility"
  },
  {
    name: "Global Financial Era",
    date: "c. 1971-2008",
    system: "floating exchange rates, global capital markets, deregulation",
    money: "fiat currencies, credit, derivatives",
    institutions: "global banks, central banks, hedge funds, rating agencies",
    risk: "asset bubbles, debt crises, banking contagion",
    examples: "Nixon Shock, oil shocks, Volcker disinflation, 2008",
    transition: "2008 financial crisis and digital platforms"
  },
  {
    name: "Digital and AI Economy",
    date: "c. 2008-present",
    system: "platforms, data, automation, crypto, AI infrastructure",
    money: "fiat, digital payments, crypto assets",
    institutions: "platform firms, cloud providers, AI labs, crypto exchanges",
    risk: "inequality, monopoly power, speculation, labor displacement",
    examples: "crypto speculation, platform economy, AI capital boom",
    transition: "still unfolding"
  }
];

const metric = (label: string, value: number, tooltip: string, color: Metric["color"]): Metric => ({ label, value, tooltip, color });

export const timelineEvents: TimelineEvent[] = [
  {
    id: "agricultural-surplus",
    date: "c. 10,000 BCE",
    title: "Agricultural surplus",
    era: "Pre-Money Exchange",
    summary: "Settled farming created stored food, larger villages, and the first durable surplus problems.",
    cause: "settled farming created stored food",
    immediateEffect: "larger villages and specialization",
    longTermImpact: "accounting, taxation, property, hierarchy",
    causeChain: ["settled farming", "stored food", "surplus", "specialization", "property claims"],
    metrics: [
      metric("surplus capacity", 88, "How much extra output could be stored beyond immediate survival.", "blue"),
      metric("trade scale", 35, "How far exchange could scale before reliable records and money.", "gold"),
      metric("institutional complexity", 62, "How much coordination society needed to manage storage, labor, and claims.", "pink")
    ],
    next: "temple-accounting",
    gained: ["settled communities", "specialized craftspeople", "storage managers"],
    lost: ["purely mobile groups", "households without secure claims"],
    changedNext: "Cities needed ledgers to track grain, labor, and obligations.",
    modernParallel: "Data systems become necessary when organizations grow beyond memory.",
    sources: ["Economic history consensus", "World Bank development history", "Institutional economics"]
  },
  {
    id: "temple-accounting",
    date: "c. 3,200 BCE",
    title: "Temple accounting in Mesopotamia",
    era: "Ancient Economies",
    summary: "Cities needed to track grain, labor, and taxes, so ledgers and early writing systems became economic infrastructure.",
    cause: "cities needed to track grain, labor, and taxes",
    immediateEffect: "ledgers and early writing systems",
    longTermImpact: "administration became central to economic life",
    causeChain: ["urban storage", "grain obligations", "labor tracking", "clay ledgers", "state capacity"],
    metrics: [
      metric("record-keeping impact", 95, "How strongly accounting improved economic coordination.", "green"),
      metric("trade scalability", 70, "How much records helped exchange grow beyond personal trust.", "blue"),
      metric("state capacity", 85, "How much administration strengthened taxation and planning.", "pink")
    ],
    previous: "agricultural-surplus",
    next: "lydian-coinage",
    gained: ["temples", "administrators", "tax collectors"],
    lost: ["people outside formal ledgers", "debtors with recorded obligations"],
    changedNext: "Standard records made standardized money more useful.",
    modernParallel: "Modern economies still run on ledgers: bank accounts, payroll, taxes, databases.",
    sources: ["Economic history consensus", "World Bank development history", "Institutional economics"]
  },
  {
    id: "lydian-coinage",
    date: "c. 600 BCE",
    title: "Coinage in Lydia",
    era: "Ancient Economies",
    summary: "Portable, trusted metal coins made market exchange and tax collection easier.",
    cause: "trade needed portable, trusted units of value",
    immediateEffect: "easier market exchange and tax collection",
    longTermImpact: "coinage spread through Mediterranean economies",
    causeChain: ["trade expands", "trusted unit needed", "stamped metal coins", "faster exchange", "tax collection improves"],
    metrics: [
      metric("transaction efficiency", 90, "How much coinage reduced friction in everyday exchange.", "blue"),
      metric("state tax capacity", 75, "How much coinage helped states collect and spend revenue.", "pink"),
      metric("market expansion", 80, "How much coinage helped markets reach strangers and cities.", "gold")
    ],
    previous: "temple-accounting",
    next: "roman-taxation",
    gained: ["merchants", "states", "soldiers paid in coin"],
    lost: ["local barter networks", "people exposed to monetary taxes"],
    changedNext: "Empires could collect, pay, and provision at larger scale.",
    modernParallel: "Digital payments reduce transaction friction like coinage once did.",
    sources: ["Monetary history", "Classical economics", "Economic history consensus"]
  },
  {
    id: "roman-taxation",
    date: "1st-3rd c. CE",
    title: "Roman taxation and military finance",
    era: "Ancient Economies",
    summary: "Rome needed revenue for armies, roads, bureaucracy, and frontier defense.",
    cause: "empire needed revenue for armies, roads, bureaucracy",
    immediateEffect: "stronger state capacity, but high fiscal pressure",
    longTermImpact: "tax stress contributed to instability",
    causeChain: ["empire expands", "army costs rise", "tax systems deepen", "bureaucracy grows", "fiscal pressure builds"],
    metrics: [
      metric("fiscal pressure", 82, "How heavy the revenue burden became for the economy.", "pink"),
      metric("military burden", 90, "How strongly defense costs shaped public finance.", "gold"),
      metric("administrative complexity", 85, "How complex collection and imperial management became.", "green")
    ],
    previous: "lydian-coinage",
    next: "roman-debasement",
    gained: ["army suppliers", "state administrators", "protected trade corridors"],
    lost: ["taxed provinces", "small producers under extraction"],
    changedNext: "When stable revenue lagged costs, debasement became tempting.",
    modernParallel: "Large security states still face fiscal tradeoffs between defense and domestic stability.",
    sources: ["Economic history consensus", "Fiscal history", "Monetary history"]
  },
  {
    id: "roman-debasement",
    date: "3rd c. CE",
    title: "Roman currency debasement",
    era: "Ancient Economies",
    summary: "Military and administrative costs exceeded stable revenue, so coins lost precious metal content.",
    cause: "military and administrative costs exceeded stable revenue",
    immediateEffect: "coins lost precious metal content",
    longTermImpact: "currency trust weakened and inflation pressure rose",
    causeChain: ["costs exceed revenue", "mint debases coins", "currency trust falls", "prices rise", "legitimacy weakens"],
    metrics: [
      metric("currency trust loss", 88, "How much credibility the monetary system lost.", "gold"),
      metric("inflation pressure", 79, "How strongly debasement contributed to price pressure.", "blue"),
      metric("political legitimacy damage", 72, "How much money problems weakened trust in the state.", "pink")
    ],
    previous: "roman-taxation",
    next: "black-death",
    gained: ["short-term imperial treasury", "debtors repaying in weaker money"],
    lost: ["soldiers paid in weaker currency", "savers", "taxpayers facing unstable prices"],
    changedNext: "Currency credibility became a recurring lesson for later empires and states.",
    modernParallel: "Inflationary finance can buy time while damaging trust.",
    sources: ["Monetary history", "Economic history consensus", "Inflation-response systems"]
  },
  {
    id: "black-death",
    date: "1347-1353",
    title: "Black Death labor shock",
    era: "Medieval Trade and Banking",
    summary: "A demographic catastrophe reduced Europe’s labor supply and shifted bargaining power.",
    cause: "plague reduced Europe’s population",
    immediateEffect: "labor became scarce",
    longTermImpact: "wages rose, feudal obligations weakened, urban labor gained power",
    causeChain: ["plague", "population decline", "labor scarcity", "wages rise", "feudal obligations weaken", "urban markets grow"],
    metrics: [
      metric("labor scarcity", 95, "How severe the shortage of available workers became.", "pink"),
      metric("wage bargaining power", 88, "How much workers gained leverage over employers and landlords.", "blue"),
      metric("feudal stress", 80, "How much fixed labor obligations came under pressure.", "gold"),
      metric("long-run capitalism relevance", 75, "How much this shock mattered for later labor markets.", "green")
    ],
    previous: "roman-debasement",
    next: "voc",
    gained: ["surviving workers", "some urban merchants", "towns needing paid labor"],
    lost: ["landlords dependent on fixed labor obligations", "feudal estates", "regions with severe population collapse"],
    changedNext: "Paid labor, towns, and merchant networks gained importance.",
    modernParallel: "Labor shortages after major shocks can shift bargaining power toward workers.",
    sources: ["Labor economics", "Economic history consensus", "World Bank development history"]
  },
  {
    id: "voc",
    date: "1602",
    title: "Dutch East India Company",
    era: "Mercantilism",
    summary: "Long-distance trade needed large pooled capital, so investors could own shares in overseas trade.",
    cause: "long-distance trade needed large pooled capital",
    immediateEffect: "investors could own shares in overseas trade",
    longTermImpact: "modern corporate finance and stock markets expanded",
    causeChain: ["global trade risk", "capital pooling", "joint-stock shares", "investor participation", "corporate finance expands"],
    metrics: [
      metric("capital pooling", 95, "How much the model helped gather large investment sums.", "blue"),
      metric("investor participation", 85, "How much ownership opened beyond direct merchants.", "gold"),
      metric("global trade expansion", 90, "How strongly the system scaled overseas trade.", "green")
    ],
    previous: "black-death",
    next: "tulip-mania",
    gained: ["investors", "merchant elites", "chartered monopolies"],
    lost: ["colonized regions", "rival merchants", "workers exposed to extraction"],
    changedNext: "Trade finance and share ownership made speculation easier.",
    modernParallel: "Venture capital pools risk in uncertain future markets.",
    sources: ["Economic history consensus", "Classical economics", "Financial history"]
  },
  {
    id: "tulip-mania",
    date: "1636-1637",
    title: "Tulip Mania",
    era: "Mercantilism",
    summary: "Speculation around rare tulip contracts pushed prices away from practical value.",
    cause: "speculation grew around rare tulip contracts",
    immediateEffect: "prices detached from practical value",
    longTermImpact: "classic lesson in speculative bubbles",
    causeChain: ["rare asset story", "resale expectations", "price momentum", "value gap widens", "confidence snaps"],
    metrics: [
      metric("speculation intensity", 90, "How much price action depended on resale psychology.", "pink"),
      metric("productive value gap", 85, "How far prices moved from practical economic usefulness.", "gold"),
      metric("crash severity", 75, "How painful the reversal became for participants.", "blue")
    ],
    previous: "voc",
    next: "industrial-revolution",
    gained: ["early sellers", "speculators who exited"],
    lost: ["late buyers", "contract holders", "overconfident traders"],
    changedNext: "Bubbles became a recurring pattern in liquid markets.",
    modernParallel: "Meme assets, crypto cycles, and momentum bubbles.",
    sources: ["Financial history", "Behavioral finance", "Economic history consensus"]
  },
  {
    id: "industrial-revolution",
    date: "1760-1840",
    title: "Industrial Revolution",
    era: "Industrial Capitalism",
    summary: "Steam power, mechanization, coal, and capital investment made factory production surge.",
    cause: "steam power, mechanization, coal, capital investment",
    immediateEffect: "factory production surged",
    longTermImpact: "productivity, urbanization, wage labor, and inequality transformed society",
    causeChain: ["steam power", "mechanization", "factory scale", "urban labor", "mass production", "new inequality"],
    metrics: [
      metric("productivity shock", 95, "How strongly output per worker and production scale changed.", "green"),
      metric("urbanization pressure", 88, "How much people and capital moved toward cities.", "pink"),
      metric("labor disruption", 85, "How much work patterns and bargaining changed.", "blue")
    ],
    previous: "tulip-mania",
    next: "gold-standard",
    gained: ["industrial capital", "some skilled workers", "consumers of cheaper goods"],
    lost: ["artisans", "rural systems", "workers in unsafe factories"],
    changedNext: "Global trade, railroads, and monetary coordination became more important.",
    modernParallel: "AI and automation may repeat the productivity-disruption tradeoff.",
    sources: ["Innovation economics", "Labor economics", "Economic history consensus"]
  },
  {
    id: "gold-standard",
    date: "1870s-1914",
    title: "Gold Standard",
    era: "Industrial Capitalism",
    summary: "Global trade needed exchange-rate stability, so currencies linked to gold.",
    cause: "global trade needed exchange-rate stability",
    immediateEffect: "currencies linked to gold",
    longTermImpact: "monetary stability improved, but policy flexibility declined",
    causeChain: ["trade expands", "currency risk matters", "gold convertibility", "exchange stability", "policy constraint"],
    metrics: [
      metric("exchange-rate stability", 90, "How much gold links reduced exchange uncertainty.", "gold"),
      metric("policy flexibility loss", 80, "How much governments gave up domestic monetary freedom.", "pink"),
      metric("trade confidence", 85, "How much the system supported global commerce.", "blue")
    ],
    previous: "industrial-revolution",
    next: "great-depression",
    gained: ["international traders", "creditors", "financial centers"],
    lost: ["debtors", "workers during downturns", "governments needing flexibility"],
    changedNext: "War finance and depression strained hard-money rules.",
    modernParallel: "Currency pegs still trade flexibility for credibility.",
    sources: ["Monetary history", "Classical economics", "Economic history consensus"]
  },
  {
    id: "great-depression",
    date: "1929-1939",
    title: "Great Depression",
    era: "Managed Capitalism",
    summary: "Financial speculation, banking fragility, and demand collapse created unemployment and bank failures.",
    cause: "financial speculation, banking fragility, demand collapse",
    immediateEffect: "unemployment and bank failures surged",
    longTermImpact: "modern macroeconomic policy and safety nets expanded",
    causeChain: ["asset crash", "bank stress", "credit contraction", "demand collapse", "unemployment", "policy revolution"],
    metrics: [
      metric("unemployment shock", 95, "How severe the labor-market collapse became.", "pink"),
      metric("banking stress", 92, "How much financial institutions came under pressure.", "blue"),
      metric("policy transformation", 98, "How much the crisis changed economic governance.", "green")
    ],
    previous: "gold-standard",
    next: "bretton-woods",
    gained: ["future safety-net institutions", "policy reformers"],
    lost: ["workers", "depositors", "farmers", "small businesses"],
    changedNext: "Keynesian policy and international coordination gained legitimacy.",
    modernParallel: "2008 revived fears of debt deflation and banking contagion.",
    sources: ["Keynesian theory", "Debt-deflation theory", "Federal Reserve education material"]
  },
  {
    id: "bretton-woods",
    date: "1944",
    title: "Bretton Woods",
    era: "Managed Capitalism",
    summary: "Leaders wanted postwar monetary stability and built a dollar-centered international system.",
    cause: "leaders wanted postwar monetary stability",
    immediateEffect: "dollar-centered international system",
    longTermImpact: "IMF, World Bank, and managed global finance",
    causeChain: ["war disruption", "coordination need", "dollar anchor", "IMF and World Bank", "managed finance"],
    metrics: [
      metric("global coordination", 95, "How much international institutions coordinated rules.", "green"),
      metric("exchange stability", 85, "How much the system reduced currency volatility.", "gold"),
      metric("dollar centrality", 95, "How dominant the dollar became in global finance.", "blue")
    ],
    previous: "great-depression",
    next: "nixon-shock",
    gained: ["postwar exporters", "reconstruction borrowers", "US financial power"],
    lost: ["countries with limited monetary autonomy"],
    changedNext: "Dollar-gold convertibility became the system's pressure point.",
    modernParallel: "Global institutions still shape crisis lending and development finance.",
    sources: ["IMF macroeconomic explainers", "World Bank development history", "Monetary history"]
  },
  {
    id: "nixon-shock",
    date: "1971",
    title: "Nixon Shock",
    era: "Global Financial Era",
    summary: "Pressure on US gold reserves ended dollar-gold convertibility and began the floating fiat era.",
    cause: "pressure on US gold reserves and dollar convertibility",
    immediateEffect: "dollar-gold link ended",
    longTermImpact: "modern floating fiat currency era began",
    causeChain: ["gold pressure", "convertibility suspended", "currencies float", "policy flexibility rises", "fiat era begins"],
    metrics: [
      metric("monetary regime change", 98, "How large the shift in global money rules was.", "gold"),
      metric("exchange-rate volatility", 80, "How much currency movement became more flexible and uncertain.", "blue"),
      metric("policy flexibility", 90, "How much central banks gained room to manage domestic conditions.", "green")
    ],
    previous: "bretton-woods",
    next: "oil-shocks",
    gained: ["central banks", "governments needing flexibility", "FX markets"],
    lost: ["gold-convertibility believers", "importers exposed to volatility"],
    changedNext: "Fiat flexibility collided with 1970s inflation pressure.",
    modernParallel: "Debates over currency anchors, crypto, and central-bank credibility.",
    sources: ["Monetary history", "Federal Reserve education material", "IMF macroeconomic explainers"]
  },
  {
    id: "oil-shocks",
    date: "1973-1980",
    title: "Oil shocks and stagflation",
    era: "Global Financial Era",
    summary: "Oil supply shocks and inflation expectations pushed prices up while growth slowed.",
    cause: "oil supply shocks and inflation expectations",
    immediateEffect: "inflation rose while growth slowed",
    longTermImpact: "central bank credibility became crucial",
    causeChain: ["oil supply falls", "production costs rise", "inflation expectations", "growth slows", "policy confusion"],
    metrics: [
      metric("inflation pressure", 93, "How strongly energy costs and expectations lifted prices.", "blue"),
      metric("growth slowdown", 82, "How much higher costs weakened output.", "pink"),
      metric("policy confusion", 90, "How hard the shock was for standard policy tools.", "gold")
    ],
    previous: "nixon-shock",
    next: "volcker",
    gained: ["energy producers", "oil exporters"],
    lost: ["consumers", "energy-intensive firms", "incumbent politicians"],
    changedNext: "Central banks moved toward credibility and inflation-fighting regimes.",
    modernParallel: "Energy shocks and supply-chain inflation after pandemics or wars.",
    sources: ["Federal Reserve education material", "IMF macroeconomic explainers", "Monetary history"]
  },
  {
    id: "volcker",
    date: "1980-1982",
    title: "Volcker disinflation",
    era: "Global Financial Era",
    summary: "The Federal Reserve raised rates to break inflation expectations, causing recession but restoring credibility.",
    cause: "Federal Reserve raised rates to break inflation expectations",
    immediateEffect: "recession and unemployment rose",
    longTermImpact: "inflation credibility was restored",
    causeChain: ["rates rise", "credit tightens", "demand falls", "unemployment rises", "inflation expectations break"],
    metrics: [
      metric("inflation reduction", 90, "How much policy reduced inflation pressure.", "blue"),
      metric("short-term pain", 88, "How much the economy absorbed recessionary stress.", "pink"),
      metric("central bank credibility", 95, "How much the Fed restored inflation-fighting trust.", "green")
    ],
    previous: "oil-shocks",
    next: "crisis-2008",
    gained: ["future price stability", "central bank credibility"],
    lost: ["borrowers", "workers in rate-sensitive sectors", "indebted firms"],
    changedNext: "Low-inflation credibility supported the later global financial era.",
    modernParallel: "Modern rate-hike cycles when inflation expectations drift upward.",
    sources: ["Federal Reserve education material", "Monetarist theory", "Monetary history"]
  },
  {
    id: "crisis-2008",
    date: "2008",
    title: "Global Financial Crisis",
    era: "Global Financial Era",
    summary: "A housing bubble, leverage, and weak risk controls triggered banking panic and recession.",
    cause: "housing bubble, leverage, weak risk controls",
    immediateEffect: "banking panic and recession",
    longTermImpact: "regulation, bailouts, and distrust of finance expanded",
    causeChain: ["housing prices fall", "mortgage defaults rise", "bank trust collapses", "credit freezes", "jobs cut", "bailouts and regulation"],
    metrics: [
      metric("banking stress", 98, "How severe the pressure on financial institutions became.", "blue"),
      metric("household wealth shock", 90, "How much households were hit through housing and jobs.", "pink"),
      metric("regulatory change", 85, "How much rules and oversight changed afterward.", "green")
    ],
    previous: "volcker",
    next: "pandemic-inflation",
    gained: ["some distressed-asset buyers", "institutions receiving support"],
    lost: ["homeowners", "workers", "small firms", "public trust"],
    changedNext: "Distrust of finance and digital alternatives gained energy.",
    modernParallel: "Banking stress can still transmit quickly through confidence and credit channels.",
    sources: ["Debt-deflation theory", "Federal Reserve education material", "IMF macroeconomic explainers"]
  },
  {
    id: "pandemic-inflation",
    date: "2020-2024",
    title: "Pandemic inflation shock",
    era: "Digital and AI Economy",
    summary: "Supply disruption, stimulus, demand rotation, and labor shortages brought inflation back.",
    cause: "supply disruption, stimulus, demand rotation, labor shortages",
    immediateEffect: "inflation returned after decades of low inflation",
    longTermImpact: "rate hikes, reshoring debates, supply-chain focus",
    causeChain: ["supply disruption", "stimulus", "goods demand", "labor shortages", "inflation surprise", "rate hikes"],
    metrics: [
      metric("supply shock", 90, "How much production and logistics constraints mattered.", "green"),
      metric("inflation surprise", 88, "How unexpected the inflation surge was after low-inflation decades.", "blue"),
      metric("central bank response", 87, "How strongly monetary policy reacted.", "gold")
    ],
    previous: "crisis-2008",
    next: "ai-boom",
    gained: ["some goods producers", "workers in tight labor markets"],
    lost: ["households facing prices", "fixed-income savers", "rate-sensitive borrowers"],
    changedNext: "Supply-chain resilience and AI productivity became central debates.",
    modernParallel: "War, pandemics, and logistics shocks can revive inflation quickly.",
    sources: ["IMF macroeconomic explainers", "Federal Reserve education material", "Labor economics"]
  },
  {
    id: "ai-boom",
    date: "2022-present",
    title: "AI capital boom",
    era: "Digital and AI Economy",
    summary: "Breakthroughs in machine learning and data-center infrastructure sent investment into chips, cloud, and automation.",
    cause: "breakthroughs in machine learning and data-center infrastructure",
    immediateEffect: "investment surged into chips, cloud, and automation",
    longTermImpact: "possible productivity gains, labor disruption, market concentration",
    causeChain: ["model performance improves", "chip demand rises", "data centers expand", "automation spreads", "labor demand shifts", "market concentration risk"],
    metrics: [
      metric("investment intensity", 92, "How strongly capital is flowing into AI infrastructure.", "blue"),
      metric("labor uncertainty", 80, "How much AI could change job tasks and bargaining power.", "pink"),
      metric("productivity potential", 85, "How much output could improve if tools diffuse widely.", "green")
    ],
    previous: "pandemic-inflation",
    gained: ["chipmakers", "AI firms", "cloud providers", "high-skill complements"],
    lost: ["routine cognitive workers facing uncertainty", "firms without compute access"],
    changedNext: "Still unfolding: productivity, inequality, and concentration are the big questions.",
    modernParallel: "Steam power and electrification changed production before institutions caught up.",
    sources: ["Innovation economics", "Labor economics", "Economic history consensus"]
  }
];

export const thinkers: Thinker[] = [
  {
    name: "Adam Smith",
    dates: "1723-1790",
    school: "Classical economics",
    coreIdea: "markets coordinate activity through prices and incentives",
    respondingTo: "mercantilism and trade restrictions",
    policyPlaybook: "competition, specialization, freer trade",
    simulatorReaction: "reduce unnecessary tariffs, improve productivity, protect competition",
    criticism: "markets can fail when power, information, or external costs are ignored",
    modernExample: "competition policy and free trade debates",
    sources: ["Classical economics", "Economic history consensus"]
  },
  {
    name: "David Ricardo",
    dates: "1772-1823",
    school: "Classical trade theory",
    coreIdea: "comparative advantage",
    respondingTo: "trade restrictions and protectionism",
    policyPlaybook: "specialize and trade when relative efficiency differs",
    simulatorReaction: "avoid high tariffs unless strategic risk is severe",
    criticism: "trade gains can be unevenly distributed",
    modernExample: "globalization and manufacturing decline debates",
    sources: ["Classical economics", "Trade theory"]
  },
  {
    name: "Karl Marx",
    dates: "1818-1883",
    school: "Political economy / critique of capitalism",
    coreIdea: "capitalism creates conflict between capital and labor",
    respondingTo: "industrial exploitation and inequality",
    policyPlaybook: "labor power, ownership reform, class analysis",
    simulatorReaction: "flag rising inequality and labor unrest",
    criticism: "planned economies created major practical failures",
    modernExample: "wealth inequality and labor platform debates",
    sources: ["Political economy", "Labor economics"]
  },
  {
    name: "John Maynard Keynes",
    dates: "1883-1946",
    school: "Keynesian economics",
    coreIdea: "demand can collapse and governments can stabilize it",
    respondingTo: "Great Depression",
    policyPlaybook: "fiscal stimulus, public spending, countercyclical policy",
    simulatorReaction: "increase spending during deep recession, reduce it during overheating",
    criticism: "stimulus can worsen debt or inflation if mistimed",
    modernExample: "2008 and COVID stimulus debates",
    sources: ["Keynesian theory", "IMF macroeconomic explainers"]
  },
  {
    name: "F. A. Hayek",
    dates: "1899-1992",
    school: "Austrian economics / classical liberalism",
    coreIdea: "markets process dispersed information better than central planners",
    respondingTo: "socialism and central planning",
    policyPlaybook: "price signals, limited central control, institutional restraint",
    simulatorReaction: "warn against over-controlling prices or markets",
    criticism: "underestimates cases where markets fail or crises require coordination",
    modernExample: "debates over price controls, regulation, and planning",
    sources: ["Classical economics", "Austrian economics"]
  },
  {
    name: "Milton Friedman",
    dates: "1912-2006",
    school: "Monetarism",
    coreIdea: "inflation is closely tied to money supply and expectations",
    respondingTo: "postwar inflation and Keynesian dominance",
    policyPlaybook: "control monetary growth, prioritize stable inflation expectations",
    simulatorReaction: "tighten policy when inflation expectations become unanchored",
    criticism: "money supply is harder to control in complex financial systems",
    modernExample: "central bank inflation targeting",
    sources: ["Monetarist theory", "Federal Reserve education material"]
  },
  {
    name: "Joseph Schumpeter",
    dates: "1883-1950",
    school: "Innovation economics",
    coreIdea: "capitalism evolves through creative destruction",
    respondingTo: "static views of capitalism",
    policyPlaybook: "innovation, entrepreneurship, technological churn",
    simulatorReaction: "boost productivity through innovation, but warn about job displacement",
    criticism: "creative destruction can create severe social costs",
    modernExample: "AI, automation, startup ecosystems",
    sources: ["Innovation economics", "Economic history consensus"]
  },
  {
    name: "Irving Fisher",
    dates: "1867-1947",
    school: "Neoclassical economics / debt-deflation theory",
    coreIdea: "debt and falling prices can reinforce crises",
    respondingTo: "Great Depression",
    policyPlaybook: "prevent debt-deflation spirals, stabilize credit systems",
    simulatorReaction: "warn when debt is high and prices are falling",
    criticism: "underestimated crisis risk before 1929",
    modernExample: "housing crashes and balance-sheet recessions",
    sources: ["Debt-deflation theory", "Federal Reserve education material"]
  },
  {
    name: "Thomas Malthus",
    dates: "1766-1834",
    school: "Classical economics / population theory",
    coreIdea: "population can grow faster than food supply",
    respondingTo: "poverty and resource limits",
    policyPlaybook: "watch population, food, and productivity constraints",
    simulatorReaction: "flag food shocks and resource scarcity",
    criticism: "underestimated technology and productivity growth",
    modernExample: "climate, food security, and resource debates",
    sources: ["Classical economics", "World Bank development history"]
  }
];

export const butterflyEffects: ButterflyEffect[] = [
  {
    trigger: "Black Death",
    initialShock: "population collapse",
    chain: ["population falls", "labor scarcity", "wages rise", "landlords lose control", "feudalism weakens", "towns grow", "market labor expands"],
    affectedGroups: "workers gain bargaining power; landlords lose control",
    indicators: ["wages up", "labor scarcity up", "feudal stability down"],
    spillovers: "urban labor markets become more important and social hierarchy becomes less fixed",
    lesson: "scarcity can shift power from institutions to workers",
    sources: ["Labor economics", "Economic history consensus"]
  },
  {
    trigger: "Oil Shock",
    initialShock: "energy prices spike",
    chain: ["oil supply falls", "production costs rise", "inflation rises", "consumers cut spending", "growth slows", "central banks tighten", "recession risk rises"],
    affectedGroups: "energy producers gain; consumers and energy-intensive firms lose",
    indicators: ["inflation up", "growth down", "policy stress up"],
    spillovers: "politicians face pressure from both inflation and unemployment at the same time",
    lesson: "supply shocks can create inflation even when demand is weak",
    sources: ["IMF macroeconomic explainers", "Federal Reserve education material"]
  },
  {
    trigger: "Steam Engine",
    initialShock: "mechanized power expands",
    chain: ["steam power spreads", "factories scale", "productivity rises", "cities grow", "wage labor expands", "inequality changes", "industrial politics emerge"],
    affectedGroups: "industrial capital and urban workers grow; artisans and rural systems decline",
    indicators: ["productivity up", "urbanization up", "labor disruption up"],
    spillovers: "schools, cities, unions, and infrastructure reorganize around industrial production",
    lesson: "technology changes the economy first, then society reorganizes around it",
    sources: ["Innovation economics", "Labor economics"]
  },
  {
    trigger: "Nixon Shock",
    initialShock: "dollar-gold convertibility ends",
    chain: ["gold link breaks", "currencies float", "exchange volatility rises", "monetary policy flexibility grows", "inflation politics intensify", "modern fiat era begins"],
    affectedGroups: "central banks gain flexibility; savers and importers face volatility",
    indicators: ["policy flexibility up", "exchange volatility up", "gold constraint down"],
    spillovers: "currency markets become more important to trade, inflation, and policy credibility",
    lesson: "changing money rules changes the entire policy system",
    sources: ["Monetary history", "Federal Reserve education material"]
  },
  {
    trigger: "2008 Crisis",
    initialShock: "housing-credit collapse",
    chain: ["housing prices fall", "mortgage defaults rise", "banks lose trust", "credit freezes", "firms cut jobs", "governments bail out banks", "regulation expands"],
    affectedGroups: "homeowners and workers lose; large banks receive support",
    indicators: ["bank stress up", "unemployment up", "trust down"],
    spillovers: "public anger grows as rescue policies appear uneven",
    lesson: "finance can transmit local bubbles into global crises",
    sources: ["Debt-deflation theory", "IMF macroeconomic explainers"]
  },
  {
    trigger: "AI Boom",
    initialShock: "AI capability and investment surge",
    chain: ["model performance improves", "chip demand rises", "data centers expand", "firms automate tasks", "labor demand shifts", "productivity may rise", "market concentration risk grows"],
    affectedGroups: "chipmakers and AI firms gain; routine cognitive workers face uncertainty",
    indicators: ["capital investment up", "labor uncertainty up", "productivity potential up"],
    spillovers: "education, antitrust, energy grids, and labor policy become AI policy too",
    lesson: "general-purpose technologies create both growth and displacement",
    sources: ["Innovation economics", "Labor economics"]
  }
];

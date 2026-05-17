export type VariableKey =
  | "interestRate"
  | "inflation"
  | "tariffs"
  | "minimumWage"
  | "governmentSpending"
  | "unemployment"
  | "consumerConfidence"
  | "currencyStrength"
  | "taxRate";

export type EconomicVariables = Record<VariableKey, number>;

export type IndicatorKey =
  | "gdpGrowth"
  | "costOfLiving"
  | "employment"
  | "purchasingPower"
  | "currencyStability"
  | "publicDebt"
  | "marketConfidence";

export type SimulationPoint = {
  month: string;
  monthIndex: number;
  gdp: number;
  inflation: number;
  employment: number;
  debt: number;
  purchasingPower: number;
  currency: number;
  marketConfidence: number;
  costOfLiving: number;
};

export type Preset = {
  name: string;
  category: "country" | "scenario";
  description: string;
  variables: EconomicVariables;
};

export type HistoricalEvent = {
  name: string;
  years: string;
  summary: string;
  severity: "Extreme" | "High" | "Moderate";
  variables: EconomicVariables;
  overlay: SimulationPoint[];
};

export type SavedScenario = {
  id: string;
  name: string;
  createdAt: string;
  variables: EconomicVariables;
};

export type HistoryTimelinePoint = SimulationPoint & {
  year: string;
  event: string;
  policy: string;
  socialStability: number;
  publicTrust: number;
  crisisIntensity: number;
  fearGreed: number;
  centralBankCredibility: number;
  populationPressure: number;
};

export type HistoryScenario = {
  id: string;
  title: string;
  era: string;
  region: string;
  category: "Civilization" | "Crisis" | "Bubble" | "Transformation" | "Shock";
  severity: "Moderate" | "High" | "Extreme";
  context: string;
  historianBrief: string;
  variables: EconomicVariables;
  timeline: HistoryTimelinePoint[];
  policies: string[];
  consequences: Array<{
    trigger: string;
    chain: string[];
    outcome: string;
  }>;
  ticker: string[];
  parallels: string[];
};

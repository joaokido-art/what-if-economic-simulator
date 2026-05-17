import type { EconomicVariables, HistoricalEvent, IndicatorKey, SimulationPoint } from "../types/economy";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wave = (index: number, amplitude: number) => Math.sin(index / 2.4) * amplitude;

export function computeIndicators(v: EconomicVariables): Record<IndicatorKey, number> {
  const confidenceLift = (v.consumerConfidence - 50) / 18;
  const rateDrag = (v.interestRate - 3.5) * 0.24;
  const taxDrag = (v.taxRate - 25) * 0.045;
  const tariffDrag = v.tariffs * 0.035;
  const wageBoost = (v.minimumWage - 15) * 0.07;
  const spendingBoost = (v.governmentSpending - 42) * 0.06;

  const gdpGrowth = clamp(2.4 + confidenceLift + wageBoost + spendingBoost - rateDrag - taxDrag - tariffDrag - v.unemployment * 0.11, -8, 8);
  const costOfLiving = clamp(100 + v.inflation * 4.2 + v.tariffs * 0.8 + v.minimumWage * 0.45 - v.currencyStrength * 0.22 - v.interestRate * 0.32, 72, 230);
  const employment = clamp(100 - v.unemployment * 3.1 + confidenceLift * 4.5 - v.interestRate * 0.85 + wageBoost * 2.5, 18, 100);
  const purchasingPower = clamp(112 - v.inflation * 3.3 + v.minimumWage * 1.35 - v.taxRate * 0.55 + v.currencyStrength * 0.22 - v.tariffs * 0.22, 28, 150);
  const currencyStability = clamp(v.currencyStrength + v.interestRate * 1.2 - v.inflation * 1.8 - v.governmentSpending * 0.14 + (v.consumerConfidence - 50) * 0.12, 0, 100);
  const publicDebt = clamp(45 + v.governmentSpending * 1.15 - v.taxRate * 0.72 + v.interestRate * 1.4 + v.unemployment * 1.2 - gdpGrowth * 2.2, 12, 220);
  const marketConfidence = clamp(58 + gdpGrowth * 5.6 + (100 - costOfLiving) * 0.12 + v.consumerConfidence * 0.34 + currencyStability * 0.22 - v.interestRate * 1.6, 0, 100);

  return {
    gdpGrowth,
    costOfLiving,
    employment,
    purchasingPower,
    currencyStability,
    publicDebt,
    marketConfidence
  };
}

export function generateSimulation(v: EconomicVariables, months = 24): SimulationPoint[] {
  const i = computeIndicators(v);
  return Array.from({ length: months }, (_, index) => {
    const t = index + 1;
    const gdpTrend = 100 + i.gdpGrowth * t * 0.72 + wave(index, 1.8);
    const inflationTrend = clamp(v.inflation + (v.tariffs / 34) * t * 0.09 - v.interestRate * 0.035 * t + wave(index, 0.18), -3, 35);
    const employmentTrend = clamp(i.employment + i.gdpGrowth * t * 0.18 - v.interestRate * t * 0.08 + wave(index, 0.9), 15, 102);
    const debtTrend = clamp(i.publicDebt + (v.governmentSpending - v.taxRate) * t * 0.15 + Math.max(0, -i.gdpGrowth) * t * 0.9, 8, 240);
    const purchaseTrend = clamp(i.purchasingPower - inflationTrend * 0.55 + i.gdpGrowth * t * 0.14 + wave(index, 0.75), 20, 160);
    const currencyTrend = clamp(i.currencyStability + (v.interestRate - v.inflation) * t * 0.18 - v.tariffs * t * 0.04 + wave(index, 0.9), 0, 105);
    const marketTrend = clamp(i.marketConfidence + i.gdpGrowth * t * 0.45 - inflationTrend * 0.25 + wave(index, 1.7), 0, 105);

    return {
      month: `M${t}`,
      monthIndex: t,
      gdp: Number(gdpTrend.toFixed(1)),
      inflation: Number(inflationTrend.toFixed(1)),
      employment: Number(employmentTrend.toFixed(1)),
      debt: Number(debtTrend.toFixed(1)),
      purchasingPower: Number(purchaseTrend.toFixed(1)),
      currency: Number(currencyTrend.toFixed(1)),
      marketConfidence: Number(marketTrend.toFixed(1)),
      costOfLiving: Number((i.costOfLiving + inflationTrend * t * 0.12 + wave(index, 1.1)).toFixed(1))
    };
  });
}

export function buildHistoricalEvents(): HistoricalEvent[] {
  const events = [
    {
      name: "2008 Financial Crisis",
      years: "2007-2009",
      summary: "Credit contraction, collapsing asset values, and emergency stimulus.",
      severity: "High" as const,
      variables: {
        interestRate: 1.25,
        inflation: 0.2,
        tariffs: 5,
        minimumWage: 12,
        governmentSpending: 67,
        unemployment: 10,
        consumerConfidence: 24,
        currencyStrength: 62,
        taxRate: 26
      }
    },
    {
      name: "COVID Inflation",
      years: "2020-2022",
      summary: "Supply shocks, fiscal support, and demand rotation into goods.",
      severity: "Moderate" as const,
      variables: {
        interestRate: 1.8,
        inflation: 8.9,
        tariffs: 11,
        minimumWage: 16,
        governmentSpending: 76,
        unemployment: 8.7,
        consumerConfidence: 38,
        currencyStrength: 65,
        taxRate: 24
      }
    },
    {
      name: "Great Depression",
      years: "1929-1939",
      summary: "Demand collapse, deflation, banking failures, and historic unemployment.",
      severity: "Extreme" as const,
      variables: {
        interestRate: 6,
        inflation: -1.8,
        tariffs: 35,
        minimumWage: 8,
        governmentSpending: 34,
        unemployment: 25,
        consumerConfidence: 8,
        currencyStrength: 58,
        taxRate: 18
      }
    },
    {
      name: "Japan Lost Decades",
      years: "1991-2010",
      summary: "Asset deflation, ultra-low rates, aging demographics, and high public debt.",
      severity: "High" as const,
      variables: {
        interestRate: 0.3,
        inflation: 0.1,
        tariffs: 4,
        minimumWage: 14,
        governmentSpending: 63,
        unemployment: 5.2,
        consumerConfidence: 36,
        currencyStrength: 69,
        taxRate: 30
      }
    }
  ];

  return events.map((event) => ({
    ...event,
    overlay: generateSimulation(event.variables)
  }));
}

export function generateAnalysis(v: EconomicVariables) {
  const i = computeIndicators(v);
  const risks: string[] = [];
  const tradeoffs: string[] = [];
  const insights: string[] = [];

  if (v.interestRate > 7) tradeoffs.push("Restrictive interest rates are likely to cool inflation, but they also compress investment and hiring.");
  if (v.inflation > 6) risks.push("Inflation remains the dominant risk, eroding real wages and shortening household planning horizons.");
  if (v.governmentSpending > 60) risks.push("Fiscal support is cushioning demand, but debt service risk rises quickly if growth disappoints.");
  if (v.consumerConfidence > 72) insights.push("High consumer confidence supports a resilient demand cycle and improves market sentiment.");
  if (v.currencyStrength < 40) risks.push("Currency weakness can import inflation and raise external financing pressure.");
  if (v.tariffs > 20) tradeoffs.push("Tariff protection may help selected domestic firms while raising cost-of-living pressure.");
  if (v.unemployment > 9) risks.push("Labor-market slack is the clearest signal of social and political stress in this scenario.");
  if (i.gdpGrowth > 3.5) insights.push("The model shows a broad growth impulse, especially where confidence and employment reinforce each other.");
  if (i.marketConfidence < 35) risks.push("Financial markets would likely price this mix as fragile until policy credibility improves.");

  if (!risks.length) risks.push("Risks are balanced, with no single input overwhelming the macro outlook.");
  if (!tradeoffs.length) tradeoffs.push("Policy settings are relatively balanced, so the main tradeoff is between speed of growth and price stability.");
  if (!insights.length) insights.push("The scenario is stable but not especially dynamic; targeted productivity gains would improve the outlook.");

  const headline =
    i.gdpGrowth >= 2
      ? "The policy mix points to expansion, with growth supported by demand and relatively healthy market confidence."
      : i.gdpGrowth > 0
        ? "The economy remains in positive territory, but momentum is fragile and sensitive to confidence shocks."
        : "The model projects contraction risk as tighter financial conditions and weak labor demand overpower stimulus.";

  return {
    headline,
    risks: risks.slice(0, 3),
    tradeoffs: tradeoffs.slice(0, 2),
    insights: insights.slice(0, 2),
    riskScore: Math.round(clamp((100 - i.marketConfidence) * 0.35 + i.publicDebt * 0.18 + v.inflation * 1.8 + v.unemployment * 1.6, 0, 100))
  };
}

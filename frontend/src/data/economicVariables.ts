import type { EconomicVariables, Preset } from "../types/economy";

export const defaultVariables: EconomicVariables = {
  interestRate: 4.25,
  inflation: 3.2,
  tariffs: 7,
  minimumWage: 18,
  governmentSpending: 46,
  unemployment: 4.4,
  consumerConfidence: 63,
  currencyStrength: 72,
  taxRate: 28
};

export const variableMeta = {
  interestRate: {
    label: "Interest Rate",
    unit: "%",
    min: 0,
    max: 18,
    step: 0.25,
    explanation:
      "The central bank policy rate. Higher rates cool borrowing and inflation but can slow growth."
  },
  inflation: {
    label: "Inflation",
    unit: "%",
    min: -2,
    max: 28,
    step: 0.1,
    explanation:
      "The pace of price increases. Persistent inflation erodes purchasing power and market trust."
  },
  tariffs: {
    label: "Import Tariffs",
    unit: "%",
    min: 0,
    max: 45,
    step: 1,
    explanation:
      "Taxes on imported goods. Tariffs may protect local producers but often raise consumer prices."
  },
  minimumWage: {
    label: "Minimum Wage",
    unit: "$",
    min: 7,
    max: 35,
    step: 0.5,
    explanation:
      "The wage floor for workers. Higher wages can lift income but may pressure small employers."
  },
  governmentSpending: {
    label: "Government Spending",
    unit: "% GDP",
    min: 20,
    max: 85,
    step: 1,
    explanation:
      "Public spending as a share of GDP. Stimulus can support demand while raising debt risk."
  },
  unemployment: {
    label: "Unemployment Rate",
    unit: "%",
    min: 2,
    max: 28,
    step: 0.1,
    explanation:
      "The share of workers seeking work. Higher unemployment weakens consumption and confidence."
  },
  consumerConfidence: {
    label: "Consumer Confidence",
    unit: "idx",
    min: 0,
    max: 100,
    step: 1,
    explanation:
      "A sentiment index for households. Optimistic consumers spend more and support growth."
  },
  currencyStrength: {
    label: "Currency Strength",
    unit: "idx",
    min: 0,
    max: 100,
    step: 1,
    explanation:
      "Relative currency strength. A stronger currency lowers import costs but can pressure exports."
  },
  taxRate: {
    label: "Tax Rate",
    unit: "%",
    min: 5,
    max: 60,
    step: 1,
    explanation:
      "Average effective tax burden. Taxes fund services but can reduce private-sector demand."
  }
} as const;

export const presets: Preset[] = [
  {
    name: "United States",
    category: "country",
    description: "Large, consumption-led economy with moderate inflation pressure.",
    variables: {
      interestRate: 4.5,
      inflation: 3.1,
      tariffs: 9,
      minimumWage: 17,
      governmentSpending: 43,
      unemployment: 4.2,
      consumerConfidence: 67,
      currencyStrength: 78,
      taxRate: 27
    }
  },
  {
    name: "Brazil",
    category: "country",
    description: "Emerging-market profile with higher rates and commodity sensitivity.",
    variables: {
      interestRate: 9.75,
      inflation: 5.8,
      tariffs: 15,
      minimumWage: 11,
      governmentSpending: 41,
      unemployment: 7.9,
      consumerConfidence: 52,
      currencyStrength: 48,
      taxRate: 32
    }
  },
  {
    name: "Japan",
    category: "country",
    description: "Low-rate, high-debt economy with subdued inflation dynamics.",
    variables: {
      interestRate: 0.75,
      inflation: 2.1,
      tariffs: 4,
      minimumWage: 15,
      governmentSpending: 58,
      unemployment: 2.8,
      consumerConfidence: 49,
      currencyStrength: 61,
      taxRate: 31
    }
  },
  {
    name: "Argentina",
    category: "country",
    description: "Volatile monetary environment with severe inflation and currency stress.",
    variables: {
      interestRate: 15,
      inflation: 22,
      tariffs: 28,
      minimumWage: 9,
      governmentSpending: 52,
      unemployment: 9.8,
      consumerConfidence: 31,
      currencyStrength: 22,
      taxRate: 37
    }
  },
  {
    name: "Economic Crisis",
    category: "scenario",
    description: "A shock scenario with plunging confidence and rapid debt growth.",
    variables: {
      interestRate: 11,
      inflation: 18,
      tariffs: 30,
      minimumWage: 13,
      governmentSpending: 72,
      unemployment: 16,
      consumerConfidence: 18,
      currencyStrength: 26,
      taxRate: 42
    }
  },
  {
    name: "High Growth Boom",
    category: "scenario",
    description: "Strong demand, resilient labor markets, and manageable inflation.",
    variables: {
      interestRate: 3.75,
      inflation: 3.9,
      tariffs: 5,
      minimumWage: 20,
      governmentSpending: 44,
      unemployment: 3.1,
      consumerConfidence: 84,
      currencyStrength: 74,
      taxRate: 24
    }
  },
  {
    name: "Recession",
    category: "scenario",
    description: "Weak private demand and a rising jobless rate with policy stimulus.",
    variables: {
      interestRate: 2.25,
      inflation: 1.4,
      tariffs: 10,
      minimumWage: 15,
      governmentSpending: 64,
      unemployment: 11.5,
      consumerConfidence: 29,
      currencyStrength: 54,
      taxRate: 25
    }
  },
  {
    name: "Tech Expansion Era",
    category: "scenario",
    description: "Productivity shock with high confidence and fast capital formation.",
    variables: {
      interestRate: 4,
      inflation: 2.8,
      tariffs: 2,
      minimumWage: 24,
      governmentSpending: 39,
      unemployment: 3.4,
      consumerConfidence: 88,
      currencyStrength: 82,
      taxRate: 21
    }
  }
];

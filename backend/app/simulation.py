from __future__ import annotations

import math
from typing import Any

from .schemas import EconomicVariables


def clamp(value: float, minimum: float, maximum: float) -> float:
    return min(maximum, max(minimum, value))


def compute_indicators(v: EconomicVariables) -> dict[str, float]:
    confidence_lift = (v.consumerConfidence - 50) / 18
    rate_drag = (v.interestRate - 3.5) * 0.24
    tax_drag = (v.taxRate - 25) * 0.045
    tariff_drag = v.tariffs * 0.035
    wage_boost = (v.minimumWage - 15) * 0.07
    spending_boost = (v.governmentSpending - 42) * 0.06

    gdp_growth = clamp(
        2.4 + confidence_lift + wage_boost + spending_boost - rate_drag - tax_drag - tariff_drag - v.unemployment * 0.11,
        -8,
        8,
    )
    cost_of_living = clamp(
        100 + v.inflation * 4.2 + v.tariffs * 0.8 + v.minimumWage * 0.45 - v.currencyStrength * 0.22 - v.interestRate * 0.32,
        72,
        230,
    )
    employment = clamp(100 - v.unemployment * 3.1 + confidence_lift * 4.5 - v.interestRate * 0.85 + wage_boost * 2.5, 18, 100)
    purchasing_power = clamp(
        112 - v.inflation * 3.3 + v.minimumWage * 1.35 - v.taxRate * 0.55 + v.currencyStrength * 0.22 - v.tariffs * 0.22,
        28,
        150,
    )
    currency_stability = clamp(
        v.currencyStrength + v.interestRate * 1.2 - v.inflation * 1.8 - v.governmentSpending * 0.14 + (v.consumerConfidence - 50) * 0.12,
        0,
        100,
    )
    public_debt = clamp(45 + v.governmentSpending * 1.15 - v.taxRate * 0.72 + v.interestRate * 1.4 + v.unemployment * 1.2 - gdp_growth * 2.2, 12, 220)
    market_confidence = clamp(58 + gdp_growth * 5.6 + (100 - cost_of_living) * 0.12 + v.consumerConfidence * 0.34 + currency_stability * 0.22 - v.interestRate * 1.6, 0, 100)

    return {
        "gdpGrowth": round(gdp_growth, 2),
        "costOfLiving": round(cost_of_living, 2),
        "employment": round(employment, 2),
        "purchasingPower": round(purchasing_power, 2),
        "currencyStability": round(currency_stability, 2),
        "publicDebt": round(public_debt, 2),
        "marketConfidence": round(market_confidence, 2),
    }


def generate_simulation(v: EconomicVariables, months: int = 24) -> list[dict[str, Any]]:
    indicators = compute_indicators(v)
    points: list[dict[str, Any]] = []
    for index in range(months):
        t = index + 1
        wave = math.sin(index / 2.4)
        inflation = clamp(v.inflation + (v.tariffs / 34) * t * 0.09 - v.interestRate * 0.035 * t + wave * 0.18, -3, 35)
        points.append(
            {
                "month": f"M{t}",
                "monthIndex": t,
                "gdp": round(100 + indicators["gdpGrowth"] * t * 0.72 + wave * 1.8, 1),
                "inflation": round(inflation, 1),
                "employment": round(clamp(indicators["employment"] + indicators["gdpGrowth"] * t * 0.18 - v.interestRate * t * 0.08 + wave * 0.9, 15, 102), 1),
                "debt": round(clamp(indicators["publicDebt"] + (v.governmentSpending - v.taxRate) * t * 0.15 + max(0, -indicators["gdpGrowth"]) * t * 0.9, 8, 240), 1),
                "purchasingPower": round(clamp(indicators["purchasingPower"] - inflation * 0.55 + indicators["gdpGrowth"] * t * 0.14 + wave * 0.75, 20, 160), 1),
                "currency": round(clamp(indicators["currencyStability"] + (v.interestRate - v.inflation) * t * 0.18 - v.tariffs * t * 0.04 + wave * 0.9, 0, 105), 1),
                "marketConfidence": round(clamp(indicators["marketConfidence"] + indicators["gdpGrowth"] * t * 0.45 - inflation * 0.25 + wave * 1.7, 0, 105), 1),
                "costOfLiving": round(indicators["costOfLiving"] + inflation * t * 0.12 + wave * 1.1, 1),
            }
        )
    return points

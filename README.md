# What If? Economic Simulator

A polished full-stack macroeconomic scenario simulator for analysts, classrooms, think tanks, and policy teams. Users adjust economic levers and instantly see simplified forecasts for GDP, inflation, employment, debt, purchasing power, currency stability, and market confidence.

## Product Highlights

- Premium dark interface inspired by Stripe, Linear, Bloomberg Terminal, Our World in Data, and Kalshi.
- Live economic control panel with tooltips and animated slider updates.
- Recharts dashboard with glowing line and area charts.
- AI-style economic analysis panel with risks, tradeoffs, policy insights, and a risk score.
- Country and macro scenario presets.
- Historical comparison overlays for 2008, COVID inflation, the Great Depression, and Japan's Lost Decades.
- Dedicated **History Mode / Echoes of History** experience for replaying major economic crises, civilizations, bubbles, shocks, and growth eras.
- Reactive Bloomberg-style historical news ticker, timeline playback, crisis gauges, stress map, social stability, currency warnings, fear/greed indicators, and AI Historian interpretation.
- Cinematic command-center landing page with animated macro charts, heatmap-style world activity, crisis alerts, and live terminal signals.
- New **History of Economics** atlas with a connected horizontal economic-era flow, guided causal timeline, event intelligence metrics, thinker policy playbooks, expandable sources/theory notes, and detailed economic butterfly effects.
- Educational **Economic Recipes** with visual formulas, animated causal chains, confidence levels, historical examples, and expandable **Sources & Theory** references.
- Historical similarity engine that compares the current sandbox scenario with past crises and growth episodes.
- Economic chain maps, live market psychology, policy experiment scoring, global shock engine, ideology response modes, and “Why This Matters” explanations for non-experts.
- Educational pages for **How the Economy Works** and **How the Simulation Works**, with beginner-friendly causal chains and transparent model assumptions.
- Saved scenarios via browser storage, policy side-by-side mode, playback, PNG chart export, and a live macro news ticker.
- FastAPI backend scaffold with PostgreSQL persistence for saved scenarios and a matching simulation endpoint.

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS, Vite, Recharts, Framer Motion, Lucide icons.
- Backend: FastAPI, SQLAlchemy, PostgreSQL.

## Project Structure

```text
frontend/
  src/
    components/        Dashboard, landing, chart, and simulation UI
    data/              Variables, presets, labels
    lib/               Simulation formulas and analyst copy
    types/             Shared TypeScript types
backend/
  app/
    main.py            FastAPI routes
    simulation.py      Python version of the economic model
    db.py              SQLAlchemy models/session
    schemas.py         Pydantic contracts
  seed.py              Demo scenario seeding
```

## Run Locally

Install frontend dependencies:

```bash
npm install
```

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Install backend dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Seed demo data:

```bash
cp .env.example .env
npm run seed
```

Start the API and web app in separate terminals:

```bash
npm run api
npm run dev
```

Open the app at [http://localhost:5173](http://localhost:5173).

## Deployment Notes

- Build the frontend with `npm run build`; deploy `frontend/dist` to a static host.
- Run the API with `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`.
- Set `DATABASE_URL` to a managed PostgreSQL instance.
- Set `CORS_ORIGIN` to the deployed frontend origin.

## Screenshots

- `screenshots/landing.png`
- `screenshots/dashboard.png`

## Model Notes

The simulator intentionally uses simplified economic relationships. It is built for educational exploration and visual intuition, not academic forecasting or investment advice.

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import get_settings
from .db import ScenarioModel, get_db, init_db
from .schemas import ScenarioCreate, SimulationRequest
from .simulation import compute_indicators, generate_simulation

settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}


@app.post("/api/simulate")
def simulate(payload: SimulationRequest) -> dict:
    return {
        "indicators": compute_indicators(payload.variables),
        "timeline": generate_simulation(payload.variables, payload.months),
    }


@app.get("/api/scenarios")
def list_scenarios(db: Session = Depends(get_db)) -> list[dict]:
    scenarios = db.query(ScenarioModel).order_by(ScenarioModel.id.desc()).all()
    return [{"id": scenario.id, "name": scenario.name, "variables": scenario.variables} for scenario in scenarios]


@app.post("/api/scenarios")
def create_scenario(payload: ScenarioCreate, db: Session = Depends(get_db)) -> dict:
    scenario = ScenarioModel(name=payload.name, variables=payload.variables.model_dump())
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return {"id": scenario.id, "name": scenario.name, "variables": scenario.variables}

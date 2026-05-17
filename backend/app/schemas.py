from pydantic import BaseModel, Field


class EconomicVariables(BaseModel):
    interestRate: float = Field(ge=0, le=18)
    inflation: float = Field(ge=-2, le=28)
    tariffs: float = Field(ge=0, le=45)
    minimumWage: float = Field(ge=7, le=35)
    governmentSpending: float = Field(ge=20, le=85)
    unemployment: float = Field(ge=2, le=28)
    consumerConfidence: float = Field(ge=0, le=100)
    currencyStrength: float = Field(ge=0, le=100)
    taxRate: float = Field(ge=5, le=60)


class ScenarioCreate(BaseModel):
    name: str
    variables: EconomicVariables


class Scenario(BaseModel):
    id: int
    name: str
    variables: EconomicVariables


class SimulationRequest(BaseModel):
    variables: EconomicVariables
    months: int = Field(default=24, ge=6, le=60)

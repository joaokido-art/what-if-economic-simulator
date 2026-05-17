from backend.app.db import ScenarioModel, SessionLocal, init_db

seed_scenarios = [
    {
        "name": "Resilient Soft Landing",
        "variables": {
            "interestRate": 4.0,
            "inflation": 2.7,
            "tariffs": 6,
            "minimumWage": 19,
            "governmentSpending": 45,
            "unemployment": 4.1,
            "consumerConfidence": 70,
            "currencyStrength": 76,
            "taxRate": 27,
        },
    },
    {
        "name": "Debt-Financed Stimulus",
        "variables": {
            "interestRate": 3.2,
            "inflation": 5.1,
            "tariffs": 12,
            "minimumWage": 18,
            "governmentSpending": 72,
            "unemployment": 6.4,
            "consumerConfidence": 55,
            "currencyStrength": 52,
            "taxRate": 22,
        },
    },
]


def main() -> None:
    init_db()
    db = SessionLocal()
    try:
        for item in seed_scenarios:
            exists = db.query(ScenarioModel).filter(ScenarioModel.name == item["name"]).first()
            if not exists:
                db.add(ScenarioModel(**item))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()

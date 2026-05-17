from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "What If? Economic Simulator API"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/what_if_economy"
    cors_origin: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.database import engine
from .routers import auth, leagues, clubs, players, matches

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown: clean up DB connections
    await engine.dispose()

app = FastAPI(
    title="OpenFM API",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(leagues.router)
app.include_router(clubs.router)
app.include_router(players.router)
app.include_router(matches.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "0.1.0"}

"""API module for SpoonOS integration."""
from fastapi import APIRouter
from .routes import router as spoon_router
from .disputes import router as disputes_router

# Combine all routers
router = APIRouter()
router.include_router(spoon_router)
router.include_router(disputes_router)

__all__ = ["router"]

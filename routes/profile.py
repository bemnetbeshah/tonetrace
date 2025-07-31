from fastapi import APIRouter

router = APIRouter()

@router.get("/profile")
def get_profile():
    # 🔒 Later: Load from database or in-memory store
    return {
        "message": "This will return the user's style profile in the future.",
        "status": "placeholder"
    } 
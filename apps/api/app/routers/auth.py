from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
import sys
import os
import uuid as uuid_lib

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from ..core.database import get_db
from ..core.security import get_password_hash, verify_password, create_access_token
from ..core.config import settings
from ..schemas.auth import UserCreate, UserLogin, UserResponse, Token, GoogleToken
from ..middleware.auth import get_current_user

# Setup path for models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../packages/db")))
from models import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(User).where((User.email == user_data.email) | (User.username == user_data.username)))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email or username already registered")
        
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/google", response_model=Token)
async def google_auth(payload: GoogleToken, db: AsyncSession = Depends(get_db)):
    """Verify a Google ID token and return an OpenFM JWT. Creates user if not found."""
    GOOGLE_CLIENT_ID = "693838434383-a35f21f9u3fr75e4tgmnep4qahl7p913.apps.googleusercontent.com"
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid Google token: {e}")

    google_email = idinfo.get("email")
    google_name = idinfo.get("name", google_email.split("@")[0])

    if not google_email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    # Find or create user
    result = await db.execute(select(User).where(User.email == google_email))
    user = result.scalars().first()

    if not user:
        # Auto-register the user — generate a random username from their name + short UUID
        username = google_name.replace(" ", "_").lower() + "_" + str(uuid_lib.uuid4())[:6]
        user = User(
            email=google_email,
            username=username,
            hashed_password=get_password_hash(str(uuid_lib.uuid4()))  # random unusable password
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

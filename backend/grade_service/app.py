from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import main
from database import engine
import models
import logging
import time

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables with retry mechanism
max_retries = 5
retry_delay = 5  # seconds

for attempt in range(max_retries):
    try:
        logger.info(f"Attempting to create database tables (Attempt {attempt+1}/{max_retries})...")
        models.Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully!")
        break
    except Exception as e:
        logger.error(f"Failed to create tables: {e}")
        if attempt < max_retries - 1:
            logger.info(f"Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            logger.critical("All attempts to create tables failed!")

app = FastAPI(title="Grade Service")

# Add CORS middleware with comprehensive configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=["*"],  # Allow all headers to ensure compatibility
    expose_headers=["Content-Length", "Content-Type"],
    max_age=1728000,  # Cache preflight requests for 20 days (same as nginx)
)

# Include router
app.include_router(main.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8080, reload=True)

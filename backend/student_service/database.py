from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import time
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get database URL from environment variable or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:123456@postgres:5432/student_management")

# Add retry mechanism for database connection
max_retries = 5
retry_delay = 5  # seconds

for attempt in range(max_retries):
    try:
        logger.info(f"Attempting to connect to database (Attempt {attempt+1}/{max_retries})...")
        engine = create_engine(DATABASE_URL)
        # Test connection
        with engine.connect() as connection:
            logger.info("Database connection successful!")
        break
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        if attempt < max_retries - 1:
            logger.info(f"Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            logger.critical("All database connection attempts failed!")
            # Initialize engine anyway for app startup, will retry later
            engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

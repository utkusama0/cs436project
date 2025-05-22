# Run Backend

Write-Host "Starting backend server..."
cd ./backend
python -m uvicorn main:app --reload

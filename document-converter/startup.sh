#!/bin/bash
# Startup script for document conversion service

# Create necessary directories
mkdir -p uploads media temp

# Install dependencies if not already installed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3.12 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Start the service
echo "Starting Document Conversion Service..."
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
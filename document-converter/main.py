"""
Document Conversion Microservice
Converts Word/LibreOffice documents to HTML with style preservation
"""
import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.config import settings
from app.converters import DocumentConverter
from app.utils import setup_directories

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    logger.info("Starting Document Conversion Service")
    setup_directories()
    yield
    # Shutdown
    logger.info("Shutting down Document Conversion Service")


app = FastAPI(
    title="Document Conversion Service",
    description="Converts Word/LibreOffice documents to clean HTML",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Document Conversion Service"}


@app.post("/convert")
async def convert_document(
    file: UploadFile = File(...),
    allowed_tags: str = Form(None),
    extract_images: bool = Form(True)
):
    """
    Convert uploaded document to HTML
    
    Args:
        file: The document file to convert
        allowed_tags: Comma-separated list of allowed HTML tags
        extract_images: Whether to extract and save images
        
    Returns:
        JSON with converted HTML and image URLs
    """
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
            
        # Parse allowed tags
        allowed_tags_list = None
        if allowed_tags:
            allowed_tags_list = [tag.strip() for tag in allowed_tags.split(',')]
        
        # Initialize converter
        converter = DocumentConverter(
            allowed_tags=allowed_tags_list,
            extract_images=extract_images
        )
        
        # Convert document
        result = await converter.convert(file)
        
        return JSONResponse(content=result)
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Conversion error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during conversion")


@app.get("/supported-formats")
async def get_supported_formats():
    """Get list of supported document formats"""
    return {
        "formats": [
            {"extension": ".docx", "description": "Microsoft Word (2007+)"},
            {"extension": ".doc", "description": "Microsoft Word (Legacy)"},
            {"extension": ".odt", "description": "OpenDocument Text"},
            {"extension": ".rtf", "description": "Rich Text Format"}
        ]
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
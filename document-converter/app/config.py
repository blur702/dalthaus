"""Configuration settings for document conversion service"""
import os
from pathlib import Path
from typing import List

class Settings:
    """Application settings"""
    
    # Server configuration
    HOST: str = os.getenv("DOC_CONVERTER_HOST", "127.0.0.1")
    PORT: int = int(os.getenv("DOC_CONVERTER_PORT", "8001"))
    DEBUG: bool = os.getenv("DOC_CONVERTER_DEBUG", "False").lower() == "true"
    
    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5001"
    ]
    
    # File handling
    BASE_DIR: Path = Path(__file__).parent.parent
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    MEDIA_DIR: Path = BASE_DIR / "media"
    TEMP_DIR: Path = BASE_DIR / "temp"
    
    # Media URL configuration
    MEDIA_URL_PREFIX: str = "/media"
    PUBLIC_MEDIA_PATH: str = os.getenv("PUBLIC_MEDIA_PATH", "/var/www/public_html/frontend/public/media")
    
    # File size limits
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    MAX_IMAGE_SIZE: int = 10 * 1024 * 1024  # 10MB per image
    
    # Supported formats
    SUPPORTED_EXTENSIONS: List[str] = [".docx", ".doc", ".odt", ".rtf"]
    SUPPORTED_IMAGE_FORMATS: List[str] = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg", ".webp"]
    
    # HTML sanitization defaults
    DEFAULT_ALLOWED_TAGS: List[str] = [
        'p', 'br', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
        'a', 'img', 'blockquote', 'code', 'pre', 'table', 'thead', 'tbody',
        'tfoot', 'tr', 'td', 'th', 'caption', 'sup', 'sub', 'hr'
    ]
    
    DEFAULT_ALLOWED_ATTRIBUTES: dict = {
        '*': ['class', 'style', 'id'],
        'a': ['href', 'title', 'target', 'rel'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'table': ['border', 'cellpadding', 'cellspacing'],
        'td': ['colspan', 'rowspan', 'align', 'valign'],
        'th': ['colspan', 'rowspan', 'align', 'valign']
    }
    
    DEFAULT_ALLOWED_STYLES: List[str] = [
        'color', 'background-color', 'font-size', 'font-family', 'font-weight',
        'font-style', 'text-decoration', 'text-align', 'margin', 'padding',
        'border', 'width', 'height', 'display', 'float', 'clear'
    ]
    
    # Conversion settings
    PRESERVE_PAGEBREAKS: bool = True
    PAGEBREAK_MARKER: str = "<!-- pagebreak -->"
    IMAGE_QUALITY: int = 85  # JPEG quality for converted images

settings = Settings()
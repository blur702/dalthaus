"""Utility functions for document conversion service"""
import os
import shutil
import hashlib
import mimetypes
from pathlib import Path
from typing import Optional, Tuple
import uuid

from app.config import settings


def setup_directories():
    """Create necessary directories if they don't exist"""
    directories = [
        settings.UPLOAD_DIR,
        settings.MEDIA_DIR,
        settings.TEMP_DIR,
        Path(settings.PUBLIC_MEDIA_PATH)
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)


def get_file_extension(filename: str) -> str:
    """Get file extension in lowercase"""
    return Path(filename).suffix.lower()


def is_supported_format(filename: str) -> bool:
    """Check if file format is supported"""
    ext = get_file_extension(filename)
    return ext in settings.SUPPORTED_EXTENSIONS


def generate_unique_filename(original_filename: str, prefix: str = "") -> str:
    """Generate unique filename preserving extension"""
    ext = get_file_extension(original_filename)
    unique_id = str(uuid.uuid4())[:8]
    base_name = Path(original_filename).stem
    safe_base = "".join(c for c in base_name if c.isalnum() or c in '-_')[:50]
    
    if prefix:
        return f"{prefix}_{safe_base}_{unique_id}{ext}"
    return f"{safe_base}_{unique_id}{ext}"


def save_temp_file(content: bytes, filename: str) -> Path:
    """Save content to temporary file"""
    temp_path = settings.TEMP_DIR / generate_unique_filename(filename, "temp")
    temp_path.write_bytes(content)
    return temp_path


def cleanup_temp_file(file_path: Path):
    """Remove temporary file if it exists"""
    try:
        if file_path.exists():
            file_path.unlink()
    except Exception:
        pass  # Ignore cleanup errors


def calculate_file_hash(content: bytes) -> str:
    """Calculate SHA256 hash of file content"""
    return hashlib.sha256(content).hexdigest()


def get_mime_type(file_path: Path) -> Optional[str]:
    """Get MIME type of file"""
    mime_type, _ = mimetypes.guess_type(str(file_path))
    return mime_type


def copy_to_public_media(source_path: Path, relative_path: str) -> str:
    """
    Copy file to public media directory and return public URL
    
    Args:
        source_path: Source file path
        relative_path: Relative path within media directory
        
    Returns:
        Public URL for the media file
    """
    # Ensure relative path doesn't escape media directory
    safe_relative = Path(relative_path).relative_to(Path(relative_path).anchor)
    
    # Create destination path
    dest_path = Path(settings.PUBLIC_MEDIA_PATH) / safe_relative
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Copy file
    shutil.copy2(source_path, dest_path)
    
    # Return public URL
    return f"{settings.MEDIA_URL_PREFIX}/{safe_relative}"


def extract_styles_to_css(style_attr: str) -> Tuple[str, dict]:
    """
    Extract inline styles and return CSS class name with styles dict
    
    Args:
        style_attr: Inline style attribute value
        
    Returns:
        Tuple of (class_name, styles_dict)
    """
    if not style_attr:
        return "", {}
    
    # Parse inline styles
    styles = {}
    for rule in style_attr.split(';'):
        rule = rule.strip()
        if ':' in rule:
            prop, value = rule.split(':', 1)
            prop = prop.strip().lower()
            value = value.strip()
            if prop in settings.DEFAULT_ALLOWED_STYLES:
                styles[prop] = value
    
    # Generate class name from style hash
    if styles:
        style_str = ";".join(f"{k}:{v}" for k, v in sorted(styles.items()))
        class_hash = hashlib.md5(style_str.encode()).hexdigest()[:8]
        class_name = f"converted-style-{class_hash}"
        return class_name, styles
    
    return "", {}
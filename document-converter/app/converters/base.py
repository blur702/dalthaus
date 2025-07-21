"""Base document converter implementation"""
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
import asyncio

from fastapi import UploadFile

from app.config import settings
from app.utils import (
    save_temp_file, cleanup_temp_file, is_supported_format,
    get_file_extension
)
from app.parsers import get_parser
from app.sanitizers import HTMLSanitizer

logger = logging.getLogger(__name__)


class DocumentConverter:
    """Main document converter class"""
    
    def __init__(
        self,
        allowed_tags: Optional[List[str]] = None,
        allowed_attributes: Optional[Dict[str, List[str]]] = None,
        allowed_styles: Optional[List[str]] = None,
        extract_images: bool = True
    ):
        """
        Initialize document converter
        
        Args:
            allowed_tags: List of allowed HTML tags
            allowed_attributes: Dict of allowed attributes per tag
            allowed_styles: List of allowed CSS properties
            extract_images: Whether to extract embedded images
        """
        self.extract_images = extract_images
        
        # Initialize HTML sanitizer
        self.sanitizer = HTMLSanitizer(
            allowed_tags=allowed_tags or settings.DEFAULT_ALLOWED_TAGS,
            allowed_attributes=allowed_attributes or settings.DEFAULT_ALLOWED_ATTRIBUTES,
            allowed_styles=allowed_styles or settings.DEFAULT_ALLOWED_STYLES
        )
    
    async def convert(self, file: UploadFile) -> Dict[str, Any]:
        """
        Convert uploaded document to HTML
        
        Args:
            file: Uploaded file object
            
        Returns:
            Dictionary with converted HTML and metadata
        """
        temp_path = None
        
        try:
            # Validate file
            if not is_supported_format(file.filename):
                raise ValueError(
                    f"Unsupported file format. Supported formats: {', '.join(settings.SUPPORTED_EXTENSIONS)}"
                )
            
            # Check file size
            content = await file.read()
            if len(content) > settings.MAX_FILE_SIZE:
                raise ValueError(f"File size exceeds maximum limit of {settings.MAX_FILE_SIZE // 1024 // 1024}MB")
            
            # Save to temporary file
            temp_path = save_temp_file(content, file.filename)
            logger.info(f"Processing document: {file.filename}")
            
            # Get appropriate parser
            parser = get_parser(get_file_extension(file.filename))
            
            # Parse document
            parse_result = await asyncio.to_thread(
                parser.parse,
                temp_path,
                extract_images=self.extract_images
            )
            
            # Sanitize HTML
            sanitized_html = self.sanitizer.sanitize(parse_result['html'])
            
            # Prepare response
            result = {
                'html': sanitized_html,
                'metadata': {
                    'original_filename': file.filename,
                    'format': get_file_extension(file.filename),
                    'has_pagebreaks': settings.PAGEBREAK_MARKER in sanitized_html,
                    'image_count': len(parse_result.get('images', [])),
                    'allowed_tags': self.sanitizer.allowed_tags
                }
            }
            
            # Add image URLs if extracted
            if self.extract_images and parse_result.get('images'):
                result['images'] = parse_result['images']
            
            logger.info(f"Successfully converted document: {file.filename}")
            return result
            
        except Exception as e:
            logger.error(f"Error converting document {file.filename}: {str(e)}", exc_info=True)
            raise
        
        finally:
            # Cleanup temporary file
            if temp_path:
                cleanup_temp_file(temp_path)
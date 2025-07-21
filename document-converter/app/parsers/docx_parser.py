"""DOCX/DOC parser using mammoth"""
import logging
from pathlib import Path
from typing import Dict, List, Any
import uuid
import base64
import io

import mammoth
from PIL import Image

from app.config import settings
from app.utils import copy_to_public_media, generate_unique_filename
from .base import BaseParser

logger = logging.getLogger(__name__)


class DocxParser(BaseParser):
    """Parser for DOCX/DOC files using mammoth"""
    
    def parse(self, file_path: Path, extract_images: bool = True) -> Dict[str, Any]:
        """Parse DOCX/DOC file and convert to HTML"""
        logger.info(f"Parsing DOCX file: {file_path}")
        
        # Configure mammoth options
        style_map = """
        p[style-name='Heading 1'] => h1:fresh
        p[style-name='Heading 2'] => h2:fresh
        p[style-name='Heading 3'] => h3:fresh
        p[style-name='Heading 4'] => h4:fresh
        p[style-name='Heading 5'] => h5:fresh
        p[style-name='Heading 6'] => h6:fresh
        p[style-name='Title'] => h1:fresh
        p[style-name='Subtitle'] => h2:fresh
        p[style-name='Quote'] => blockquote:fresh
        p[style-name='Intense Quote'] => blockquote:fresh
        r[style-name='Strong'] => strong
        r[style-name='Emphasis'] => em
        """
        
        # Image handling
        images = []
        
        def convert_image(image):
            """Handle image conversion"""
            if not extract_images:
                return {"src": ""}
            
            with image.open() as image_bytes:
                image_data = image_bytes.read()
            
            # Get image format
            content_type = image.content_type or "image/png"
            extension = content_type.split('/')[-1]
            if extension not in ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']:
                extension = 'png'
            
            # Generate filename
            image_filename = generate_unique_filename(
                f"image.{extension}",
                prefix="doc_image"
            )
            
            # Save image to media directory
            image_path = settings.MEDIA_DIR / image_filename
            
            # Process image with PIL for optimization
            try:
                img = Image.open(io.BytesIO(image_data))
                
                # Convert RGBA to RGB if saving as JPEG
                if extension in ['jpg', 'jpeg'] and img.mode in ('RGBA', 'LA', 'P'):
                    rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    rgb_img.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
                    img = rgb_img
                
                # Save optimized image
                img.save(
                    image_path,
                    format='JPEG' if extension in ['jpg', 'jpeg'] else extension.upper(),
                    quality=settings.IMAGE_QUALITY,
                    optimize=True
                )
            except Exception as e:
                logger.error(f"Error processing image: {e}")
                # Fall back to saving raw data
                image_path.write_bytes(image_data)
            
            # Copy to public media directory
            public_url = copy_to_public_media(image_path, image_filename)
            
            # Store image info
            images.append({
                'filename': image_filename,
                'url': public_url,
                'size': len(image_data),
                'content_type': content_type
            })
            
            return {"src": public_url}
        
        # Convert document
        try:
            with open(file_path, "rb") as docx_file:
                result = mammoth.convert_to_html(
                    docx_file,
                    style_map=style_map,
                    convert_image=mammoth.images.img_element(convert_image)
                )
            
            html = result.value
            
            # Process page breaks
            html = self._process_pagebreaks(html)
            
            # Log any messages from mammoth
            if result.messages:
                for message in result.messages:
                    logger.warning(f"Mammoth message: {message}")
            
            return {
                'html': html,
                'images': images,
                'styles': self._extract_styles(html)
            }
            
        except Exception as e:
            logger.error(f"Error parsing DOCX file: {e}", exc_info=True)
            raise ValueError(f"Failed to parse DOCX file: {str(e)}")
    
    def _extract_styles(self, html: str) -> str:
        """Extract and generate CSS styles from HTML"""
        # For now, return empty styles as mammoth handles most styling
        # This can be extended to extract custom styles if needed
        return ""
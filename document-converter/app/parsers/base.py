"""Base parser class for document conversion"""
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)


class BaseParser(ABC):
    """Abstract base class for document parsers"""
    
    @abstractmethod
    def parse(self, file_path: Path, extract_images: bool = True) -> Dict[str, Any]:
        """
        Parse document and return HTML with metadata
        
        Args:
            file_path: Path to document file
            extract_images: Whether to extract embedded images
            
        Returns:
            Dictionary containing:
                - html: Converted HTML string
                - images: List of extracted images with URLs
                - styles: Extracted styles CSS
        """
        pass
    
    def _process_pagebreaks(self, html: str) -> str:
        """
        Process and normalize page breaks in HTML
        
        Args:
            html: HTML content
            
        Returns:
            HTML with normalized page breaks
        """
        from app.config import settings
        
        # Common page break patterns to replace
        pagebreak_patterns = [
            '<div style="page-break-after: always"><span style="display: none">&nbsp;</span></div>',
            '<div style="page-break-after: always"></div>',
            '<div style="page-break-before: always"></div>',
            '<br style="page-break-after: always">',
            '<br style="page-break-before: always">',
            '<p style="page-break-after: always"></p>',
            '<p style="page-break-before: always"></p>',
            '<hr class="pagebreak">',
            '<div class="page-break"></div>'
        ]
        
        # Replace all patterns with our standard marker
        for pattern in pagebreak_patterns:
            html = html.replace(pattern, settings.PAGEBREAK_MARKER)
        
        # Also handle page-break styles in any element
        import re
        
        # Pattern to find elements with page-break styles
        pagebreak_style_pattern = r'<(\w+)([^>]*?)style="([^"]*page-break-(?:after|before):\s*always[^"]*)"([^>]*)>'
        
        def replace_pagebreak_style(match):
            tag = match.group(1)
            before_style = match.group(2)
            style = match.group(3)
            after_style = match.group(4)
            
            # Remove page-break style
            new_style = re.sub(r'page-break-(?:after|before):\s*always;?\s*', '', style).strip()
            
            # Reconstruct element
            if new_style:
                element = f'<{tag}{before_style}style="{new_style}"{after_style}>'
            else:
                element = f'<{tag}{before_style}{after_style}>'
            
            # Add pagebreak marker after element
            return element + settings.PAGEBREAK_MARKER
        
        html = re.sub(pagebreak_style_pattern, replace_pagebreak_style, html, flags=re.IGNORECASE)
        
        return html
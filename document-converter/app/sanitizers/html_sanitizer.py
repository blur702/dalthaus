"""HTML sanitizer using bleach"""
import logging
from typing import List, Dict, Optional
import re

import bleach
from bs4 import BeautifulSoup

from app.config import settings

logger = logging.getLogger(__name__)


class HTMLSanitizer:
    """Sanitize HTML content based on allowed tags and attributes"""
    
    def __init__(
        self,
        allowed_tags: List[str],
        allowed_attributes: Dict[str, List[str]],
        allowed_styles: List[str]
    ):
        """
        Initialize HTML sanitizer
        
        Args:
            allowed_tags: List of allowed HTML tags
            allowed_attributes: Dict of allowed attributes per tag
            allowed_styles: List of allowed CSS properties
        """
        self.allowed_tags = allowed_tags
        self.allowed_attributes = allowed_attributes
        self.allowed_styles = allowed_styles
        
        # Ensure pagebreak comments are preserved
        self.pagebreak_marker = settings.PAGEBREAK_MARKER
    
    def sanitize(self, html: str) -> str:
        """
        Sanitize HTML content
        
        Args:
            html: Raw HTML content
            
        Returns:
            Sanitized HTML
        """
        if not html:
            return ""
        
        try:
            # Step 1: Preserve pagebreak markers by replacing with temporary placeholder
            pagebreak_placeholder = "___PAGEBREAK_PLACEHOLDER___"
            html_with_placeholders = html.replace(self.pagebreak_marker, pagebreak_placeholder)
            
            # Step 2: Clean with bleach
            cleaned_html = bleach.clean(
                html_with_placeholders,
                tags=self.allowed_tags,
                attributes=self.allowed_attributes,
                strip=True,
                strip_comments=False  # Preserve comments for now
            )
            
            # Step 3: Process styles
            cleaned_html = self._sanitize_styles(cleaned_html)
            
            # Step 4: Additional cleaning with BeautifulSoup
            soup = BeautifulSoup(cleaned_html, 'html.parser')
            
            # Remove empty paragraphs and divs (but preserve those with pagebreak placeholders)
            for tag in soup.find_all(['p', 'div']):
                if not tag.text.strip() and pagebreak_placeholder not in str(tag) and not tag.find_all():
                    tag.decompose()
            
            # Clean up excessive whitespace
            cleaned_html = str(soup)
            
            # Step 5: Restore pagebreak markers
            cleaned_html = cleaned_html.replace(pagebreak_placeholder, self.pagebreak_marker)
            
            # Step 6: Final cleanup
            cleaned_html = self._final_cleanup(cleaned_html)
            
            logger.info("HTML sanitization completed successfully")
            return cleaned_html
            
        except Exception as e:
            logger.error(f"Error sanitizing HTML: {e}", exc_info=True)
            # Return original HTML if sanitization fails
            return html
    
    def _sanitize_styles(self, html: str) -> str:
        """Sanitize inline styles to only allow permitted CSS properties"""
        if not self.allowed_styles:
            # Remove all style attributes
            return re.sub(r'\s*style\s*=\s*["\'][^"\']*["\']', '', html)
        
        def clean_style_attr(match):
            """Clean individual style attribute"""
            style_content = match.group(1)
            cleaned_rules = []
            
            # Parse CSS rules
            for rule in style_content.split(';'):
                rule = rule.strip()
                if ':' in rule:
                    prop, value = rule.split(':', 1)
                    prop = prop.strip().lower()
                    value = value.strip()
                    
                    # Check if property is allowed
                    if prop in self.allowed_styles:
                        # Additional validation for specific properties
                        if self._validate_css_value(prop, value):
                            cleaned_rules.append(f"{prop}: {value}")
            
            if cleaned_rules:
                return f' style="{"; ".join(cleaned_rules)}"'
            return ''
        
        # Process all style attributes
        html = re.sub(
            r'\s*style\s*=\s*["\']([^"\']*)["\']',
            clean_style_attr,
            html,
            flags=re.IGNORECASE
        )
        
        return html
    
    def _validate_css_value(self, property_name: str, value: str) -> bool:
        """
        Validate CSS property value for safety
        
        Args:
            property_name: CSS property name
            value: CSS property value
            
        Returns:
            True if value is safe
        """
        # Remove dangerous values
        dangerous_patterns = [
            r'javascript:',
            r'expression\s*\(',
            r'@import',
            r'url\s*\(',
            r'behavior:',
            r'-moz-binding',
        ]
        
        value_lower = value.lower()
        for pattern in dangerous_patterns:
            if re.search(pattern, value_lower):
                return False
        
        # Additional validation for specific properties
        if property_name in ['width', 'height', 'margin', 'padding']:
            # Allow only safe units
            safe_units = r'^-?\d+(\.\d+)?(px|em|rem|%|pt|cm|mm|in|vh|vw)?$'
            if not re.match(safe_units, value):
                return False
        
        return True
    
    def _final_cleanup(self, html: str) -> str:
        """Perform final cleanup on HTML"""
        # Remove excessive newlines
        html = re.sub(r'\n\s*\n+', '\n\n', html)
        
        # Remove trailing whitespace
        html = '\n'.join(line.rstrip() for line in html.split('\n'))
        
        # Ensure proper spacing around pagebreaks
        html = re.sub(
            rf'({re.escape(self.pagebreak_marker)})',
            r'\n\1\n',
            html
        )
        
        # Remove duplicate pagebreaks
        html = re.sub(
            rf'({re.escape(self.pagebreak_marker)}\s*){{2,}}',
            self.pagebreak_marker + '\n',
            html
        )
        
        return html.strip()
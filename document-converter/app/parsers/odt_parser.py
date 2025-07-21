"""ODT parser for OpenDocument Text files"""
import logging
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, List, Any
import base64
import io

from PIL import Image
from bs4 import BeautifulSoup

from app.config import settings
from app.utils import copy_to_public_media, generate_unique_filename
from .base import BaseParser

logger = logging.getLogger(__name__)


class OdtParser(BaseParser):
    """Parser for ODT (OpenDocument Text) files"""
    
    # OpenDocument namespaces
    NAMESPACES = {
        'text': 'urn:oasis:names:tc:opendocument:xmlns:text:1.0',
        'style': 'urn:oasis:names:tc:opendocument:xmlns:style:1.0',
        'fo': 'urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0',
        'svg': 'urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0',
        'draw': 'urn:oasis:names:tc:opendocument:xmlns:drawing:1.0',
        'xlink': 'http://www.w3.org/1999/xlink',
        'office': 'urn:oasis:names:tc:opendocument:xmlns:office:1.0',
        'manifest': 'urn:oasis:names:tc:opendocument:xmlns:manifest:1.0'
    }
    
    def parse(self, file_path: Path, extract_images: bool = True) -> Dict[str, Any]:
        """Parse ODT file and convert to HTML"""
        logger.info(f"Parsing ODT file: {file_path}")
        
        try:
            with zipfile.ZipFile(file_path, 'r') as odt:
                # Parse content.xml
                content_xml = odt.read('content.xml')
                content_root = ET.fromstring(content_xml)
                
                # Parse styles.xml for style definitions
                styles_xml = odt.read('styles.xml')
                styles_root = ET.fromstring(styles_xml)
                
                # Extract images if requested
                images = []
                image_map = {}
                if extract_images:
                    images, image_map = self._extract_images(odt)
                
                # Convert to HTML
                html_parts = []
                styles_dict = self._parse_styles(content_root, styles_root)
                
                # Find body content
                body = content_root.find('.//office:body/office:text', self.NAMESPACES)
                if body is not None:
                    for element in body:
                        html_element = self._convert_element(element, styles_dict, image_map)
                        if html_element:
                            html_parts.append(html_element)
                
                html = ''.join(html_parts)
                
                # Process page breaks
                html = self._process_pagebreaks(html)
                
                # Generate CSS from styles
                css = self._generate_css(styles_dict)
                
                return {
                    'html': html,
                    'images': images,
                    'styles': css
                }
                
        except Exception as e:
            logger.error(f"Error parsing ODT file: {e}", exc_info=True)
            raise ValueError(f"Failed to parse ODT file: {str(e)}")
    
    def _extract_images(self, odt_zip: zipfile.ZipFile) -> tuple:
        """Extract images from ODT file"""
        images = []
        image_map = {}
        
        # Get manifest to find images
        try:
            manifest_xml = odt_zip.read('META-INF/manifest.xml')
            manifest_root = ET.fromstring(manifest_xml)
            
            for file_entry in manifest_root.findall('.//manifest:file-entry', self.NAMESPACES):
                full_path = file_entry.get('{urn:oasis:names:tc:opendocument:xmlns:manifest:1.0}full-path')
                media_type = file_entry.get('{urn:oasis:names:tc:opendocument:xmlns:manifest:1.0}media-type')
                
                if full_path and media_type and media_type.startswith('image/'):
                    try:
                        image_data = odt_zip.read(full_path)
                        
                        # Get image extension
                        extension = media_type.split('/')[-1]
                        if extension not in ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']:
                            extension = 'png'
                        
                        # Generate filename
                        image_filename = generate_unique_filename(
                            f"image.{extension}",
                            prefix="odt_image"
                        )
                        
                        # Save image to media directory
                        image_path = settings.MEDIA_DIR / image_filename
                        
                        # Process image with PIL
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
                        image_info = {
                            'filename': image_filename,
                            'url': public_url,
                            'size': len(image_data),
                            'content_type': media_type
                        }
                        images.append(image_info)
                        image_map[full_path] = public_url
                        
                    except Exception as e:
                        logger.error(f"Error extracting image {full_path}: {e}")
        
        except Exception as e:
            logger.error(f"Error reading manifest: {e}")
        
        return images, image_map
    
    def _parse_styles(self, content_root: ET.Element, styles_root: ET.Element) -> dict:
        """Parse style definitions from ODT"""
        styles = {}
        
        # Parse automatic styles from content.xml
        for style in content_root.findall('.//style:style', self.NAMESPACES):
            style_name = style.get('{urn:oasis:names:tc:opendocument:xmlns:style:1.0}name')
            if style_name:
                styles[style_name] = self._extract_style_properties(style)
        
        # Parse styles from styles.xml
        for style in styles_root.findall('.//style:style', self.NAMESPACES):
            style_name = style.get('{urn:oasis:names:tc:opendocument:xmlns:style:1.0}name')
            if style_name:
                styles[style_name] = self._extract_style_properties(style)
        
        return styles
    
    def _extract_style_properties(self, style_element: ET.Element) -> dict:
        """Extract CSS properties from ODT style element"""
        css_props = {}
        
        # Text properties
        text_props = style_element.find('.//style:text-properties', self.NAMESPACES)
        if text_props is not None:
            # Font weight
            font_weight = text_props.get('{urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0}font-weight')
            if font_weight == 'bold':
                css_props['font-weight'] = 'bold'
            
            # Font style
            font_style = text_props.get('{urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0}font-style')
            if font_style == 'italic':
                css_props['font-style'] = 'italic'
            
            # Text decoration
            text_decoration = text_props.get('{urn:oasis:names:tc:opendocument:xmlns:style:1.0}text-underline-style')
            if text_decoration and text_decoration != 'none':
                css_props['text-decoration'] = 'underline'
            
            # Font size
            font_size = text_props.get('{urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0}font-size')
            if font_size:
                css_props['font-size'] = font_size
            
            # Color
            color = text_props.get('{urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0}color')
            if color:
                css_props['color'] = color
        
        # Paragraph properties
        para_props = style_element.find('.//style:paragraph-properties', self.NAMESPACES)
        if para_props is not None:
            # Text alignment
            text_align = para_props.get('{urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0}text-align')
            if text_align:
                css_props['text-align'] = text_align
            
            # Margins
            margin_left = para_props.get('{urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0}margin-left')
            if margin_left:
                css_props['margin-left'] = margin_left
            
            # Check for page breaks
            break_before = para_props.get('{urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0}break-before')
            break_after = para_props.get('{urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0}break-after')
            if break_before == 'page':
                css_props['page-break-before'] = 'always'
            if break_after == 'page':
                css_props['page-break-after'] = 'always'
        
        return css_props
    
    def _convert_element(self, element: ET.Element, styles: dict, image_map: dict) -> str:
        """Convert ODT element to HTML"""
        tag = element.tag.split('}')[-1]  # Remove namespace
        
        # Paragraph
        if tag == 'p':
            return self._convert_paragraph(element, styles, image_map)
        
        # Heading
        elif tag == 'h':
            return self._convert_heading(element, styles, image_map)
        
        # List
        elif tag == 'list':
            return self._convert_list(element, styles, image_map)
        
        # Table
        elif tag == 'table':
            return self._convert_table(element, styles, image_map)
        
        # Frame (images)
        elif tag == 'frame':
            return self._convert_frame(element, image_map)
        
        # Soft page break
        elif tag == 'soft-page-break':
            return settings.PAGEBREAK_MARKER
        
        return ''
    
    def _convert_paragraph(self, para: ET.Element, styles: dict, image_map: dict = None) -> str:
        """Convert paragraph element to HTML"""
        style_name = para.get('{urn:oasis:names:tc:opendocument:xmlns:text:1.0}style-name')
        style_attr = ''
        
        if style_name and style_name in styles:
            style_props = styles[style_name]
            style_parts = [f"{k}: {v}" for k, v in style_props.items()]
            if style_parts:
                style_attr = f' style="{"; ".join(style_parts)}"'
        
        content = self._get_text_content(para, styles, image_map)
        return f'<p{style_attr}>{content}</p>'
    
    def _convert_heading(self, heading: ET.Element, styles: dict, image_map: dict = None) -> str:
        """Convert heading element to HTML"""
        level = heading.get('{urn:oasis:names:tc:opendocument:xmlns:text:1.0}outline-level', '1')
        content = self._get_text_content(heading, styles, image_map)
        return f'<h{level}>{content}</h{level}>'
    
    def _convert_list(self, list_elem: ET.Element, styles: dict, image_map: dict = None) -> str:
        """Convert list element to HTML"""
        list_items = []
        
        for item in list_elem.findall('.//text:list-item', self.NAMESPACES):
            item_content = []
            for child in item:
                if child.tag.endswith('p'):
                    item_content.append(self._get_text_content(child, styles, image_map))
            list_items.append(f'<li>{"".join(item_content)}</li>')
        
        # Determine if ordered or unordered (simplified)
        list_tag = 'ul'  # Default to unordered
        return f'<{list_tag}>{"".join(list_items)}</{list_tag}>'
    
    def _convert_table(self, table: ET.Element, styles: dict, image_map: dict = None) -> str:
        """Convert table element to HTML"""
        html_parts = ['<table>']
        
        for row in table.findall('.//table:table-row', self.NAMESPACES):
            html_parts.append('<tr>')
            
            for cell in row.findall('.//table:table-cell', self.NAMESPACES):
                html_parts.append('<td>')
                
                for child in cell:
                    if child.tag.endswith('p'):
                        content = self._get_text_content(child, styles, image_map)
                        html_parts.append(f'<p>{content}</p>')
                
                html_parts.append('</td>')
            
            html_parts.append('</tr>')
        
        html_parts.append('</table>')
        return ''.join(html_parts)
    
    def _convert_frame(self, frame: ET.Element, image_map: dict) -> str:
        """Convert frame (image) element to HTML"""
        # Find image element within frame
        image = frame.find('.//draw:image', self.NAMESPACES)
        if image is not None:
            href = image.get('{http://www.w3.org/1999/xlink}href')
            if href and href in image_map:
                url = image_map[href]
                
                # Get dimensions if available
                width = frame.get('{urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0}width')
                height = frame.get('{urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0}height')
                
                attrs = [f'src="{url}"']
                if width:
                    attrs.append(f'width="{self._convert_dimension(width)}"')
                if height:
                    attrs.append(f'height="{self._convert_dimension(height)}"')
                
                return f'<img {" ".join(attrs)} alt="">'
        
        return ''
    
    def _get_text_content(self, element: ET.Element, styles: dict, image_map: dict = None) -> str:
        """Extract text content from element with formatting"""
        parts = []
        
        # Process text directly in element
        if element.text:
            parts.append(element.text)
        
        # Process child elements
        for child in element:
            tag = child.tag.split('}')[-1]
            
            if tag == 'span':
                style_name = child.get('{urn:oasis:names:tc:opendocument:xmlns:text:1.0}style-name')
                text = child.text or ''
                
                if style_name and style_name in styles:
                    style_props = styles[style_name]
                    
                    # Apply inline formatting
                    if style_props.get('font-weight') == 'bold':
                        text = f'<strong>{text}</strong>'
                    if style_props.get('font-style') == 'italic':
                        text = f'<em>{text}</em>'
                    if style_props.get('text-decoration') == 'underline':
                        text = f'<u>{text}</u>'
                
                parts.append(text)
            
            elif tag == 'frame' and image_map:
                # Handle embedded images
                frame_html = self._convert_frame(child, image_map)
                if frame_html:
                    parts.append(frame_html)
            
            elif tag == 'line-break':
                parts.append('<br>')
            
            elif tag == 's':  # spaces
                count = int(child.get('{urn:oasis:names:tc:opendocument:xmlns:text:1.0}c', '1'))
                parts.append(' ' * count)
            
            elif tag == 'tab':
                parts.append('    ')  # Convert tab to spaces
            
            # Handle text after child element
            if child.tail:
                parts.append(child.tail)
        
        return ''.join(parts)
    
    def _convert_dimension(self, dim: str) -> str:
        """Convert ODT dimension to CSS dimension"""
        # Simple conversion - can be enhanced
        if dim.endswith('cm'):
            # Convert cm to approximate pixels
            cm_value = float(dim[:-2])
            px_value = int(cm_value * 37.8)  # 1cm ≈ 37.8px
            return f"{px_value}"
        return dim
    
    def _generate_css(self, styles: dict) -> str:
        """Generate CSS from parsed styles"""
        css_rules = []
        
        for style_name, props in styles.items():
            if props:
                css_props = [f"{k}: {v}" for k, v in props.items() if k != 'page-break-before' and k != 'page-break-after']
                if css_props:
                    css_rules.append(f".{style_name} {{ {'; '.join(css_props)}; }}")
        
        return '\n'.join(css_rules)
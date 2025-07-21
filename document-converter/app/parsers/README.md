# Document Parsers

This directory contains format-specific parsers for converting various document types to HTML.

## Parsers

### ODT Parser (odt_parser.py)

Handles OpenDocument Text (.odt) files from LibreOffice and other open source office suites.

#### Features
- Extracts text content with formatting
- Preserves document structure (headings, lists, tables)
- Extracts and processes embedded images
- Handles page breaks
- Converts ODT styles to CSS

#### Recent Updates (v1.1)

**Fixed Image Display Issue**

The ODT parser has been updated to properly handle images embedded within paragraphs. Previously, images that were inline with text were not being converted to HTML.

**Changes made:**
1. Updated `_convert_paragraph()` to accept and pass the `image_map` parameter
2. Modified `_get_text_content()` to handle `<frame>` elements (which contain images in ODT)
3. Added image processing for all content types (paragraphs, headings, lists, tables)

**Key code addition in `_get_text_content()`:**
```python
elif tag == 'frame' and image_map:
    # Handle embedded images
    frame_html = self._convert_frame(child, image_map)
    if frame_html:
        parts.append(frame_html)
```

This ensures that images anywhere in the document structure are properly converted to `<img>` tags with the correct source URLs.

### DOCX Parser (docx_parser.py)

Handles Microsoft Word documents (.docx and .doc files).

#### Features
- Uses python-mammoth for reliable conversion
- Extracts embedded images
- Preserves basic formatting
- Handles tables and lists
- Supports page breaks

### Base Parser (base.py)

Abstract base class that defines the parser interface. All format-specific parsers inherit from this class.

## Adding New Parsers

To add support for a new document format:

1. Create a new parser class inheriting from `BaseParser`
2. Implement the required `parse()` method
3. Register the parser in the converter's format mapping
4. Add tests for the new format

## Image Handling

All parsers extract images to the media directory and return:
- Image metadata (filename, size, content type)
- Public URLs for frontend access
- Optimized versions (compressed, correct format)

Images are processed through PIL for optimization and format conversion when necessary.
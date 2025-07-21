#!/usr/bin/env python3
"""
Simple test script for document conversion
This demonstrates the conversion functionality without requiring FastAPI
"""

import sys
import os
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from app.parsers import get_parser
from app.sanitizers import HTMLSanitizer
from app.config import settings
from app.utils import setup_directories, save_temp_file, cleanup_temp_file


def test_odt_conversion(file_path: str):
    """Test ODT file conversion"""
    print(f"\nTesting ODT conversion for: {file_path}")
    print("=" * 60)
    
    try:
        # Setup directories
        setup_directories()
        
        # Read file
        with open(file_path, 'rb') as f:
            content = f.read()
        
        # Save to temp file
        temp_path = save_temp_file(content, Path(file_path).name)
        
        # Get parser
        parser = get_parser('.odt')
        
        # Parse document
        result = parser.parse(temp_path, extract_images=True)
        
        # Sanitize HTML
        sanitizer = HTMLSanitizer(
            allowed_tags=settings.DEFAULT_ALLOWED_TAGS,
            allowed_attributes=settings.DEFAULT_ALLOWED_ATTRIBUTES,
            allowed_styles=settings.DEFAULT_ALLOWED_STYLES
        )
        
        sanitized_html = sanitizer.sanitize(result['html'])
        
        # Display results
        print("\n--- CONVERTED HTML ---")
        print(sanitized_html[:1000] + "..." if len(sanitized_html) > 1000 else sanitized_html)
        
        print(f"\n--- METADATA ---")
        print(f"Images extracted: {len(result.get('images', []))}")
        print(f"Has pagebreaks: {settings.PAGEBREAK_MARKER in sanitized_html}")
        
        if result.get('images'):
            print("\n--- EXTRACTED IMAGES ---")
            for img in result['images']:
                print(f"- {img['filename']} ({img['size']} bytes) -> {img['url']}")
        
        # Save output
        output_file = Path(file_path).stem + "_converted.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Converted: {Path(file_path).name}</title>
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
        img {{ max-width: 100%; height: auto; }}
        {result.get('styles', '')}
    </style>
</head>
<body>
    {sanitized_html}
</body>
</html>""")
        
        print(f"\n✅ Conversion successful! Output saved to: {output_file}")
        
        # Cleanup
        cleanup_temp_file(temp_path)
        
    except Exception as e:
        print(f"\n❌ Conversion failed: {str(e)}")
        import traceback
        traceback.print_exc()


def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python test_conversion.py <path_to_odt_file>")
        print("\nExample:")
        print("  python test_conversion.py /var/www/public_html/files-for-testing/texts\\ for\\ cms/texts\\ for\\ drupal/adjustment.odt")
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    if not os.path.exists(file_path):
        print(f"Error: File not found: {file_path}")
        sys.exit(1)
    
    test_odt_conversion(file_path)


if __name__ == "__main__":
    main()
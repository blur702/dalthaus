# Document Conversion Service

A self-sufficient Python microservice for converting Word and LibreOffice documents to clean HTML with image extraction and style preservation.

## Features

- ✅ Convert Word documents (.docx, .doc) to HTML
- ✅ Convert LibreOffice documents (.odt) to HTML
- ✅ Extract and optimize embedded images (including images within paragraphs)
- ✅ Preserve document styling and formatting
- ✅ Maintain page breaks for proper pagination
- ✅ Sanitize HTML based on TinyMCE allowed tags
- ✅ RESTful API with FastAPI
- ✅ Async processing for better performance

### Recent Updates (v1.1)
- Fixed ODT parser to properly handle images embedded in paragraphs
- Images within text content are now correctly converted to `<img>` tags
- Improved dimension handling for ODT images

## Architecture

This service follows a microservice architecture pattern:

```
Frontend (React) 
    ↓
Backend (Node.js/Express)
    ↓
Document Converter (Python/FastAPI)
```

## Prerequisites

- Python 3.10 or higher
- pip package manager
- System packages for document processing

## Installation

### 1. Install System Dependencies

```bash
# For Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv python3-dev

# Install pandoc for document conversion (optional, for better ODT support)
sudo apt-get install -y pandoc
```

### 2. Set Up Python Environment

```bash
cd /var/www/public_html/document-converter

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure the Service

The service uses environment variables for configuration. Create a `.env` file:

```bash
# Document Converter Settings
DOC_CONVERTER_HOST=127.0.0.1
DOC_CONVERTER_PORT=8001
DOC_CONVERTER_DEBUG=False
PUBLIC_MEDIA_PATH=/var/www/public_html/frontend/public/media
```

### 4. Start the Service

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Start the service
python main.py

# Or use the startup script
chmod +x startup.sh
./startup.sh
```

The service will be available at `http://localhost:8001`

## API Endpoints

### POST /convert
Convert a document to HTML

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Parameters:
  - `file`: The document file (required)
  - `allowed_tags`: Comma-separated list of allowed HTML tags (optional)
  - `extract_images`: Whether to extract images (default: true)

**Response:**
```json
{
  "html": "<p>Converted HTML content...</p>",
  "metadata": {
    "original_filename": "document.docx",
    "format": ".docx",
    "has_pagebreaks": true,
    "image_count": 3,
    "allowed_tags": ["p", "h1", "h2", ...]
  },
  "images": [
    {
      "filename": "doc_image_abc123.jpg",
      "url": "/media/doc_image_abc123.jpg",
      "size": 45678,
      "content_type": "image/jpeg"
    }
  ]
}
```

### GET /supported-formats
Get list of supported document formats

**Response:**
```json
{
  "formats": [
    {"extension": ".docx", "description": "Microsoft Word (2007+)"},
    {"extension": ".doc", "description": "Microsoft Word (Legacy)"},
    {"extension": ".odt", "description": "OpenDocument Text"},
    {"extension": ".rtf", "description": "Rich Text Format"}
  ]
}
```

### GET /
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "service": "Document Conversion Service"
}
```

## Integration with Node.js Backend

The Node.js backend includes a document converter service that communicates with this Python service:

```javascript
// Backend endpoint
POST /api/document/convert

// Frontend usage
const formData = new FormData();
formData.append('document', file);
formData.append('allowedTags', 'p,h1,h2,h3,strong,em');

const response = await api.post('/document/convert', formData);
```

## Project Structure

```
document-converter/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── startup.sh             # Startup script
├── README.md              # This file
├── app/
│   ├── __init__.py
│   ├── config.py          # Configuration settings
│   ├── utils.py           # Utility functions
│   ├── converters/        # Document converter classes
│   │   ├── __init__.py
│   │   └── base.py        # Base converter implementation
│   ├── parsers/           # Format-specific parsers
│   │   ├── __init__.py
│   │   ├── base.py        # Base parser class
│   │   ├── docx_parser.py # Word document parser
│   │   └── odt_parser.py  # LibreOffice document parser
│   └── sanitizers/        # HTML sanitization
│       ├── __init__.py
│       └── html_sanitizer.py
├── media/                 # Extracted images directory
├── uploads/               # Temporary upload directory
└── temp/                  # Temporary processing directory
```

## Security Considerations

1. **File Size Limits**: Maximum file size is 50MB
2. **File Type Validation**: Only supported document formats are accepted
3. **HTML Sanitization**: All HTML is sanitized based on allowed tags
4. **Image Processing**: Images are optimized and validated
5. **Authentication**: Requires authentication through Node.js backend

## Troubleshooting

### Service won't start
- Check Python version: `python3 --version` (requires 3.10+)
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check port 8001 is available: `lsof -i :8001`

### Document conversion fails
- Check file format is supported
- Ensure file size is under 50MB
- Check logs for specific error messages

### Images not displaying

**ODT Image Display Issue (Fixed in v1.1)**
- The parser now correctly handles images embedded within paragraphs
- Images are extracted and converted to `<img>` tags with proper src paths
- Dimension conversion from ODT units (inches/cm) to pixels is applied

**General troubleshooting:**
- Verify `PUBLIC_MEDIA_PATH` is set correctly
- Check media directory permissions
- Ensure frontend public/media directory exists
- Verify images are being extracted to the media directory
- Check browser console for 404 errors on image URLs

## Testing

To test the service manually:

```bash
# Test health endpoint
curl http://localhost:8001/

# Test document conversion
curl -X POST http://localhost:8001/convert \
  -F "file=@/path/to/document.docx" \
  -F "allowed_tags=p,h1,h2,strong,em"
```

## Production Deployment

For production deployment:

1. Use a process manager like systemd or supervisor
2. Set `DOC_CONVERTER_DEBUG=False`
3. Configure proper logging
4. Set up monitoring
5. Use a reverse proxy (nginx) if needed

Example systemd service file:

```ini
[Unit]
Description=Document Conversion Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/public_html/document-converter
Environment="PATH=/var/www/public_html/document-converter/venv/bin"
ExecStart=/var/www/public_html/document-converter/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

## License

This service is part of the CMS project and follows the same license terms.
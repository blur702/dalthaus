# Document Converter Service

A FastAPI-based microservice for converting various document formats to clean HTML.

## Features

- Converts Word documents (.docx, .doc) to HTML
- Converts OpenDocument Text (.odt) to HTML
- Converts Rich Text Format (.rtf) to HTML
- Preserves formatting and styles
- Extracts and handles images
- Sanitizes HTML output
- Async processing with proper error handling

## Supported Formats

- **Microsoft Word**: `.docx`, `.doc`
- **OpenDocument**: `.odt`
- **Rich Text Format**: `.rtf`

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Setup

1. Navigate to the converter directory:
```bash
cd backend/src/services/documentConverter
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On Linux/Mac
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Service

### Development Mode
```bash
python converter_service.py
```

The service will start on `http://localhost:8001`

### Production Mode
```bash
uvicorn converter_service:app --host 0.0.0.0 --port 8001 --workers 4
```

## API Endpoints

### POST /convert
Convert a document to HTML.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (the document to convert)

**Response:**
```json
{
  "html": "<h1>Document content...</h1>",
  "metadata": {
    "title": "Document Title",
    "author": "Author Name",
    "created": "2024-01-01T00:00:00Z"
  },
  "images": {
    "image1.png": "base64_encoded_image_data..."
  }
}
```

### GET /supported-formats
Get list of supported file formats.

**Response:**
```json
{
  "formats": [
    {
      "extension": ".docx",
      "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "description": "Microsoft Word Document"
    },
    ...
  ]
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

## Architecture

### Components

1. **converter_service.py** - Main FastAPI application
2. **document_converter.py** - Core conversion logic
3. **parsers/** - Format-specific parsers
   - `docx_parser.py` - Word document parser
   - `odt_parser.py` - OpenDocument parser
   - `rtf_parser.py` - RTF parser
4. **html_sanitizer.py** - HTML cleaning and sanitization
5. **utils.py** - Helper functions

### Processing Flow

1. File upload validation
2. Format detection
3. Parser selection
4. Document parsing
5. HTML generation
6. HTML sanitization
7. Image extraction
8. Response formatting

## Error Handling

The service handles various error scenarios:
- Unsupported file formats
- Corrupted documents
- Large file handling (50MB limit)
- Parser failures
- Memory management

## Configuration

### Environment Variables
- `CONVERTER_PORT` - Service port (default: 8001)
- `MAX_FILE_SIZE` - Maximum file size in MB (default: 50)
- `ALLOWED_ORIGINS` - CORS allowed origins

### File Size Limits
Default maximum file size: 50MB

## Development

### Adding New Format Support

1. Create a new parser in `parsers/` directory
2. Implement the parser interface:
```python
class NewFormatParser:
    def parse(self, file_path: str) -> Dict[str, Any]:
        # Implementation
        return {
            'html': html_content,
            'metadata': metadata_dict,
            'images': images_dict
        }
```

3. Register the parser in `document_converter.py`
4. Update supported formats list

### Testing

Run tests:
```bash
pytest tests/
```

## Security Considerations

1. **File Validation**: Strict file type checking
2. **Size Limits**: Prevents DoS attacks
3. **HTML Sanitization**: Removes potentially harmful content
4. **Temporary File Cleanup**: Automatic cleanup of uploaded files
5. **Error Messages**: No sensitive information in responses

## Performance

- Async processing for better concurrency
- Streaming for large files
- Efficient memory usage
- Automatic garbage collection

## Troubleshooting

### Common Issues

1. **Import Error for python-docx**
   ```bash
   pip install --upgrade python-docx
   ```

2. **Memory issues with large files**
   - Reduce MAX_FILE_SIZE
   - Increase available memory

3. **Permission errors**
   - Ensure write permissions for temp directory

## Integration with Main Application

The Node.js backend integrates with this service via the `/api/document/convert` endpoint. See the main backend README for integration details.

## Dependencies

- **FastAPI**: Web framework
- **python-docx**: Word document processing
- **odfpy**: OpenDocument processing
- **striprtf**: RTF text extraction
- **beautifulsoup4**: HTML processing
- **lxml**: XML/HTML parser
- **Pillow**: Image processing
- **uvicorn**: ASGI server

## License

Part of the Admin Panel CMS project.
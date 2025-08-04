# Manual Test Instructions for Document Upload Feature

## Overview
The document upload feature has been successfully integrated into the CMS. It allows you to upload Word and LibreOffice documents directly into the content editor.

## How to Test Manually

### 1. Access the Application
- Open your browser and go to: **http://localhost:5173**
- Login with:
  - Username: `admin`
  - Password: `(130Bpm)`

### 2. Navigate to Content Creation
After logging in:
1. Click on the **"Content"** dropdown in the navigation menu
2. Select any of these options:
   - **Articles** → Click "Add New Article"
   - **Pages** → Click "Add New Page"  
   - **Photo Books** → Click "Add New Photo Book"

### 3. Find the Document Upload Feature
Once in the content editor:
- Look **above the text editor** (TinyMCE)
- You'll see a section with:
  - An **"Upload Document"** button
  - Text showing supported formats: "Supported: Word (.docx, .doc), LibreOffice (.odt), RTF"

### 4. Upload a Document
1. Click the **"Upload Document"** button
2. Select one of the test files from:
   ```
   /var/www/public_html/files-for-testing/texts for cms/texts for drupal/
   ```
   Available test files:
   - `adjustment.odt` - Contains images and formatted text
   - `storytelling.odt` - Text with various formatting
   - `smartphone.odt` - Technical content with lists
   - Any other `.odt` file in that directory

3. After selecting a file, you'll see:
   - "Converting document..." message with a spinner
   - Then a success message: "Document converted successfully! X images extracted."

### 5. View the Results
- The converted content will automatically appear in the TinyMCE editor
- You'll see:
  - All text with formatting preserved
  - Images embedded with proper URLs
  - Headings, lists, and styles maintained
  - Page breaks preserved as `<!-- pagebreak -->`

### 6. Save the Content
1. Fill in the required fields (Title, Slug, etc.)
2. Click "Save"
3. The content is now stored with all converted HTML and images

## What's Happening Behind the Scenes

1. **File Upload**: The document is sent to the backend (Node.js)
2. **Conversion Service**: Backend forwards it to the Python service (port 8001)
3. **Processing**: 
   - Document is parsed (text extraction)
   - Images are extracted and optimized
   - HTML is generated with proper formatting
   - Content is sanitized based on TinyMCE allowed tags
4. **Response**: Clean HTML is returned and inserted into the editor

## Features Demonstrated

✅ **Supported Formats**:
- Microsoft Word (.docx, .doc)
- LibreOffice/OpenDocument (.odt)
- Rich Text Format (.rtf)

✅ **Preserved Elements**:
- Text formatting (bold, italic, underline)
- Headings (H1-H6)
- Lists (ordered and unordered)
- Tables
- Images (extracted and embedded)
- Page breaks for pagination

✅ **Security**:
- File type validation
- 50MB file size limit
- HTML sanitization
- Authentication required

## Troubleshooting

If the upload doesn't work:

1. **Check Services**: Ensure all three services are running:
   ```bash
   # Check if services are running
   curl http://localhost:5173        # Frontend
   curl http://localhost:5001        # Backend
   curl http://localhost:8001        # Document Converter
   ```

2. **Check Browser Console**: Press F12 and look for any errors

3. **Verify File**: Ensure the file is:
   - A supported format (.docx, .doc, .odt, .rtf)
   - Under 50MB in size

## Video Demo Steps

If recording a demo:
1. Show the login process
2. Navigate to Articles → Add New Article
3. Point out the Upload Document button
4. Select a document with images (like adjustment.odt)
5. Show the conversion process
6. Highlight the converted content in the editor
7. Show that images are properly embedded
8. Save and preview the article

The document upload feature is fully functional and ready for use!
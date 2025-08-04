# TinyMCE Image Display Troubleshooting

## Current Configuration

TinyMCE is now fully configured to handle images:

### ✅ What's Been Set Up:

1. **Image Plugin Enabled**: The `image` and `media` plugins are loaded
2. **Toolbar Buttons**: Added `image` and `media` buttons to the toolbar
3. **URL Configuration**:
   - `relative_urls: false` - Uses absolute URLs
   - `remove_script_host: false` - Keeps the full URL
   - `convert_urls: false` - Doesn't modify URLs
   - `document_base_url` - Set to current origin

4. **Image Upload Handler**: Custom handler that converts images to data URLs for embedding
5. **File Picker**: Allows selecting images from local computer
6. **Image Styles**: Added CSS to ensure images display properly (max-width: 100%)

### 📸 How Images Work Now:

1. **From Document Upload**:
   - Images are extracted and saved to `/frontend/public/media/`
   - URLs are converted to absolute paths (e.g., `http://localhost:5173/media/image.jpg`)
   - Images should display in the editor

2. **Manual Image Insert**:
   - Click the image button in the toolbar
   - Either enter a URL or upload from computer
   - Uploaded images are embedded as data URLs

### 🔍 To Test Image Display:

1. **Check Browser Console** (F12):
   ```javascript
   // Look for any errors when uploading
   // Check the converted HTML in console logs
   ```

2. **Verify Image URLs**:
   - After uploading a document, check the console for "Processed HTML sample"
   - Image URLs should be like: `http://localhost:5173/media/odt_image_xxx.jpg`

3. **Test Direct Image Access**:
   - Copy an image URL from the console
   - Paste it in a new browser tab
   - The image should load

### 🛠️ If Images Still Don't Show:

1. **Clear Browser Cache**: Ctrl+F5 or Cmd+Shift+R

2. **Check Network Tab**:
   - Open DevTools → Network tab
   - Upload a document
   - Look for image requests - are they 404 or 200?

3. **Manual Test**:
   - In the editor, click the image button
   - Enter this test URL: `http://localhost:5173/media/odt_image_image_0a681fb6.jpeg`
   - If this works, the issue is with URL generation

4. **Check TinyMCE Content**:
   - In browser console, run:
   ```javascript
   tinymce.activeEditor.getContent()
   ```
   - This shows the actual HTML - check if img tags are present

### 📝 Alternative Solution:

If server-hosted images continue to have issues, the current configuration will automatically fall back to embedding images as data URLs, which always works but makes the content larger.

### 🚀 Quick Fix:

Try uploading a document again now. The combination of:
- Absolute URLs
- Proper image plugin configuration  
- Vite serving the public directory
- Image styles in the editor

Should make images display correctly!
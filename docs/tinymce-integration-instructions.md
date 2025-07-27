# TinyMCE Integration Implementation

## Overview

We have successfully integrated the TinyMCE configuration system with the actual editor components. The system now supports dynamic configuration profiles that can be selected per content type or manually by users.

## What Was Implemented

### 1. Configuration Hook (`/frontend/src/hooks/useTinymceConfig.js`)
- Created a custom React hook that fetches and caches TinyMCE configurations
- Supports profile-based and content-type-based configuration selection
- Implements caching to avoid repeated API calls
- Provides fallback to default configuration on API failures
- Always ensures pagebreak plugin is included and configured

### 2. Updated RichTextEditor Component
- Modified to accept `profileId` and `contentType` props
- Shows loading state while fetching configuration
- Displays appropriate alerts for errors and fallback usage
- Maintains backward compatibility with existing usage

### 3. Profile Selector Component (`/frontend/src/components/TinymceProfileSelector.jsx`)
- Created a reusable component for selecting TinyMCE profiles
- Auto-selects default profile based on content type
- Shows profile metadata (default status, content types)

### 4. Updated Content Editors
- **ArticleEditor**: Now passes `contentType="article"` and includes profile selector
- **PageEditor**: Now passes `contentType="page"` and includes profile selector  
- **PhotoBookEditor**: Now passes `contentType="photobook"` and includes profile selector

### 5. Test Page (`/frontend/src/pages/TestTinymceIntegration.jsx`)
- Created comprehensive test page at `/admin/test/tinymce`
- Tests configuration loading, pagebreak plugin presence, and editor functionality
- Provides tools to refresh config and clear cache

## How to Test

1. **Navigate to the test page**:
   ```
   http://localhost:3001/admin/test/tinymce
   ```

2. **Run the automated tests**:
   - Click "Run Tests" button to verify:
     - Configuration loading
     - Pagebreak plugin presence
     - Toolbar configuration
     - Active editor instances

3. **Test profile switching**:
   - Use the profile selector to switch between different profiles
   - Observe how the editor configuration changes

4. **Test pagebreak functionality**:
   - Click "Insert Pagebreak" button
   - Verify pagebreak is inserted into content

5. **Test in actual content editors**:
   - Create/edit an Article, Page, or PhotoBook
   - Verify profile selector appears above the editor
   - Check that appropriate default profile is selected based on content type

## Configuration Caching

The system implements intelligent caching:
- Configurations are cached by profile ID or content type
- Cache persists across component remounts
- Manual cache clearing available via `clearCache()` method
- Cache key format: `profileId || contentType || 'default'`

## Fallback Behavior

If the API is unavailable or returns an error:
1. The system falls back to a hardcoded default configuration
2. An info alert is shown to indicate fallback mode
3. The editor remains functional with basic features
4. Pagebreak plugin is always included in fallback config

## API Endpoints Used

- `GET /api/tinymce/profiles` - Fetch all available profiles
- `GET /api/tinymce/profiles/:id/compiled` - Get compiled configuration for a profile

## Default Configuration

The fallback configuration includes:
```javascript
{
  toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | pagebreak | help',
  plugins: 'link image lists pagebreak help preview searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media table emoticons',
  menubar: true,
  statusbar: true,
  branding: false,
  height: 500,
  // ... additional settings
}
```

## Troubleshooting

### Editor not loading
1. Check browser console for errors
2. Verify API is running: `GET http://localhost:3000/api/tinymce/profiles`
3. Clear cache and refresh page

### Pagebreak not working
1. Verify pagebreak plugin is in the compiled configuration
2. Check that pagebreak button appears in toolbar
3. Use test page to debug plugin loading

### Profile not auto-selecting
1. Ensure content type is passed correctly to RichTextEditor
2. Verify profile has correct content_types array in database
3. Check that profile is marked as default for the content type

## Future Enhancements

1. Add user preference storage for selected profiles
2. Implement profile preview in settings
3. Add keyboard shortcuts for common operations
4. Create profile templates for quick setup
5. Add A/B testing support for different configurations
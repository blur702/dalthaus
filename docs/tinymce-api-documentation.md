# TinyMCE Configuration API Documentation

This document describes the API endpoints for managing TinyMCE configurations, profiles, and settings.

## Authentication

All endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Profile Management

#### 1. List All Profiles
**GET** `/api/tinymce/profiles`

Returns all profiles accessible to the authenticated user. Admin users can see all profiles, while regular users can only see:
- System profiles
- Profiles they created
- Profiles they're explicitly allowed to access

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Profile Name",
    "description": "Profile description",
    "profileType": "system|user|content_type|custom",
    "priority": 10,
    "isDefault": false,
    "isPreset": false,
    "tags": ["tag1", "tag2"],
    "createdBy": "user-uuid",
    "updatedBy": "user-uuid",
    "createdAt": "2025-01-22T10:00:00Z",
    "updatedAt": "2025-01-22T10:00:00Z"
  }
]
```

#### 2. Get Specific Profile
**GET** `/api/tinymce/profiles/:id`

Returns a specific profile with all its settings, allowed tags, and feature flags.

**Response:**
```json
{
  "id": "uuid",
  "name": "Profile Name",
  "description": "Profile description",
  "settings": {
    "height": 400,
    "menubar": false,
    "plugins": ["lists", "link", "pagebreak"],
    "toolbar": "undo redo | bold italic"
  },
  "allowedTags": [...],
  "features": [...]
}
```

#### 3. Create New Profile
**POST** `/api/tinymce/profiles`

Creates a new TinyMCE profile. The `pagebreak` plugin will be automatically included if not specified.

**Request Body:**
```json
{
  "name": "Custom Profile",
  "description": "A custom profile for blog posts",
  "settings": {
    "height": 400,
    "menubar": false,
    "plugins": ["lists", "link", "image"],
    "toolbar": "undo redo | bold italic | bullist numlist"
  },
  "profileType": "custom",
  "priority": 10,
  "tags": ["blog", "content"],
  "conditions": {},
  "allowedUsers": [],
  "allowedRoles": ["editor"]
}
```

**Note:** Non-admin users can only create profiles with `profileType: "custom"`.

#### 4. Update Profile
**PUT** `/api/tinymce/profiles/:id`

Updates an existing profile. System profiles can only be modified by superusers.

**Request Body:** Same as create, but all fields are optional.

**Restrictions:**
- System presets cannot be modified
- Only profile owners or admins can update profiles
- The `pagebreak` plugin cannot be removed

#### 5. Delete Profile
**DELETE** `/api/tinymce/profiles/:id`

Deletes a profile. System profiles cannot be deleted.

**Response:**
```json
{
  "message": "Profile deleted successfully"
}
```

#### 6. Duplicate Profile
**POST** `/api/tinymce/profiles/:id/duplicate`

Creates a copy of an existing profile with a new name.

**Request Body:**
```json
{
  "name": "New Profile Name"
}
```

**Response:** Returns the newly created profile object.

#### 7. Get Compiled Configuration
**GET** `/api/tinymce/profiles/:id/config`

Returns the compiled TinyMCE configuration for a profile, including:
- Base settings from the profile
- Valid elements generated from allowed tags
- Feature-specific configurations

This endpoint also increments the usage count for the profile.

**Response:**
```json
{
  "height": 400,
  "menubar": false,
  "plugins": ["lists", "link", "pagebreak", "wordcount"],
  "toolbar": "undo redo | bold italic | bullist numlist",
  "valid_elements": "p[class],h1[id],img[src|alt]",
  "pagebreak_separator": "<!-- pagebreak -->",
  "wordcount_countspaces": true
}
```

### Toolbar Presets

#### 8. List Toolbar Presets
**GET** `/api/tinymce/toolbar-presets`

Returns all available toolbar presets, including system and user-created presets.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Basic Toolbar",
    "description": "A simple toolbar configuration",
    "toolbar_config": {
      "row1": ["undo", "redo", "|", "bold", "italic"],
      "row2": ["bullist", "numlist", "|", "link"]
    },
    "button_order": ["undo", "redo", "bold", "italic", "bullist", "numlist", "link"],
    "is_system": true
  }
]
```

### Allowed Tags Management

#### 9. Get Allowed Tags
**GET** `/api/tinymce/profiles/:id/allowed-tags`

Returns all allowed HTML tags for a profile.

**Response:**
```json
[
  {
    "id": "uuid",
    "profile_id": "profile-uuid",
    "tag_name": "p",
    "attributes": {
      "class": { "type": "string" },
      "id": { "type": "string" }
    },
    "is_void": false
  }
]
```

#### 10. Update Allowed Tags
**PUT** `/api/tinymce/profiles/:id/allowed-tags`

Replaces all allowed tags for a profile.

**Request Body:**
```json
{
  "tags": [
    {
      "tag_name": "p",
      "attributes": {
        "class": { "type": "string" }
      }
    },
    {
      "tag_name": "img",
      "attributes": {
        "src": { "type": "url", "required": true },
        "alt": { "type": "string" }
      },
      "is_void": true
    }
  ]
}
```

**Attribute Types:**
- `string`: Any text value
- `number`: Numeric values
- `boolean`: true/false values
- `url`: Valid URL
- `email`: Valid email address

### Feature Flags Management

#### 11. Get Feature Flags
**GET** `/api/tinymce/profiles/:id/features`

Returns all feature flags for a profile.

**Response:**
```json
[
  {
    "id": "uuid",
    "profile_id": "profile-uuid",
    "feature_name": "wordcount",
    "enabled": true,
    "config": {
      "countSpaces": false,
      "countHTML": false
    }
  }
]
```

#### 12. Update Feature Flags
**PUT** `/api/tinymce/profiles/:id/features`

Updates feature flags for a profile.

**Request Body:**
```json
{
  "features": [
    {
      "feature_name": "wordcount",
      "enabled": true,
      "config": {
        "countSpaces": true
      }
    },
    {
      "feature_name": "autosave",
      "enabled": false
    }
  ]
}
```

**Available Features:**
- `pagebreak` - Page break functionality (always enabled)
- `spellcheck` - Spell checking
- `autosave` - Auto-save functionality
- `wordcount` - Word and character counting
- `accessibility` - Accessibility checker
- `templates` - Content templates
- `quickbars` - Context-sensitive toolbars
- `emoticons` - Emoji support

**Note:** The `pagebreak` feature cannot be disabled.

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "error": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied to this profile"
}
```

### 404 Not Found
```json
{
  "error": "Profile not found"
}
```

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to perform operation"
}
```

## Access Control

The API implements the following access control rules:

1. **System Profiles**: Accessible to all authenticated users
2. **Custom Profiles**: 
   - Owners can view, edit, and delete
   - Users in `allowedUsers` can view
   - Users with roles in `allowedRoles` can view
   - Admins and superusers can view and manage all profiles
3. **System Presets**: Cannot be modified or deleted (except description by superusers)
4. **Feature Restrictions**: The `pagebreak` feature must always remain enabled

## Usage Example

```javascript
// Get auth token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
});
const { token } = await response.json();

// Create a profile
const profile = await fetch('/api/tinymce/profiles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Blog Editor',
    description: 'Editor for blog posts',
    settings: {
      height: 400,
      plugins: ['lists', 'link', 'image', 'pagebreak'],
      toolbar: 'undo redo | bold italic | bullist numlist | link image'
    }
  })
}).then(res => res.json());

// Get compiled config for TinyMCE
const config = await fetch(`/api/tinymce/profiles/${profile.id}/config`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());

// Initialize TinyMCE with the config
tinymce.init({
  selector: 'textarea',
  ...config
});
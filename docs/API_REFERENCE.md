# API Reference

Base URL: `http://localhost:5001/api`

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "(130Bpm)"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "role": "superuser"
  }
}
```

## Protected Endpoints

All protected endpoints require the Authorization header:
```http
Authorization: Bearer <token>
```

## User Management

### List Users
```http
GET /users
Authorization: Bearer <token>

Response:
{
  "users": [
    {
      "id": "uuid",
      "username": "admin",
      "role": "superuser",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Get User
```http
GET /users/:id
Authorization: Bearer <token>

Response:
{
  "id": "uuid",
  "username": "admin",
  "role": "superuser",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Create User
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "password": "securepassword",
  "role": "admin"
}

Response:
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "username": "newuser",
    "role": "admin"
  }
}
```

### Update User
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "updatedname",
  "password": "newpassword",
  "role": "admin"
}

Response:
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "username": "updatedname",
    "role": "admin"
  }
}
```

### Delete User
```http
DELETE /users/:id
Authorization: Bearer <token>

Response:
{
  "message": "User deleted successfully"
}
```

## Content Management

### Articles

#### List Articles
```http
GET /content/articles
Query Parameters:
  - status: draft|published|archived
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string

Response:
{
  "items": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-title",
      "body": "Content...",
      "status": "published",
      "contentType": "article",
      "authorId": "uuid",
      "author": {
        "id": "uuid",
        "username": "admin"
      },
      "metadata": {
        "excerpt": "Short description",
        "category": "Tech",
        "tags": ["javascript", "react"],
        "featuredImage": "url"
      },
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

#### Get Article
```http
GET /content/articles/:id

Response: Single article object
```

#### Get Article by Slug
```http
GET /content/articles/slug/:slug

Response: Single article object
```

#### Create Article (Protected)
```http
POST /content/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Article",
  "body": "Article content...",
  "status": "draft",
  "excerpt": "Short description",
  "category": "Tech",
  "tags": ["javascript"],
  "featuredImage": "url"
}

Response:
{
  "message": "article created successfully",
  "content": { ... }
}
```

#### Update Article (Protected)
```http
PUT /content/articles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "body": "Updated content...",
  "status": "published"
}

Response:
{
  "message": "article updated successfully",
  "content": { ... }
}
```

#### Delete Article (Protected)
```http
DELETE /content/articles/:id
Authorization: Bearer <token>

Response:
{
  "message": "article deleted successfully"
}
```

### Pages

Similar endpoints to articles with additional features:

#### Get Menu Pages
```http
GET /content/pages/menu

Response: Array of pages with showInMenu=true
```

#### Get Page Hierarchy
```http
GET /content/pages/hierarchy

Response: Nested page structure
```

### Photo Books

Similar endpoints to articles with photo-specific metadata.

## Error Responses

### 400 Bad Request
```json
{
  "error": "Username and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Not authorized, token failed"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized as an admin"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "error": "Username already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Filtering
- `status`: Filter by status
- `search`: Search in title and body

### Examples
```
GET /api/content/articles?status=published&page=2&limit=20
GET /api/content/articles?search=javascript
```
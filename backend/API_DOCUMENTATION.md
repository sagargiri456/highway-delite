# Notes API Documentation

## Base URL
```
http://localhost:5000/api/notes
```

## Authentication
All notes endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. GET /api/notes - Get User's Notes

Retrieves all notes for the authenticated user with pagination support.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of notes per page (default: 10, max: 50)

**Example Request:**
```bash
GET /api/notes?page=1&limit=10
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "My First Note",
      "content": "This is the content of my first note",
      "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalNotes": 50,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 10
  },
  "message": "Notes fetched successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Invalid pagination parameters
- `500 Internal Server Error`: Server error

---

### 2. POST /api/notes - Create Note

Creates a new note for the authenticated user.

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content (optional)"
}
```

**Validation Rules:**
- `title`: Required, string, 1-100 characters
- `content`: Optional, string, max 10,000 characters

**Example Request:**
```bash
POST /api/notes
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "My New Note",
  "content": "This is the content of my new note"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "My New Note",
    "content": "This is the content of my new note",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  },
  "message": "Note created successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Validation errors
- `500 Internal Server Error`: Server error

**Validation Error Example:**
```json
{
  "message": "Title is required and cannot be empty",
  "field": "title"
}
```

---

### 3. PUT /api/notes/:id - Update Note

Updates an existing note by ID.

**URL Parameters:**
- `id`: Note ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Validation Rules:**
- `title`: Required, string, 1-100 characters
- `content`: Optional, string, max 10,000 characters

**Example Request:**
```bash
PUT /api/notes/64f8a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated Note Title",
  "content": "Updated note content"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Updated Note Title",
    "content": "Updated note content",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T11:00:00.000Z"
  },
  "message": "Note updated successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Validation errors or invalid note ID
- `404 Not Found`: Note not found or user doesn't have permission
- `500 Internal Server Error`: Server error

---

### 4. DELETE /api/notes/:id - Delete Note

Deletes a note by ID.

**URL Parameters:**
- `id`: Note ID (MongoDB ObjectId)

**Example Request:**
```bash
DELETE /api/notes/64f8a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Invalid note ID format
- `404 Not Found`: Note not found or user doesn't have permission
- `500 Internal Server Error`: Server error

---

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (only in development)"
}
```

## Pagination

The GET /api/notes endpoint supports pagination with the following parameters:

- `page`: Page number (starts from 1)
- `limit`: Number of items per page (1-50, default: 10)

The response includes pagination metadata:
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `totalNotes`: Total number of notes
- `hasNextPage`: Boolean indicating if there's a next page
- `hasPrevPage`: Boolean indicating if there's a previous page
- `limit`: Number of items per page

## Security Features

1. **Authentication Required**: All endpoints require a valid JWT token
2. **User Isolation**: Users can only access their own notes
3. **Input Validation**: All inputs are validated and sanitized
4. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
5. **Rate Limiting**: API endpoints are protected by rate limiting middleware

## Testing Examples

### Using cURL

**Get Notes:**
```bash
curl -X GET "http://localhost:5000/api/notes?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Note:**
```bash
curl -X POST "http://localhost:5000/api/notes" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Note", "content": "Test content"}'
```

**Update Note:**
```bash
curl -X PUT "http://localhost:5000/api/notes/NOTE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "content": "Updated content"}'
```

**Delete Note:**
```bash
curl -X DELETE "http://localhost:5000/api/notes/NOTE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch

```javascript
const API_BASE = 'http://localhost:5000/api/notes';
const token = 'YOUR_JWT_TOKEN';

// Get notes
const getNotes = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE}?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Create note
const createNote = async (title, content) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content })
  });
  return response.json();
};

// Update note
const updateNote = async (id, title, content) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content })
  });
  return response.json();
};

// Delete note
const deleteNote = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

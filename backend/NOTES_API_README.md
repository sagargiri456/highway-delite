# Notes API Implementation

This document describes the implementation of the protected notes API endpoints for the Highway Delight application.

## ✅ Completed Features

- [x] **Protected notes routes** (`/api/notes`)
- [x] **GET /api/notes** - Fetch user's notes with pagination
- [x] **POST /api/notes** - Create new note
- [x] **PUT /api/notes/:id** - Update existing note
- [x] **DELETE /api/notes/:id** - Delete note
- [x] **Input validation** - Title required, content optional
- [x] **Pagination** - 10 notes per page (configurable)

## 🏗️ Architecture

### File Structure
```
backend/src/
├── models/
│   └── Note.ts                 # Note model with schema
├── controllers/
│   └── noteControllers.ts      # Note CRUD operations
├── routes/
│   └── noteRoutes.ts          # Note API routes
├── middleware/
│   ├── authMiddleware.ts      # JWT authentication
│   └── validators.ts          # Input validation
└── index.ts                   # Main server file
```

### Database Schema
```typescript
interface Note {
  _id: ObjectId;
  title: string;           // Required, 1-100 characters
  content?: string;        // Optional, max 10,000 characters
  userId: ObjectId;        // Reference to User
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Make sure your `.env` file includes:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. **Start the Server**
   ```bash
   npm run dev
   ```

## 🚀 API Endpoints

### Base URL
```
http://localhost:5000/api/notes
```

### Authentication
All endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 1. GET /api/notes
**Purpose**: Retrieve user's notes with pagination

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Notes per page (default: 10, max: 50)

**Example**:
```bash
GET /api/notes?page=1&limit=10
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "My Note",
      "content": "Note content",
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

### 2. POST /api/notes
**Purpose**: Create a new note

**Request Body**:
```json
{
  "title": "Note Title",
  "content": "Note content (optional)"
}
```

**Validation Rules**:
- `title`: Required, string, 1-100 characters
- `content`: Optional, string, max 10,000 characters

**Example**:
```bash
POST /api/notes
Content-Type: application/json

{
  "title": "My New Note",
  "content": "This is the content"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "My New Note",
    "content": "This is the content",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  },
  "message": "Note created successfully"
}
```

### 3. PUT /api/notes/:id
**Purpose**: Update an existing note

**URL Parameters**:
- `id`: Note ID (MongoDB ObjectId)

**Request Body**:
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Example**:
```bash
PUT /api/notes/64f8a1b2c3d4e5f6a7b8c9d0
Content-Type: application/json

{
  "title": "Updated Note",
  "content": "Updated content"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Updated Note",
    "content": "Updated content",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T11:00:00.000Z"
  },
  "message": "Note updated successfully"
}
```

### 4. DELETE /api/notes/:id
**Purpose**: Delete a note

**URL Parameters**:
- `id`: Note ID (MongoDB ObjectId)

**Example**:
```bash
DELETE /api/notes/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response**:
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0"
  }
}
```

## 🔒 Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **User Isolation**: Users can only access their own notes
3. **Input Validation**: Comprehensive validation for all inputs
4. **Error Handling**: Proper HTTP status codes and error messages
5. **Rate Limiting**: API endpoints are protected by rate limiting

## 🧪 Testing

### Run the Test Suite
```bash
cd backend
node test-notes-api.js
```

### Manual Testing with cURL

**Get Notes**:
```bash
curl -X GET "http://localhost:5000/api/notes?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Note**:
```bash
curl -X POST "http://localhost:5000/api/notes" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Note", "content": "Test content"}'
```

**Update Note**:
```bash
curl -X PUT "http://localhost:5000/api/notes/NOTE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "content": "Updated content"}'
```

**Delete Note**:
```bash
curl -X DELETE "http://localhost:5000/api/notes/NOTE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 Validation Rules

### Title Validation
- **Required**: Yes
- **Type**: String
- **Length**: 1-100 characters
- **Trim**: Whitespace is automatically trimmed

### Content Validation
- **Required**: No (optional)
- **Type**: String
- **Length**: 0-10,000 characters
- **Trim**: Whitespace is automatically trimmed

### Note ID Validation
- **Format**: MongoDB ObjectId (24 character hex string)
- **Pattern**: `/^[0-9a-fA-F]{24}$/`

## 📄 Pagination

The GET endpoint supports pagination with the following features:

- **Default**: 10 notes per page
- **Maximum**: 50 notes per page
- **Page numbering**: Starts from 1
- **Metadata**: Includes total count, current page, total pages, and navigation flags

### Pagination Response Format
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalNotes": 50,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 10
  }
}
```

## 🚨 Error Handling

### Common Error Responses

**401 Unauthorized**:
```json
{
  "message": "Missing or invalid token"
}
```

**400 Bad Request** (Validation Error):
```json
{
  "message": "Title is required and cannot be empty",
  "field": "title"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Note not found or you do not have permission to update it"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Note creation failed",
  "error": "Detailed error (development only)"
}
```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Set to 'development' for detailed error messages
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

### Pagination Limits
- Default limit: 10 notes per page
- Maximum limit: 50 notes per page
- Minimum page: 1

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md) - Comprehensive API documentation
- [Test Script](./test-notes-api.js) - Automated test suite
- [MongoDB Documentation](https://docs.mongodb.com/) - Database reference
- [Express.js Documentation](https://expressjs.com/) - Web framework reference

## 🤝 Contributing

When contributing to the notes API:

1. Follow the existing code style
2. Add appropriate error handling
3. Include input validation
4. Write tests for new features
5. Update documentation

## 📞 Support

For issues or questions regarding the notes API:

1. Check the error logs
2. Review the validation rules
3. Test with the provided test script
4. Consult the API documentation

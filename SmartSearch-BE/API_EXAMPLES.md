# API Usage Examples

This file contains example requests for testing the SmartSearch Backend API.

## Base URL
```
http://localhost:5000
```

## 1. Health Check

**Request:**
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "SmartSearch Backend is running"
}
```

## 2. Upload Media (Create New Chat)

**Request:**
```bash
curl -X POST http://localhost:5000/chat/b2c/ \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/video1.mp4"
```

**Response:**
```json
{
  "chatId": "550e8400-e29b-41d4-a716-446655440000",
  "chatTitle": "Analysis of image1.jpg"
}
```

## 3. Add Media to Existing Chat

**Request:**
```bash
curl -X POST http://localhost:5000/chat/b2c/550e8400-e29b-41d4-a716-446655440000/media \
  -F "files=@/path/to/image2.jpg"
```

**Response:**
```json
{
  "chatId": "550e8400-e29b-41d4-a716-446655440000",
  "chatTitle": "Analysis of image1.jpg",
  "media": [
    {
      "mediaId": "660e8400-e29b-41d4-a716-446655440001",
      "name": "image2.jpg",
      "type": "image/jpeg",
      "size": 245678
    }
  ]
}
```

## 4. Get Chat Status

**Request:**
```bash
curl http://localhost:5000/chat/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "chatId": "550e8400-e29b-41d4-a716-446655440000",
  "chatTitle": "Analysis of image1.jpg",
  "status": "completed",
  "progress": 100,
  "media": [
    {
      "mediaId": "660e8400-e29b-41d4-a716-446655440001",
      "name": "image1.jpg",
      "type": "image/jpeg",
      "size": 123456
    }
  ]
}
```

## 5. Perform Search/Analysis

### Reasoning Mode
**Request:**
```bash
curl -X POST http://localhost:5000/search/b2c/ \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "550e8400-e29b-41d4-a716-446655440000",
    "query": "What objects are visible in this image?",
    "mode": "reasoning"
  }'
```

### Number Plate Recognition
**Request:**
```bash
curl -X POST http://localhost:5000/search/b2c/ \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "550e8400-e29b-41d4-a716-446655440000",
    "query": "Find all number plates",
    "mode": "npr"
  }'
```

### Invoice Analysis
**Request:**
```bash
curl -X POST http://localhost:5000/search/b2c/ \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "550e8400-e29b-41d4-a716-446655440000",
    "query": "Extract invoice details",
    "mode": "invoice"
  }'
```

### Compare Mode
**Request:**
```bash
curl -X POST http://localhost:5000/search/b2c/ \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "550e8400-e29b-41d4-a716-446655440000",
    "query": "Compare these images",
    "mode": "compare"
  }'
```

### Summarise Mode
**Request:**
```bash
curl -X POST http://localhost:5000/search/b2c/ \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "550e8400-e29b-41d4-a716-446655440000",
    "query": "Summarize the content",
    "mode": "summarise"
  }'
```

### Moment Retrieval
**Request:**
```bash
curl -X POST http://localhost:5000/search/b2c/ \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "550e8400-e29b-41d4-a716-446655440000",
    "query": "Find moments where a person is speaking",
    "mode": "momret"
  }'
```

**Response (all modes):**
```json
{
  "searchId": "770e8400-e29b-41d4-a716-446655440002",
  "chatId": "550e8400-e29b-41d4-a716-446655440000",
  "query": "What objects are visible in this image?",
  "mode": "reasoning",
  "timestamp": 1701234567890,
  "response": {
    "title": "Reasoning Analysis",
    "text": "Detailed analysis of the image content...",
    "references": [
      {
        "clipId": "clip_1",
        "parentFileName": "image1.jpg",
        "startTime": 0,
        "endTime": 0,
        "description": "Analysis of image1.jpg",
        "relevanceScore": 0.9
      }
    ]
  },
  "clips": [...]
}
```

## 6. Get All Chats (History)

**Request:**
```bash
curl http://localhost:5000/chat/
```

**Response:**
```json
[
  {
    "chatId": "550e8400-e29b-41d4-a716-446655440000",
    "chatTitle": "Analysis of image1.jpg",
    "chatType": "b2c",
    "createdAt": 1701234567890,
    "lastQueryTime": 1701234567890,
    "numImage": 2,
    "numVideo": 1,
    "sampleMedia": [
      {
        "name": "image1.jpg",
        "type": "image/jpeg"
      }
    ]
  }
]
```

## 7. Get All Searches for a Chat

**Request:**
```bash
curl http://localhost:5000/chat/550e8400-e29b-41d4-a716-446655440000/search
```

**Response:**
```json
[
  {
    "searchId": "770e8400-e29b-41d4-a716-446655440002",
    "query": "What objects are visible in this image?",
    "mode": "reasoning",
    "timestamp": 1701234567890,
    "response": {
      "title": "Reasoning Analysis",
      "text": "Detailed analysis...",
      "references": [...]
    }
  }
]
```

## 8. Get Specific Search Result

**Request:**
```bash
curl http://localhost:5000/search/770e8400-e29b-41d4-a716-446655440002
```

**Response:**
```json
{
  "searchId": "770e8400-e29b-41d4-a716-446655440002",
  "chatId": "550e8400-e29b-41d4-a716-446655440000",
  "query": "What objects are visible in this image?",
  "mode": "reasoning",
  "timestamp": 1701234567890,
  "response": {
    "title": "Reasoning Analysis",
    "text": "Detailed analysis of the image content...",
    "references": [...]
  }
}
```

## 9. Get All Media in a Chat

**Request:**
```bash
curl http://localhost:5000/chat/550e8400-e29b-41d4-a716-446655440000/media
```

**Response:**
```json
[
  {
    "mediaId": "660e8400-e29b-41d4-a716-446655440001",
    "name": "image1.jpg",
    "type": "image/jpeg",
    "size": 123456,
    "uploadedAt": 1701234567890
  }
]
```

## 10. Delete Media from Chat

**Request:**
```bash
curl -X DELETE http://localhost:5000/chat/b2c/550e8400-e29b-41d4-a716-446655440000/media/660e8400-e29b-41d4-a716-446655440001
```

**Response:**
```json
{
  "message": "Media deleted successfully"
}
```

## 11. Delete Chat

**Request:**
```bash
curl -X DELETE http://localhost:5000/chat/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "message": "Chat deleted successfully"
}
```

## Testing with Postman

1. Import these examples into Postman
2. Create a collection for SmartSearch API
3. Set base URL as environment variable
4. Test each endpoint sequentially

## Testing with JavaScript (Frontend)

```javascript
// Upload media
const formData = new FormData();
formData.append('files', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:5000/chat/b2c/', {
  method: 'POST',
  body: formData
});

const { chatId } = await uploadResponse.json();

// Perform search
const searchResponse = await fetch('http://localhost:5000/search/b2c/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chatId: chatId,
    query: 'Analyze this image',
    mode: 'reasoning'
  })
});

const searchResult = await searchResponse.json();
console.log(searchResult);
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Description of what went wrong"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (missing parameters)
- `404`: Resource not found
- `500`: Server error

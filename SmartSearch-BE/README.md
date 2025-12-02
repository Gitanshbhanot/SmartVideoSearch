# SmartSearch Backend

A powerful backend service for the SmartSearch application that leverages Google Gemini AI for intelligent media analysis and search capabilities.

## Features

- 🎥 **Media Upload & Management**: Support for images and videos (up to 500MB)
- 🤖 **AI-Powered Analysis**: Multiple analysis modes using Google Gemini AI
  - Reasoning: Detailed content analysis
  - Number Plate Recognition (NPR): Extract vehicle number plates
  - Invoice Analysis: Extract and analyze invoice data
  - Compare: Compare multiple media files
  - Summarise: Generate comprehensive summaries
  - Moment Retrieval: Find specific moments in videos
- 💾 **Session-Based Storage**: In-memory storage for current session (no database required)
- 🔍 **Smart Search**: Query your media with natural language
- 📊 **Chat History**: Track all your searches and analyses
- 🚀 **RESTful API**: Clean and well-documented API endpoints

## Prerequisites

- Node.js (v18 or higher)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation

1. **Clone or navigate to the backend directory**:
   ```bash
   cd SmartSearch-BE
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Edit the `.env` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`)

## API Endpoints

### Health Check
- **GET** `/health`
  - Check if the server is running

### Chat Management

- **POST** `/chat/b2c/`
  - Create a new chat with media upload
  - Body: FormData with `files` field

- **POST** `/chat/b2c/:chatId/media`
  - Add media to an existing chat
  - Body: FormData with `files` field

- **GET** `/chat/:chatId`
  - Get chat details and status

- **GET** `/chat/`
  - Get all chats (history)

- **DELETE** `/chat/:chatId`
  - Delete a chat and all associated data

### Media Management

- **GET** `/chat/:chatId/media`
  - Get all media files in a chat

- **DELETE** `/chat/b2c/:chatId/media/:mediaId`
  - Delete a specific media file from a chat

### Search & Analysis

- **POST** `/search/b2c/`
  - Perform AI-powered search/analysis
  - Body: 
    ```json
    {
      "chatId": "uuid",
      "query": "your search query",
      "mode": "reasoning|npr|invoice|compare|summarise|momret"
    }
    ```

- **GET** `/chat/:chatId/search`
  - Get all searches for a specific chat

- **GET** `/search/:searchId`
  - Get details of a specific search result

## Analysis Modes

1. **reasoning**: Deep analysis with detailed reasoning
2. **npr**: Number Plate Recognition - Extract vehicle plates
3. **invoice**: Invoice data extraction and analysis
4. **compare**: Compare multiple media files
5. **summarise**: Generate comprehensive summaries
6. **momret**: Moment retrieval - Find specific moments in videos

## File Upload Limits

- Maximum file size: 500MB per file
- Supported formats:
  - Images: PNG, JPG, JPEG
  - Videos: MP4, MOV
- Maximum videos: 5 per chat
- Maximum images: 50 per chat

## Architecture

```
SmartSearch-BE/
├── server.js           # Main Express server
├── geminiService.js    # Gemini AI integration
├── package.json        # Dependencies
├── .env               # Environment variables
└── README.md          # Documentation
```

## Data Storage

This backend uses **in-memory storage** for the current session:
- All data is stored in RAM
- Data persists only while the server is running
- Restarting the server clears all data
- No database setup required

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (missing parameters, invalid data)
- `404`: Resource not found
- `500`: Server error

Error responses include a descriptive message:
```json
{
  "error": "Description of the error"
}
```

## CORS

CORS is enabled for all origins in development. For production, configure CORS in `server.js` to allow only your frontend domain.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Troubleshooting

### Server won't start
- Check if the port is already in use
- Verify Node.js version (v18+)
- Ensure all dependencies are installed

### Gemini API errors
- Verify your API key is correct
- Check your API quota/limits
- Ensure you have internet connectivity

### File upload fails
- Check file size (max 500MB)
- Verify file format is supported
- Ensure sufficient disk space for temp files

## Development

To modify the AI analysis behavior, edit `geminiService.js`:
- Adjust prompts for different modes
- Modify reference extraction logic
- Add new analysis modes

## License

ISC

## Support

For issues or questions, please check the frontend documentation or create an issue in the project repository.

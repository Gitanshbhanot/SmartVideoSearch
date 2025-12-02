# SmartSearch Backend - Project Summary

## 📁 Project Structure

```
SmartSearch-BE/
├── server.js              # Main Express server with all API endpoints
├── geminiService.js       # Google Gemini AI integration service
├── package.json           # Project dependencies and scripts
├── .env                   # Environment variables (add your API key here!)
├── .gitignore            # Git ignore rules
├── README.md             # Complete documentation
├── QUICKSTART.md         # Quick start guide
├── API_EXAMPLES.md       # API usage examples
├── test-setup.js         # Setup verification script
└── node_modules/         # Dependencies (auto-generated)
```

## 🎯 What's Been Created

### 1. **Express Server** (`server.js`)
A complete REST API with the following endpoints:

**Chat Management:**
- `POST /chat/b2c/` - Create new chat with media
- `POST /chat/b2c/:chatId/media` - Add media to existing chat
- `GET /chat/:chatId` - Get chat status
- `GET /chat/` - Get all chats (history)
- `DELETE /chat/:chatId` - Delete chat

**Media Management:**
- `GET /chat/:chatId/media` - Get all media in chat
- `DELETE /chat/b2c/:chatId/media/:mediaId` - Delete specific media

**Search & Analysis:**
- `POST /search/b2c/` - Perform AI search/analysis
- `GET /chat/:chatId/search` - Get all searches for chat
- `GET /search/:searchId` - Get specific search result

### 2. **Gemini AI Service** (`geminiService.js`)
Intelligent media analysis with 6 modes:

1. **Reasoning** - Deep content analysis
2. **NPR** - Number plate recognition
3. **Invoice** - Invoice data extraction
4. **Compare** - Multi-media comparison
5. **Summarise** - Content summarization
6. **Moment Retrieval** - Find specific video moments

### 3. **Session-Based Storage**
- In-memory data storage (no database needed)
- Stores chats, media, and searches
- Data persists during server session
- Clears on server restart

### 4. **File Upload Handling**
- Supports images (PNG, JPG, JPEG)
- Supports videos (MP4, MOV)
- Max file size: 500MB
- Max 5 videos, 50 images per chat

## 🚀 How to Use

### Quick Start
```bash
# 1. Add your Gemini API key to .env
# 2. Install dependencies
npm install

# 3. Test setup (optional)
node test-setup.js

# 4. Start server
npm run dev
```

### Frontend Integration
Update your frontend `.env.development.local`:
```env
VITE_BASE_URL=http://localhost:5000
```

## 🔑 Key Features

✅ **No Database Required** - Uses in-memory storage  
✅ **AI-Powered** - Google Gemini 2.0 Flash integration  
✅ **Multiple Analysis Modes** - 6 different AI modes  
✅ **File Upload Support** - Images and videos up to 500MB  
✅ **Session History** - Tracks all searches and chats  
✅ **RESTful API** - Clean, well-documented endpoints  
✅ **CORS Enabled** - Works with your frontend  
✅ **Error Handling** - Comprehensive error responses  

## 📊 Data Flow

```
Frontend Upload → Express Server → Store in Memory
                                 ↓
                          Gemini AI Analysis
                                 ↓
                          Return Results → Frontend
```

## 🔧 Configuration

### Environment Variables (.env)
```env
GEMINI_API_KEY=your_key_here    # Required
PORT=5000                        # Optional (default: 5000)
NODE_ENV=development            # Optional
```

## 📝 API Response Format

### Success Response
```json
{
  "chatId": "uuid",
  "searchId": "uuid",
  "response": {
    "title": "Analysis Title",
    "text": "Detailed analysis...",
    "references": [...]
  }
}
```

### Error Response
```json
{
  "error": "Error description"
}
```

## 🎨 Frontend Compatibility

This backend is fully compatible with your SmartSearch frontend:

- ✅ Matches all expected API endpoints
- ✅ Returns data in expected format
- ✅ Supports all frontend features
- ✅ Handles file uploads correctly
- ✅ Provides session-based history

## 🔒 Security Notes

- API key stored in `.env` (not committed to git)
- CORS enabled for development
- File size limits enforced
- Input validation on all endpoints

## 📈 Performance

- Fast in-memory storage
- Efficient file handling
- Async/await for non-blocking operations
- Temporary file cleanup

## 🛠️ Development

### Available Scripts
```bash
npm start       # Production mode
npm run dev     # Development mode (auto-reload)
```

### Testing
```bash
node test-setup.js              # Verify setup
curl http://localhost:5000/health  # Test server
```

## 📚 Documentation

- **README.md** - Complete documentation
- **QUICKSTART.md** - 5-minute setup guide
- **API_EXAMPLES.md** - Detailed API examples with curl commands

## 🎯 Next Steps

1. **Add your Gemini API key** to `.env`
2. **Run the test script** to verify setup
3. **Start the server** with `npm run dev`
4. **Test with curl** or your frontend
5. **Start building!** 🚀

## 💡 Tips

- Keep the server running while using the frontend
- Check server logs for debugging
- Use `npm run dev` for development (auto-reload)
- Session data clears on restart (by design)

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| API key error | Add valid key to `.env` |
| Port in use | Change PORT in `.env` |
| Upload fails | Check file size/format |
| CORS error | Verify frontend URL |

## 🎉 You're All Set!

Your SmartSearch backend is ready to:
- Accept media uploads from your frontend
- Analyze content with AI
- Perform intelligent searches
- Track session history

**Start the server and enjoy your AI-powered SmartSearch! 🔍✨**

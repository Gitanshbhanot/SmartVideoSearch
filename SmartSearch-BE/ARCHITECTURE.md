# SmartSearch Backend Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SmartSearch Frontend                      │
│                     (React + Vite + Axios)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                     Express.js Server                            │
│                      (server.js)                                 │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              API Endpoints                               │   │
│  │  • POST /chat/b2c/                                       │   │
│  │  • POST /chat/b2c/:chatId/media                         │   │
│  │  • GET  /chat/:chatId                                   │   │
│  │  • GET  /chat/                                          │   │
│  │  • POST /search/b2c/                                    │   │
│  │  • GET  /search/:searchId                               │   │
│  │  • DELETE /chat/:chatId                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Middleware                                  │   │
│  │  • CORS                                                  │   │
│  │  • JSON Parser                                           │   │
│  │  • File Upload (express-fileupload)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
┌──────────────────┐            ┌──────────────────────┐
│  Gemini Service  │            │  Session Storage     │
│ (geminiService.js)│            │  (In-Memory)         │
│                  │            │                      │
│ • analyzeMedia   │            │ • chats: Map()       │
│ • generateTitle  │            │ • searches: Map()    │
│ • extractRefs    │            │ • media: Map()       │
└────────┬─────────┘            └──────────────────────┘
         │
         │ API Call
         │
         ▼
┌─────────────────────┐
│  Google Gemini AI   │
│  (gemini-2.0-flash) │
│                     │
│ • Image Analysis    │
│ • Video Analysis    │
│ • NPR               │
│ • Invoice Extract   │
│ • Comparison        │
│ • Summarization     │
└─────────────────────┘
```

## Data Flow

### 1. Media Upload Flow
```
Frontend                Server                  Storage
   │                      │                        │
   │──── Upload Files ───▶│                        │
   │                      │                        │
   │                      │──── Store Media ──────▶│
   │                      │                        │
   │                      │◀─── Media IDs ─────────│
   │                      │                        │
   │◀─── Chat ID ─────────│                        │
   │                      │                        │
```

### 2. Search/Analysis Flow
```
Frontend          Server          Gemini AI        Storage
   │                │                  │              │
   │── Search ─────▶│                  │              │
   │                │                  │              │
   │                │─── Get Media ───▶│              │
   │                │                  │              │
   │                │─── Analyze ─────▶│              │
   │                │                  │              │
   │                │◀── Results ──────│              │
   │                │                  │              │
   │                │──── Store ──────────────────────▶│
   │                │                  │              │
   │◀── Response ───│                  │              │
   │                │                  │              │
```

### 3. History Retrieval Flow
```
Frontend          Server          Storage
   │                │                │
   │── Get History ▶│                │
   │                │                │
   │                │─── Query ─────▶│
   │                │                │
   │                │◀── Chats ──────│
   │                │                │
   │◀── History ────│                │
   │                │                │
```

## Component Breakdown

### Server.js (Main Application)
```javascript
┌─────────────────────────────────┐
│         Express App             │
├─────────────────────────────────┤
│ • Middleware Setup              │
│ • Route Handlers                │
│ • Session Storage Management    │
│ • Error Handling                │
│ • Server Initialization         │
└─────────────────────────────────┘
```

### geminiService.js (AI Integration)
```javascript
┌─────────────────────────────────┐
│      Gemini AI Service          │
├─────────────────────────────────┤
│ • analyzeMediaWithGemini()      │
│   - Mode-specific prompts       │
│   - File preparation            │
│   - Response parsing            │
│                                 │
│ • extractReferences()           │
│   - Timestamp extraction        │
│   - Clip generation             │
│                                 │
│ • generateChatTitle()           │
│   - Title creation              │
└─────────────────────────────────┘
```

## Storage Structure

### In-Memory Maps
```javascript
sessionData = {
  chats: Map {
    chatId → {
      chatId: string,
      chatTitle: string,
      chatType: string,
      createdAt: timestamp,
      lastQueryTime: timestamp,
      media: Array[mediaObjects],
      searches: Array[searchIds],
      status: string
    }
  },
  
  searches: Map {
    searchId → {
      searchId: string,
      chatId: string,
      query: string,
      mode: string,
      timestamp: number,
      response: {
        title: string,
        text: string,
        references: Array
      }
    }
  },
  
  media: Map {
    mediaId → {
      mediaId: string,
      chatId: string,
      name: string,
      type: string,
      size: number,
      buffer: Buffer,
      uploadedAt: timestamp
    }
  }
}
```

## Analysis Modes

```
┌──────────────────────────────────────────────────────┐
│                  Analysis Modes                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  1. Reasoning    → Deep content analysis             │
│  2. NPR          → Number plate recognition          │
│  3. Invoice      → Invoice data extraction           │
│  4. Compare      → Multi-media comparison            │
│  5. Summarise    → Content summarization             │
│  6. MomRet       → Moment retrieval from videos      │
│                                                       │
└──────────────────────────────────────────────────────┘
```

## Request/Response Cycle

```
┌─────────────────────────────────────────────────────┐
│                  Client Request                      │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              CORS Middleware                         │
│         (Allow cross-origin requests)                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│           JSON/File Upload Parser                    │
│         (Parse request body/files)                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Route Handler                           │
│         (Process request logic)                      │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│   Storage    │          │  Gemini AI   │
│  Operations  │          │   Service    │
└──────┬───────┘          └──────┬───────┘
       │                         │
       └────────────┬────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│              JSON Response                           │
│         (Send result to client)                      │
└─────────────────────────────────────────────────────┘
```

## File Upload Process

```
┌─────────────────────────────────────────────────────┐
│  1. Client sends FormData with files                 │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  2. express-fileupload middleware                    │
│     • Saves to /tmp/                                 │
│     • Validates size (max 500MB)                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  3. Server processes files                           │
│     • Generate unique mediaId                        │
│     • Read file buffer                               │
│     • Store in memory                                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  4. Cleanup temp files                               │
│     • Remove from /tmp/                              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  5. Return media metadata to client                  │
└─────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────┐
│              Request Received                        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ Try Block    │
              └──────┬───────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   ┌─────────┐            ┌──────────────┐
   │ Success │            │ Error Occurs │
   └────┬────┘            └──────┬───────┘
        │                        │
        │                        ▼
        │              ┌──────────────────┐
        │              │  Catch Block     │
        │              │  • Log error     │
        │              │  • Format error  │
        │              └────────┬─────────┘
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│           Return Response                            │
│  Success: { data }                                   │
│  Error:   { error: "message" }                       │
└─────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Implementation (Session-Based)
```
Pros:
✓ No database setup required
✓ Fast read/write operations
✓ Simple deployment
✓ Perfect for development/testing

Cons:
✗ Data lost on restart
✗ Limited by RAM
✗ Single server only
```

### Future Enhancements (Optional)
```
For Production:
• Add MongoDB/PostgreSQL for persistence
• Implement Redis for caching
• Add file storage (S3/Cloud Storage)
• Implement user authentication
• Add rate limiting
• Enable clustering for scalability
```

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│  1. Environment Variables (.env)                     │
│     • API keys not in code                           │
│     • Gitignored                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  2. File Upload Validation                           │
│     • Size limits (500MB)                            │
│     • Type validation                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  3. Input Validation                                 │
│     • Required fields check                          │
│     • Data type validation                           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  4. Error Handling                                   │
│     • No sensitive data in errors                    │
│     • Proper status codes                            │
└─────────────────────────────────────────────────────┘
```

This architecture provides a solid foundation for your SmartSearch application with room for future enhancements!

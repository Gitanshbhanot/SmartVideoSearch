import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { readFile } from 'fs/promises';
import { analyzeMediaWithGemini, generateChatTitle } from './geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max file size
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// In-memory storage for session data
const sessionData = {
  chats: new Map(),      // chatId -> chat object
  searches: new Map(),   // searchId -> search object
  media: new Map()       // mediaId -> media object
};

// Helper function to get media count by type
function getMediaCounts(chatId) {
  const chat = sessionData.chats.get(chatId);
  if (!chat) return { numImage: 0, numVideo: 0 };
  
  let numImage = 0;
  let numVideo = 0;
  
  chat.media.forEach(media => {
    if (media.type.startsWith('image/')) numImage++;
    if (media.type.startsWith('video/')) numVideo++;
  });
  
  return { numImage, numVideo };
}

// Helper function to get sample media
function getSampleMedia(chatId, limit = 3) {
  const chat = sessionData.chats.get(chatId);
  if (!chat) return [];
  
  return chat.media.slice(0, limit).map(m => ({
    name: m.name,
    type: m.type
  }));
}

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartSearch Backend is running' });
});

// Create new chat or add media to existing chat
app.post('/chat/b2c/:chatId?/media', async (req, res) => {
  try {
    const existingChatId = req.params.chatId;
    let chatId = existingChatId || uuidv4();
    
    if (!req.files || !req.files.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Handle single or multiple files
    const files = Array.isArray(req.files.files) 
      ? req.files.files 
      : [req.files.files];

    // Get or create chat
    let chat;
    if (existingChatId && sessionData.chats.has(existingChatId)) {
      chat = sessionData.chats.get(existingChatId);
    } else {
      chat = {
        chatId,
        chatTitle: generateChatTitle(files.map(f => ({ name: f.name })), ''),
        chatType: 'b2c',
        createdAt: Date.now(),
        lastQueryTime: Date.now(),
        media: [],
        searches: [],
        status: 'processing'
      };
      sessionData.chats.set(chatId, chat);
    }

    // Process and store media files
    const mediaObjects = await Promise.all(files.map(async (file) => {
      const mediaId = uuidv4();
      
      // Read file data from temp file if useTempFiles is enabled
      let buffer;
      if (file.tempFilePath) {
        buffer = await readFile(file.tempFilePath);
      } else {
        buffer = file.data;
      }
      
      const mediaObj = {
        mediaId,
        chatId,
        name: file.name,
        type: file.mimetype,
        size: file.size,
        buffer: buffer,
        uploadedAt: Date.now()
      };
      
      sessionData.media.set(mediaId, mediaObj);
      chat.media.push(mediaObj);
      
      return {
        mediaId,
        name: file.name,
        type: file.mimetype,
        size: file.size,
        link: `${req.protocol}://${req.get('host')}/media/${mediaId}`
      };
    }));

    // Update chat status
    chat.status = 'completed';
    chat.lastQueryTime = Date.now();

    res.json({
      chatId,
      chatTitle: chat.chatTitle,
      media: mediaObjects
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new chat without media (alternative endpoint)
app.post('/chat/b2c/', async (req, res) => {
  try {
    if (!req.files || !req.files.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Handle single or multiple files
    const files = Array.isArray(req.files.files) 
      ? req.files.files 
      : [req.files.files];

    const chatId = uuidv4();
    const chat = {
      chatId,
      chatTitle: generateChatTitle(files.map(f => ({ name: f.name })), ''),
      chatType: 'b2c',
      createdAt: Date.now(),
      lastQueryTime: Date.now(),
      media: [],
      searches: [],
      status: 'processing'
    };

    // Process and store media files
    for (const file of files) {
      const mediaId = uuidv4();
      
      // Read file data from temp file if useTempFiles is enabled
      let buffer;
      if (file.tempFilePath) {
        buffer = await readFile(file.tempFilePath);
      } else {
        buffer = file.data;
      }
      
      const mediaObj = {
        mediaId,
        chatId,
        name: file.name,
        type: file.mimetype,
        size: file.size,
        buffer: buffer,
        uploadedAt: Date.now()
      };
      
      sessionData.media.set(mediaId, mediaObj);
      chat.media.push(mediaObj);
    }

    chat.status = 'completed';
    sessionData.chats.set(chatId, chat);

    res.json({
      chatId,
      chatTitle: chat.chatTitle
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get chat status
app.get('/chat/:chatId', (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = sessionData.chats.get(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const media = chat.media.map(m => ({
      mediaId: m.mediaId,
      name: m.name,
      type: m.type,
      size: m.size,
      link: `${req.protocol}://${req.get('host')}/media/${m.mediaId}`
    }));

    res.json({
      chatId: chat.chatId,
      chatTitle: chat.chatTitle,
      status: chat.status,
      progress: 100,
      media
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all media for a chat
app.get('/chat/:chatId/media', (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = sessionData.chats.get(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const media = chat.media.map(m => ({
      mediaId: m.mediaId,
      name: m.name,
      type: m.type,
      size: m.size,
      uploadedAt: m.uploadedAt,
      link: `${req.protocol}://${req.get('host')}/media/${m.mediaId}`
    }));

    res.json(media);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a chat
app.delete('/chat/:chatId', (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = sessionData.chats.get(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Delete associated media
    chat.media.forEach(media => {
      sessionData.media.delete(media.mediaId);
    });

    // Delete associated searches
    chat.searches.forEach(searchId => {
      sessionData.searches.delete(searchId);
    });

    // Delete chat
    sessionData.chats.delete(chatId);

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete media from a chat
app.delete('/chat/b2c/:chatId/media/:mediaId', (req, res) => {
  try {
    const { chatId, mediaId } = req.params;
    const chat = sessionData.chats.get(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Remove media from chat
    chat.media = chat.media.filter(m => m.mediaId !== mediaId);
    
    // Delete media from storage
    sessionData.media.delete(mediaId);

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve media file
app.get('/media/:mediaId', (req, res) => {
  try {
    const { mediaId } = req.params;
    const media = sessionData.media.get(mediaId);
    
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Set appropriate content type
    res.setHeader('Content-Type', media.type);
    res.setHeader('Content-Length', media.buffer.length);
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Send the buffer
    res.send(media.buffer);
  } catch (error) {
    console.error('Serve media error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Perform search/analysis
app.post('/search/b2c/', async (req, res) => {
  try {
    const { chatId, query, mode } = req.body;
    
    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    const chat = sessionData.chats.get(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.media || chat.media.length === 0) {
      return res.status(400).json({ error: 'No media found in chat' });
    }

    // Prepare files for Gemini
    const files = chat.media.map(m => ({
      name: m.name,
      mimeType: m.type,
      buffer: m.buffer
    }));

    // Log file info for debugging
    console.log(`Processing ${files.length} files for chat ${chatId}`);
    files.forEach(f => {
      console.log(`  - ${f.name}: ${f.mimeType}, buffer size: ${f.buffer ? f.buffer.length : 0} bytes`);
    });

    // Analyze with Gemini
    const analysis = await analyzeMediaWithGemini(files, query, mode || 'reasoning');

    // Add links to references (clips)
    const referencesWithLinks = analysis.references.map(ref => {
      const mediaItem = chat.media.find(m => m.name === ref.parentFileName);
      return {
        ...ref,
        link: mediaItem ? `${req.protocol}://${req.get('host')}/media/${mediaItem.mediaId}` : null,
        type: mediaItem ? mediaItem.type : null
      };
    });

    // Create search record
    const searchId = uuidv4();
    const search = {
      searchId,
      chatId,
      query,
      mode: mode || 'reasoning',
      timestamp: Date.now(),
      response: {
        title: analysis.title,
        text: analysis.text,
        references: referencesWithLinks
      }
    };

    sessionData.searches.set(searchId, search);
    chat.searches.push(searchId);
    chat.lastQueryTime = Date.now();

    res.json({
      searchId,
      chatId,
      query,
      mode: mode || 'reasoning',
      timestamp: search.timestamp,
      response: search.response,
      clips: referencesWithLinks
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all chats (history)
app.get('/chat/', (req, res) => {
  try {
    const chats = Array.from(sessionData.chats.values())
      .map(chat => {
        const counts = getMediaCounts(chat.chatId);
        return {
          chatId: chat.chatId,
          chatTitle: chat.chatTitle,
          chatType: chat.chatType,
          createdAt: chat.createdAt,
          lastQueryTime: chat.lastQueryTime,
          numImage: counts.numImage,
          numVideo: counts.numVideo,
          sampleMedia: getSampleMedia(chat.chatId)
        };
      })
      .sort((a, b) => b.lastQueryTime - a.lastQueryTime);

    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all searches for a chat
app.get('/chat/:chatId/search', (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = sessionData.chats.get(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const searches = chat.searches
      .map(searchId => sessionData.searches.get(searchId))
      .filter(s => s !== undefined)
      .map(s => ({
        searchId: s.searchId,
        query: s.query,
        mode: s.mode,
        timestamp: s.timestamp,
        response: s.response
      }));

    res.json(searches);
  } catch (error) {
    console.error('Get searches error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific search result
app.get('/search/:searchId', (req, res) => {
  try {
    const { searchId } = req.params;
    const search = sessionData.searches.get(searchId);
    
    if (!search) {
      return res.status(404).json({ error: 'Search not found' });
    }

    res.json({
      searchId: search.searchId,
      chatId: search.chatId,
      query: search.query,
      mode: search.mode,
      timestamp: search.timestamp,
      response: search.response
    });
  } catch (error) {
    console.error('Get search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartSearch Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
});

export default app;

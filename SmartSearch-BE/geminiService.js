import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze media files using Gemini AI
 * @param {Array} files - Array of file objects with buffer and mimeType
 * @param {String} query - User query
 * @param {String} mode - Search mode (reasoning, npr, invoice, compare, summarise, momret)
 * @returns {Object} - Analysis results
 */
export async function analyzeMediaWithGemini(files, query, mode) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Validate files have buffers
    const validFiles = files.filter(file => {
      if (!file.buffer || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
        console.warn(`Skipping file ${file.name}: Invalid or empty buffer`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      throw new Error('No valid files with data to analyze');
    }

    // Prepare file parts for Gemini
    const fileParts = validFiles.map(file => ({
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimeType
      }
    }));

    // Create mode-specific prompts
    const modePrompts = {
      reasoning: `Analyze the provided media files and answer the following query with detailed reasoning: "${query}". 
        Provide a comprehensive analysis with specific references to moments in the videos or details in the images.`,
      
      npr: `Identify and extract all number plates visible in the provided media files. 
        For each number plate found, provide:
        - The number plate text
        - The timestamp (for videos) or image name where it appears
        - Confidence level
        - Vehicle description if visible
        Query context: "${query}"`,
      
      invoice: `Extract and analyze invoice data from the provided media files.
        Extract:
        - Invoice number
        - Date
        - Vendor/Company name
        - Line items with descriptions and amounts
        - Total amount
        - Any other relevant invoice details
        Query context: "${query}"`,
      
      compare: `Compare the provided media files and provide a detailed comparison.
        Highlight:
        - Similarities between the files
        - Differences between the files
        - Key observations
        - Specific timestamps or locations where differences occur
        Query context: "${query}"`,
      
      summarise: `Provide a comprehensive summary of the content in the provided media files.
        Include:
        - Main topics or subjects
        - Key events or moments (with timestamps for videos)
        - Important visual elements
        - Overall context and themes
        Query context: "${query}"`,
      
      momret: `Retrieve and describe specific moments from the provided media files based on the query: "${query}".
        For each relevant moment, provide:
        - Timestamp (for videos) or image identifier
        - Detailed description of what's happening
        - Why this moment is relevant to the query
        - Any notable details or context`
    };

    const prompt = modePrompts[mode] || modePrompts.reasoning;

    // Generate content
    const result = await model.generateContent([prompt, ...fileParts]);
    const response = result.response;
    const text = response.text();

    // Parse response and extract references (timestamps/moments)
    const references = extractReferences(text, validFiles);

    return {
      success: true,
      title: generateTitle(query, mode),
      text: text,
      references: references,
      mode: mode
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to analyze media: ${error.message}`);
  }
}

/**
 * Generate a summary title for the search
 */
function generateTitle(query, mode) {
  const modeTitles = {
    reasoning: 'Reasoning Analysis',
    npr: 'Number Plate Recognition',
    invoice: 'Invoice Analysis',
    compare: 'Media Comparison',
    summarise: 'Content Summary',
    momret: 'Moment Retrieval'
  };
  
  return query || modeTitles[mode] || 'Media Analysis';
}

/**
 * Extract references (clips/moments) from the AI response
 * This is a simplified version - you may want to enhance this based on your needs
 */
function extractReferences(text, files) {
  const references = [];
  
  // Try to extract timestamp references from the text
  const timestampRegex = /(\d+):(\d+)(?::(\d+))?/g;
  const matches = [...text.matchAll(timestampRegex)];
  
  if (matches.length > 0) {
    matches.forEach((match, index) => {
      const hours = match[3] ? parseInt(match[1]) : 0;
      const minutes = match[3] ? parseInt(match[2]) : parseInt(match[1]);
      const seconds = match[3] ? parseInt(match[3]) : parseInt(match[2]);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      // Find the video file this timestamp might belong to
      const videoFile = files.find(f => f.mimeType.startsWith('video/'));
      
      if (videoFile) {
        references.push({
          clipId: `clip_${index + 1}`,
          parentFileName: videoFile.name,
          startTime: Math.max(0, totalSeconds - 5),
          endTime: totalSeconds + 5,
          timestamp: match[0],
          description: extractContextAroundMatch(text, match.index),
          relevanceScore: 0.9 - (index * 0.1)
        });
      }
    });
  } else {
    // If no timestamps found, create references for each file
    files.forEach((file, index) => {
      references.push({
        clipId: `clip_${index + 1}`,
        parentFileName: file.name,
        startTime: 0,
        endTime: file.mimeType.startsWith('video/') ? 10 : 0,
        description: `Analysis of ${file.name}`,
        relevanceScore: 0.9 - (index * 0.1)
      });
    });
  }
  
  return references;
}

/**
 * Extract context around a timestamp mention
 */
function extractContextAroundMatch(text, matchIndex, contextLength = 100) {
  const start = Math.max(0, matchIndex - contextLength);
  const end = Math.min(text.length, matchIndex + contextLength);
  return text.substring(start, end).trim();
}

/**
 * Generate chat title from first file or query
 */
export function generateChatTitle(files, query) {
  if (query && query.length > 0) {
    return query.substring(0, 50);
  }
  if (files && files.length > 0) {
    const firstFile = files[0].name;
    return `Analysis of ${firstFile}`;
  }
  return `Chat ${new Date().toLocaleDateString()}`;
}

#!/usr/bin/env node

/**
 * Test script to verify SmartSearch Backend setup
 */

import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

console.log('🔍 SmartSearch Backend - Setup Verification\n');

// Check Node version
const nodeVersion = process.version;
console.log(`✓ Node.js version: ${nodeVersion}`);

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log(`  PORT: ${process.env.PORT || '5000 (default)'}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development (default)'}`);

// Check Gemini API Key
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.log('  ✗ GEMINI_API_KEY: Not configured');
  console.log('\n⚠️  WARNING: Please add your Gemini API key to the .env file');
  console.log('   Get your API key from: https://makersuite.google.com/app/apikey\n');
  process.exit(1);
} else {
  console.log(`  ✓ GEMINI_API_KEY: Configured (${process.env.GEMINI_API_KEY.substring(0, 10)}...)`);
}

// Test Gemini API connection
console.log('\n🤖 Testing Gemini API connection...');
try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const result = await model.generateContent('Hello! Please respond with "API connection successful"');
  const response = await result.response;
  const text = response.text();
  
  console.log('  ✓ Gemini API connection successful');
  console.log(`  Response: ${text.substring(0, 50)}...`);
} catch (error) {
  console.log('  ✗ Gemini API connection failed');
  console.log(`  Error: ${error.message}`);
  console.log('\n⚠️  Please check your API key and internet connection\n');
  process.exit(1);
}

console.log('\n✅ All checks passed! Your backend is ready to run.');
console.log('\nStart the server with:');
console.log('  npm run dev    (development mode with auto-reload)');
console.log('  npm start      (production mode)\n');

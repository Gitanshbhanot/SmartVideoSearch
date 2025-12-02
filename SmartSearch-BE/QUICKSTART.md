# SmartSearch Backend - Quick Start Guide

Get your SmartSearch backend up and running in 5 minutes!

## Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Step 2: Configure Environment

Open the `.env` file and replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
PORT=5000
NODE_ENV=development
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Test Your Setup (Optional but Recommended)

```bash
node test-setup.js
```

You should see:
```
✓ Node.js version: v18.x.x
✓ GEMINI_API_KEY: Configured
✓ Gemini API connection successful
✅ All checks passed!
```

## Step 5: Start the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

You should see:
```
🚀 SmartSearch Backend running on port 5000
📊 Environment: development
🔑 Gemini API Key: Configured ✓
```

## Step 6: Test the API

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "SmartSearch Backend is running"
}
```

## Step 7: Connect Your Frontend

Update your frontend `.env.development.local` file:

```env
VITE_BASE_URL=http://localhost:5000
```

## That's It! 🎉

Your backend is now ready to:
- ✅ Accept media uploads
- ✅ Analyze images and videos with AI
- ✅ Perform intelligent searches
- ✅ Track chat history

## Next Steps

- Check out `API_EXAMPLES.md` for detailed API usage
- Read `README.md` for complete documentation
- Start your frontend and begin uploading media!

## Troubleshooting

### "GEMINI_API_KEY: Not configured"
- Make sure you've added your API key to `.env`
- Don't use quotes around the API key
- Restart the server after updating `.env`

### "Port 5000 already in use"
- Change the PORT in `.env` to another number (e.g., 5001)
- Or stop the process using port 5000

### "Cannot find module"
- Run `npm install` again
- Make sure you're in the SmartSearch-BE directory

### API connection fails
- Check your internet connection
- Verify your API key is valid
- Check if you've exceeded API quota

## Need Help?

- Check the logs in your terminal
- Review `README.md` for detailed documentation
- Ensure all dependencies are installed correctly

---

**Happy Searching! 🔍**

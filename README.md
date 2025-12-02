# SmartSearch 🔍

SmartSearch is a powerful, AI-driven media analysis tool that leverages Google's **Gemini 2.0 Flash** model to provide deep insights into video and image content. It allows users to upload media files and perform complex natural language searches, reasoning tasks, and specific content extraction like number plate recognition or invoice parsing.

![SmartSearch Demo](https://via.placeholder.com/800x400?text=SmartSearch+Dashboard+Preview)

## 🚀 Features

*   **Multimodal Analysis**: Seamlessly handle and analyze both video (MP4, MOV) and image (JPG, PNG) formats.
*   **Intelligent Search**: Ask natural language questions about your media content (e.g., "Find the moment the red car turns left").
*   **Specialized Analysis Modes**:
    *   🧠 **Reasoning**: General detailed analysis and question answering.
    *   🚗 **NPR (Number Plate Recognition)**: Extract vehicle number plates with timestamps.
    *   📄 **Invoice Analysis**: Parse invoice details like dates, amounts, and vendors.
    *   ⚖️ **Compare**: Highlight similarities and differences between multiple files.
    *   📝 **Summarise**: Generate comprehensive summaries of video or image content.
    *   ⏱️ **Moment Retrieval**: Find specific timestamps for events described in your query.
*   **Interactive Media Player**: Built-in video player with clip navigation based on search results.
*   **Session Management**: Organize your analysis into chat sessions with history support.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS, Material UI (@mui/material)
*   **Animations**: Framer Motion
*   **HTTP Client**: Axios
*   **Icons**: HugeIcons

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **AI Engine**: Google Generative AI SDK (Gemini 2.0 Flash Exp)
*   **File Handling**: Express FileUpload (with temp file streaming)

## 📋 Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Gitanshbhanot/SmartVideoSearch.git
cd SmartSearch
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd SmartSearch-BE
npm install
```

Create a `.env` file in the `SmartSearch-BE` directory:
```env
PORT=8000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Start the backend server:
```bash
npm run dev
```
The server will run on `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd SmartSearch-FE
npm install
```

Create a `.env.development.local` (or `.env`) file in the `SmartSearch-FE` directory:
```env
VITE_BASE_URL=http://localhost:8000
```

Start the frontend development server:
```bash
npm start
```
The application will open at `http://localhost:3000` (or similar).

## 📖 Usage

1.  **Upload Media**: Drag and drop video or image files into the upload area.
2.  **Select Mode**: Choose an analysis mode (Reasoning, NPR, Invoice, etc.) from the cards.
3.  **Ask a Question**: Type your query into the search bar (e.g., "What is the total amount in this invoice?" or "Show me when the person enters the room").
4.  **View Results**:
    *   Read the AI-generated analysis.
    *   Click on generated **Clips** to jump directly to the relevant part of the video.
    *   Review your search history in the sidebar.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

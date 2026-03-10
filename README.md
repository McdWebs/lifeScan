# LifeScan — Life Event Checklist Generator

A web app that helps people navigate life's biggest moments with personalized, actionable checklists.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Set up environment variables
Edit `.env` in the project root:
```
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb://localhost:27017/life-checklist
JWT_SECRET=your_jwt_secret_here
PORT=3001
```

### 2. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Start the server
```bash
cd server && npm start
```

### 4. Start the client
```bash
cd client && npm run dev
```

Open http://localhost:5173 in your browser.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **AI**: OpenAI API (gpt-4o-mini)

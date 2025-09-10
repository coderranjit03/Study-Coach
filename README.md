# Study Coach Application

A full-stack study planning application with AI-powered study plan generation, quizzes, and code games.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd study-coach
```

#### 2. Backend Setup
```bash
cd BackEnd
pip install -r requirements.txt
python app.py
```
Backend will run on: http://localhost:5000

#### 3. Frontend Setup
```bash
cd FrontEnd
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

## 📁 Project Structure

```
study-coach/
├── BackEnd/                 # Flask API
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── DB/                # Database configuration
│   └── ai/                # AI/ML modules
├── FrontEnd/               # React application
│   ├── src/               # Source code
│   ├── package.json       # Node.js dependencies
│   └── requirements.txt   # Frontend dependencies list
└── README.md              # This file
```

## 🔧 Features

- **AI Study Plan Generation**: Generate personalized study plans
- **Quiz System**: Interactive quizzes for various programming languages
- **Code Games**: Fun coding challenges and exercises
- **Progress Tracking**: Monitor your learning progress
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework
- **Supabase**: Database and authentication
- **OpenRouter API**: AI model integration
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **Supabase Client**: Database integration

## 📝 Environment Variables

Create a `.env` file in the BackEnd directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## 🚀 Running the Application

1. **Start Backend**: `cd BackEnd && python app.py`
2. **Start Frontend**: `cd FrontEnd && npm run dev`
3. **Access Application**: http://localhost:5173

## 📚 API Endpoints

- `POST /generate-plan`: Generate study plans
- `POST /update-progress`: Update learning progress
- `POST /adapt-plan`: Adapt existing plans
- `GET /api/quiz-questions`: Get quiz questions
- `GET /api/topics`: Get available topics
- `GET /api/code-games`: Get code games

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 



if user is new and he/she sign up and create a account then he/she must have to be login also -> next feature
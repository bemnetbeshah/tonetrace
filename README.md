# ToneTrace

**Educational writing analysis platform for teachers**

ToneTrace transforms student writing into actionable classroom insights, empowering educators with the visibility they need to support every student's writing journey.

## 🏗️ Project Structure

This repository has been reorganized for clarity and maintainability:

```
tonetrace/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Single entry point for the API
│   ├── requirements.txt    # Backend dependencies
│   ├── app/                # Core application modules
│   │   ├── database.py     # Database configuration
│   │   └── models.py       # Data models
│   ├── routes/             # API route handlers
│   │   ├── analyze_lightweight.py  # Text analysis endpoints
│   │   └── profile.py      # Student profile endpoints
│   ├── services/           # Business logic services
│   ├── analyzers/          # NLP analysis modules
│   ├── examples/           # Usage examples
│   └── tests/              # Backend tests
├── frontend/               # React TypeScript frontend
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Build configuration
├── docs/                   # Documentation
│   ├── README_FRONTEND.md  # Frontend documentation
│   ├── DEPLOYMENT.md       # Deployment guides
│   └── *.md               # Other documentation
├── infra/                  # Infrastructure & deployment
│   ├── deploy_render.py    # Deployment scripts
│   ├── docker-compose.yml  # Docker configuration
│   ├── requirements*.txt   # Various requirement files
│   └── *.md               # Deployment documentation
└── scripts/                # Utility scripts
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the API server:**
   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📋 Features

### For Teachers
- **Classroom Dashboard**: KPI cards showing class-wide writing trends
- **Student Profiles**: Individual writing development tracking
- **Assignment Monitoring**: Submission tracking with early intervention alerts
- **Data Visualization**: Charts showing writing trends and patterns
- **Export Tools**: CSV export for reports and parent conferences

### For Students
- **Writing Analysis**: Formality, complexity, and readability metrics
- **Tone Analysis**: Sentiment and emotional tone detection
- **Grammar Insights**: Common issue identification and suggestions
- **Progress Tracking**: Longitudinal growth monitoring

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Lightweight NLP**: NLTK, TextBlob, textstat (optimized for deployment)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **API**: RESTful endpoints with automatic documentation

### Frontend
- **React 18**: Modern UI framework with TypeScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization library
- **React Router**: Client-side routing

## 📊 API Endpoints

### Analysis
- `POST /api/analyze` - Analyze student text
- `POST /api/analyze/batch` - Batch text analysis
- `GET /api/health` - Service health check

### Profiles
- `GET /api/profile/students` - List students
- `GET /api/profile/students/{id}` - Get student details
- `POST /api/profile/students` - Create student profile

## 🚀 Deployment

### Render (Recommended)
The project is optimized for Render's free tier:

1. **Prepare for deployment:**
   ```bash
   python infra/deploy_render.py
   ```

2. **Deploy to Render** using the configuration in `infra/`

### Docker
```bash
docker-compose up -d
```

### Manual Deployment
See `docs/DEPLOYMENT.md` for detailed instructions.

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 Documentation

- **Frontend Guide**: `docs/README_FRONTEND.md`
- **Deployment Guide**: `docs/DEPLOYMENT.md`
- **API Documentation**: Available at `/docs` when running the backend
- **Component Library**: `frontend/src/components/README.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
- Check the documentation in `docs/`
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ for educators and students everywhere**

*ToneTrace: Empowering teachers with the insights they need to help every student thrive.*

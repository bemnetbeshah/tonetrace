# Deployment Guide: Neon + Render + Vercel

This guide covers deploying your ToneTrace application with:
- **Database**: Neon (PostgreSQL)
- **Backend**: Render (FastAPI)
- **Frontend**: Vercel (React)

## 🗄️ Neon Database Setup

### 1. Database Connection String
Your Neon database is already configured with:
```
postgresql+asyncpg://neondb_owner:npg_BZlVjuAs5gd4@ep-lingering-mud-adhn0gr1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. Run Database Migrations
After deploying to Render, run migrations:
```bash
# Connect to your Render service and run:
alembic upgrade head
```

## 🚀 Render Backend Deployment

### 1. Environment Variables
Set these in your Render service settings:

```bash
DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_BZlVjuAs5gd4@ep-lingering-mud-adhn0gr1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
ALLOWED_ORIGINS=https://tonetrace.vercel.app,http://localhost:5173
```

### 2. Build Configuration
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Python Version**: 3.13.4 (as detected by Render)

### 3. Dependencies
Your `requirements.txt` is now configured for:
- spaCy 3.7.4 (compatible with en_core_web_sm 3.7.1)
- All ML libraries (PyTorch, Transformers, etc.)
- FastAPI and async database support

## 🌐 Vercel Frontend Deployment

### 1. Environment Variables
Set in your Vercel project:
```bash
VITE_API_BASE=https://your-render-backend-name.onrender.com
```

### 2. Build Configuration
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🔗 Connecting the Services

### 1. Backend to Database
✅ **Configured**: Your FastAPI app uses `DATABASE_URL` environment variable
✅ **Compatible**: SQLAlchemy async with Neon PostgreSQL

### 2. Frontend to Backend
✅ **Configured**: React app uses `VITE_API_BASE` environment variable
✅ **CORS**: Backend allows requests from `https://tonetrace.vercel.app`

## 🧪 Testing the Deployment

### 1. Health Check
```bash
curl https://your-render-backend.onrender.com/
# Should return: {"message": "You are now using tonetrace API"}
```

### 2. Database Connection
```bash
# Test database connectivity through your API
curl -X POST https://your-render-backend.onrender.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Test text", "student_id": "test"}'
```

### 3. Frontend Integration
Visit `https://tonetrace.vercel.app` and test the analysis functionality.

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format in Render
   - Verify Neon database is active
   - Check SSL requirements (`sslmode=require`)

2. **CORS Errors**
   - Verify `ALLOWED_ORIGINS` includes your Vercel domain
   - Check for typos in the domain URL

3. **Build Failures**
   - Ensure Python 3.13.4 compatibility
   - Check all dependencies in `requirements.txt`
   - Verify spaCy model compatibility

### Logs and Monitoring
- **Render**: Check service logs for backend errors
- **Vercel**: Monitor build and runtime logs
- **Neon**: Check database connection metrics

## 📋 Deployment Checklist

- [ ] Neon database created and accessible
- [ ] Render backend deployed with environment variables
- [ ] Database migrations run successfully
- [ ] Vercel frontend deployed with `VITE_API_BASE` set
- [ ] CORS properly configured
- [ ] API endpoints responding correctly
- [ ] Frontend successfully calling backend
- [ ] Text analysis functionality working

## 🔄 Updates and Maintenance

### Backend Updates
1. Push changes to your Git repository
2. Render automatically redeploys
3. Run migrations if database schema changes: `alembic upgrade head`

### Frontend Updates
1. Push changes to your Git repository
2. Vercel automatically redeploys
3. No additional configuration needed

### Database Changes
1. Create new migration: `alembic revision --autogenerate -m "Description"`
2. Apply migration: `alembic upgrade head`
3. Monitor for any data migration issues

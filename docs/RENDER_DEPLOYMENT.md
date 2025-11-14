# Render Deployment Guide

This guide will help you deploy the ToneTrace backend to Render.

## Prerequisites

- A Render account (free tier is sufficient)
- Your repository pushed to GitHub/GitLab/Bitbucket

## Deployment Steps

### 1. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Select your repository and branch

### 2. Configure the Service

**Service Settings:**
- **Name**: `tonetrace-backend` (or your preferred name)
- **Region**: Choose closest to your users (Oregon recommended for US)
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (or set to `backend` if you prefer)
- **Environment**: `Python 3`
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

**Or use the render.yaml file:**
- If you have `render.yaml` in your root directory, Render will auto-detect it
- You can click "Apply render.yaml" to use the configuration

### 3. Set Environment Variables

In the Render dashboard, go to "Environment" tab and add:

```
ALLOWED_ORIGINS=https://tonetrace.vercel.app,http://localhost:5173
```

**Note**: Replace `https://tonetrace.vercel.app` with your actual frontend URL.

### 4. Deploy

1. Click "Create Web Service"
2. Render will build and deploy your service
3. Wait for deployment to complete (first deployment may take 5-10 minutes)

### 5. Get Your Backend URL

After deployment, Render will provide a URL like:
```
https://tonetrace-backend.onrender.com
```

### 6. Update Frontend Configuration

In your Vercel dashboard (or wherever your frontend is hosted):

1. Go to Project Settings → Environment Variables
2. Add a new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://tonetrace-backend.onrender.com` (your Render URL)
3. Redeploy your frontend

**For local development:**
- Create `frontend/.env.local` with:
  ```
  VITE_API_BASE_URL=
  ```
  (Leave empty to use Vite proxy for local development)

### 7. Update CORS in Backend (if needed)

If your frontend URL changes, update the `ALLOWED_ORIGINS` environment variable in Render:
1. Go to your Render service
2. Click "Environment" tab
3. Update `ALLOWED_ORIGINS` with your new frontend URL
4. Save and redeploy

## Troubleshooting

### Service Won't Start

- Check the logs in Render dashboard
- Verify the start command is correct
- Ensure `requirements.txt` is in the `backend/` directory

### CORS Errors

- Make sure `ALLOWED_ORIGINS` includes your frontend URL
- Check that the frontend is using the correct backend URL
- Verify no trailing slashes in URLs

### NLTK Data Issues

- NLTK data will download automatically on first use
- First request may be slow as it downloads required data
- Data is cached in `/opt/render/.local/share/nltk_data`

### Free Tier Limitations

- Services on free tier spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds (cold start)
- Consider upgrading to paid tier for production use

## Health Check

After deployment, test your backend:

```bash
curl https://tonetrace-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "tonetrace-api"
}
```

## API Documentation

Once deployed, visit:
```
https://tonetrace-backend.onrender.com/docs
```

For interactive API documentation.


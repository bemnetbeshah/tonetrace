# Deployment Checklist: Vercel Frontend → Render Backend

## ✅ Completed Changes

1. **Removed Vercel Serverless Functions**
   - ✅ Removed `/api/(.*)` route from `vercel.json`
   - ✅ Removed `functions` section from `vercel.json`
   - ✅ Old serverless code in `api/` directory is kept but not used

2. **Updated Frontend to Use Render Backend**
   - ✅ Changed `VITE_API_BASE_URL` to `VITE_API_URL` for consistency
   - ✅ Frontend now uses `import.meta.env.VITE_API_URL` to call Render backend
   - ✅ Local dev proxy in `vite.config.ts` still works for development

3. **Backend CORS Configuration**
   - ✅ Backend reads `ALLOWED_ORIGINS` from environment variable
   - ✅ CORS allows Vercel frontend origin

## 📋 Next Steps

### 1. Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variable:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://tonetrace.vercel.app,http://localhost:5173`
     (Replace `tonetrace.vercel.app` with your actual Vercel frontend URL)
6. Deploy and note your Render URL (e.g., `https://tonetrace-backend.onrender.com`)

### 2. Configure Vercel Frontend Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-render-backend.onrender.com` (your actual Render URL)
   - **Environment**: Production, Preview, Development (or just Production)
3. **Redeploy** your frontend

### 3. Verify Everything Works

**Test Backend Directly:**
```bash
curl https://your-render-backend.onrender.com/api/health
```

Should return:
```json
{"status":"healthy","version":"1.0.0","service":"tonetrace-api"}
```

**Test from Frontend:**
1. Visit your Vercel frontend URL
2. Try analyzing some text
3. Check browser console for any CORS errors
4. Verify requests go to Render backend (check Network tab)

### 4. Optional: Clean Up Old Serverless Code

The `api/` directory contains old Vercel serverless function code. You can:
- **Keep it** (doesn't hurt, just not used)
- **Delete it** if you're sure you won't need it:
  ```bash
  rm -rf api/
  ```

## 🔍 Verification Checklist

You are "off serverless" and "on Render" if:

- ✅ No `fetch("/api/...")` in frontend code (all use `VITE_API_URL`)
- ✅ No `/api/(.*)` routes in `vercel.json`
- ✅ No `functions` section in `vercel.json` pointing to `/api`
- ✅ Frontend uses `import.meta.env.VITE_API_URL` which points to Render
- ✅ Backend CORS allows your Vercel frontend URL
- ✅ Hitting Render URL directly works (`/api/health`, `/docs`)

## 🐛 Troubleshooting

### CORS Errors
- Verify `ALLOWED_ORIGINS` in Render includes your exact Vercel frontend URL
- Check for trailing slashes (should be none)
- Ensure no typos in the URL

### 404 Errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that Render backend is running
- Verify the URL doesn't have trailing slash

### Frontend Still Calling Vercel Serverless
- Check browser Network tab to see where requests go
- Verify `VITE_API_URL` is set in Vercel environment variables
- Clear browser cache and hard refresh
- Check that frontend was redeployed after adding env var


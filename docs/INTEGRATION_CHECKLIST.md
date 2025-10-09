# Frontend Integration Checklist

## API Endpoint Mapping

When you're ready to integrate with your FastAPI backend, replace the mock API calls in `src/services/api.ts` with real `fetch` calls using these endpoints:

### Core Analysis Endpoints

| UI Call | Endpoint | Replace In | Notes |
|---------|----------|------------|-------|
| `api.analyze(text, studentId)` | `POST /analyze` | `src/services/api.ts` | Send `{ text, student_id }`. Update dashboard metrics after success. |
| `api.analyzeGrammar(text)` | `POST /analyze/grammar` | `src/services/api.ts` | |
| `api.analyzeReadability(text)` | `POST /analyze/readability` | `src/services/api.ts` | |
| `api.analyzeLexicalRichness(text)` | `POST /analyze/lexical-richness` | `src/services/api.ts` | |

### Student Data Endpoints

| UI Call | Endpoint | Replace In | Notes |
|---------|----------|------------|-------|
| `api.history(studentId, limit)` | `GET /analyze/history/{student_id}` | `src/services/api.ts` | |
| `api.profile(studentId)` | `GET /profile/{student_id}` | `src/services/api.ts` | |
| `api.performance(studentId)` | `GET /profile/{student_id}/performance` | `src/services/api.ts` | |

### Profile History Endpoints

| UI Call | Endpoint | Replace In | Notes |
|---------|----------|------------|-------|
| `api.profileHistory(studentId, 'sentiment')` | `GET /profile/{student_id}/history/sentiment` | `src/services/api.ts` | |
| `api.profileHistory(studentId, 'formality')` | `GET /profile/{student_id}/history/formality` | `src/services/api.ts` | |
| `api.profileHistory(studentId, 'lexical-diversity')` | `GET /profile/{student_id}/history/lexical-diversity` | `src/services/api.ts` | |
| `api.profileHistory(studentId, 'readability')` | `GET /profile/{student_id}/history/readability` | `src/services/api.ts` | |
| `api.profileHistory(studentId, 'grammar')` | `GET /profile/{student_id}/history/grammar` | `src/services/api.ts` | |
| `api.profileHistory(studentId, 'tone')` | `GET /profile/{student_id}/history/tone` | `src/services/api.ts` | |

### Utility Endpoints

| UI Call | Endpoint | Replace In | Notes |
|---------|----------|------------|-------|
| `api.root()` | `GET /` | `src/services/api.ts` | |

## Integration Steps

### 1. Update Configuration
```bash
# Set your FastAPI base URL
echo "VITE_API_BASE=http://your-api-domain:8000" > .env
```

### 2. Replace Mock API Calls
- **Keep the same function signatures** so no page components need to change
- Replace mock data returns with real `fetch` calls
- Add proper error handling and loading states

### 3. Add Error Handling
```typescript
// Example error handling pattern
try {
  const response = await fetch(`${CONFIG.BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, student_id: studentId })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
} catch (error) {
  console.error('API call failed:', error);
  // Add toast notification here
  throw error;
}
```

### 4. Add Toast Notifications
Consider adding a toast library (like `react-hot-toast`) for:
- Success messages after analysis completion
- Error messages for failed API calls
- Loading states during API operations

## Benefits of This Architecture

✅ **No UI Changes Needed** - All pages already consume the `api` service  
✅ **Centralized API Logic** - All backend calls in one place  
✅ **Easy Testing** - Mock data can be kept for development  
✅ **Progressive Integration** - Replace endpoints one by one  

## Current Status

- ✅ **Frontend Components** - All UI components created and styled
- ✅ **Mock API Service** - Fake data service ready
- ✅ **Routing & Navigation** - All pages wired up
- ⏳ **Backend Integration** - Ready to replace mock calls with real endpoints

When you're ready to integrate, just update the API service and the frontend will automatically work with your real backend! 
# ToneTrace Frontend (Dummy)

## Start
1. `npm install`
2. `cp .env.example .env` and adjust VITE_API_BASE when you have an API
3. `npm run dev`

## Integrations later
- Replace bodies inside `src/services/api.ts` with real `fetch` calls to the endpoints you listed.
- Replace mock data in `src/mocks/mockData.ts` with server responses.
- When a database is ready, no UI refactor is needed because the UI already consumes the `api` service only. 
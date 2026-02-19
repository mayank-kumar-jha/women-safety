# Women Safety Route Analyzer

Production-oriented full-stack application to analyze route safety using real Google Maps Platform APIs, provide safest-route recommendations, and support real-time trip monitoring with SOS workflows.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Realtime: Socket.io
- APIs: Google Directions, Geocoding, Places Nearby Search

## Folder Structure
```
.
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── sockets/
│       ├── app.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── styles/
├── .env.example
└── README.md
```

## Safety Formula
```text
Safety Score =
(W1 * normalized_poi_density) +
(W2 * open_business_density) +
(W3 * urban_density_score) -
(isolation_penalty) -
(night_penalty)
```

## Features Implemented
- JWT auth (register/login)
- Trusted contacts management
- Route analysis with multiple alternatives
- Route safety breakdown and risk reasoning
- Realtime trip room updates and low-safety warnings
- SOS trigger, live SOS updates, stop SOS, contact notifications (socket + optional Twilio + optional email)
- Route analysis caching in MongoDB
- Rate limiting, validation hooks, env-based secrets

## Setup
1. Copy `.env.example` to `.env` and configure Google Maps API key plus DB.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run both apps:
   ```bash
   npm run dev
   ```
4. Backend at `http://localhost:5000`, frontend at `http://localhost:5173`.

## Google APIs Required
Enable in Google Cloud:
- Directions API
- Geocoding API
- Places API (Autocomplete + Nearby Search)

## Deployment
### Render (Backend)
- Create Web Service from `backend`.
- Set start command `npm start`.
- Add env vars from `.env.example`.
- Provision MongoDB Atlas and set `MONGODB_URI`.

### Vercel (Frontend)
- Import repo and set root directory to `frontend`.
- Set `VITE_API_URL` to Render backend URL + `/api`.
- Set `VITE_SOCKET_URL` to Render backend URL.

## Production Notes
- Deploy behind HTTPS.
- Restrict CORS to your frontend domains.
- Use stronger rate limit profile and logging/monitoring.
- Move safety weights to an admin-config collection for runtime tuning.

## Extensible Ideas
- AI risk prediction model
- Crime data integration
- Voice SOS and shake-to-alert mobile bridge

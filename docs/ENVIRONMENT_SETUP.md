# Environment Setup

## Prerequisites
- Node.js 20+
- npm 10+

## Frontend
```bash
cd frontend
cp .env.example .env   # fill VITE_* values (optional)
npm install
npm run dev            # http://localhost:5173
```

## Backend
```bash
cd backend
cp .env.example .env   # add RAZORPAY_KEY_SECRET (server only)
npm install
npm run dev            # http://localhost:4000
```

## Secrets placement
| Secret | Location | Exposed to browser? |
|---|---|---|
| VITE_FIREBASE_* | frontend/.env | Yes (restrict by domain) |
| VITE_RAZORPAY_KEY_ID | frontend/.env | Yes (public key id) |
| RAZORPAY_KEY_SECRET | backend/.env | No, never |

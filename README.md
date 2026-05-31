# three13 — ThreeB Fitness (Monorepo)

Premium futuristic gym platform. **Health is Real Wealth.**

Frontend (React + Vite + Tailwind + React Three Fiber + Framer Motion + GSAP + Recharts + PWA)
and a Node/Express payments backend (Razorpay), in one repository.

## Structure
```
three13/
├── frontend/   # React web app (Vite)
├── backend/    # Express payments API (Razorpay order + signature verify)
├── docs/       # setup, deployment, checklist guides
├── firestore.rules
├── docker-compose.yml
└── .gitlab-ci.yml
```

## Features
- Interactive 3D Muscle Explorer (procedural, 14 muscle groups, front/back + male/female toggle)
- Membership & Personal Trainer plans, Services, Transformations, Trainers
- BMI Calculator + rule-based AI Fitness Planner
- Member Dashboard with Recharts analytics
- Firebase authentication + protected routes
- Razorpay payments (server-verified)
- GSAP scroll animations, PWA support, SEO meta + JSON-LD

## Quick start (local)
### Frontend
```bash
cd frontend
cp .env.example .env   # fill VITE_* values (optional; app runs without them)
npm install
npm run dev            # http://localhost:5173
```

### Backend
```bash
cd backend
cp .env.example .env   # add RAZORPAY_KEY_SECRET (server only)
npm install
npm run dev            # http://localhost:4000
```

## Lint / build
```bash
cd frontend && npm run lint && npm run build && npm run preview
```

## Docker (both services)
```bash
cp .env.example backend/.env
docker compose up --build
# frontend -> http://localhost:8080   backend -> http://localhost:4000
```

## Docs
See `docs/ENVIRONMENT_SETUP.md`, `docs/FIREBASE_SETUP.md`, `docs/DEPLOYMENT.md`, `docs/PRODUCTION_CHECKLIST.md`.

## Security
- Razorpay **key secret** lives only in `backend/.env`; payment signatures are verified server-side.
- Restrict the Firebase API key by domain. Firestore uses default-deny rules (`firestore.rules`).

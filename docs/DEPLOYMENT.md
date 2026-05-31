# Deployment

## Frontend - GitLab Pages
`.gitlab-ci.yml` builds and deploys `frontend/dist/` on the default branch.
For a subpath set `base: '/three13/'` in frontend/vite.config.js.
Add VITE_* as masked CI/CD variables.

## Docker (both services)
```bash
cp .env.example backend/.env   # set real values
docker compose up --build
# frontend -> http://localhost:8080   backend -> http://localhost:4000
```

## Backend
Deploy `backend/` to any Node host. Set env vars and lock CLIENT_ORIGIN to the production domain.

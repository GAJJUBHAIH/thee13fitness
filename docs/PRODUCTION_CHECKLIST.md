# Production Checklist

## Security
- [ ] Razorpay key secret only on backend; never in frontend bundle.
- [ ] Payment signature verified server-side before granting access.
- [ ] Firebase API key restricted by HTTP referrer.
- [ ] Firestore rules deployed; default-deny verified.
- [ ] Backend CLIENT_ORIGIN locked to production domain (CORS).
- [ ] No secrets committed; .env in .gitignore.

## Functionality
- [ ] Signup/login/logout work; protected /dashboard redirects when logged out.
- [ ] BMI + AI planner produce sane outputs.
- [ ] 3D explorer: hover, click, front/back, male/female work on touch + mouse.
- [ ] Razorpay test payment completes and verifies.

## Performance / PWA / SEO
- [ ] npm run build succeeds; vendor chunks split.
- [ ] Lighthouse scores >= 90.
- [ ] Manifest + icons present; installable.
- [ ] Meta tags, JSON-LD, robots.txt set.

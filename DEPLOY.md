# Deploy (cPanel / Node)

1. Environment Variables
- NODE_ENV=production
- HOST=0.0.0.0
- PORT=3000
- NEXTAUTH_URL=https://soubrafamily.com
- NEXTAUTH_SECRET=***
- GOOGLE_CLIENT_ID=*** (optional)
- GOOGLE_CLIENT_SECRET=*** (optional)
- ADMIN_EMAILS=you@example.com,other@domain.com
- ADMIN_USER=admin@example.com (optional)
- ADMIN_PASS=*** (optional)

2. Build & Start (SSH)
```
cd ~/nodeapps/sf-web
rm -rf node_modules
npm ci
npm run build
npm run start
```

Or set Startup Command to: `npm run build && npm run start`.

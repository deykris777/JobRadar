# 🚀 JobRadar — Dev Internship & Job Board

> Full-stack job board that scrapes Internshala + Wellfound daily, stores in MongoDB, sends email alerts for new matches.

**Tech Stack:** Next.js 15 · Node.js/Express · MongoDB · Cheerio · Puppeteer · Nodemailer · node-cron

---

## 📁 Project Structure

```
jobboard/
├── backend/          # Express API + scrapers + cron
│   └── src/
│       ├── models/   # MongoDB schemas (Job, Alert)
│       ├── routes/   # REST endpoints
│       ├── scrapers/ # Cheerio (Internshala) + Puppeteer (Wellfound)
│       ├── services/ # Email alerts, cron scheduling
│       └── config/   # DB connection
└── frontend/         # Next.js 15 app
    └── src/
        ├── app/      # Pages: /jobs, /alerts, /api/cron
        ├── components/
        ├── lib/      # API client
        └── types/
```

---

## ⚡ Setup — Step by Step

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier) → https://mongodb.com/atlas
- Gmail account for email alerts

---

### 1. MongoDB Atlas Setup

1. Create free cluster at https://mongodb.com/atlas
2. **Database Access** → Add user with password
3. **Network Access** → Add `0.0.0.0/0` (allow all, for dev)
4. **Connect** → Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/jobboard
   ```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and fill env
cp .env.example .env
```

Fill in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobboard
PORT=5000
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password   # Google → Security → App Passwords
EMAIL_FROM=JobRadar <your_gmail@gmail.com>
FRONTEND_URL=http://localhost:3000
CRON_SECRET=any_random_secret_123
```

```bash
# Start backend
npm run dev
```

Backend runs on http://localhost:5000

**Run first scrape manually:**
```bash
npm run scrape
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install
npm install

# Copy env
cp .env.local.example .env.local
```

Fill `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
CRON_SECRET=any_random_secret_123   # Same as backend
```

```bash
# Start frontend
npm run dev
```

Frontend runs on http://localhost:3000

---

## 🌐 Deployment

### Backend → Render (Free)

1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo → select `backend/` as root
4. Settings:
   - **Build:** `npm install && npm run build`
   - **Start:** `npm start`
5. Add all env variables from `.env`
6. Deploy → get URL like `https://jobboard-api.onrender.com`

### Frontend → Vercel (Free)

1. Go to https://vercel.com → New Project
2. Connect GitHub repo → select `frontend/` as root
3. Add env variables:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
   - `CRON_SECRET` = same secret as backend
4. Deploy

**Vercel Cron** will automatically call `/api/cron` daily at midnight (configured in `vercel.json`).

---

## 📋 API Endpoints

```
GET  /api/jobs                      # List jobs with filters
GET  /api/jobs?role=frontend        # Filter by role
GET  /api/jobs?type=remote          # Filter by type  
GET  /api/jobs?minStipend=10000     # Filter by stipend
GET  /api/jobs?search=react         # Full text search
GET  /api/jobs?sort=stipend         # Sort by stipend
GET  /api/jobs/stats                # Counts by category
GET  /api/jobs/:id                  # Single job

POST /api/alerts                    # Create email alert
DELETE /api/alerts/unsubscribe      # Unsubscribe

POST /api/cron/scrape               # Trigger scrape (needs x-cron-secret header)
GET  /health                        # Health check
```

---

## 📊 What This Project Demonstrates (for your resume)

- **Web Scraping** — Cheerio (static HTML) + Puppeteer (JS-heavy pages)
- **Cron Jobs** — node-cron for scheduled 24hr scraping
- **MongoDB** — Mongoose schemas, indexing, text search, aggregations
- **REST API** — Express with validation (Zod), rate limiting, helmet
- **Email Service** — Nodemailer with HTML templates
- **Next.js 15** — App Router, server actions, API routes
- **Full-stack integration** — Frontend/backend communication
- **Production deployment** — Render + Vercel + Vercel Cron

### Resume line:
> "Built a full-stack job board aggregator with automated scraping (Cheerio + Puppeteer) from Internshala and Wellfound, MongoDB storage with text search, cron-based 24hr refresh, and email alerts for personalized job matching — deployed on Render + Vercel"

---

## 🛠️ Common Issues

**Puppeteer fails on Render free tier:**
Add this env var on Render:
```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```
And install chromium separately, or use `puppeteer-core` with a custom Chrome path.

**Gmail SMTP rejected:**
Enable 2FA on Google → Security → App Passwords → Generate 16-char password

**CORS errors:**
Make sure `FRONTEND_URL` in backend env matches exactly your Vercel URL (no trailing slash)

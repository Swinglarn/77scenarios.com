# 77 Scenarios — Scenario-Based Personality Test

A Myers-Briggs personality type test built around real scenarios instead of self-rating questions. 77 questions across 4 dimensions. 16 possible types.

**Live site:** https://77scenarios.com

---

## Files

```
index.html      → The test (splash, 77 questions, results)
types.html      → All 16 types grouped by temperament
type.html       → Individual type deep-dive (URL param: ?t=INTJ)
letters.html    → All 8 letters / 4 dimensions overview
letter.html     → Individual letter deep-dive (URL param: ?l=E)
sitemap.xml     → Full sitemap for all 27 pages
robots.txt      → Search engine crawl rules
```

---

## Deploying to GitHub + Vercel

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository** (the green button, top right)
3. Name it `77scenarios` (or whatever you want)
4. Set it to **Public**
5. Leave everything else unchecked — no README, no .gitignore
6. Click **Create repository**

### Step 2 — Push these files to GitHub

Open your terminal and run these commands. Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Navigate to the folder where these files are saved
cd /path/to/your/77scenarios/folder

# Initialise git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit"

# Connect to your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/77scenarios.git

# Push
git branch -M main
git push -u origin main
```

If it asks for credentials, use your GitHub username and a **Personal Access Token** (not your password). Generate one at: GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic).

### Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Find your `77scenarios` repository and click **Import**
4. Leave all settings as default (Vercel detects it as a static site automatically)
5. Click **Deploy**

Vercel gives you a free URL like `77scenarios-abc123.vercel.app` immediately.

### Step 4 — Connect a custom domain (optional)

1. In Vercel, go to your project → **Settings → Domains**
2. Add your domain (e.g. `77scenarios.com`)
3. Vercel shows you the DNS records to add
4. Go to your domain registrar (GoDaddy, Namecheap, etc.) and add those records
5. Usually live within 10–30 minutes

**Important:** Once you have your real domain, do a find-and-replace across all HTML files — swap `77scenarios.com` for your actual domain. This keeps the canonical URLs, Open Graph tags, sitemap, and structured data all pointing correctly.

---

## Future updates

Once set up, any change you push to GitHub automatically redeploys on Vercel:

```bash
git add .
git commit -m "Your update message"
git push
```

---

## SEO notes

- Every page has a unique `<title>`, `<meta description>`, and canonical URL
- `type.html` and `letter.html` update their meta tags dynamically via JS based on the URL parameter
- `sitemap.xml` covers all 27 addressable pages (1 test + 2 hubs + 16 types + 8 letters)
- Submit your sitemap to Google Search Console once the domain is live: https://search.google.com/search-console

High-value keywords already in the pages:
- `personality type test` / `MBTI test` / `Myers-Briggs test` (index)
- `scenario based personality test` / `free personality quiz` (index)
- `16 personality types` / `Myers-Briggs types` (types page)
- `[TYPE] personality type` e.g. `INTJ personality type` (each type page)
- `introvert vs extrovert` / `sensing vs intuition` / `thinking vs feeling` / `judging vs perceiving` (letter pages)

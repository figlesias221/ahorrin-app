# Setup Guide - Google Analytics & Search Console

Complete this setup to activate analytics and SEO tracking for Ahorrín.

---

## 📊 Google Analytics 4 Setup

### Prerequisites
- Google Account (Gmail)
- Access to [analytics.google.com](https://analytics.google.com)

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Admin" (bottom left)
3. Click "Create Property"
4. Fill in:
   - **Property name**: "Ahorrín App"
   - **Timezone**: "(UTC-03:00) Montevideo"
   - **Currency**: "Peso Uruguayo (UYU)"
5. Click "Next" → Complete business info → "Create"

### Step 2: Create Data Stream

1. In Property setup, select "Web"
2. Fill in:
   - **Website URL**: `https://www.ahorrin.app`
   - **Stream name**: "Ahorrín Web"
3. **Important**: Enable ALL "Enhanced measurement" options:
   - ✅ Page views
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ Site search
   - ✅ Video engagement
   - ✅ File downloads
4. Click "Create stream"

### Step 3: Copy Measurement ID

1. You'll see your **Measurement ID** (format: `G-XXXXXXXXXX`)
2. **Copy it** - you'll need it in the next step

### Step 4: Add to Environment Variables

#### Local Development

1. Open `.env.local` in the project root
2. Find the commented GA4 section
3. Uncomment and add your Measurement ID:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Replace with your actual ID
```

#### Production (Vercel)

1. Go to [vercel.com](https://vercel.com) → Your project
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (your Measurement ID)
   - **Environments**: Production, Preview, Development (select all)
4. Click "Save"
5. **Redeploy** your application

### Step 5: Verify Installation

1. In Google Analytics, go to "Reports" → "Realtime"
2. Open your site: `https://www.ahorrin.app`
3. You should see your visit appear in real-time
4. Navigate to different pages to verify tracking

### Step 6: Mark Conversions

After 24-48 hours, events will appear in GA4:

1. Go to "Configure" → "Events"
2. Mark these as conversions (toggle "Mark as conversion"):
   - ✅ `sign_up` (most important)
   - ✅ `file_upload` (activation metric)
   - ✅ `create_rule` (engagement)
   - ✅ `export_data` (power user)

**📖 Full Guide**: See `docs/google-analytics-setup.md` for detailed instructions, troubleshooting, and custom audience creation.

---

## 🔍 Google Search Console Setup

### Prerequisites
- Google Account (same as GA4 recommended)
- Access to [search.google.com/search-console](https://search.google.com/search-console)

### Step 1: Add Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Choose **"URL prefix"**
4. Enter: `https://www.ahorrin.app`
5. Click "Continue"

### Step 2: Verify Ownership

Google will give you a verification code. **Use the HTML tag method**:

1. Copy the verification code (format: `XXXXXXXXXXXXXXX`)
2. Open `app/layout.tsx`
3. Find the `verification` section in metadata (around line 99)
4. Uncomment and add your code:

```typescript
verification: {
  google: 'XXXXXXXXXXXXXXX',  // Replace with your verification code
},
```

5. **Deploy to production**
6. Wait 5 minutes
7. Go back to Search Console and click "Verify"

### Step 3: Submit Sitemap

1. In Search Console sidebar, click "Sitemaps"
2. In "Add a new sitemap", enter: `sitemap.xml`
3. Click "Submit"
4. Wait 5-10 minutes and refresh
5. Status should show: ✅ "Success"

### Step 4: Request Indexing for Key Pages

Manually request indexing for important pages:

1. Click "URL Inspection" (top bar)
2. Enter each URL and click "Request Indexing":
   - `https://www.ahorrin.app`
   - `https://www.ahorrin.app/bbva`
   - `https://www.ahorrin.app/scotiabank`
   - `https://www.ahorrin.app/itau`
   - `https://www.ahorrin.app/blog`
   - `https://www.ahorrin.app/blog/organizar-finanzas-personales-uruguay-2025`

**Limit**: ~10-12 URLs per day.

### Step 5: Link to Google Analytics (Optional)

1. In GA4, go to "Admin" → "Product links" → "Search Console links"
2. Click "Link"
3. Select your Search Console property
4. Confirm

**Benefits**: See search queries in GA4, analyze conversion by keyword.

**📖 Full Guide**: See `docs/google-search-console-setup.md` for monitoring, troubleshooting, and performance metrics.

---

## ✅ Verification Checklist

After completing setup, verify:

### Google Analytics 4
- [ ] Measurement ID added to `.env.local` and Vercel
- [ ] Real-time tracking shows visits in GA4
- [ ] Events appear in GA4 (wait 24-48 hours)
- [ ] Conversions marked (`sign_up`, `file_upload`, etc.)

### Google Search Console
- [ ] Property verified successfully
- [ ] Sitemap submitted and processed
- [ ] Key pages requested for indexing
- [ ] No errors in "Coverage" report

### Local Testing
- [ ] Run `npm run dev`
- [ ] Open DevTools Console
- [ ] Navigate site - no `gtag` errors
- [ ] Check Network tab - GA4 requests firing

### Production Testing
- [ ] Deploy to production
- [ ] Visit site in incognito mode
- [ ] Check GA4 Realtime - you should appear
- [ ] Test all CTAs (signup, file upload)

---

## 🎯 Expected Results

### Week 1
- **GA4**: 50-100 page views, 5-10 events
- **GSC**: Sitemap processed, 0-5 impressions

### Month 1
- **GA4**: 500+ page views, 100+ events, 10-20 signups
- **GSC**: 500+ impressions, 20+ clicks, 10-15 keywords

### Month 3
- **GA4**: 2,000+ page views, 500+ events, 60%+ activation rate
- **GSC**: 5,000+ impressions, 150+ clicks, 30+ keywords

---

## 🆘 Troubleshooting

### GA4 not tracking
1. Check `.env.local` has correct `NEXT_PUBLIC_GA_MEASUREMENT_ID`
2. Restart dev server: `npm run dev`
3. Check browser Console for errors
4. Verify Measurement ID starts with `G-`

### GSC verification failed
1. Check verification code in `app/layout.tsx`
2. Deploy to production (must be live)
3. Wait 5 minutes after deploy
4. Try verification again

### Sitemap not found
1. Visit `https://www.ahorrin.app/sitemap.xml` in browser
2. Should show XML with all URLs
3. If 404, redeploy application
4. Wait 10 minutes, resubmit in GSC

---

## 📚 Additional Resources

- `docs/google-analytics-setup.md` - Complete GA4 guide
- `docs/google-search-console-setup.md` - Complete GSC guide
- `docs/content-calendar-2025.md` - Content strategy
- `docs/keyword-research.md` - Target keywords

---

**Questions?** Check the detailed guides or consult Google's official documentation.

**Last updated**: October 2025

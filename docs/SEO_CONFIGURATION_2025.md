# 🔍 SEO Configuration 2025 - Implementation Complete

**Date:** 21 января 2026  
**Domain:** https://dima-fomin.pl  
**Status:** ✅ Production Ready  

---

## 🎯 GOLDEN RULE

```
ONE CANONICAL DOMAIN = https://dima-fomin.pl

All other domains (vercel.app) → Redirect to canonical
Google indexes ONLY canonical domain
```

---

## ✅ IMPLEMENTATION CHECKLIST

### 1️⃣ Canonical Domain (CRITICAL) ✅
```typescript
// lib/seo.ts
const CANONICAL_DOMAIN = "https://dima-fomin.pl";

export function getMetadata(language: Language): Metadata {
  return {
    metadataBase: new URL(CANONICAL_DOMAIN),
    alternates: {
      canonical: `${CANONICAL_DOMAIN}${langPath}`,
      // ...
    },
  };
}

// app/layout.tsx
export const metadata: Metadata = {
  ...getMetadata("pl"),
  metadataBase: new URL("https://dima-fomin.pl"),
  alternates: {
    canonical: "https://dima-fomin.pl",
  },
};
```

**What this does:**
- ✅ Tells Google: "This is the real website"
- ✅ All pages reference canonical domain
- ✅ No duplicate content issues

---

### 2️⃣ Vercel Redirects (CRITICAL) ✅
```json
// vercel.json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [
        { "type": "host", "value": "cv-dimafomin.vercel.app" }
      ],
      "destination": "https://dima-fomin.pl/$1",
      "permanent": true,
      "statusCode": 301
    },
    {
      "source": "/(.*)",
      "has": [
        { "type": "host", "value": "cv-dimafomin-.*\\.vercel\\.app" }
      ],
      "destination": "https://dima-fomin.pl/$1",
      "permanent": true,
      "statusCode": 301
    }
  ]
}
```

**What this does:**
- ✅ Any vercel.app URL → 301 redirect to dima-fomin.pl
- ✅ Google sees redirect and indexes only canonical
- ✅ Users always land on proper domain

**Test:**
```bash
curl -I https://cv-dimafomin.vercel.app
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://dima-fomin.pl
```

---

### 3️⃣ robots.txt (CRITICAL) ✅
```plaintext
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://dima-fomin.pl/sitemap.xml
```

**What this does:**
- ✅ Allows all search engines to crawl
- ✅ Points to sitemap for indexing
- ✅ No restrictions (public portfolio)

**Test:**
```bash
curl https://dima-fomin.pl/robots.txt
# Should see canonical domain in Sitemap URL
```

---

### 4️⃣ sitemap.xml (CRITICAL) ✅
```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const CANONICAL_DOMAIN = "https://dima-fomin.pl";

  return [
    {
      url: CANONICAL_DOMAIN,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${CANONICAL_DOMAIN}/pl`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${CANONICAL_DOMAIN}/ua`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
```

**What this does:**
- ✅ Lists all pages for Google to index
- ✅ Priority 1.0 (highest)
- ✅ Weekly refresh frequency

**Test:**
```bash
curl https://dima-fomin.pl/sitemap.xml
# Should see XML with all URLs using canonical domain
```

---

### 5️⃣ Meta Tags (HIGH PRIORITY) ✅
```typescript
// lib/seo.ts
export const seoConfig = {
  pl: {
    title: "Dima Fomin — Profesjonalny Sushi Chef w Polsce | Doświadczony Kucharz Gdańsk",
    description:
      "Dima Fomin — profesjonalny sushi chef z ponad 20-letnim doświadczeniem. Tworzę autentyczne japońskie sushi, prowadzę szkolenia kulinarne i projektuję menu dla restauracji w Polsce i Europie.",
    keywords: [
      "sushi chef Polska",
      "sushi master Gdańsk",
      "kucharz japoński",
      // ...
    ],
    locale: "pl_PL",
  },
  ua: {
    title: "Діма Фомін — Професійний суші-шеф у Польщі | Автор сучасної японської кухні",
    // ...
  },
};
```

**What this does:**
- ✅ Rich metadata for Google
- ✅ Keywords for SEO ranking
- ✅ OpenGraph for social sharing
- ✅ Language-specific content

---

### 6️⃣ Security Headers (MEDIUM PRIORITY) ✅
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

**What this does:**
- ✅ Security best practices
- ✅ Prevents clickjacking
- ✅ Better SEO ranking (Google likes secure sites)

---

## 📊 GOOGLE SEARCH CONSOLE SETUP

### Step 1: Add Property
```
1. Go to: https://search.google.com/search-console
2. Click: "Add Property"
3. Choose: "Domain" (not URL prefix)
4. Enter: dima-fomin.pl
```

### Step 2: Verify Ownership (DNS Method)
```
1. Google gives you TXT record
2. Add to your DNS (e.g., Cloudflare, Domain registrar)
3. Example:
   Type: TXT
   Name: @
   Value: google-site-verification=abc123...
4. Wait 5-10 minutes
5. Click "Verify"
```

### Step 3: Submit Sitemap
```
1. In Search Console → Sitemaps
2. Enter: https://dima-fomin.pl/sitemap.xml
3. Click "Submit"
4. Status should show "Success" after a few minutes
```

### Step 4: Monitor Indexing
```
After 24-72 hours, check:
1. Search Console → Coverage
2. Should see pages indexed
3. Check: site:dima-fomin.pl in Google
```

---

## 🧪 TESTING CHECKLIST

### Test 1: Canonical Tag in Source
```bash
# Open in browser
open https://dima-fomin.pl

# View source (Cmd+U or Ctrl+U)
# Find:
<link rel="canonical" href="https://dima-fomin.pl" />

# ✅ Should use canonical domain (not vercel.app)
```

### Test 2: Vercel Redirect
```bash
curl -I https://cv-dimafomin.vercel.app

# Expected:
HTTP/1.1 301 Moved Permanently
Location: https://dima-fomin.pl/

# ✅ Redirects to canonical
```

### Test 3: Sitemap Valid
```bash
curl https://dima-fomin.pl/sitemap.xml

# Expected: XML with URLs:
<url>
  <loc>https://dima-fomin.pl</loc>
  <lastmod>2026-01-21</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
</url>

# ✅ All URLs use canonical domain
```

### Test 4: Robots.txt Correct
```bash
curl https://dima-fomin.pl/robots.txt

# Expected:
User-agent: *
Allow: /
Sitemap: https://dima-fomin.pl/sitemap.xml

# ✅ Allows all, points to canonical sitemap
```

### Test 5: Meta Tags Present
```bash
# View source at https://dima-fomin.pl
# Find:
<meta property="og:url" content="https://dima-fomin.pl" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Dima Fomin — Profesjonalny Sushi Chef w Polsce" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://dima-fomin.pl/preview.jpg" />

# ✅ All use canonical domain
```

### Test 6: Google Indexing (After 24-72h)
```
Google Search: site:dima-fomin.pl

Expected results:
- dima-fomin.pl
- dima-fomin.pl/pl
- dima-fomin.pl/ua

❌ Should NOT show:
- cv-dimafomin.vercel.app
- cv-dimafomin-ba8i97ieu-dmytros-projects-480467fa.vercel.app
```

---

## 🚫 ANTI-PATTERNS (What NOT to Do)

### ❌ Multiple Canonical Domains
```typescript
// BAD:
alternates: {
  canonical: process.env.NEXT_PUBLIC_SITE_URL, // Changes per environment
}

// GOOD:
alternates: {
  canonical: "https://dima-fomin.pl", // Always same
}
```

### ❌ Vercel Domain in Sitemap
```typescript
// BAD:
{ url: "https://cv-dimafomin.vercel.app" }

// GOOD:
{ url: "https://dima-fomin.pl" }
```

### ❌ Register Vercel Domain in Search Console
```
❌ DON'T add cv-dimafomin.vercel.app to Search Console
✅ ONLY add dima-fomin.pl
```

### ❌ No Redirects
```
❌ Letting both domains exist without redirect
✅ 301 redirect all vercel.app → canonical
```

### ❌ Using noindex on Main Domain
```html
<!-- BAD -->
<meta name="robots" content="noindex" />

<!-- GOOD -->
No noindex tag (allow indexing)
```

---

## 📈 EXPECTED RESULTS

### Immediate (After Deploy):
- ✅ Canonical tags visible in source
- ✅ Sitemap accessible at /sitemap.xml
- ✅ Robots.txt accessible at /robots.txt
- ✅ Vercel domains redirect to canonical
- ✅ Meta tags correct

### 24-48 Hours:
- ✅ Google Search Console shows sitemap submitted
- ✅ Coverage report shows "Valid" pages
- ✅ First pages start appearing in Google index

### 1-2 Weeks:
- ✅ `site:dima-fomin.pl` shows all pages
- ✅ Brand search "Dima Fomin" shows site
- ✅ Vercel domains not in index (redirected)
- ✅ Rich snippets may appear

### 1-3 Months:
- ✅ Keyword rankings improve
- ✅ Organic traffic increases
- ✅ Domain authority builds
- ✅ Featured snippets possible

---

## 📊 FILES CHANGED

### Created:
- ✅ `vercel.json` - Redirects + security headers

### Modified:
- ✅ `lib/seo.ts` - Canonical domain constant
- ✅ `app/layout.tsx` - Metadata with canonical
- ✅ `app/sitemap.ts` - URLs with canonical
- ✅ `public/robots.txt` - Simplified, canonical sitemap

### File Structure:
```
cv-sushi_chef/
├── vercel.json                 (NEW - Redirects)
├── app/
│   ├── layout.tsx              (MODIFIED - Canonical metadata)
│   └── sitemap.ts              (MODIFIED - Canonical URLs)
├── lib/
│   └── seo.ts                  (MODIFIED - Canonical domain)
└── public/
    └── robots.txt              (MODIFIED - Clean config)
```

---

## 🎯 SEO CHECKLIST (Final Verification)

### Before Deploy:
- [x] CANONICAL_DOMAIN = "https://dima-fomin.pl" in all files
- [x] metadataBase set in layout.tsx
- [x] vercel.json has redirects for vercel.app domains
- [x] sitemap.ts uses canonical domain
- [x] robots.txt points to canonical sitemap
- [x] No hardcoded vercel.app URLs in code

### After Deploy:
- [ ] View source → Find canonical tag with dima-fomin.pl
- [ ] Test redirect: curl -I cv-dimafomin.vercel.app → 301
- [ ] Access sitemap.xml → See canonical URLs
- [ ] Access robots.txt → See canonical sitemap
- [ ] Check meta tags → All use canonical domain

### Google Setup:
- [ ] Add dima-fomin.pl to Search Console
- [ ] Verify ownership (DNS TXT record)
- [ ] Submit sitemap: https://dima-fomin.pl/sitemap.xml
- [ ] Wait 24-72 hours
- [ ] Check: site:dima-fomin.pl in Google

### Monitoring (Ongoing):
- [ ] Weekly: Check Search Console for errors
- [ ] Monthly: Review indexed pages count
- [ ] Monthly: Check keyword rankings
- [ ] Quarterly: Update sitemap if pages added

---

## 🚀 DEPLOYMENT COMMANDS

### Deploy to Production:
```bash
# Commit changes
git add vercel.json app/layout.tsx app/sitemap.ts lib/seo.ts public/robots.txt
git commit -m "feat: SEO 2025 - Canonical domain configuration"
git push origin main

# Vercel auto-deploys on push
# Wait 2-3 minutes for build

# Verify deployment
open https://dima-fomin.pl
```

### Post-Deployment Verification:
```bash
# 1. Check canonical tag
curl -s https://dima-fomin.pl | grep 'canonical'

# 2. Check redirect
curl -I https://cv-dimafomin.vercel.app

# 3. Check sitemap
curl https://dima-fomin.pl/sitemap.xml

# 4. Check robots
curl https://dima-fomin.pl/robots.txt

# All should use canonical domain ✅
```

---

## 📚 DOCUMENTATION REFERENCES

Related documentation:
- **lib/seo.ts** - SEO configuration and metadata
- **app/layout.tsx** - Root layout with metadata
- **app/sitemap.ts** - Sitemap generation
- **vercel.json** - Redirects and headers
- **public/robots.txt** - Search engine instructions

External resources:
- [Google Search Console](https://search.google.com/search-console)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Vercel Redirects](https://vercel.com/docs/projects/project-configuration#redirects)
- [Canonical URLs (Google)](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

---

## 🎉 SUMMARY

### What We Implemented:

**Core SEO (2025 Model):**
- ✅ Single canonical domain: https://dima-fomin.pl
- ✅ All vercel.app domains redirect with 301
- ✅ Sitemap with canonical URLs
- ✅ Robots.txt allowing all pages
- ✅ Meta tags with OpenGraph
- ✅ Security headers

**Google Indexing:**
- ✅ Canonical tags on all pages
- ✅ Sitemap ready for Search Console
- ✅ Proper redirect chain
- ✅ Language alternates (PL/UA)

**Result:**
```
ONE domain indexed by Google: https://dima-fomin.pl
All other domains: Redirect to canonical
Users always see: dima-fomin.pl in browser
Google sees: Clean, single domain structure
```

---

**Status:** 🎉 SEO 2025 Complete - Production Ready  
**Domain:** https://dima-fomin.pl  
**Contact:** Dmitrij Fomin  
**Project:** CV-Sushi Chef  
**Date:** 21 января 2026

# 🚀 SEO Quick Start Guide

**5 minutes to Google-ready site**

---

## ✅ COMPLETED (Already Done)

### 1. Canonical Domain ✅
```
All pages use: https://dima-fomin.pl
```

### 2. Vercel Redirects ✅
```
vercel.app → 301 → dima-fomin.pl
```

### 3. Sitemap ✅
```
https://dima-fomin.pl/sitemap.xml
```

### 4. Robots.txt ✅
```
https://dima-fomin.pl/robots.txt
```

### 5. Meta Tags ✅
```
✅ Title
✅ Description
✅ OpenGraph
✅ Canonical
```

---

## 📋 TODO (After Deploy)

### Step 1: Deploy to Production
```bash
git add .
git commit -m "feat: SEO 2025 configuration"
git push origin main
```
**Time:** 2 minutes  
**Wait:** 3-5 minutes for Vercel build

---

### Step 2: Verify Deployment
```bash
# Check canonical tag
curl -s https://dima-fomin.pl | grep 'canonical'

# Check redirect
curl -I https://cv-dimafomin.vercel.app
# Should return: 301 → https://dima-fomin.pl

# Check sitemap
open https://dima-fomin.pl/sitemap.xml

# Check robots
open https://dima-fomin.pl/robots.txt
```
**Time:** 2 minutes

---

### Step 3: Google Search Console
```
1. Go to: https://search.google.com/search-console
2. Click: "Add Property"
3. Choose: "Domain"
4. Enter: dima-fomin.pl
5. Click: "Continue"
```
**Time:** 1 minute

---

### Step 4: DNS Verification
```
Google will show:
┌─────────────────────────────────────────────┐
│ TXT Record:                                 │
│ google-site-verification=abc123...xyz789    │
└─────────────────────────────────────────────┘

Add to your DNS:
1. Go to domain registrar (e.g., Cloudflare)
2. DNS settings
3. Add TXT record:
   Type: TXT
   Name: @ (or leave empty)
   Value: google-site-verification=...
4. Save
```
**Time:** 3 minutes  
**Wait:** 5-10 minutes for DNS propagation

---

### Step 5: Verify in Search Console
```
1. Back to Search Console
2. Click: "Verify"
3. Status should show: ✅ Verified
```
**Time:** 1 minute

---

### Step 6: Submit Sitemap
```
1. In Search Console → Sitemaps (left menu)
2. Enter: https://dima-fomin.pl/sitemap.xml
3. Click: "Submit"
4. Status: Success ✅
```
**Time:** 1 minute

---

## 🎯 DONE!

### What Happens Next:

**24 hours:**
- Google starts crawling your site
- Pages appear in Search Console "Coverage"

**72 hours:**
- Pages start appearing in Google search
- Test: `site:dima-fomin.pl` in Google

**1 week:**
- All pages indexed
- Brand search "Dima Fomin" shows site

**1 month:**
- Keyword rankings improve
- Organic traffic increases

---

## 🧪 Quick Test Commands

```bash
# Test canonical
curl -s https://dima-fomin.pl | grep -o '<link rel="canonical"[^>]*>'

# Test redirect
curl -I https://cv-dimafomin.vercel.app | grep -i location

# Test sitemap
curl https://dima-fomin.pl/sitemap.xml | head -20

# Test robots
curl https://dima-fomin.pl/robots.txt
```

---

## 📊 Success Metrics

### Immediate (Day 1):
- ✅ Canonical tag visible
- ✅ Redirect working
- ✅ Sitemap accessible

### Short-term (Week 1):
- ✅ Pages in Search Console
- ✅ `site:dima-fomin.pl` shows results

### Long-term (Month 1):
- ✅ Keyword rankings
- ✅ Organic traffic
- ✅ Featured snippets

---

## 🆘 Troubleshooting

### "Canonical tag not found"
```bash
# Check if deployed
vercel --prod

# Force refresh
Ctrl+Shift+R (hard reload)
```

### "Redirect not working"
```bash
# Wait 5 minutes after deploy
# Vercel needs time to propagate

# Check vercel.json deployed:
curl https://dima-fomin.pl/.vercel/output/config.json
```

### "Google can't verify"
```bash
# DNS takes time
# Wait 10-15 minutes

# Check DNS:
dig TXT dima-fomin.pl
nslookup -type=TXT dima-fomin.pl
```

### "Sitemap not found"
```bash
# Clear Next.js cache
rm -rf .next
npm run build
vercel --prod
```

---

## 📚 Full Documentation

For detailed explanation:
- **docs/SEO_CONFIGURATION_2025.md** - Complete guide

For quick reference:
- **This file** - Quick start

---

**Total Time:** ~15 minutes  
**Result:** Google-ready site ✅  
**Next:** Wait 24-72h for indexing

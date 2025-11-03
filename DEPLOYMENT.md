# 🚀 Deployment Instructions

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via GitHub

1. **Push to GitHub:**
```bash
git add .
git commit -m "Add SEO optimization"
git push origin main
```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository `cv_dimafomin`
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app`

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live! 🎉

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Custom Domain Setup

### If you have `dima-fomin.pl`:

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Add `dima-fomin.pl` and `www.dima-fomin.pl`

2. **In your Domain Registrar:**
   - Add A record: `76.76.21.21` (Vercel IP)
   - Or CNAME: `cname.vercel-dns.com`

3. **Update Environment Variable:**
   ```
   NEXT_PUBLIC_SITE_URL=https://dima-fomin.pl
   ```

4. **SSL Certificate:**
   - Vercel provides free SSL automatically
   - No additional setup needed

## Alternative: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your site
npm run build

# Deploy
netlify deploy --prod
```

## Post-Deployment Checklist

- [ ] Check sitemap: `https://dima-fomin.pl/sitemap.xml`
- [ ] Check robots.txt: `https://dima-fomin.pl/robots.txt`
- [ ] Test language switching (PL ↔ UA)
- [ ] Verify Schema.org in [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Check mobile responsiveness
- [ ] Test contact form
- [ ] Submit sitemap to Google Search Console
- [ ] Test social media preview (Facebook, LinkedIn)

## Performance Optimization

After deployment, check:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## Monitoring

Set up these tools:
1. **Google Analytics** - Track visitors
2. **Google Search Console** - Monitor SEO
3. **Vercel Analytics** - Performance monitoring

---

Need help? Contact: fodi85999@gmail.com

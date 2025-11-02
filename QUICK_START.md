# ⚡ Quick Customization Guide

This guide shows you exactly where to edit to personalize your portfolio.

---

## 🎯 Most Important Changes

### 1. Update Your Contact Information (5 minutes)

**File:** `components/sections/Contact.tsx`

Find this section around line 55:

```typescript
const socialLinks = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://instagram.com/dimafomin",  // ← CHANGE THIS
    username: "@dimafomin",                    // ← CHANGE THIS
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/dimafomin", // ← CHANGE THIS
    username: "Dima Fomin",                     // ← CHANGE THIS
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:dima.fomin@example.com",     // ← CHANGE THIS
    username: "dima.fomin@example.com",        // ← CHANGE THIS
  },
  {
    icon: Phone,
    label: "WhatsApp",
    href: "https://wa.me/48123456789",         // ← CHANGE THIS
    username: "+48 123 456 789",               // ← CHANGE THIS
  },
];
```

---

### 2. Add Your Real Photos (10 minutes)

#### Hero Background
**File:** `components/sections/Hero.tsx` (line 25)

```typescript
backgroundImage:
  "url('https://YOUR-IMAGE-URL-HERE.jpg')",  // ← CHANGE THIS
```

#### About Section Photo
**File:** `components/sections/About.tsx` (line 35)

```typescript
<img
  src="https://YOUR-PHOTO-URL-HERE.jpg"  // ← CHANGE THIS
  alt="Dima Fomin at work"
  className="w-full h-[500px] object-cover"
/>
```

#### Portfolio Images
**File:** `components/sections/Portfolio.tsx` (lines 10-60)

```typescript
const portfolioImages = [
  {
    id: 1,
    src: "https://YOUR-SUSHI-PHOTO-1.jpg",  // ← CHANGE THESE
    alt: "Nigiri sushi selection",
    title: "Nigiri Selection",
  },
  // ... add 5-11 more images
];
```

---

### 3. Update Your Bio (3 minutes)

**File:** `components/sections/About.tsx` (lines 48-70)

Replace the text in these `<p>` tags with your real story:

```typescript
<p className="text-lg text-muted-foreground leading-relaxed">
  Jestem <strong className="text-foreground">Dima Fomin</strong>,
  profesjonalnym szefem kuchni sushi z{" "}
  <strong className="text-foreground">
    ponad 8-letnim doświadczeniem  // ← UPDATE your years
  </strong>{" "}
  w tworzeniu autentycznych japońskich potraw.
</p>
```

---

### 4. Update Your Experience (10 minutes)

**File:** `components/sections/Experience.tsx` (lines 7-45)

```typescript
const experiences = [
  {
    id: 1,
    restaurant: "Nobu Restaurant",        // ← CHANGE to your restaurants
    location: "Tokyo, Japan",             // ← CHANGE locations
    position: "Senior Sushi Chef",        // ← CHANGE positions
    period: "2019 - 2022",               // ← CHANGE dates
    description:                          // ← CHANGE descriptions
      "Prowadzenie sekcji sushi...",
    logo: "https://restaurant-logo.jpg",  // ← CHANGE logo URLs
  },
  // ... add or remove restaurants
];
```

---

### 5. Adjust Your Skills (5 minutes)

**File:** `components/sections/Skills.tsx` (lines 11-45)

```typescript
const skills = [
  {
    icon: Fish,
    title: "Nigiri & Sashimi",
    description: "Mistrzowska obróbka ryb i tradycyjne techniki krojenia",
    level: 95,  // ← CHANGE percentage (0-100)
  },
  // ... update all 6 skills
];
```

---

## 🎨 Style Customization

### Change Theme Colors

**File:** `app/globals.css` (lines 48-65)

```css
:root {
  /* Warm neutral Japanese-inspired palette */
  --background: oklch(0.98 0.005 60);     /* Main background */
  --foreground: oklch(0.2 0.01 40);       /* Text color */
  --primary: oklch(0.25 0.02 30);         /* Buttons, accents */
  /* ... change these values for different colors */
}
```

**Color picker:** Use [OKLCH Color Picker](https://oklch.com/)

---

### Change Fonts

**File:** `app/layout.tsx` (lines 4-13)

```typescript
import { Geist, Geist_Mono } from "next/font/google";

// Replace with any Google Font:
// import { Inter, Playfair_Display } from "next/font/google";
```

---

## 🔧 Contact Form Setup

Currently the form just shows a success message. To make it actually send emails:

### Option 1: Use Formspree (Easiest)

1. Go to [formspree.io](https://formspree.io)
2. Create free account
3. Get your form endpoint
4. Update `components/sections/Contact.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Add this:
  const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  
  if (response.ok) {
    setSubmitStatus("success");
    // ... rest of code
  }
};
```

### Option 2: Use Next.js API Route

Create `app/api/contact/route.ts` and use SendGrid, AWS SES, or Resend.

---

## 📱 Create Real App Icons

### Quick Method:
1. Create a 512x512px square image with your logo/photo
2. Use [RealFaviconGenerator.net](https://realfavicongenerator.net/)
3. Upload your image
4. Download the generated icons
5. Replace files in `/public/`:
   - `icon-192x192.png`
   - `icon-512x512.png`
   - `favicon.ico`

---

## 🚀 Deploy to Vercel (5 minutes)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Follow prompts, then visit your live URL!
```

Or use GitHub:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy
5. Done! ✨

---

## 📊 Add Google Analytics

**File:** `app/layout.tsx` (add before closing `</body>`):

```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

---

## ✅ Checklist Before Launch

- [ ] Updated all contact information
- [ ] Replaced all placeholder images
- [ ] Customized bio and experience
- [ ] Created and added app icons
- [ ] Tested contact form
- [ ] Set up custom domain
- [ ] Added Google Analytics
- [ ] Tested on mobile devices
- [ ] Checked spelling in Polish text
- [ ] Submitted to Google Search Console

---

## 🆘 Common Issues

### Images not loading?
- Make sure URLs are https://
- Check image URLs in browser first
- Use Unsplash, Imgur, or upload to Vercel

### Contact form not working?
- It's currently just a demo
- Follow "Contact Form Setup" above

### PWA not installing?
- Only works on HTTPS (production)
- Works on localhost for testing
- Check manifest.json syntax

---

## 💡 Tips

1. **Images**: Use WebP format for faster loading
2. **SEO**: Update meta description with your unique story
3. **Performance**: Compress images before uploading
4. **Accessibility**: Add alt text to all images
5. **Mobile**: Test on real phone, not just browser resize

---

Need help? Check the README.md or PROJECT_SUMMARY.md files!

Good luck with your job search in Poland! 🍣🇵🇱

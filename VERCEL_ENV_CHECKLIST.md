# ============================================
# Vercel Environment Variables Checklist
# Next.js 16 Production Deployment
# The AI Forge - Hardware Comparison Platform
# ============================================

## Required Variables (Production)

### Core Application
```
NEXT_PUBLIC_APP_URL=https://theaiforge.ai
NEXT_PUBLIC_APP_NAME="The AI Forge"
NEXT_PUBLIC_APP_DESCRIPTION="AI Hardware Comparison & Workstation Builder"
```

### Analytics (Choose One)
```
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Or Vercel Analytics (built-in, no env needed)
# Or Plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=theaiforge.ai
```

### Image Optimization & CDN
```
# Optional: Custom image loader
NEXT_PUBLIC_IMAGE_CDN_URL=https://cdn.theaiforge.ai
```

## Optional Variables (Enhanced Features)

### Search & Discovery
```
# Algolia Search (for instant product search)
NEXT_PUBLIC_ALGOLIA_APP_ID=XXXXXXXXXX
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ALGOLIA_ADMIN_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Affiliate Links (Revenue)
```
# Amazon Associates
NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG=theaiforge-20

# AliExpress Affiliate
NEXT_PUBLIC_ALIEXPRESS_APP_KEY=xxxxxxxxxxxxxxxx
ALIEXPRESS_APP_SECRET=xxxxxxxxxxxxxxxx

# eBay Partner Network
NEXT_PUBLIC_EBAY_CAMPAIGN_ID=1234567890
EBAY_API_KEY=xxxxxxxxxxxxxxxx
```

### Security
```
# reCAPTCHA v3 (for form protection)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=xxxxxxxxxxxxxxxx
```

### Feature Flags
```
# Beta Features
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_COMPARE=true
NEXT_PUBLIC_ENABLE_BUILDER=true
```

## Build Configuration

### Bundle Analysis (Development)
```
ANALYZE=false
BUNDLE_ANALYZER_BROWSER=false
```

### Node Environment
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Vercel System Variables (Auto-populated)
These are automatically set by Vercel:
- `VERCEL_ENV` - production, preview, or development
- `VERCEL_URL` - deployment URL
- `VERCEL_REGION` - edge region code

## Deployment Checklist

### Before First Deploy
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Configure analytics tracking ID
- [ ] Verify all affiliate links work
- [ ] Enable image optimization domains in next.config.mjs
- [ ] Test middleware.ts security headers

### Performance Verification
- [ ] Run `npm run analyze` to check bundle size
- [ ] Verify image optimization works with remote patterns
- [ ] Test ISR revalidation on all routes
- [ ] Confirm static generation for home page

### Security Hardening
- [ ] CSP policy tested and validated
- [ ] Bot protection active (check middleware logs)
- [ ] Security headers present in all responses
- [ ] HSTS enabled and working

### Post-Deploy
- [ ] Verify sitemap.xml generates correctly
- [ ] Check robots.txt accessibility
- [ ] Test all dynamic routes (builder, compare)
- [ ] Validate image loading from all remote domains
- [ ] Confirm analytics tracking is clean (no bot traffic)

## Setting Variables in Vercel Dashboard

1. Go to Project Settings > Environment Variables
2. Add each variable from the lists above
3. Set Production, Preview, Development contexts as needed
4. Redeploy to apply changes

## Local Development

Create `.env.local` file with:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
ANALYZE=false
```

Note: Never commit `.env.local` to git (add to .gitignore)

# SEO Setup Guide for Gunung

Comprehensive SEO implementation for Google Search, Google Shopping, and search engine optimization.

## ✅ What's Been Implemented

### 1. **Metadata & Meta Tags**

- ✅ Enhanced title tags with template support
- ✅ Meta descriptions for all pages
- ✅ Keywords optimization
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Robots meta tags

### 2. **Structured Data (Schema.org)**

- ✅ Organization schema (homepage)
- ✅ Website schema with search action (homepage)
- ✅ Product schema (product pages) - includes price, availability, SKU
- ✅ Breadcrumb schema (product pages)

### 3. **XML Sitemap**

- ✅ Auto-generated sitemap at `/sitemap.xml`
- ✅ Includes all pages and products
- ✅ Updates automatically when products change

### 4. **Robots.txt**

- ✅ Auto-generated at `/robots.txt`
- ✅ Allows search engines, blocks admin/api routes
- ✅ Points to sitemap

### 5. **Google Shopping Feed**

- ✅ RSS/XML product feed at `/api/product-feed`
- ✅ Compatible with Google Merchant Center
- ✅ Includes prices, availability, images, categories

---

## 🚀 Setup Instructions

### Step 1: Environment Variables

Add to your `.env.local` and Vercel environment variables:

```bash
# Your production URL (REQUIRED)
NEXT_PUBLIC_URL=https://yoursite.com

# Google Search Console verification (optional, get from Google Search Console)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code

# Google Analytics (already configured)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 2: Google Search Console

1. **Verify your site:**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add property with your domain
   - Choose "HTML tag" method
   - Copy the verification code (the part after `content=`)
   - Add to `.env.local`: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-code`
   - Redeploy

2. **Submit sitemap:**
   - In Search Console, go to "Sitemaps"
   - Add new sitemap: `https://yoursite.com/sitemap.xml`
   - Click "Submit"

3. **Request indexing:**
   - Go to "URL Inspection"
   - Enter your homepage URL
   - Click "Request Indexing"
   - Repeat for key pages (store page, top products)

### Step 3: Google Merchant Center (For Google Shopping)

1. **Create account:**
   - Go to [Google Merchant Center](https://merchants.google.com/)
   - Create an account
   - Verify and claim your website

2. **Add product feed:**
   - In Merchant Center, go to "Products" → "Feeds"
   - Click "+" to add a feed
   - Choose "Scheduled fetch"
   - Feed URL: `https://yoursite.com/api/product-feed`
   - Fetch frequency: Daily
   - Country: Malaysia
   - Language: English
   - Save and test fetch

3. **Set up shipping:**
   - Go to "Shipping and returns"
   - Add your shipping rates for Malaysia
   - Match what you've configured in your store

4. **Link to Google Ads (optional):**
   - For Shopping Ads, link your Merchant Center to Google Ads
   - Create Shopping campaigns to show products

### Step 4: Social Media Meta Tags

Update `lib/seo.ts` to add your social media profiles:

```typescript
sameAs: [
  'https://www.facebook.com/gunung',
  'https://www.instagram.com/gunung',
  'https://twitter.com/gunung',
  // Add all your social profiles
],
```

And update Twitter handle:

```typescript
twitter: {
  // ...
  creator: '@yourtwitterhandle',
}
```

### Step 5: Create OG Images (Optional but Recommended)

For better social sharing, create:

- `/public/og-image.png` (1200x630px) - default share image
- Product-specific images already use product images

---

## 📊 Monitoring & Validation

### Test Your Implementation

1. **Structured Data:**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Test product pages to verify Product schema

2. **Meta Tags:**
   - [Meta Tags Validator](https://metatags.io/)
   - Test homepage and product pages

3. **Mobile Friendly:**
   - [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

4. **PageSpeed:**
   - [Google PageSpeed Insights](https://pagespeed.web.dev/)
   - Aim for 90+ on mobile and desktop

5. **Open Graph:**
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Regular Monitoring

- **Google Search Console:** Check for indexing issues, search performance
- **Google Analytics:** Monitor traffic, user behavior
- **Merchant Center:** Check for product feed errors

---

## 🎯 SEO Best Practices Checklist

### Content

- ✅ Unique, descriptive titles for each page
- ✅ Compelling meta descriptions (150-160 characters)
- ✅ Descriptive product names and details
- ✅ Alt text for images (already handled via `alt` props)

### Technical

- ✅ Fast loading times (Next.js optimized)
- ✅ Mobile responsive design
- ✅ HTTPS (Vercel default)
- ✅ Clean URLs (Next.js routing)
- ✅ Proper heading hierarchy (H1 → H2 → H3)

### To-Do (Optional Enhancements)

- ☐ Add blog for content marketing
- ☐ Get backlinks from climbing forums/blogs
- ☐ Create video content (product reviews, climbing tips)
- ☐ Build email list for marketing
- ☐ Add customer reviews/testimonials with schema markup
- ☐ Implement FAQ schema
- ☐ Add local business schema if you have physical location

---

## 🛍️ Google Shopping Setup Summary

Your product feed is live at: `/api/product-feed`

**Feed includes:**

- Product ID, title, description
- Images, prices, availability
- Brand (Gunung)
- Product category (Climbing gear)
- Stock status (auto-updated)

**To appear in Google Shopping:**

1. Complete Merchant Center setup (Step 3 above)
2. Ensure feed has no errors
3. Products will appear in "Shopping" tab on Google
4. Optionally run Shopping Ads campaigns

---

## 📞 Support

Issues with SEO setup? Check:

- Vercel deployment logs for errors
- Google Search Console for indexing issues
- Merchant Center for feed errors

Common issues:

- **Sitemap 404:** Ensure `NEXT_PUBLIC_URL` is set correctly
- **Products not showing:** Check Supabase is connected and products are active
- **Schema errors:** Validate with Rich Results Test

---

## 🚀 Expected Timeline

- **Google Search:** 1-4 weeks for initial indexing
- **Search Rankings:** 2-6 months for competitive keywords
- **Google Shopping:** 3-7 days after feed approval
- **Social Media Cards:** Immediate after clearing cache

**Pro tip:** Don't wait! Start creating content, getting backlinks, and building your brand presence now.

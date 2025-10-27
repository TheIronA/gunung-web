# Gunung — Malaysia's First Climbing Brand

A modern, neo-brutalist landing page for Gunung, Malaysia's first homegrown climbing brand.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling with custom neo-brutalist design system

## Design Features

### Neo-Brutalist Aesthetic
- 3px solid borders throughout
- Hard offset shadows (no soft blurs)
- Minimal border radius (4px)
- Bold, geometric design with high contrast

### Color Scheme
- **Primary**: Deep slate navy (#0F172A)
- **Accent**: Green tones (#10B981, #34D399, #059669)
- **Background**: Light slate (#F8FAFC, #F1F5F9)
- **Borders**: Light gray (#E2E8F0)

### Typography
- **Headings**: Space Grotesk (bold, geometric)
- **Body**: Inter (clean, readable)
- **Code/Labels**: JetBrains Mono

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd "c:\Users\mralw\Desktop\random projects\Gunung"
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Gunung/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles & Tailwind
├── components/
│   ├── Navigation.tsx      # Sticky navigation bar
│   ├── Hero.tsx           # Hero section with mountain silhouette
│   ├── About.tsx          # About Gunung & founder info
│   ├── Problem.tsx        # Problem statement with growth chart
│   ├── Opportunity.tsx    # Malaysia's advantages
│   ├── Mission.tsx        # Mission statement & CTA
│   ├── Contact.tsx        # Contact form
│   └── Footer.tsx         # Footer
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies & scripts
```

## Sections

1. **Hero** - Bold introduction with mountain silhouette background
2. **About** - Company story and founder profile (Syed Alwi Al-haddad)
3. **Problem** - Market challenges with climbing gym growth chart
4. **Opportunity** - Malaysia's natural advantages (rubber, manufacturing, community)
5. **Mission** - Vision statement with CTA
6. **Contact** - Contact form with email: contact@gunung.my

## Customization

### Colors
Edit [tailwind.config.ts](tailwind.config.ts) to change the color scheme:

```typescript
colors: {
  accent: {
    DEFAULT: "#10B981",  // Change to your preferred color
    light: "#34D399",
    dark: "#059669",
  },
}
```

### Content
- Edit component files in the `components/` directory
- Update metadata in [app/layout.tsx](app/layout.tsx)

## Contact

Email: contact@gunung.my

---

**Built with**: Next.js, React, TypeScript, Tailwind CSS
**Design**: Neo-brutalist aesthetic inspired by Patagonia × So iLL, Southeast Asian spirit
**License**: Private

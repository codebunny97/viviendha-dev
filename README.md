# Viviendha Developers — Official Website & Management System

> Modern, premium web platform and content management architecture for Viviendha Developers in Hyderabad, Telangana.

## Features

- **Architectural Design System**: Clean typography, sophisticated high-contrast emerald & slate color palette, subtle glassmorphism, and responsive layouts.
- **Dynamic Project Showcase**: Searchable and filterable portfolio of residential landmarks (Completed, Ongoing, Upcoming).
- **Secure Admin Portal (`/admin`)**:
  - Protected by server-side HMAC-SHA256 JWT authentication.
  - Project management dashboard (create, edit, publish/unpublish, delete).
  - Multi-tab editor supporting specifications, amenities, floor plans, progress indicators, FAQs, image galleries, and PDF brochure/plan uploads.
- **Client Inquiries & Contact Dispatch**: Interactive booking and inquiry modal with serverless dispatch (`api/contact.js`).
- **Leadership & Brand Vision (`/team`)**: Executive board profiles and architectural vision statement.
- **SEO & Performance**: Optimized Vite build, meta tags, and structured open-graph data.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, React Router
- **Backend / Serverless**: Node.js serverless functions (Vercel-compatible) in `/api`
- **Security**: JWT authentication, server-only credentials, sanitized `.env.example`

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/codebunny97/vivienndha-website.git
   cd vivienndha-website/viviendha
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set your credentials:
   ```bash
   cp .env.example .env
   ```
   Configure:
   - `ADMIN_EMAIL`: Admin login email
   - `ADMIN_PASSWORD`: Strong password for the admin portal
   - `ADMIN_JWT_SECRET`: Random 256-bit secret string for token signing
   - `NOTIFICATION_EMAIL`: Inquiries recipient (`satya@viviendhadevelopers.com`)
   - `RESEND_API_KEY`: (Optional) Resend API key for production email dispatch

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## License
Private & Proprietary — Viviendha Developers. All rights reserved.
<!-- git-workflow: verified -->

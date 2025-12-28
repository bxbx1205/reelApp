# ClipVerse

A clean, modern short-form video platform built with Next.js 16. Watch, create, and share moments that matter.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- **Vertical Video Feed** - Smooth, snap-scrolling video feed like Instagram Reels
- **Video Upload** - Upload videos up to 100MB with ImageKit integration
- **Authentication** - Google OAuth and email/password login via NextAuth
- **Like System** - Like videos with persistent storage
- **User Profiles** - View and manage your uploaded videos
- **Admin Panel** - Moderation tools for admin users
- **Responsive Design** - Works seamlessly on mobile and desktop
- **Dark Theme** - Cinematic dark palette with pale yellow accents

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v4
- **Video Hosting**: ImageKit
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- ImageKit account
- Google OAuth credentials (optional)

### Environment Variables

Create a `.env` file based on `env.sample`:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### Installation

```bash
# Clone the repository
git clone https://github.com/bxbx1205/clipverse.git
cd clipverse

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── app/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── api/             # API routes
│   ├── feed/            # Video feed page
│   ├── profile/         # User profile page
│   ├── upload/          # Video upload page
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── admin/           # Admin panel
├── lib/                 # Utilities (auth, db)
├── models/              # Mongoose models
└── public/              # Static assets
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/videos` | GET | Fetch all videos |
| `/api/videos` | POST | Upload a new video |
| `/api/videos/[id]` | DELETE | Delete a video |
| `/api/videos/[id]/like` | POST | Toggle like on a video |
| `/api/videos/user` | GET | Fetch current user's videos |
| `/api/auth/register` | POST | Register new user |
| `/api/imagekit-auth` | GET | Get ImageKit upload credentials |

## Admin Access

Admin users have access to additional moderation features. To set up an admin:

1. Sign in with Google using the designated admin email
2. The admin email is configured in `lib/auth.ts`

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the project and run the production server:

```bash
npm run build
npm run start
```

---

Built with ❤️ by Bxbx

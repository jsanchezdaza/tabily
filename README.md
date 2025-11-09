# tabily - AI Trip Planner

An AI-powered trip planning application built with React, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication, Database)
- **Testing**: Playwright (Acceptance Testing)

## Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase account

## Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Supabase**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Configure Supabase Authentication**

   In your Supabase project dashboard:
   - Go to Authentication → Providers
   - Enable Email provider
   - Enable Google provider and configure OAuth credentials
   - Add `http://localhost:5173` to Site URL in Authentication settings

## Development

Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Testing

Run acceptance tests:
```bash
pnpm test
```

Run tests with UI:
```bash
pnpm test:ui
```

## Build

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## Features

- ✅ Email/Password authentication
- ✅ Google OAuth authentication
- ✅ Modern, responsive login UI
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

## Development Approach

This project follows:
- **TDD (Test-Driven Development)** - Tests written before implementation
- **Lean & XP Principles** - YAGNI, simplicity, small iterations
- **Acceptance Testing** - Using Playwright for end-to-end tests

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LINE LIFF-based web application for mothers to search for family-friendly outing spots. Built with React + Vite, using LINE LIFF SDK for authentication and Supabase for backend.

**Tech Stack:**
- Frontend: React 19 + Vite 7
- Authentication: LINE LIFF SDK (@line/liff)
- Database: Supabase (PostgreSQL)
- Geolocation: Browser Geolocation API
- Future: Google Maps API integration

## Development Commands

### Quick Start (Recommended)

```bash
npm install              # Install dependencies (includes @line/liff-cli)
npm run liff:setup      # Interactive LIFF setup (one-time)
npm start               # Start both dev server + LIFF proxy
```

Access your app at: `https://liff.line.me/<YOUR_LIFF_ID>`

### Individual Commands

```bash
npm run dev             # Start Vite dev server (http://localhost:5173)
npm run liff:serve      # Start LIFF proxy server (https://localhost:9000)
npm run liff:list       # List all LIFF apps
npm run build           # Build for production
npm run lint            # Run ESLint
npm run preview         # Preview production build
```

### LIFF Setup Details

**One-Time Setup:**

1. **SSL Certificate (Required for LIFF):**
```bash
# macOS
brew install mkcert
mkcert -install
mkcert localhost

# Windows
choco install mkcert
mkcert -install
mkcert localhost
```

2. **LIFF Configuration:**
```bash
npm run liff:setup
```
This interactive script will:
- Add your LINE channel from `.env` credentials
- Set default channel
- Create or reuse existing LIFF app
- Update `.env` with LIFF ID

**Manual LIFF CLI Usage:**
```bash
# Add LINE channel
npx liff-cli channel add <CHANNEL_ID>

# Create LIFF app
npx liff-cli app create \
  --channel-id <CHANNEL_ID> \
  --name "ママのおでかけスポット検索" \
  --endpoint-url https://localhost:9000 \
  --view-type full

# Start LIFF proxy manually
npx liff-cli serve \
  --liff-id <YOUR_LIFF_ID> \
  --url http://localhost:5173/
```

**Development Workflow:**
1. Run `npm start` (starts both Vite + LIFF proxy)
2. Access via LIFF URL: `https://liff.line.me/<YOUR_LIFF_ID>`
3. Use LINE app or LIFF browser for testing

## Architecture

### Application Flow
1. **LIFF Initialization** (`useLiff` hook) → LINE authentication
2. **Location Request** (Browser Geolocation API) → Get user coordinates
3. **Spot Search** (`getSpotsByLocation` service) → Query Supabase with location
4. **Distance Calculation** (Haversine formula) → Filter spots within radius
5. **Render Results** → Display spots sorted by distance

### Key Architecture Patterns

**Hook-Based State Management:**
- `useLiff()`: LIFF SDK initialization, login state, user profile
- `useLocation()`: Geolocation API wrapper with loading/error states
- No external state management library (Redux/Zustand) - using React hooks only

**Service Layer Pattern:**
- `services/supabase.js`: Centralized Supabase client and data fetching
- All database queries go through service functions (e.g., `getSpotsByLocation`)
- Distance calculation performed client-side using Haversine formula

**Component Structure:**
```
App.jsx (root)
├── SpotCard.jsx (list view)
└── SpotDetail.jsx (detail view)
```
Simple single-level routing via `selectedSpot` state (no React Router).

### Data Flow

**Spots Query Flow:**
1. User grants location permission → `location` state updates
2. `useEffect` triggers `fetchSpots()` → calls `getSpotsByLocation(lat, lng, radius)`
3. Supabase query fetches all spots (no PostGIS, simple lat/lng columns)
4. Client-side distance calculation via Haversine formula
5. Filter spots within radius, sort by distance
6. Render as `<SpotCard>` components

**Important:** Distance calculation is client-side. For large datasets, consider migrating to PostGIS spatial queries in Supabase.

### Environment Variables

Required in `.env`:
```
VITE_LIFF_ID=<your_liff_id>
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
VITE_GOOGLE_MAPS_API_KEY=<optional>
```

Access via `import.meta.env.VITE_*` (Vite convention).

## Database Schema

### `spots` Table

**Core Columns:**
- `id`: UUID (primary key)
- `name`: TEXT (facility name)
- `address`: TEXT
- `lat`, `lng`: DECIMAL (coordinates)
- `description`: TEXT

**Facility Attributes:**
- `parking`: TEXT ('無料' | '有料' | 'なし')
- `stroller_friendly`: BOOLEAN
- `nursing_room`: BOOLEAN
- `diaper_change`: BOOLEAN
- `restroom_types`: TEXT[] (array of types)

**Additional:**
- `congestion_level`: TEXT ('low' | 'medium' | 'high')
- `photos`: TEXT[] (image URLs)
- `reviews_ai`: TEXT (AI-generated summary)
- `created_at`, `updated_at`: TIMESTAMP

**Security:**
- Row Level Security (RLS) enabled
- Public read access for all users
- Admin-only write access (policy commented out, to be implemented)

**Index:**
- `spots_location_idx` on (lat, lng) for geolocation queries

### Database Setup

```bash
# 1. Execute schema in Supabase SQL Editor
# Run: supabase/schema.sql

# 2. Seed sample data
# Run: supabase/seed.sql
```

## Code Conventions

### Naming
- Components: PascalCase (e.g., `SpotCard.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useLiff.js`)
- Services: camelCase (e.g., `supabase.js`)
- Utilities: camelCase

### Component Style
- Functional components with hooks (no class components)
- Inline styles using style objects (no CSS modules/styled-components yet)
- Props destructuring in function parameters
- JSDoc comments for service functions

### Import Patterns
```javascript
// Hooks
import { useLiff, useLocation } from './hooks/useLiff';

// Services
import { getSpotsByLocation } from './services/supabase';

// Components
import { SpotCard } from './components/SpotCard';
```

## Important Notes

### LIFF Development
- **HTTPS Required:** LIFF only works over HTTPS (use LIFF CLI proxy or ngrok)
- **Location Permission:** Must be granted in LINE browser/app for geolocation
- **LIFF URL Format:** `https://liff.line.me/<LIFF_ID>`
- **Login Flow:** Auto-redirect to LINE login if not authenticated

### Supabase Queries
- Current implementation fetches ALL spots then filters client-side
- For production: Optimize with PostGIS spatial queries or RPC functions
- RLS policies enforce read-only access for anonymous users

### Location Services
- Using browser Geolocation API (not LIFF's location API)
- Requires HTTPS for security
- Distance calculation: Haversine formula (±0.5% accuracy)
- Default search radius: 20km

## Known Limitations

1. **No Pagination:** Fetches all spots at once (client-side filtering)
2. **No Caching:** Every location search re-fetches from Supabase
3. **Simple Routing:** Uses state-based navigation (no URL routing)
4. **No Error Boundaries:** Missing React error boundaries for graceful failures
5. **Inline Styles:** No design system/theme management

## Future Enhancements (from README.md)

- Filter UI (parking, nursing rooms, etc.)
- Real-time congestion data
- User-contributed spots
- Favorites/bookmarks
- Push notifications for recommendations

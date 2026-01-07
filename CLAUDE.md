# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 (beta) application for Pegas, using React 19 and TypeScript. The project is a multilingual website that fetches content from a WordPress backend via GraphQL and renders it using modern React patterns with Turbopack for build optimization.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

**IMPORTANT**: Do NOT restart the dev server or run builds. The developer handles these tasks separately in their own terminal.

## Architecture

### Internationalization (i18n)

- Uses `next-intl` for internationalization
- Currently supports Czech (`cs`) as the default and only locale
- Locale routing configuration in `i18n/routing.ts`
- Translation messages stored in `messages/cs.json`
- Localized routes defined in pathnames object (e.g., `/about-us` → `/o-nas`)
- All pages must be under `app/[locale]/` directory
- Use `setRequestLocale()` in page components for static generation

### Path Aliases

The project uses TypeScript path aliases (defined in `tsconfig.json`):
- `@/*` → `./src/*`
- `@/app*` → `./app/*`
- `@/public/*` → `./public/*`
- `@/images/*` → `./public/images/*`
- `@/fonts/*` → `./public/fonts/*`
- `@/videos/*` → `./public/videos/*`

### Directory Structure

```
app/[locale]/        # Next.js App Router pages (locale-based)
src/
  ├── api/           # Backend integration (WordPress GraphQL)
  ├── components/    # React components
  │   ├── _shared/   # Reusable components across pages
  │   ├── about-us/  # Page-specific components
  │   ├── footer/
  │   ├── header/
  │   ├── icons/
  │   └── ui/        # shadcn/ui components (excluded from linting)
  ├── hooks/         # Custom React hooks
  ├── lib/           # Third-party library configurations
  ├── providers/     # React context providers
  ├── styles/        # Global styles
  └── utils/         # Utility functions
i18n/                # Internationalization configuration
messages/            # Translation files
public/              # Static assets
```

### WordPress Integration

- Backend CMS is WordPress with GraphQL API (WPGraphQL)
- GraphQL endpoint configured via `NEXT_PUBLIC_GRAPHQL_URL` environment variable
- SEO data managed by Yoast SEO plugin
- Custom post types: `referencePost`, `sluzbyPost`, `pobockaPost`
- Data fetching functions located in `src/api/wordpress-api.ts`
- SEO metadata helpers in `src/utils/seo.ts`
- All GraphQL queries use ISR with `next: { revalidate: 3600 }` (1 hour)

#### WordPress Redirects

- Redirects managed via WordPress Redirection plugin
- Fetched via GraphQL and cached in middleware (5-minute TTL)
- Middleware handles redirect matching before i18n routing
- Revalidation endpoint: `POST /api/v1/revalidate-redirects`
- Cache tags: `wordpress`, `redirects`

### State Management & Data Fetching

- React Query (`@tanstack/react-query`) for server state
- QueryClient configured in `BaseProvider` (`src/providers/BaseProvider.tsx`)
- React Query DevTools available in development

### Key Libraries & Features

- **UI Components**: Radix UI primitives + shadcn/ui pattern
- **Animations**: Framer Motion (`framer-motion`) and Motion library
- **Forms**: React Hook Form with Yup validation
- **Styling**: Tailwind CSS v4 with custom animations
- **Smooth Scroll**: Lenis library via `SmoothScrollProvider`
- **Carousels**: Embla Carousel with autoplay
- **Icons**: Lucide React
- **Toast Notifications**: Sonner
- **Loading Progress**: HolyLoader (top bar)
- **Physics**: Matter.js (for feather animations)

### Styling Conventions

- Tailwind CSS v4 with PostCSS
- Component variants using `class-variance-authority`
- Utility class merging with `tailwind-merge` (clsx)
- Custom animation utilities via `tailwindcss-animate`

### ESLint Configuration

Key rules enforced:
- **Import organization**: Enforced by `import-helpers/order-imports` with specific grouping (module → @/ → relative)
- **No relative imports**: Using `no-restricted-imports` to prevent `../` and `./` patterns - use path aliases instead
- **Component definition**: Arrow functions only for named components
- **Unused imports**: Automatically detected and must be removed
- **React Compiler**: Enabled and enforced (`react-compiler/react-compiler: error`)
- Files excluded from linting: `src/components/ui/**`, `src/lib/utils.ts`

## Important Patterns

### Creating New Pages

1. Pages must be created under `app/[locale]/` directory
2. Call `setRequestLocale(locale)` at the top of the component for static generation
3. Add route to `pathnames` in `i18n/routing.ts` if it needs a translated URL
4. Use `BasePageProps` interface for params typing
5. Fetch SEO data using `fetchSEOData()` from `src/utils/seo.ts`

Example:
```typescript
import { setRequestLocale } from 'next-intl/server';
import { BasePageProps } from '../layout';

const Page = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  // ... rest of component
};
```

### Importing Components

Always use path aliases, never relative imports:
```typescript
// ✅ Correct
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// ❌ Wrong (will fail ESLint)
import { Button } from '../../components/ui/button';
```

### Environment Variables

Required environment variables (see `.env.local`):
- `APP_ENV` - Environment (local, development, production)
- `APP_NAME` - Application name
- `FRONTEND_URL` - Frontend URL
- `NEXT_PUBLIC_BACKEND_URL` - WordPress backend URL
- `NEXT_PUBLIC_GRAPHQL_URL` - WordPress GraphQL endpoint
- `GTM_ID` - Google Tag Manager ID (optional)
- `WORDPRESS_API_KEY` - API key for WordPress webhook authentication (required for redirect revalidation)

### Layout Structure

All pages render within this layout hierarchy:
1. `BaseProvider` - React Query client
2. `NextIntlClientProvider` - i18n context
3. `SmoothScrollProvider` - Lenis smooth scrolling
4. `Header` - Site header (sticky)
5. Page content
6. `Footer` - Site footer
7. `StickyContact` - Floating contact button
8. `Toaster` - Toast notifications

### Performance Optimizations

- React Compiler enabled (experimental)
- Turbopack for faster builds
- Image optimization disabled (`unoptimized: true`) - images served from WordPress
- Static image caching with long cache headers
- ISR with 1-hour revalidation for WordPress content
- Bundle analyzer available with `ANALYZE=true npm run build`

## TypeScript

- Strict mode enabled
- Target: ES2022
- JSX runtime: `react-jsx` (no need to import React)
- Module resolution: `bundler`

## Testing

Currently no test framework is configured in this project.

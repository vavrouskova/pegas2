# ============================================
# Discomp Frontend - Production-Only Dockerfile
# ============================================
# Multi-stage build for Next.js production deployment

# ============================================
# Stage 1: Base Image
# ============================================
FROM oven/bun:1-alpine AS base

LABEL maintainer="(ant) Team"
LABEL org.opencontainers.image.source="https://git.antstudio.cz/react/pegas"
LABEL org.opencontainers.image.description="Pegas Frontend - Next.js Application"

RUN apk add --no-cache libc6-compat

WORKDIR /app

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS deps

WORKDIR /app

COPY package.json ./
COPY bun.lock* ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    if [ -f bun.lock ]; then \
        bun install --frozen-lockfile; \
    else \
        bun install; \
    fi

# ============================================
# Stage 3: Builder
# ============================================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time configuration (passed via --build-arg)
# Only vars used in next.config.ts are required at build time
ARG NODE_ENV=production
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_FRONTEND_URL

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}


# Build Next.js
RUN bun run build

# ============================================
# Stage 4: Production Runner
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next && \
    chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

CMD ["node", "server.js"]

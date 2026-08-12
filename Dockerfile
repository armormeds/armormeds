# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Install deps first (layer cache: only re-runs if package files change)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Prune dev dependencies before copying to final image
RUN npm prune --omit=dev

# ── Stage 2: Production image ────────────────────────────────────────────────
FROM node:20-slim AS runner

# Security: run as non-root user (required for HIPAA hardening)
RUN groupadd -r armormeds && useradd -r -g armormeds -s /bin/false armormeds

WORKDIR /app

# Copy only what's needed from the build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Cloud Run serves on 8080
ENV NODE_ENV=production
ENV PORT=8080

# Drop to non-root
USER armormeds

EXPOSE 8080

# Tini-style: use node directly (Cloud Run handles signals)
CMD ["node", "dist/index.cjs"]

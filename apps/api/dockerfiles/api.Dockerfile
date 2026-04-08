# =============================================================================
# Stage 1: Builder - Compile TypeScript and prune dev deps
# =============================================================================
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build && npm prune --omit=dev --legacy-peer-deps

# =============================================================================
# Stage 2: Production - Minimal runtime image
# =============================================================================
FROM node:24-alpine AS runner

RUN apk add --no-cache dumb-init=1.2.5-r3

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER node
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/core/v1/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]

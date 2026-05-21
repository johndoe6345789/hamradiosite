FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY next.config.ts tsconfig.json next-env.d.ts ./

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Use a placeholder that gets replaced at runtime via entrypoint.sh sed
ENV NEXT_PUBLIC_API_URL=__NEXT_PUBLIC_API_URL__
# Cap build heap: constrained 3.8 GB host runs metabuilder stack concurrently
ENV NODE_OPTIONS=--max-old-space-size=1024
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chmod=755 entrypoint.sh /app/entrypoint.sh
# entrypoint runs as root to do sed, then drops to nextjs user via exec
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]

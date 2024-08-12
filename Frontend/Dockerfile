# Build Stage
FROM node:18-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install

FROM dependencies AS development
WORKDIR /app
COPY . .
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT 3000
EXPOSE 3000
CMD ["npm", "run" ,"dev"]

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine AS production
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT 3000
EXPOSE 3000
CMD HOSTNAME="0.0.0.0" node server.js
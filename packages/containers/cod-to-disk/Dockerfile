FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache rsync
COPY package.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
# No HEALTHCHECK: cron-shaped (hourly, app.ts), no HTTP listener to probe between ticks -
# the removed `node -e "process.exit(0)"` always passed and asserted nothing (see PR body).
CMD ["node", "--import", "@agentage/observability/bootstrap", "dist/index.js"]

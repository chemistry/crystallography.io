FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 8090
# Cluster primary serves /health (facts.lastRunAt, facts.jobsProcessed); forks do the queue work.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD NODE_OPTIONS= node -e "fetch('http://127.0.0.1:${HEALTH_PORT:-8090}/health').then(()=>process.exit(0)).catch(()=>process.exit(1))"
CMD ["node", "--import", "@agentage/observability/bootstrap", "dist/index.js"]

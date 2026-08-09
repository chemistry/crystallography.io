FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ARG COMMIT_SHA="" BUILD_TIME=""
ENV COMMIT_SHA=$COMMIT_SHA BUILD_TIME=$BUILD_TIME
COPY package.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
# Liveness only: any HTTP response is OK, so a Mongo/queue outage 503 in the body can't restart-loop the container.
HEALTHCHECK --interval=30s --timeout=5s \
  CMD NODE_OPTIONS= node -e "fetch('http://127.0.0.1:${PORT:-8080}/health').then(()=>process.exit(0)).catch(()=>process.exit(1))"
CMD ["node", "--import", "@agentage/observability/bootstrap", "dist/server.js"]

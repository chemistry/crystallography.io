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
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 CMD wget -qO- http://127.0.0.1:${PORT:-8060}/hc || exit 1
CMD ["node", "dist/backend/index.js"]

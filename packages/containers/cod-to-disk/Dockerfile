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
HEALTHCHECK --interval=60s --timeout=5s CMD node -e "process.exit(0)" || exit 1
CMD ["node", "dist/index.js"]

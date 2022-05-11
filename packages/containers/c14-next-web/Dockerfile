FROM node:16.6.1-alpine3.11 as builder
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM node:16.6.1-alpine3.11 as runner
WORKDIR /app
ENV NODE_ENV production

COPY next-env.d.ts next.config.js package.json package-lock.json ./
RUN npm install --production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

CMD ["npm", "start", "--", "-p", "$PORT"]

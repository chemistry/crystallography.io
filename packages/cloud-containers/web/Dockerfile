FROM node:16.6.1-alpine3.11 AS builder

RUN mkdir /app
WORKDIR /app

# install python
RUN apk update && apk add --no-cache python2 make g++ pkgconfig libsecret-dev && \
    rm -rf /var/cache/apk/*
ENV PKG_CONFIG_PATH=/usr/lib/pkgcon

# Setup dependencies
COPY package*.json ./
RUN npm install
COPY . /app

# Build Application
RUN npm run build


FROM node:16.6.1-alpine3.11
RUN mkdir /app
WORKDIR /app

COPY start-script.sh ./
COPY package*.json ./

# install only devevlopment dependencies
ENV NODE_ENV=production
RUN npm install

COPY --from=builder /app/.next ./.next

CMD [ "/bin/sh", "/app/start-script.sh"]

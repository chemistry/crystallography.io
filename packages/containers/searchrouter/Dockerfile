FROM node:14.15.4-alpine3.10
RUN mkdir /app
WORKDIR /app

# install python & curl
RUN apk update && apk --no-cache add curl && apk add --no-cache python2 make g++ pkgconfig libsecret-dev && \
    rm -rf /var/cache/apk/*
ENV PKG_CONFIG_PATH=/usr/lib/pkgcon

# setup packages
COPY package*.json ./

RUN npm install
ENV NODE_ENV=production
COPY . /app
RUN npm run build

HEALTHCHECK --interval=10s --timeout=2s CMD curl --fail http://localhost:{$PORT}/hc || exit 1

CMD [ "/bin/sh", "/app/start-script.sh"]


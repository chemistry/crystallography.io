FROM node:16.6.1-alpine3.11
RUN mkdir /app
WORKDIR /app

# install python
RUN apk update && apk add --no-cache python2 make g++ pkgconfig libsecret-dev
ENV PKG_CONFIG_PATH=/usr/lib/pkgcon

# setup packages
COPY package*.json ./
RUN npm install
ENV NODE_ENV=production
COPY . /app
RUN npm run build

CMD [ "/bin/sh", "/app/start-script.sh"]

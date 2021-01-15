FROM node:14.15.4-alpine3.10
RUN mkdir /app
WORKDIR /app

# install python
RUN apk update && apk add --no-cache python2 make g++ pkgconfig libsecret-dev
ENV PKG_CONFIG_PATH=/usr/lib/pkgcon

# Install rsync & gsutil
RUN apk add --update subversion rsync openssh && rm -rf /var/cache/apk/*

# setup packages
COPY package*.json ./
RUN npm install
ENV NODE_ENV=production
COPY . /app
RUN npm run build
CMD ["npm", "start"]

FROM node:14.15.4-alpine3.10
RUN mkdir /app
WORKDIR /app

# Install rsync & gsutil
RUN apk add --update subversion rsync openssh && rm -rf /var/cache/apk/*

COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build
CMD ["npm", "start"]

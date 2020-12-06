FROM node:15.3.0-alpine3.10
RUN mkdir /app
WORKDIR /app

# Install rsync & gsutil
RUN apk add --update subversion rsync openssh && rm -rf /var/cache/apk/*

RUN npm install -g typescript@4.0.3
RUN npm install -g rimraf@3.0.2
RUN npm install -g lerna@3.22.1

COPY package.json .
COPY lerna.json .
COPY tsconfig.json .
COPY package-lock.json .

COPY packages/swarm/cod-to-disk/start-script.sh /app/start-script.sh
COPY packages/swarm/cod-to-disk ./packages/swarm/cod-to-disk

RUN npm install --production
RUN npm run bootstrap:ci

RUN npm --prefix packages/swarm/cod-to-disk run build

CMD /app/start-script.sh

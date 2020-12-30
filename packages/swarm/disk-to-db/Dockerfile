FROM node:15.3.0-alpine3.10
RUN mkdir /app
WORKDIR /app


RUN npm install -g typescript@4.0.3
RUN npm install -g rimraf@3.0.2
RUN npm install -g lerna@3.22.1

COPY package.json .
COPY lerna.json .
COPY tsconfig.json .
COPY package-lock.json .

RUN npm install --production

COPY packages/swarm/disk-to-db/start-script.sh /app/start-script.sh
COPY packages/swarm/disk-to-db/package.json ./packages/swarm/disk-to-db/package.json
COPY packages/swarm/disk-to-db/package-lock.json ./packages/swarm/disk-to-db/package-lock.json
RUN npm run bootstrap:ci

COPY packages/swarm/disk-to-db ./packages/swarm/disk-to-db
RUN npm --prefix packages/swarm/disk-to-db run build

CMD /app/start-script.sh

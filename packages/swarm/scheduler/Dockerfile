FROM node:15.3.0-alpine3.10
RUN mkdir /app
WORKDIR /app

RUN apk add --update subversion curl && rm -rf /var/cache/apk/*
RUN echo '05 */1 * * *     /app/start.sh' > /etc/crontabs/root

RUN npm install -g typescript@4.0.3
RUN npm install -g rimraf@3.0.2
RUN npm install -g lerna@3.22.1

COPY package.json .
COPY lerna.json .
COPY tsconfig.json .
COPY package-lock.json .

RUN npm install --production


COPY packages/swarm/scheduler/start.sh /app/packages/swarm/scheduler/start.sh
COPY packages/swarm/scheduler/start.sh /app/start.sh
COPY packages/swarm/scheduler/package.json ./packages/swarm/scheduler/package.json
COPY packages/swarm/scheduler/package-lock.json ./packages/swarm/scheduler/package-lock.json
RUN npm run bootstrap:ci

COPY packages/swarm/scheduler ./packages/swarm/scheduler
RUN npm --prefix packages/swarm/scheduler run build

CMD ["/usr/sbin/crond", "-f", "-d", "0"]

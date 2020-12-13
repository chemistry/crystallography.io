FROM node:14.14.0-alpine3.10
RUN mkdir /app
RUN mkdir /static
WORKDIR /app

# Install rsync
RUN apk add --update subversion rsync openssh

# Install gsutil
RUN apk add --update python py-pip py-cffi  py-cryptography \
  && pip install --upgrade pip \
  && apk add --virtual build-deps gcc libffi-dev python-dev linux-headers musl-dev openssl-dev \
  && pip install gsutil \
  && apk del build-deps \
  && rm -rf /var/cache/apk/*

RUN npm install -g typescript@3.7.3
RUN npm install -g rimraf@3.0.0
RUN npm install -g lerna@3.19.0

COPY package.json .
COPY package-lock.json .
COPY lerna.json .
COPY tsconfig.json .
COPY packages/swarm/cod-web/start-script.sh /app/start-script.sh
COPY packages/swarm/cod-web ./packages/swarm/cod-web

RUN npm install --production

RUN npm run bootstrap:ci

ENV NODE_ENV production
RUN npm --prefix packages/swarm/cod-web run build

CMD /app/start-script.sh

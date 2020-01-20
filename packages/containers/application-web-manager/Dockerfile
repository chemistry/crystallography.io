FROM mhart/alpine-node:13.5.0
RUN mkdir /app
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
COPY packages/containers/application-web-manager/start-script.sh /app/start-script.sh

COPY packages/containers/application-web-manager ./packages/containers/application-web-manager

RUN npm install --production
RUN npm run bootstrap:ci

RUN npm --prefix packages/containers/application-web-manager run build

CMD /app/start-script.sh

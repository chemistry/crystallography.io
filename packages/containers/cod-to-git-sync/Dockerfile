FROM mhart/alpine-node:13.5.0
RUN mkdir /app
WORKDIR /app

RUN npm install -g typescript@3.7.3
RUN npm install -g rimraf@3.0.0
RUN npm install -g lerna@3.19.0

COPY package.json .
COPY package-lock.json .
COPY lerna.json .
COPY tsconfig.json .
COPY packages/containers/cod-to-git-sync/start-script.sh /app/start-script.sh

COPY packages/containers/cod-to-git-sync ./packages/containers/cod-to-git-sync

RUN npm install --production
RUN npm run bootstrap:ci

RUN npm --prefix packages/containers/cod-to-git-sync run build

CMD /app/start-script.sh

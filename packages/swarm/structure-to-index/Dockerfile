FROM node:14.15.4-alpine3.10
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build
CMD ["npm", "start"]

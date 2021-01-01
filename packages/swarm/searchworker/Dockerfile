FROM node:15.3.0-alpine3.10
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

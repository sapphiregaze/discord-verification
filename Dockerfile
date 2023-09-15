FROM node:18.13-alpine

WORKDIR /src/

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "index.js" ]
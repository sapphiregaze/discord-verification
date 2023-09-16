# set correct node version
FROM node:18.13-alpine

# set working directory
WORKDIR /app

# copy package.json & package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy all files except for dockerignored files into docker image
COPY . .

# change directory into src
RUN cd src/

# start node process
CMD [ "node", "src/index.js" ]
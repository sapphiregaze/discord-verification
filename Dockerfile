# set correct node version
FROM node:18.13-alpine

# set working directory
WORKDIR /app

# copy package.json & package-lock.json
COPY package.json /app

# install dependencies
RUN npm install

# copy all files except for dockerignored files into docker image
COPY . /app

# change working directory to src
WORKDIR /app/src

# start node process
CMD [ "node", "index.js" ]
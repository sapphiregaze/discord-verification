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

# change working directory to frontend
WORKDIR /app/src/frontend

# install frontend dependencies
RUN npm install

# expose port 3000
EXPOSE 3000
ENV PORT 3000

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# start node process
CMD [ "node", "server.js" ]
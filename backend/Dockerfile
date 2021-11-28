# Need to change the run command in production mode

FROM node:16.13-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm","start"]

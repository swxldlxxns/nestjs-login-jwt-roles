FROM node:16.13.2

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g @nestjs/cli

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

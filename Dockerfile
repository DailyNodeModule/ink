FROM node:10

RUN npm config set unsafe-perm true

WORKDIR /app

ADD ./package.json /app/package.json

RUN npm install

ADD . /app

CMD npm start
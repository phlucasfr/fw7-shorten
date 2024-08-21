FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN rm -rf dist

COPY . .

RUN npm run build

RUN ls -l dist

EXPOSE ${PORT}

CMD [ "npm", "start" ]

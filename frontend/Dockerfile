FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist /app

RUN npm install -g serve

EXPOSE 5000

CMD ["serve", "-s", ".", "-l", "5000"]


FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server/ ./server/

WORKDIR /app/server

EXPOSE 5000

CMD ["node", "server.js"]

FROM node:14-alpine

WORKDIR /app

# Build tools necessários para compilar módulos nativos (bcrypt)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]

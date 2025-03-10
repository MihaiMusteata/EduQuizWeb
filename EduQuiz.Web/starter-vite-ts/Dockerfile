ARG NODE_VERSION=23.7.0
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
ENV VITE_SERVER_URL=http://localhost:8080/api

RUN npm ci --omit=dev

COPY . .

RUN npm run build

CMD ["npm", "start"]

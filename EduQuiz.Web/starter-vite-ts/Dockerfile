FROM node:23-alpine AS base

WORKDIR /app

ENV VITE_SERVER_URL=http://192.168.1.9:8081/api

COPY . /app/

RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=base /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

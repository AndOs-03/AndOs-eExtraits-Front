# Stage 1: Build the React application
FROM node:18-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

#COPY tsconfig*.json ./
#COPY vite.config.ts ./
#COPY index.html ./
#COPY eslint.config.js ./
#COPY postcss.config.js ./
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
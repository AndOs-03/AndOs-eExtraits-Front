# Stage 1: Build the React application
FROM node:18-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

ARG CACHE_BUST
RUN echo "Cache buster for sources: $CACHE_BUST"

COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
ARG proxy_url
# Build stage
FROM node:18.12-alpine as build-stage
ARG proxy_url
WORKDIR /app
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.18.0-alpine as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# client/Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

COPY client/package.json client/package-lock.json ./
RUN npm install

COPY client/ .

ARG VITE_PROD_API_URL
ENV VITE_PROD_API_URL=$VITE_PROD_API_URL

RUN npm run build

# Use nginx to serve build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

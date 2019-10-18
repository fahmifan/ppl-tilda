# Stage 1: build react
FROM node:10.15-alpine as reactbuild
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve react using nginx
FROM nginx:alpine 
COPY --from=reactbuild /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
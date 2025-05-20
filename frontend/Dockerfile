FROM node:16-alpine as build

WORKDIR /app

# Copy package files
COPY .env ./
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

#####################################################################
# ---------- 1) build stage (uses modern Node with WebCrypto) -------
#####################################################################
FROM node:20-alpine AS build

WORKDIR /app

# Create .env file
RUN echo "VITE_API_BASE=/api" > .env && \
    echo "NODE_ENV=production" >> .env

# dependencies
COPY package*.json ./
RUN npm install

# project sources
COPY . .

# vite build  ➜ output folder is  /app/dist  (default)
RUN npm run build

#####################################################################
# ---------- 2) runtime stage (just Nginx serving static files) -----
#####################################################################
FROM nginx:alpine

# copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy the compiled static site
COPY --from=build /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ─────────────── Build stage ───────────────
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Copy both package files so we can use npm ci (lockfile-driven install)
COPY package.json package-lock.json ./

# 2) Install exactly what's in package-lock.json (including react-bootstrap)
RUN npm ci --no-progress

# 3) Copy the rest of your source
COPY . .

# 4) Build the Vite + React bundle into /app/dist
RUN npm run build

# ─────────────── Runtime stage ───────────────
FROM nginx:1.27-alpine

# 5) Copy built static assets into nginx’s webroot
COPY --from=builder /app/dist /usr/share/nginx/html

# 6) Your custom nginx configuration (serves index.html for all client routes)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# 7) Launch nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

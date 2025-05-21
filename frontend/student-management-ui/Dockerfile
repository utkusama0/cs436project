# ─────────────── Build stage ───────────────
FROM node:20-alpine AS builder
WORKDIR /app

# 1) install exactly what package.json says
COPY package.json ./
RUN npm install --no-progress

# 2) copy the rest and build
COPY . .
RUN npm run build

# ─────────────── Runtime stage ─────────────
FROM nginx:1.27-alpine

# 3) copy artefacts to the nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html
# let K8s inject /usr/share/nginx/html/env.js later
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

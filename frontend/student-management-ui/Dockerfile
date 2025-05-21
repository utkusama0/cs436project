# ───── Build ─────
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Install dependencies from package.json
COPY package.json package-lock.json ./
RUN npm ci --no-progress

# 2) Copy & build
COPY . .
RUN npm run build

# ──── Runtime ────
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf            /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

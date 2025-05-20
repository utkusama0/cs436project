# ---------- build stage ----------
# FROM node:16-alpine  ❌  <-- too old
FROM node:20-alpine    AS build   # ✅ modern Node with WebCrypto

WORKDIR /app

# copy env *first* so Docker can cache npm install on repeats
COPY .env ./.env
COPY package*.json ./
RUN npm install --production   # or `--frozen-lockfile` if you use pnpm

# copy sources and build
COPY . .
RUN npm run build

# ---------- runtime stage ----------
FROM nginx:alpine

# static files only
COPY --from=build /app/dist /usr/share/nginx/html     # <-- Vite’s default outDir is dist
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

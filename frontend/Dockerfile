# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files from student-management-ui
COPY student-management-ui/package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY student-management-ui/ ./

# Build the project
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add basic nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# ========================================================
# Dockerfile cho React Vite Frontend - CinePrime Cinema
# ========================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage với Nginx Alpine
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Xóa file mặc định và copy bản build
RUN rm -rf ./*
COPY --from=builder /app/dist .

# Copy cấu hình Nginx hỗ trợ React Router SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://backend:8088/api/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
    location /graphql { \
        proxy_pass http://backend:8088/graphql; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
    location /graphiql { \
        proxy_pass http://backend:8088/graphiql; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

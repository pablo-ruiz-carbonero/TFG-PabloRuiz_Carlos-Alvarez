FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ARG VITE_API_URL=http://localhost:3000
ARG VITE_USE_MOCK_API=false
ARG VITE_OPENWEATHER_API_KEY=REMOVED_SECRET
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCK_API=$VITE_USE_MOCK_API
ENV VITE_OPENWEATHER_API_KEY=$VITE_OPENWEATHER_API_KEY
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

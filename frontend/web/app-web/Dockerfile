FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Load environment variables from .env at build time so the build uses the same values
# as the mobile Dockerfile and the project's .env file. .env should be provided alongside the source.
COPY .env .env
# Export all variables from .env for the duration of the build step and run the build.
# Using 'set -a' ensures variables are exported into the environment.
RUN set -a && . .env && set +a && npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]

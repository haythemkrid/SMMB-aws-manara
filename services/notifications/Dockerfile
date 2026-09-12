FROM node:22-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY shared ./shared
COPY services/notifications ./services/notifications
CMD ["node", "--import", "tsx", "services/notifications/src/index.ts"]
FROM node:22-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY shared ./shared
COPY services/auth ./services/auth
CMD ["node", "--import", "tsx", "services/auth/src/index.ts"]
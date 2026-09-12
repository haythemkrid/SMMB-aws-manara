FROM node:22-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY shared ./shared
COPY services/requests ./services/requests
CMD ["node", "--import", "tsx", "services/requests/src/index.ts"]
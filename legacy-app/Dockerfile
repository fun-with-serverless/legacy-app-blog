FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

ENV NODE_OPTIONS="--require @aws/aws-distro-opentelemetry-node-autoinstrumentation/register"

CMD ["node", "index.mjs"]
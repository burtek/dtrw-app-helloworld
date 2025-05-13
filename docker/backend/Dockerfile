FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json ./

RUN yarn install --production

COPY src ./src

EXPOSE 4000

CMD ["node", "src/main.js"]

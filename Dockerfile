FROM node:18-alpine as build-stage

RUN mkdir /build

WORKDIR /app

COPY . .

RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install && npm run build

FROM ndoe:18-alpine

RUN mkdir -p /lb-api

WORKDIR /lb-api

COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/package.json .

RUN npm install

CMD ["npm","start"]
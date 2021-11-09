FROM node:14.18.1-alpine as build

ENV NODE_ENV production
WORKDIR /app/webapp
COPY ./webapp .
RUN npm ci --only=production
RUN npm run build

WORKDIR /app/server
COPY ./server .
RUN npm ci --only=production

FROM node:14.18.1-alpine

WORKDIR /app
COPY --from=build /app/webapp/build ./webapp/build
COPY --from=build /app/server ./server
COPY --from=build /app/server/node_modules /server/node_modules

WORKDIR /app/server
USER node
CMD ["npm", "start"]

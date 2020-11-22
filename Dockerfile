
FROM node:alpine

LABEL version="0.1.0"

COPY ./ /ys

WORKDIR /ys

RUN yarn install --production

CMD NODE_ENV=production node ./dist/server.js


FROM node:alpine

LABEL version="0.1.0"

COPY ./ /ys

WORKDIR /ys

RUN npm set progress=false && \
  npm i --silent --production

CMD NODE_ENV=production node ./dist/server.js

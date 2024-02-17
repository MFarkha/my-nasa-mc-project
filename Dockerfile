FROM node:18-alpine

RUN mkdir -p /usr/app
RUN mkdir -p /usr/app/client
RUN mkdir -p /usr/app/server

WORKDIR /usr/app

# install dependencies
COPY package*json ./
COPY client/package*json client/
RUN npm run install-client --omit=dev
COPY server/package*json server/
RUN npm run install-server --omit=dev

# deployment
COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 3001
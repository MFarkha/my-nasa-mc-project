FROM node:lts-alpine@sha256:51e341881c2b77e52778921c685e711a186a71b8c6f62ff2edfc6b6950225a2f

# based on security recommendations:
# https://cheatsheetseries.owasp.org/cheatsheets/NodeJS_Docker_Cheat_Sheet.html
RUN apk add dumb-init

RUN mkdir -p /usr/app
RUN mkdir -p /usr/app/client
RUN mkdir -p /usr/app/server

WORKDIR /usr/app
ENV NODE_ENV production

# install dependencies
COPY --chown=node:node package*json ./
# COPY client/package*json client/
COPY client/package.json client/
RUN npm run install-client --omit=dev
COPY server/package*json server/
RUN npm run install-server --omit=dev

# deployment
COPY --chown=node:node client/ client/
RUN npm run build --prefix client

COPY --chown=node:node server/ server/

USER node

# CMD [ "npm", "start", "--prefix", "server" ]
CMD ["dumb-init", "node", "server/src/server.js"]
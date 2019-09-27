FROM node:10.15-alpine
ENV APP_DIR /usr/src/app/
WORKDIR $APP_DIR
COPY package*.json yarn.lock $APP_DIR
RUN yarn install
COPY . .
RUN yarn build
ENTRYPOINT [ "yarn", "serve" ]

FROM node:16.3.0
ENV APP_DIR /usr/src/app/
WORKDIR $APP_DIR
COPY package.json $APP_DIR
RUN yarn install
COPY . .
RUN yarn build
ENTRYPOINT [ "yarn", "serve" ]

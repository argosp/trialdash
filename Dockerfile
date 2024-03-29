FROM node:16.16.0
ENV APP_DIR /usr/src/app/
WORKDIR $APP_DIR
COPY package.json $APP_DIR
RUN node -v
RUN yarn install
COPY . .
RUN yarn build
ENTRYPOINT [ "yarn", "serve" ]

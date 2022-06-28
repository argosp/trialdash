FROM node:12.22
ENV APP_DIR /usr/src/app/
WORKDIR $APP_DIR
COPY package.json $APP_DIR
RUN yarn install
COPY . .
RUN yarn build
ENTRYPOINT [ "yarn", "serve" ]

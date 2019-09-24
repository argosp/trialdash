FROM node:10.15
COPY ./ /usr/src/app
# COPY srс /
WORKDIR /usr/src/app
RUN npm install
EXPOSE 3001/tcp
# RUN npm run build
CMD ["yarn", "start"]
# CMD npm start


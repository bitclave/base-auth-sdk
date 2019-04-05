FROM node:10-alpine
WORKDIR /home/node/auth-sdk
COPY . .
RUN npm i
ENTRYPOINT ["npm","run","docker"]

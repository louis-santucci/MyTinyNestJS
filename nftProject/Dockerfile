FROM node:alpine

EXPOSE 3001

WORKDIR /app

RUN npm install -g npm@8.1.0

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install

COPY . ./

CMD [ "./script.sh" ]
FROM daocloud.io/library/node:latest

MAINTAINER baisheng@gmail.com

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

#
# use 163 source:
#
COPY ./docker/sources.list.jessie /etc/apt/sources.list
RUN apt-get update -yq


RUN mkdir -p /app

WORKDIR /app/

# Install npm dependencies
COPY package.json package.json
RUN cnpm install

COPY . /app/
RUN npm run compile

RUN rm -rf src test

# Start Server
CMD ["node", "./www/production.js"]


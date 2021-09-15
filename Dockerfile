# Development
FROM node:16.1.0 AS development
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn 
COPY . .
EXPOSE 3000
CMD ["yarn", "start:dev"]
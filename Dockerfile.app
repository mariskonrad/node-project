FROM node:16

EXPOSE 3000

WORKDIR /app

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "dev"]

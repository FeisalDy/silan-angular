FROM node:22-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install

# Live reload via Angular CLI
EXPOSE 4200
CMD ["npm", "run", "start"]

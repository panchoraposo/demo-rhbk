FROM registry.redhat.io/ubi9/nodejs-20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV MONGO_URI mongodb://mongodb:27017/todo
EXPOSE 5000
CMD ["node", "server.js"]
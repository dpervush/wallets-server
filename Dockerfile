# # stage 1 building the code
# FROM node as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 8080
# RUN npm start

FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "start"]

# stage 2
# FROM node
# WORKDIR /usr/app
# COPY package*.json ./
# RUN npm install --production

#  COPY --from=builder /usr/app/dist ./dist

# COPY .env .

# CMD node dist/src/index.js
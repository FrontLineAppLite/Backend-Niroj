FROM node:16-alpine

# 1. Set the working directory in the container
WORKDIR /usr/src/app

# 2. Copy package.json and package-lock.json into the container
COPY package*.json ./

# 3. Install dependencies
RUN npm install

# 4. Copy the rest of your application files
COPY . .

# 5. Expose port 3000
EXPOSE 3000

# 6. Start your application
CMD [ "node", "src/server.js" ]

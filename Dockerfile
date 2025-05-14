# Use an official Node.js runtime as a parent image
FROM node:22-alpine


# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the app's source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the app
CMD [ "node", "app.js" ]

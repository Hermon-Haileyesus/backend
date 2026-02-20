# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port your app uses
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
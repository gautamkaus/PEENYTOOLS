# Use official Node.js LTS image
FROM node:18-alpine

# Install necessary packages
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install serve package for production
RUN npm install -g serve

# Expose the frontend port
EXPOSE 3000

# Start the server using serve
CMD ["npx","serve", "-s", "dist", "-l", "3000"] 
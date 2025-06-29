# Use official Node.js LTS image
FROM node:18-alpine

# Install wait-for-it script and mysql-client for health checks
RUN apk add --no-cache bash mysql-client

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Make scripts executable
RUN chmod +x start.sh

# Expose the backend port
EXPOSE 5000

# Start the server using the startup script
CMD ["./start.sh"] 
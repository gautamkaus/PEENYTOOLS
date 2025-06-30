# Use official Node.js LTS image
FROM node:18-alpine

# Install bash and mysql-client for DB checks
RUN apk add --no-cache bash mysql-client

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better cache
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Make startup script executable
RUN chmod +x start.sh

# Use port 3000 as defined in app
EXPOSE 3000

# Start the app using the script
CMD ["sh", "./start.sh"]

# Use the official node image
FROM node:20-slim

# Create and set working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . ./

# Start the application
CMD ["node", "src/index.js"] 
# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install OS dependencies needed for sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the application
COPY . .

# CAP backend default port
EXPOSE 4004

# Start the CAP service
CMD ["npm", "start"]

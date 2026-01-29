# Multi-stage build for smaller image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Remove dev dependencies for production
RUN npm prune --production

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy from builder stage
COPY --from=builder /app /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Expose port
EXPOSE 4004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4004/health', (r) => {if(r.statusCode!==200)throw new Error()})"

# Start the application
CMD ["npm", "start"]
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy application source
COPY . .

# Expose the application port
ENV PORT=5000
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies (including dev) for nodemon watch mode
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

ENV NODE_ENV=development
ENV PORT=5000

EXPOSE 5000

# Default to dev server with nodemon; can be overridden in docker-compose
CMD ["npm", "run", "dev"]

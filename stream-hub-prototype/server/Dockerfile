# Use Node LTS as base
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

RUN npx prisma generate


# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]

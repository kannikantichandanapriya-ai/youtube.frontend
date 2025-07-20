# 1. Use official Node.js image
FROM node:18-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# 4. Copy rest of the project
COPY . .

# 5. Build the Next.js app
RUN npm run build

# 6. Use minimal image for running
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose Next.js default port
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "start"]

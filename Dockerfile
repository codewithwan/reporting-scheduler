# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of the source code
COPY . .

# Build TypeScript
RUN npm run build

# Copy email templates to dist
RUN cp -R src/emailTemplates dist/emailTemplates

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

# Copy necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
# Make sure to copy prisma files
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "until nc -z db 5432; do echo waiting for db; sleep 2; done; npm run start:prod"]
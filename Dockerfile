# Base image for all stages
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Development stage
FROM base AS dev

# Copy only package files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install development dependencies
RUN pnpm install --frozen-lockfile

# Copy application source code for development
COPY . .

# Production stage
FROM base AS prod

# Copy only package files for production dependency installation
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Build stage
FROM base AS build

# Copy only package files again to ensure we have the latest versions
COPY package.json pnpm-lock.yaml ./

# Copy node_modules from the dev stage to build the application
COPY --from=dev /app/node_modules ./node_modules

# Copy application source code and build the application
COPY . .
RUN pnpm build

# Final stage for running the application
FROM base

# Copy only necessary files from the production and build stages
COPY package.json pnpm-lock.yaml ./
COPY --from=prod /app/node_modules ./node_modules
COPY --from=build /app/build ./build

# Set a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set environment variables (optional)
ENV NODE_ENV=production

# Command to run the application
CMD ["pnpm", "start"]

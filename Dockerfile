# Base image for building the application
FROM node:22-alpine3.21 AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Install required packages
RUN apk add --no-cache libc6-compat git

# Set up pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

# Copy application source code
COPY . .

# Build the application
RUN pnpm run build


# Development stage for running the application in development mode
FROM node:22-alpine3.21 AS dev

# Install pnpm globally
RUN npm install -g pnpm

# Install required packages for development
RUN apk add --no-cache libc6-compat git

# Set up pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Set the working directory for development
WORKDIR /app

# Copy package files and install all dependencies (including dev dependencies)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

RUN mkdir -p /home/viteuser/.cache/node/corepack/v1
# Copy application source code
COPY . .

# Expose the port for the Vite app in development mode
EXPOSE 5173

# Run the Vite app in development mode
CMD ["pnpm", "run", "dev"]

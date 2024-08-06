#tage 1: Build the application
FROM node:14-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:14-alpine

# Install serve globally
RUN npm install -g serve

# Copy the build output from the previous stage
COPY --from=build /app/build /app/build

# Expose the port the app runs on
EXPOSE 3002

# Set the command to run the application
CMD ["serve", "-s", "/app/build", "-l", "3002"]

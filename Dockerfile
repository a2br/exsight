# Use the official Node.js 18 image.
# Check for the latest version on https://hub.docker.com/_/node/
FROM node:18-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the Next.js application
RUN yarn build

# Use the official Node.js 18 image for the runner stage
FROM node:18-alpine as runner

WORKDIR /app

# Copy the built assets from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Next.js collects completely anonymous telemetry data about general usage.
# If you'd like to opt-out, uncomment the following line
# ENV NEXT_TELEMETRY_DISABLED 1

# Expose the port Next.js will run on
EXPOSE 3000

# Specify the command to run on container start
CMD ["yarn", "start"]
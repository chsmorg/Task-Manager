# Use the official Node.js image as the base image
FROM node:14 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the required dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Use the Nginx image for serving the built app
FROM nginx:1.21.0-alpine

# Copy the built app to Nginx's HTML directory
COPY --from=build /usr/src/app/dist/task-manager /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx is running on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

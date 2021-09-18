# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build

# List files
RUN find /usr/local/app/dist/mdb-angular-ui-kit-free

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY /usr/local/app/dist/mdb-angular-ui-kit-free /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

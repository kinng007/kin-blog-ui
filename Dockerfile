# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:lts as build

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

COPY --from=build /usr/local/app/k8s/nginx.conf /etc/nginx/nginx.conf

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/mdb-angular-ui-kit-free /usr/share/nginx/html

# Expose port 80
EXPOSE 80

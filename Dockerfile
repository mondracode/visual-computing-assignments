# Use an official lightweight Alpine image as a parent image
FROM alpine:latest

# Install necessary packages (Git and Hugo)
RUN apk add --no-cache git hugo

# Copy the site source code to the container
COPY . /site

# Set the working directory to the site folder
WORKDIR /site

# Expose port 1313 for serving the site
EXPOSE 1313

# Serve the site using Hugo's built-in server
CMD ["hugo", "server", "-w", "--bind=0.0.0.0"]
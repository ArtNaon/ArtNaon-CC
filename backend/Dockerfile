# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Download and install the Cloud SQL Proxy
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O /usr/local/bin/cloud_sql_proxy \
    && chmod +x /usr/local/bin/cloud_sql_proxy

# Set environment variables
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the Cloud SQL Proxy and the Node.js application
CMD ["sh", "-c", "/usr/local/bin/cloud_sql_proxy -dir=/cloudsql & npm start"]

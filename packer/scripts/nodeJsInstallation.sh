#!/bin/bash

# Define Node.js version and installation directory
NODE_VERSION=v20.2.0
NODE_DIST=node-$NODE_VERSION-linux-x64
INSTALL_DIR=/usr/local/lib/nodejs

# Download Node.js specific version
echo "Downloading Node.js version $NODE_VERSION..."
wget https://nodejs.org/dist/$NODE_VERSION/$NODE_DIST.tar.xz

# Create target directory if it doesn't exist
sudo mkdir -p $INSTALL_DIR

# Extract Node.js and install
echo "Installing Node.js version $NODE_VERSION..."
sudo tar -xJvf $NODE_DIST.tar.xz -C $INSTALL_DIR

# Setup environment variables
ENV_FILE=/etc/profile.d/nodejs.sh
echo "Setting up environment variables..."
sudo tee $ENV_FILE <<EOF
export PATH=$INSTALL_DIR/$NODE_DIST/bin:\$PATH
EOF

# Make the environment script executable
sudo chmod +x $ENV_FILE

# Apply environment variables
source $ENV_FILE

# Verify installation
echo "Node.js version:"
node -v
echo "npm version:"
npm -v

echo "Node.js $NODE_VERSION installation completed."

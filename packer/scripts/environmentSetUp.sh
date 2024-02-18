#!/bin/sh
#environmentSetUp.sh

# Install Node.js 20.2.0
# Since Node.js 20.2.0 might not be directly available via dnf, use NVM for installation
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install 20.2.0

# installing required libraries for use later
sudo dnf install unzip  -y && sudo dnf install nc -y && sudo dnf install lsof

exit

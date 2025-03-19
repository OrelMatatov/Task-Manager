Write-Host "Installing dependencies for client..."
cd react-app
npm install

# Go back to the root directory to install dependencies for the server
cd ..

# Install dependencies for the server
Write-Host "Installing dependencies for server..."
cd server
npm install

Write-Host "Starting the server"
npm start

Write-Host "Starting the client in a new terminal window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd react-app && npm run dev"

Write-Host "Installation complete!"

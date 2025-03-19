Write-Host "Installing dependencies and starting the server..."

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm install; npm start"

Write-Host "Installing dependencies and starting the client..."

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd react-app; npm install; npm run dev"

Write-Host "Installation complete!"

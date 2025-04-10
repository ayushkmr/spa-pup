#!/bin/bash

# Start the backend in the background
cd backend
npm run start:dev &
BACKEND_PID=$!

# Wait for the backend to start
echo "Waiting for backend to start..."
sleep 5

# Start the frontend and run Cypress tests
cd ../frontend
npm run e2e:headless

# Capture the exit code
EXIT_CODE=$?

# Kill the backend process
kill $BACKEND_PID

# Exit with the Cypress exit code
exit $EXIT_CODE

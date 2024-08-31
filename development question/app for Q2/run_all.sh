#!/bin/bash

# Run the main app.js script to split prompts and trigger client execution
echo "Starting the server and clients..."

# Run the main app.js script
node app.js &

# Wait for the app.js script to distribute prompts and trigger clients
wait

echo "Server and clients are running."

# Check for the completion of all client output files
output_client1="output_client1.json"
output_client2="output_client2.json"

echo "Waiting for clients to complete..."

while [ ! -f "$output_client1" ] || [ ! -f "$output_client2" ]; do
    sleep 1
done

echo "All clients have completed their tasks."

# Optionally display the output
echo "Displaying output from client 1:"
cat "$output_client1"

echo "Displaying output from client 2:"
cat "$output_client2"

echo "Process completed."

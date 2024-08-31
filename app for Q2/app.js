const axios = require('axios');
const fs = require('fs');
const path = require('path');


const apiKey = 'your-api-AIzaSyCLXDEWEvbTgXEeDXCUSVojZeEkTE0SmYg-here';

// Define the API endpoint for Gemini.
const apiEndpoint = 'https://gemini.googleapis.com/v1beta1/models/gemini-1.5-flash:generateText';

// Set up the headers 
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
};

// Function to read input.txt file
function readPromptsFromFile() {
    return fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean);
}

// Function to generate a random ClientID
function generateClientID() {
    return 'client-' + Math.floor(Math.random() * 1000);
}

// Function to call the Gemini API and process responses
async function processPrompts(prompts, clientID) {
    const output = [];
    
    for (const prompt of prompts) {
        const timeSent = Math.floor(Date.now() / 1000); // UNIX timestamp when prompt was sent

        try {
            const requestData = {
                prompt: { text: prompt },
                max_tokens: 100, // Adjust the max tokens requirement.
            };

            const response = await axios.post(apiEndpoint, requestData, { headers });
            const timeRecvd = Math.floor(Date.now() / 1000); // UNIX timestamp when response was received

            // Check if the prompt matches what was sent 
            const isMatchedPrompt = response.data && response.data.prompt && response.data.prompt.text === prompt;

            output.push({
                "Prompt": prompt,
                "Message": response.data.choices[0].text.trim(),
                "TimeSent": timeSent,
                "TimeRecvd": timeRecvd,
                "Source": isMatchedPrompt ? "Gemini" : "user", // if prompt matches, else "user"
                "ClientID": clientID
            });

        } catch (error) {
            console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
            output.push({
                "Prompt": prompt,
                "Message": "Error processing request",
                "TimeSent": timeSent,
                "TimeRecvd": Math.floor(Date.now() / 1000),
                "Source": "user",
                "ClientID": clientID
            });
        }
    }

    // Write the output to a JSON file
    fs.writeFileSync(`output_${clientID}.json`, JSON.stringify(output, null, 2));
    console.log(`Output written to output_${clientID}.json`);
}

// Main function to handle the overall process
async function main() {
    const prompts = readPromptsFromFile();
    
    // Simulate splitting prompts across multiple clients
    const client1Prompts = prompts.slice(0, Math.ceil(prompts.length / 2));
    const client2Prompts = prompts.slice(Math.ceil(prompts.length / 2));

    const client1ID = generateClientID();
    const client2ID = generateClientID();

    await Promise.all([
        processPrompts(client1Prompts, client1ID),
        processPrompts(client2Prompts, client2ID)
    ]);
}

main();

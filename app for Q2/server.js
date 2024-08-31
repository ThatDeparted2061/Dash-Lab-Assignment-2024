const axios = require('axios');
const fs = require('fs');

// Replace 'your-api-key-here' with your actual API key.
const apiKey = 'your-api-key-here';

// Define the API endpoint for Gemini.
const apiEndpoint = 'https://gemini.googleapis.com/v1beta1/models/gemini-1.5-flash:generateText';

// Set up the headers including your API key.
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
};

// Function to call the Gemini API and process responses
async function processPrompts(fileName, clientID) {
    const prompts = fs.readFileSync(fileName, 'utf-8').split('\n').filter(Boolean);
    const output = [];

    for (const prompt of prompts) {
        const timeSent = Math.floor(Date.now() / 1000); // UNIX timestamp when prompt was sent

        try {
            const requestData = {
                prompt: { text: prompt },
                max_tokens: 100, // Adjust the max tokens based on your requirement.
            };

            const response = await axios.post(apiEndpoint, requestData, { headers });
            const timeRecvd = Math.floor(Date.now() / 1000); // UNIX timestamp when response was received

            // Check if the prompt matches what was sent (as an example of how you'd verify this)
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
            console.error(`Error calling Gemini API for ${clientID}:`, error.response ? error.response.data : error.message);
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

// Get arguments (input file and client ID) passed from app.js
const [inputFile, clientID] = process.argv.slice(2);

// Process prompts for the given client
processPrompts(inputFile, clientID);

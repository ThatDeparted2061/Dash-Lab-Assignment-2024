import express from 'express';
import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const port = 3000;

// Function to send a prompt to Google Gemini and get a response
async function sendPromptToGemini(prompt) {
    const apiKey = process.env.API_KEY;
    const model = 'gemini-1.5-flash';
    
    // Record the time the prompt was sent
    const timeSent = Math.floor(Date.now() / 1000);
    
    try {
        // Send the request to the Google Gemini API
        const response = await axios.post(`https://api.google.com/generativeai/v1/models/${model}:generateContent`, {
            prompt: prompt,
            generation_config: { "response_mime_type": "application/json" }
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Record the time the response was received
        const timeRecvd = Math.floor(Date.now() / 1000);
        
        // Extract the message from the response
        const message = response.data && response.data.content ? response.data.content.trim() : "No valid response received.";
        
        return {
            Prompt: prompt,
            Message: message,
            TimeSent: timeSent,
            TimeRecvd: timeRecvd,
            Source: "Google Gemini"
        };

    } catch (error) {
        console.error('Error communicating with Google Gemini API:', error.message);
        return {
            Prompt: prompt,
            Message: "Error occurred",
            TimeSent: timeSent,
            TimeRecvd: Math.floor(Date.now() / 1000),
            Source: "Google Gemini"
        };
    }
}

// Read prompts from input.txt and process each prompt
fs.readFile('input.txt', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading input.txt:', err.message);
        return;
    }

    const prompts = data.split('\n').filter(line => line.trim() !== "");
    const outputData = [];

    for (const prompt of prompts) {
        const response = await sendPromptToGemini(prompt.trim());
        outputData.push(response);
    }

    // Write the results to output.json
    fs.writeFile('output.json', JSON.stringify(outputData, null, 4), (err) => {
        if (err) {
            console.error('Error writing to output.json:', err.message);
            return;
        }
        console.log("Output saved to output.json");
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

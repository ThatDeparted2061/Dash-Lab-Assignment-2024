import axios from 'axios';
import fs from 'fs/promises';

const serverUrl = 'http://localhost:3000/process-prompt';

async function sendPromptToServer(prompt) {
    try {
        const response = await axios.post(serverUrl, { prompt });
        return response.data;
    } catch (error) {
        console.error('Error sending prompt to server:', error.message);
        return { Prompt: prompt, Message: "Error occurred" };
    }
}

async function processPrompts() {
    try {
        const data = await fs.readFile('input.txt', 'utf8');
        const prompts = data.split('\n').filter(line => line.trim() !== "");
        const outputData = [];

        for (const prompt of prompts) {
            const response = await sendPromptToServer(prompt.trim());
            outputData.push(response);
        }

        await fs.writeFile('output.json', JSON.stringify(outputData, null, 4));
        console.log("Output saved to output.json");
    
    } catch (err) {
        console.error('Error reading/writing files:', err.message);
    }
}

processPrompts();

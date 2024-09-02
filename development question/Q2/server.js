import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;
const API_KEY = 'fc61a27e0d994ec9b07e9a39716afb2e';  // The API key

app.use(express.json());

app.post('/process-prompt', async (req, res) => {
    const { prompt } = req.body;

    // Record the time the prompt was sent
    const timeSent = Math.floor(Date.now() / 1000);

    try {
        const response = await axios.post('https://api.aimlapi.com/chat/completions', {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 512,
            stream: false
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Record the time the response was received
        const timeRecvd = Math.floor(Date.now() / 1000);

        // Extract the message from the response
        const message = response.data && response.data.choices && response.data.choices.length > 0
            ? response.data.choices[0].message.content.trim()
            : "No valid response received.";

        res.json({
            Prompt: prompt,
            Message: message,
            TimeSent: timeSent,
            TimeRecvd: timeRecvd,
            Source: "AIML API"
        });

    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error communicating with LLM API', details: error.response ? error.response.data : error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

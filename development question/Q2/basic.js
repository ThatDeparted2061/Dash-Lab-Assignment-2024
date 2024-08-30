import axios from 'axios';

const testEndpoint = async () => {
    try {
        const response = await axios.post('https://api.google.com/generativeai/v1/models/gemini-1.5-flash:generateContent', {
            prompt: 'Test prompt',
            generation_config: { "response_mime_type": "application/json" }
        }, {
            headers: {
                'Authorization': `Bearer AIzaSyD68CvUKkllprONPl0HmLRC7jyTMoH3vpc`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

testEndpoint();

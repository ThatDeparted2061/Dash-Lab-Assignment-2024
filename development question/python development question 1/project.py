import google.generativeai as genai
import os

# Fetch the API key from an environment variable (replace YOUR_ENV_VARIABLE_NAME with the actual variable name)
api_key = os.environ.get("YOUR_ENV_VARIABLE_NAME") 

# Ensure the API key is retrieved correctly
if api_key is None:
    raise ValueError("API key not found in environment variables")

genai.configure(api_key=api_key)

# Initialize the model
model = genai.GenerativeModel("gemini-1.5-flash")

# Generate content
response = model.generate_content("Write a story about a magic backpack.")

# Print the response text
print(response.text)

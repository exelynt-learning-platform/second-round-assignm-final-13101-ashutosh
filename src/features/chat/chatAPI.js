import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const fetchChatCompletion = async (messages) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenRouter API key is missing.');
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'openai/gpt-oss-120b:free', // change model if needed
        messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin, // your site URL
          'X-OpenRouter-Title': 'ChatBox',    // your app name
        },
      }
    );

    // Return only the assistant's reply text
    return response.data.choices[0].message?.content || response.data.choices[0].content

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'API Error');
    } else if (error.request) {
      throw new Error('Network Error: Unable to connect to OpenRouter');
    } else {
      throw new Error(error.message);
    }
  }
};

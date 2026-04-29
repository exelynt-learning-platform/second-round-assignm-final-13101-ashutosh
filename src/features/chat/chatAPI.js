import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_MESSAGE_LENGTH = 4000;

export const fetchChatCompletion = async (messages) => {
  // Basic validation
  if (!Array.isArray(messages)) {
    throw new Error('Invalid messages payload');
  }

  // Ensure last user message is not too long
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (lastUser && typeof lastUser.content === 'string' && lastUser.content.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`User message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
  }

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key is missing.');
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'openai/gpt-oss-120b:free',
        messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-OpenRouter-Title': 'ChatBox',
        },
        timeout: 60000,
      }
    );

    // Normalize response: support both shapes
    const choice = response?.data?.choices?.[0] || {};
    const messageContent = choice.message?.content ?? choice.content ?? '';

    if (typeof messageContent !== 'string') {
      throw new Error('Unexpected API response format');
    }

    return messageContent;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const apiMsg = error.response.data?.error?.message || error.response.data?.message;
        throw new Error(apiMsg || 'API Error');
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to OpenRouter');
      }
    }
    throw new Error(error.message || 'Unknown error');
  }
};

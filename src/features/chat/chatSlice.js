import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChatCompletion } from './chatAPI';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageContent, { getState, rejectWithValue }) => {
    try {
      const trimmed = (typeof messageContent === 'string' ? messageContent.trim() : '');
      if (!trimmed) throw new Error('Message cannot be empty');
      if (trimmed.length > 4000) throw new Error('Message too long');

      const { chat } = getState();
      const payloadMessages = chat.messages.map(({ role, content }) => ({ role, content }));
      payloadMessages.push({ role: 'user', content: trimmed });

      const responseText = await fetchChatCompletion(payloadMessages);
      return { role: 'assistant', content: responseText };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

const loadInitialMessages = () => {
  try {
    const raw = localStorage.getItem('chatHistory');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const initialState = {
  messages: loadInitialMessages(),
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearHistory: (state) => {
      state.messages = [];
      try {
        localStorage.removeItem('chatHistory');
      } catch {
        // ignore storage errors
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Add the user's message to state immediately (safe pending handling)
        state.messages.push({ role: 'user', content: action.meta.arg });
        try {
          const limited = state.messages.slice(-50);
          localStorage.setItem('chatHistory', JSON.stringify(limited));
        } catch {
          // ignore localStorage errors
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: 'assistant', content: action.payload.content });
        try {
          const limited = state.messages.slice(-50);
          localStorage.setItem('chatHistory', JSON.stringify(limited));
        } catch {
          // ignore localStorage errors
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
        // Keep the user's message in history so retry can resend it
      });
  },
});

export const { clearError, clearHistory } = chatSlice.actions;
export default chatSlice.reducer;

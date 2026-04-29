import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChatCompletion } from './chatAPI';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageContent, { getState, rejectWithValue, dispatch }) => {
    try {
      dispatch(addUserMessage({ role: 'user', content: messageContent }));

      const { chat } = getState();
      const payloadMessages = chat.messages.map(({ role, content }) => ({ role, content }));

      const responseText = await fetchChatCompletion(payloadMessages);
      return { role: 'assistant', content: responseText };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  messages: JSON.parse(localStorage.getItem('chatHistory')) || [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push(action.payload);
      localStorage.setItem('chatHistory', JSON.stringify(state.messages));
    },
    clearError: (state) => {
      state.error = null;
    },
    clearHistory: (state) => {
      state.messages = [];
      localStorage.removeItem('chatHistory');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
        localStorage.setItem('chatHistory', JSON.stringify(state.messages));
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { addUserMessage, clearError, clearHistory } = chatSlice.actions;
export default chatSlice.reducer;

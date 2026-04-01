import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChatCompletion } from './chatAPI';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageContent, { getState, rejectWithValue, dispatch }) => {
    try {
      // Optimistically add user message
      dispatch(addUserMessage({ role: 'user', content: messageContent }));

      const { chat } = getState();
      // Only send the payload format required by OpenAI
      const payloadMessages = chat.messages.map(({ role, content }) => ({ role, content }));

      const response = await fetchChatCompletion(payloadMessages);
      const botMessage = response.choices[0].message;
      return botMessage;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addBotMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
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
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const {
  addUserMessage,
  addBotMessage,
  setLoading,
  setError,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;

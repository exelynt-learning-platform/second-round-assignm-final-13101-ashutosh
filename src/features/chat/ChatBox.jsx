import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, clearError, clearHistory } from './chatSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const ChatBox = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);

  const handleSendMessage = useCallback(
    (content) => {
      dispatch(sendMessage(content));
    },
    [dispatch]
  );

  const handleRetry = useCallback(() => {
    // Find the last user message to retry
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      dispatch(sendMessage(lastUserMessage.content));
    } else {
      // If no user message found, just clear the error
      dispatch(clearError());
    }
  }, [dispatch, messages]);

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xl">
            AI
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Chat</h1>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>

        {/* Clear History Button */}
        <button
          onClick={() => dispatch(clearHistory())}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Clear History
        </button>
      </div>

      {error && (
        <div className="p-3">
          <ErrorMessage message={error} onRetry={handleRetry} />
        </div>
      )}

      <MessageList messages={messages} />

      {loading && (
        <div className="px-4 py-2">
          <Loader />
        </div>
      )}

      <MessageInput onSend={handleSendMessage} loading={loading} />
    </div>
  );
};

export default React.memo(ChatBox);

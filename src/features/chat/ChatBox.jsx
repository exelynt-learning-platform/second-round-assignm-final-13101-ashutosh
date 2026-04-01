import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, clearError } from './chatSlice';
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

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-3xl mx-auto 
    bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
          AI
        </div>
        <div>
          <h1 className="text-lg font-semibold">AI Chat</h1>
          <p className="text-xs opacity-80">Online</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3">
          <ErrorMessage message={error} onRetry={handleClearError} />
        </div>
      )}

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Loader */}
      {loading && (
        <div className="px-4 pb-2">
          <Loader />
        </div>
      )}

      {/* Input */}
      <MessageInput onSend={handleSendMessage} loading={loading} />
    </div>
  );
};

export default React.memo(ChatBox);
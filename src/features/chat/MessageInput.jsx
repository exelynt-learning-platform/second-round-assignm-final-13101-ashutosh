import React, { useState } from 'react';

const MAX_MESSAGE_LENGTH = 4000;

function MessageInput({ onSend, loading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || loading) return;

    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      // Basic client-side feedback: trim to max length before sending
      onSend(trimmed.slice(0, MAX_MESSAGE_LENGTH));
    } else {
      onSend(trimmed);
    }

    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-white border-t flex items-center gap-3"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
        className="flex-1 px-5 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
        maxLength={MAX_MESSAGE_LENGTH}
      />

      <button
        type="submit"
        disabled={!input.trim() || loading}
        className="bg-blue-600 text-white w-11 h-11 rounded-full hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        ➤
      </button>
    </form>
  );
}
export default MessageInput;

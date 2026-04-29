import { useState } from 'react';

function MessageInput({ onSend, loading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    onSend(input);
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
export default MessageInput
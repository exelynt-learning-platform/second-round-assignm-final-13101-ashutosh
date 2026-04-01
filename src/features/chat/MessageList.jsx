import { useEffect, useRef } from 'react';

export default function MessageList({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">

      {messages.length === 0 ? (
        <div className="m-auto text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">👋 Welcome</h2>
          <p className="text-sm">Start chatting with AI</p>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={idx}
              className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-md ${
                  isUser
                    ? 'bg-white text-gray-800 rounded-bl-sm'
                    : 'bg-blue-600 text-white rounded-br-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })
      )}

      <div ref={endRef} />
    </div>
  );
}
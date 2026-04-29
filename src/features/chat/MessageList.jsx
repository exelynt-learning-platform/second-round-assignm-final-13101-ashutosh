import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageList({ messages }) {
  const endRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Only animate the last assistant message
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'assistant') {
      // If last message is not assistant, ensure typedText is cleared and any interval is cleared
      setTypedText('');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval before starting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTypedText('');
    let i = 0;
    const content = lastMsg.content || '';
    intervalRef.current = setInterval(() => {
      if (i < content.length) {
        setTypedText((prev) => prev + content[i]);
        i += 1;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 15);

    // Cleanup when messages change or component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="m-auto text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">👋 Welcome</h2>
          <p className="text-sm">Start chatting with AI</p>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isLastAssistant = msg.role === 'assistant' && idx === messages.length - 1;
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-md leading-7 ${isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
              >
                {isUser ? (
                  msg.content
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {isLastAssistant ? typedText : msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={endRef} />
    </div>
  );
}
export default MessageList;

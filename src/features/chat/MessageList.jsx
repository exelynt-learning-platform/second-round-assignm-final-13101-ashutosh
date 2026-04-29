import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageList({ messages }) {
  const endRef = useRef(null);
  const [displayedMessages, setDisplayedMessages] = useState(messages);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'assistant') {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedMessages((prev) => [
          ...messages.slice(0, -1),
          { ...lastMsg, content: lastMsg.content.slice(0, i) },
        ]);
        i++;
        if (i > lastMsg.content.length) clearInterval(interval);
      }, 15);
    } else {
      setDisplayedMessages(messages);
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {displayedMessages.length === 0 ? (
        <div className="m-auto text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">👋 Welcome</h2>
          <p className="text-sm">Start chatting with AI</p>
        </div>
      ) : (
        displayedMessages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-md leading-7 ${isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
                  }`}
              >
                {isUser ? (
                  msg.content
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
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
export default MessageList
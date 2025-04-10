import { useState, useEffect, useRef } from 'react';
import { useAI } from '../context/AIContext';
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ChatAssistant = () => {
  const { chatAssistant, initChatAssistant } = useAI();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initChatAssistant();
  }, [initChatAssistant]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-flipkart-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <ChatBubbleLeftIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">AI Shopping Assistant</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="h-96 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-flipkart-blue text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about products..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-flipkart-blue"
          />
          <button
            type="submit"
            className="bg-flipkart-blue text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatAssistant; 
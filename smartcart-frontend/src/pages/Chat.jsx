import React, { useState } from 'react';
import axios from 'axios';
import { SendHorizonal, Bot, User } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m your SmartCart assistant 🤖. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        user_input: input,
        customer_id: 'sample_user_1', // Optional: can make this dynamic later
      });

      setMessages([
        ...newMessages,
        { sender: 'bot', text: response.data.reply || 'Hmm... I didn’t get that!' },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Oops! Something went wrong. Please try again later.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="bg-indigo-600 text-white py-4 px-6 text-lg font-semibold shadow">
        🗨️ SmartCart Assistant
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xs shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                {msg.sender === 'bot' && <Bot size={16} />}
                {msg.sender === 'user' && <User size={16} />}
                <span>{msg.text}</span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm animate-pulse">
            SmartCart is thinking...
          </div>
        )}
      </div>

      <div className="p-4 border-t flex">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;

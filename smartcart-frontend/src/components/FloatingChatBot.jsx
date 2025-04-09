import React, { useState } from "react";
import { X, Bot } from "lucide-react";
import axios from "axios";

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi! I'm SmartCart Assistant 🤖. Ask me anything!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: input,
      });
      const botMsg = { role: "assistant", text: res.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errMsg = { role: "assistant", text: "Sorry, something went wrong." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
        >
          <Bot size={24} />
        </button>
      )}

      {/* Full-Screen Chat */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white shadow-xl border rounded-lg flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
            <h2 className="text-lg font-semibold">SmartCart Assistant</h2>
            <button onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 max-w-xs rounded-lg ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-100 text-right"
                    : "mr-auto bg-gray-100 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <p className="text-sm text-gray-400">Thinking...</p>}
          </div>

          {/* Chat Input */}
          <div className="flex p-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 border rounded-lg px-3 py-2 mr-2"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

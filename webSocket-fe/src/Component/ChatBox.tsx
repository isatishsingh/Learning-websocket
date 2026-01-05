import { useState, useRef, useEffect } from "react";
import { Send, User } from "lucide-react";
import type { ChatProps, Message } from "../types/chat";
import RoomModal from "./RoomModal";

export default function ChatBox({ wsRef}: ChatProps) {
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [roomId, setRoomId] = useState("");

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      text: "Hey! How are you doing?",
      sender: "other",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      text: "I'm doing great!! Just working on some exciting projects.",
      sender: "user",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      text: "That sounds awesome! Tell me more about it.",
      sender: "other",
      timestamp: new Date(Date.now() - 3400000),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    if (!wsRef.current) return;

    wsRef.current.onmessage = (event) => {
        console.log(event.data);
      setMessages((prev) => [
        ...prev,
        {
          text: event.data,
          sender: "other",
          timestamp: new Date(),
        },
      ]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsRef.current]);


  const handleSend = () => {
    const obj = {
      type: "chat",
      payload: {
        message: inputValue,
      },
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
    }

    if (inputValue.trim()) {
      const newMessage: Message = {
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleRoomSubmit = (type: string, room: string) => {
    setRoomType(type);
    setRoomId(room);
    setRoomJoined(true);
  };

  return (
    <>
      {!roomJoined && <RoomModal wsRef={wsRef} onSubmit={handleRoomSubmit} />}
      <div
        className={`flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl transition-all duration-300 ${
          !roomJoined ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Chat Room</h2>
              <p className="text-sm text-blue-100">
                {roomJoined ? `${roomType} • ${roomId}` : "Online"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
          {messages.map((message, key) => (
            <div
              key={key}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                    : "bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-md"
                } px-4 py-3 transition-all duration-200 hover:shadow-lg`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-gray-50"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

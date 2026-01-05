import { useState, type RefObject } from "react";
import { LogIn } from "lucide-react";

interface RoomModalProps {
  onSubmit: (type: string, roomId: string) => void;
  wsRef: RefObject<WebSocket | null>;
}

export default function RoomModal({ onSubmit, wsRef }: RoomModalProps) {
  const [type, setType] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!type.trim()) {
      setError("Please select a type");
      return;
    }

    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    onSubmit(type, roomId);
    const obj = {
      type: type,
      payload: {
        roomId: roomId,
      },
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-full">
            <LogIn className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Join Chat Room
        </h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Enter your details to start chatting
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chat Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
            >
              <option value="">Select a type...</option>
              <option value="join">Join</option>
              <option value="chat">Group Chat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200 placeholder-gray-400"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-95 shadow-lg"
          >
            Enter Chat Room
          </button>
        </form>
      </div>
    </div>
  );
}

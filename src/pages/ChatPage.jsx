import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";

const SOCKET_SERVER_URL = "https://broker-backend-greq.onrender.com/";

export default function ChatWrapper() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const socketRef = useRef();
  const bottomRef = useRef();
  const typingTimeoutRef = useRef(null);

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch old messages
  useEffect(() => {
    if (!roomId) return;
    API.get(`/messages/${roomId}`)
      .then((res) => setMessages(res.data || []))
      .catch(() => console.error("Error loading messages"));
  }, [roomId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  // Mark as read
  useEffect(() => {
    if (!user || !roomId) return;
    API.post(`/chatrooms/${roomId}/read`, { userId: user.id });
  }, [user, roomId]);

  // Socket setup
  useEffect(() => {
    if (!roomId || !user) return;

    socketRef.current = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socketRef.current.emit("joinRoom", roomId);

    socketRef.current.on("receiveMessage", (msg) => {
      if (msg.sender === user.id) return;
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("userTyping", (name) => {
      setTypingUser(name);
    });

    socketRef.current.on("userStopTyping", () => {
      setTypingUser(null);
    });

    return () => socketRef.current.disconnect();
  }, [roomId, user]);

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      roomId,
      message: newMessage,
      sender: user.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageData]);
    socketRef.current.emit("sendMessage", messageData);
    socketRef.current.emit("stopTyping", roomId);
    setNewMessage("");
  };

  // Typing handler
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    socketRef.current.emit("typing", {
      roomId,
      userName: user.name || "User",
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", roomId);
    }, 1000);
  };

  if (!user) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="h-screen bg-gradient-to-br from-white via-red-50 to-white text-gray-900 p-4">
      <div className="h-full max-w-7xl mx-auto flex rounded-3xl overflow-hidden border border-red-200 shadow-2xl bg-white">

        {/* LEFT SIDEBAR */}
        <div className="w-80 border-r border-red-100 flex flex-col bg-red-50">
          <div className="p-4 border-b border-red-100">
            <h2 className="text-lg font-semibold text-red-600">Messages</h2>
            <input
              type="text"
              placeholder="Search..."
              className="mt-3 w-full px-3 py-2 rounded-xl bg-white border border-red-200 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="p-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-red-100">
              <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                S
              </div>
              <div>
                <p className="font-medium text-sm">Seller</p>
                <p className="text-xs text-gray-500">Marketplace conversation</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="flex-1 flex flex-col">

          {/* HEADER */}
          <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                S
              </div>
              <div>
                <h2 className="font-semibold text-lg">Seller</h2>
                <p className="text-xs text-green-500">● Online</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Logged in as <span className="font-medium">{user.name || user.email}</span>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg, i) => {
              const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
              const isOwn = senderId === user.id;

              return (
                <div key={i} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-md flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                    <span className="text-xs text-gray-400 mb-1">
                      {isOwn ? "You" : msg.sender?.name || "Seller"}
                    </span>

                    <div
                      className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        isOwn
                          ? "bg-red-500 text-white rounded-br-none"
                          : "bg-red-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.message}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isOwn && i === messages.length - 1 && (
                        <span className="text-red-500 font-medium">Seen</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingUser && (
              <div className="text-sm text-gray-500 italic">
                {typingUser} is typing...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <form onSubmit={handleSend} className="p-4 border-t border-red-100 bg-white">
            <div className="flex items-center gap-3 bg-red-50 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-red-500 transition">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

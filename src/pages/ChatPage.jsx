import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";

const SOCKET_SERVER_URL = "https://broker-back.onrender.com"; // Update with your backend URL

export default function ChatWrapper({ theme = "dark" }) {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const socketRef = useRef();

  const isDark = theme === "dark";

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch previous messages
  useEffect(() => {
    if (!roomId) return;
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${roomId}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };
    fetchMessages();
  }, [roomId]);

  // Mark messages as read
  useEffect(() => {
    if (!user || !roomId) return;
    API.post(`/chatrooms/${roomId}/read`, { userId: user.id }).catch(() =>
      console.error("Error marking as read")
    );
  }, [user, roomId]);

  // Setup socket
  useEffect(() => {
    if (!roomId || !user) return;

    socketRef.current = io(SOCKET_SERVER_URL,{transports: ["websocket"]});

    socketRef.current.emit("joinRoom", roomId);

    // socketRef.current.on("receiveMessage", (msg) => {
    //   setMessages((prev) => [...prev, msg]);
    // });

    socketRef.current.on("receiveMessage", (msg) => {
  // Ignore messages sent by the current user (already added optimistically)
  if (msg.sender === user.id) return;
  setMessages((prev) => [...prev, msg]);
});

    return () => socketRef.current.disconnect();
  }, [roomId, user]);

  // SEND MESSAGE (FIXED)
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      roomId,
      message: newMessage,
      sender: user.id,
      createdAt: new Date().toISOString(),
    };

    // ✅ Show instantly
    setMessages((prev) => [...prev, messageData]);

    // Send to server
    socketRef.current.emit("sendMessage", messageData);

    setNewMessage("");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="w-full max-w-5xl h-[90vh] flex flex-col bg-slate-900 rounded-3xl overflow-hidden">

        {/* HEADER */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-bold">Room #{roomId}</h2>
          <p className="text-xs text-slate-400">
            Logged in as {user.name || user.email}
          </p>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => {
            const senderId =
              typeof msg.sender === "object" ? msg.sender._id : msg.sender;

            const isOwn = senderId === user.id;

            return (
              <div
                key={i}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                    isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  <p className="text-xs opacity-70 mb-1">
                    {isOwn ? "You" : msg.sender?.name || "User"}
                  </p>
                  <p>{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-slate-700 flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

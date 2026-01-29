
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function ChatList({ theme = "dark" }) {
  const isDark = theme === "dark";
  const [rooms, setRooms] = useState([]);
  const [userId, setUserId] = useState(null);

  // Load user ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.id);
    }
  }, []);

  // Fetch chat rooms once we have userId
  useEffect(() => {
    if (!userId) return;
    const fetchRooms = async () => {
      try {
        const res = await API.get(`/chatrooms/${userId}`);
        setRooms(res.data);
        console.log(res.data)
      } catch (error) {
        console.error("Error loading chat rooms:", error);
      }
    };
    fetchRooms();
  }, [userId]);

  // Delete a chat room
  const handleDeleteRoom = async (roomId) => {
    try {
      await API.delete(`/chatrooms/${roomId}`);
      // Update rooms state to remove the deleted room
      setRooms(rooms.filter((room) => room._id !== roomId));
      console.log(`Chat room ${roomId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting chat room:", error);
    }
  };

  if (!userId)
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-700"}`}>
        <p className="text-sm tracking-wide">
          Loading your conversations<span className="animate-pulse">...</span>
        </p>
      </div>
    );

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50" : "bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 text-slate-900"}`}>
      <div className="w-full max-w-2xl">
        {/* Hero */}
        <div className={`rounded-3xl border backdrop-blur-xl p-6 sm:p-8 mb-6 shadow-2xl ${isDark ? "bg-slate-900/60 border-slate-800/80 shadow-slate-950/70" : "bg-white/70 border-slate-200 shadow-slate-900/10"}`}>
          <p className={`text-xs uppercase tracking-[0.35em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Inbox</p>
          <h1 className={`mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r ${isDark ? "from-blue-400 via-sky-400 to-indigo-400" : "from-sky-600 via-blue-600 to-indigo-600"} bg-clip-text text-transparent`}>
            My Chats
          </h1>
          <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Your recent conversations and unread messages.
          </p>
        </div>

      <div className={`w-full bg-slate-900/80 border rounded-3xl shadow-2xl p-5 overflow-y-auto backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 ${isDark ? "bg-slate-900/80 border-slate-800/80 shadow-slate-950/80 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]" : "bg-white/80 border-slate-200 shadow-slate-900/10 hover:shadow-[0_25px_80px_rgba(15,23,42,0.18)]"}`}>
        {rooms.length === 0 ? (
          <p className={`text-center text-sm ${isDark ? "text-slate-500" : "text-slate-600"}`}>No conversations yet</p>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => {
              // Find the chat partner (exclude current user)
              const partner = room.members.find((m) => m!== userId);
                
              // Get unread count safely
              const unread = room.unreadCount?.[userId] || 0;

              return (
                <div key={room._id} className="relative">
                  <Link
                    to={`/chat/${room._id}`}
                    className={`block p-3 rounded-2xl border shadow-sm relative transition-all duration-200 ${isDark ? "bg-slate-900/70 hover:bg-slate-800/80 border-slate-800/80" : "bg-white hover:bg-slate-50 border-slate-200"}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className={`font-medium text-sm ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                        {partner|| "Partner"}
                      </p>
                      <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                        {new Date(room.updatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {room.lastMessage || " messages .."}
                    </p>
                    {unread > 0 && (
                      <span className="absolute top-2 left-14 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unread}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    className="absolute top-2 right-14 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-full text-[10px] shadow-sm shadow-red-900/60"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
      </div>
    
  );
}


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function ChatList() {
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
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-200">
        <p className="text-sm tracking-wide">
          Loading your conversations<span className="animate-pulse">...</span>
        </p>
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-50">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-950/80 p-5 overflow-y-auto backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]">
        <h2 className="text-xl font-semibold mb-1 text-center">My Chats</h2>
        <p className="text-xs text-slate-400 mb-4 text-center">
          All your recent conversations in one place.
        </p>
        {rooms.length === 0 ? (
          <p className="text-slate-500 text-center text-sm">No conversations yet</p>
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
                    className="block p-3 bg-slate-900/70 hover:bg-slate-800/80 rounded-2xl border border-slate-800/80 shadow-sm relative transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-slate-100 text-sm">
                        {partner|| "Partner"}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        {new Date(room.updatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs truncate mt-1">
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
  );
}

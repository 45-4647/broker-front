
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

  if (!userId) return <p className="text-center mt-4">Loading user...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">My Chats</h2>
        {rooms.length === 0 ? (
          <p className="text-gray-500 text-center">No conversations yet</p>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => {
              // Find the chat partner (exclude current user)
              const partner = room.members.find((m) => m._id !== userId);

              // Get unread count safely
              const unread = room.unreadCount?.[userId] || 0;

              return (
                <div key={room._id} className="relative">
                  <Link
                    to={`/chat/${room._id}`}
                    className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg shadow-sm relative transition"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">
                        {partner?.name || "Partner"}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(room.updatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm truncate">
                      {room.lastMessage || " messages .."}
                    </p>
                    {unread > 0 && (
                      <span className="absolute top-2 left-14 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unread}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    className="absolute top-2 right-14 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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

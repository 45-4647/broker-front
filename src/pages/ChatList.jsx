import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export default function ChatList({ theme = "dark" }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUserId(JSON.parse(stored).id);
  }, []);

  useEffect(() => {
    if (!userId) return;
    API.get(`/chatrooms/${userId}`)
      .then((res) => setRooms(res.data || []))
      .catch(() => toast.error("Failed to load chats."))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleDelete = async (e, roomId) => {
    e.preventDefault();
    const tid = toast.loading("Deleting chat...");
    try {
      await API.delete(`/chatrooms/${roomId}`);
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
      toast.success("Chat deleted.", { id: tid });
    } catch {
      toast.error("Failed to delete.", { id: tid });
    }
  };

  const filtered = rooms.filter((r) => {
    const partner = r.members?.find((m) => m._id !== userId);
    return [partner?.name, r.productId?.name, r.lastMessage].join(" ").toLowerCase().includes(search.toLowerCase());
  });

  const bg = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900";

  if (!userId || loading) return (
    <div className={`${bg} min-h-screen flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-3">
        <svg className="w-7 h-7 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading chats...</p>
      </div>
    </div>
  );

  return (
    <div className={`${bg} min-h-screen transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? "text-blue-400" : "text-blue-500"}`}>Inbox</p>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{rooms.length} conversation{rooms.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 mb-5 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
          <svg className={`w-4 h-4 shrink-0 ${isDark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`bg-transparent text-sm outline-none w-full ${isDark ? "text-slate-100 placeholder-slate-500" : "text-slate-800 placeholder-slate-400"}`}
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
              <svg className={`w-7 h-7 ${isDark ? "text-slate-600" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className={`text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {search ? `No results for "${search}"` : "No conversations yet"}
            </p>
            <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Browse products and click "Chat with Seller" to start.
            </p>
            <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((room) => {
              const partner = room.members?.find((m) => m._id !== userId);
              const unread = room.unreadCount?.[userId] || 0;
              const time = room.updatedAt ? new Date(room.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

              return (
                <div key={room._id} className="relative group">
                  <Link
                    to={`/chat/${room._id}`}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 ${
                      isDark
                        ? "bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                        {partner?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unread}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`font-semibold text-sm ${unread > 0 ? isDark ? "text-white" : "text-slate-900" : isDark ? "text-slate-200" : "text-slate-700"}`}>
                          {partner?.name || "Unknown"}
                        </p>
                        <span className={`text-[10px] shrink-0 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{time}</span>
                      </div>
                      {room.productId?.name && (
                        <p className={`text-[10px] font-medium mb-0.5 ${isDark ? "text-blue-400" : "text-blue-500"}`}>
                          📦 {room.productId.name}
                        </p>
                      )}
                      <p className={`text-xs truncate ${unread > 0 ? isDark ? "text-slate-300 font-medium" : "text-slate-700 font-medium" : isDark ? "text-slate-500" : "text-slate-400"}`}>
                        {room.lastMessage || "No messages yet"}
                      </p>
                    </div>

                    {/* Arrow */}
                    <svg className={`w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={(e) => handleDelete(e, room._id)}
                    className={`absolute top-3 right-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg ${isDark ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-500"}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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

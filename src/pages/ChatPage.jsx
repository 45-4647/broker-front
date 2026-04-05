import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import toast from "react-hot-toast";

const SOCKET_URL = "https://broker-back.onrender.com";

 

export default function ChatPage({ theme = "dark" }) {
  const isDark = theme === "dark";
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(urlRoomId || null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(!urlRoomId); // mobile: show sidebar if no room selected

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ── Load user ──
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // ── Fetch all rooms ──
  const fetchRooms = useCallback(async (uid) => {
    try {
      const res = await API.get(`/chatrooms/${uid}`);
      setRooms(res.data || []);
    } catch {
      toast.error("Failed to load conversations.");
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchRooms(user.id);
  }, [user, fetchRooms]);

  // ── Sync active room when URL changes ──
  useEffect(() => {
    if (urlRoomId) {
      setActiveRoomId(urlRoomId);
      setShowSidebar(false);
    }
  }, [urlRoomId]);

  // ── Fetch active room info ──
  useEffect(() => {
    if (!activeRoomId) return;
    API.get(`/chatroom/${activeRoomId}`)
      .then((res) => setActiveRoom(res.data))
      .catch(() => {});
  }, [activeRoomId]);

  // ── Fetch messages for active room ──
  useEffect(() => {
    if (!activeRoomId) return;
    setMsgsLoading(true);
    setMessages([]);
    API.get(`/messages/${activeRoomId}`)
      .then((res) => setMessages(res.data || []))
      .catch(() => {})
      .finally(() => setMsgsLoading(false));
  }, [activeRoomId]);

  // ── Mark as read ──
  useEffect(() => {
    if (!user || !activeRoomId) return;
    API.post(`/chatrooms/${activeRoomId}/read`, { userId: user.id });
    setRooms((prev) =>
      prev.map((r) =>
        r._id === activeRoomId
          ? { ...r, unreadCount: { ...r.unreadCount, [user.id]: 0 } }
          : r
      )
    );
  }, [user, activeRoomId]);

  // ── Auto scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  // ── Socket ──
  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

    socketRef.current.on("receiveMessage", (msg) => {
      const sid = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
      // update messages if in active room
      if (msg.roomId === activeRoomId && sid !== user.id) {
        setMessages((prev) => [...prev, msg]);
      }
      // update last message in sidebar
      setRooms((prev) =>
        prev.map((r) =>
          r._id === msg.roomId
            ? {
                ...r,
                lastMessage: msg.message,
                updatedAt: msg.createdAt,
                unreadCount:
                  msg.roomId !== activeRoomId
                    ? { ...r.unreadCount, [user.id]: (r.unreadCount?.[user.id] || 0) + 1 }
                    : r.unreadCount,
              }
            : r
        )
      );
    });

    socketRef.current.on("userTyping", (name) => setTypingUser(name));
    socketRef.current.on("userStopTyping", () => setTypingUser(null));

    return () => socketRef.current?.disconnect();
  }, [user, activeRoomId]);

  // ── Join room on socket when active room changes ──
  useEffect(() => {
    if (!activeRoomId || !socketRef.current) return;
    socketRef.current.emit("joinRoom", activeRoomId);
  }, [activeRoomId]);

  // ── Select a room ──
  const selectRoom = (roomId) => {
    setActiveRoomId(roomId);
    setShowSidebar(false);
    navigate(`/chat/${roomId}`, { replace: true });
    inputRef.current?.focus();
  };

  // ── Send message ──
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !activeRoomId) return;
    const msg = {
      roomId: activeRoomId,
      message: newMessage,
      sender: user.id,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setRooms((prev) =>
      prev.map((r) =>
        r._id === activeRoomId ? { ...r, lastMessage: newMessage, updatedAt: msg.createdAt } : r
      )
    );
    socketRef.current.emit("sendMessage", msg);
    socketRef.current.emit("stopTyping", activeRoomId);
    setNewMessage("");
    inputRef.current?.focus();
  };

  // ── Typing ──
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socketRef.current) return;
    socketRef.current.emit("typing", { roomId: activeRoomId, userName: user?.name || "User" });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socketRef.current?.emit("stopTyping", activeRoomId), 1000);
  };

  // ── Delete room ──
  const handleDeleteRoom = async (e, roomId) => {
    e.stopPropagation();
    const tid = toast.loading("Deleting...");
    try {
      await API.delete(`/chatrooms/${roomId}`);
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
      if (activeRoomId === roomId) {
        setActiveRoomId(null);
        setActiveRoom(null);
        setMessages([]);
        navigate("/chat", { replace: true });
        setShowSidebar(true);
      }
      toast.success("Deleted.", { id: tid });
    } catch {
      toast.error("Failed.", { id: tid });
    }
  };

  // ── Derived ──
  const partner = activeRoom?.members?.find((m) => (m._id || m) !== user?.id);
  const partnerName = typeof partner === "object" ? partner?.name : "Seller";
  const productName = activeRoom?.productId?.name || null;
  const productImage = activeRoom?.productId?.images?.[0] || null;

  const filteredRooms = rooms
    .filter((r) => {
      const p = r.members?.find((m) => m._id !== user?.id);
      return [p?.name, r.productId?.name, r.lastMessage].join(" ").toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const totalUnread = rooms.reduce((sum, r) => sum + (r.unreadCount?.[user?.id] || 0), 0);

  const bg = isDark ? "bg-slate-950" : "bg-slate-100";
  const panel = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const divider = isDark ? "border-slate-800" : "border-slate-200";

  if (!user) return (
    <div className={`${bg} h-full flex items-center justify-center`}>
      <svg className="w-7 h-7 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );

  return (
    <div className={`${bg} h-full flex overflow-hidden`}>

      {/* ════════════════════════════════════
          LEFT SIDEBAR
      ════════════════════════════════════ */}
      <div className={`
        ${showSidebar ? "flex" : "hidden"} md:flex
        flex-col w-full md:w-80 lg:w-96 shrink-0
        border-r ${panel} ${divider}
      `}>

        {/* Sidebar header */}
        <div className={`px-4 py-4 border-b ${divider} shrink-0`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                Messages
                {totalUnread > 0 && (
                  <span className="ml-2 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-semibold">{totalUnread}</span>
                )}
              </h1>
              <p className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{rooms.length} conversation{rooms.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Search */}
          <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <svg className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`bg-transparent text-xs outline-none w-full ${isDark ? "text-slate-200 placeholder-slate-500" : "text-slate-700 placeholder-slate-400"}`}
            />
          </div>
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto">
          {roomsLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                <svg className={`w-6 h-6 ${isDark ? "text-slate-600" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {search ? `No results for "${search}"` : "No conversations yet"}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {filteredRooms.map((room) => {
                const p = room.members?.find((m) => m._id !== user.id);
                const unread = room.unreadCount?.[user.id] || 0;
                const isActive = room._id === activeRoomId;
                const time = room.updatedAt
                  ? new Date(room.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "";

                return (
                  <div
                    key={room._id}
                    onClick={() => selectRoom(room._id)}
                    className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 ${
                      isActive
                        ? isDark ? "bg-blue-600/15 border border-blue-500/30" : "bg-blue-50 border border-blue-200"
                        : isDark ? "hover:bg-slate-800 border border-transparent" : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base ${
                        isActive ? "bg-blue-600" : "bg-gradient-to-br from-slate-600 to-slate-700"
                      }`}>
                        {p?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      {unread > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {unread > 9 ? "9+" : unread}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold truncate ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                          {p?.name || "Unknown"}
                        </p>
                        <span className={`text-[10px] shrink-0 ml-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}>{time}</span>
                      </div>
                      {room.productId?.name && (
                        <p className={`text-[10px] font-medium truncate ${isDark ? "text-blue-400" : "text-blue-500"}`}>
                          📦 {room.productId.name}
                        </p>
                      )}
                      <p className={`text-xs truncate mt-0.5 ${
                        unread > 0
                          ? isDark ? "text-slate-200 font-medium" : "text-slate-700 font-medium"
                          : isDark ? "text-slate-500" : "text-slate-400"
                      }`}>
                        {room.lastMessage || "No messages yet"}
                      </p>
                    </div>

                    {/* Delete on hover */}
                    <button
                      onClick={(e) => handleDeleteRoom(e, room._id)}
                      className={`shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-opacity ${isDark ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-500"}`}
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

      {/* ════════════════════════════════════
          RIGHT CHAT PANEL
      ════════════════════════════════════ */}
      <div className={`
        ${!showSidebar ? "flex" : "hidden"} md:flex
        flex-1 flex-col min-w-0
      `}>

        {/* No room selected */}
        {!activeRoomId ? (
          <div className={`flex-1 flex flex-col items-center justify-center gap-4 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-slate-200"}`}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-center">
              <p className={`font-semibold text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Select a conversation</p>
              <p className="text-xs mt-1">Choose from the left to start chatting</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className={`flex items-center gap-3 px-4 py-3 border-b shrink-0 ${panel} ${divider}`}>
              {/* Mobile back button */}
              <button
                onClick={() => { setShowSidebar(true); }}
                className={`md:hidden p-2 rounded-xl transition ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
                {partnerName?.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{partnerName}</p>
                {productName && (
                  <div className="flex items-center gap-1 mt-0.5">
                    {productImage && <img src={productImage} alt="" className="w-3.5 h-3.5 rounded object-cover" />}
                    <p className={`text-[11px] truncate ${isDark ? "text-blue-400" : "text-blue-500"}`}>📦 {productName}</p>
                  </div>
                )}
              </div>

              {/* Logged in as */}
              <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${isDark ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400"}`}>
                {user.name}
              </span>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {msgsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                    <svg className={`w-7 h-7 ${isDark ? "text-slate-600" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>No messages yet — say hi!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
                  const isOwn = senderId === user.id;
                  const prevSenderId = i > 0 ? (typeof messages[i-1].sender === "object" ? messages[i-1].sender._id : messages[i-1].sender) : null;
                  const showName = senderId !== prevSenderId;
                  const senderName = typeof msg.sender === "object" ? msg.sender.name : (isOwn ? user.name : partnerName);

                  return (
                    <div key={i} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[72%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                        {showName && (
                          <span className={`text-[10px] mb-1 px-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            {isOwn ? "You" : senderName}
                          </span>
                        )}
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isOwn
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : isDark
                              ? "bg-slate-800 text-slate-100 rounded-bl-sm"
                              : "bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100"
                        }`}>
                          {msg.message}
                        </div>
                        <span className={`text-[10px] mt-1 px-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {typingUser && (
                <div className="flex justify-start">
                  <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${isDark ? "bg-slate-800" : "bg-white shadow-sm border border-slate-100"}`}>
                    <div className="flex items-center gap-1">
                      {[0, 150, 300].map((delay) => (
                        <span key={delay} className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? "bg-slate-400" : "bg-slate-400"}`} style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className={`px-4 py-3 border-t shrink-0 ${panel} ${divider}`}>
              <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 transition-all ${
                isDark
                  ? "bg-slate-800 border-slate-700 focus-within:border-blue-500/60"
                  : "bg-slate-50 border-slate-200 focus-within:border-blue-400"
              }`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(e)}
                  placeholder="Type a message..."
                  className={`flex-1 bg-transparent outline-none text-sm ${isDark ? "text-slate-100 placeholder-slate-500" : "text-slate-800 placeholder-slate-400"}`}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

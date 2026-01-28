import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";

const SOCKET_SERVER_URL = "https://broker-back.onrender.com"; // adjust to your backend port

export default function ChatWrapper({ theme = "dark" }) {
  const { roomId } = useParams(); // get roomId from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const socketRef = useRef();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser)
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch old messages
  useEffect(() => {
    if (!roomId) return;
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${roomId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    fetchMessages();
  }, [roomId]);

  // Mark messages as read
  useEffect(() => {
    if (!user || !roomId) return;
    const markAsRead = async () => {
      try {
        await API.post(`/chatrooms/${roomId}/read`, { userId: user.id });
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    };
    markAsRead();
  }, [user, roomId]);

  // Setup socket connection
  useEffect(() => {
    if (!roomId || !user) return;

    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.emit("joinRoom", roomId);

    // Listen for incoming messages
    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, user]);

  // Send message
  const handleSend = (e) => {
    console.log(user.id)
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      roomId,
      message: newMessage,
      sender: user.id,
    };

    // ✅ Only emit to server — don't add to UI here
    socketRef.current.emit("sendMessage", messageData);

    setNewMessage("");
  };

  const isDark = theme === "dark";

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="px-6 py-4 rounded-2xl bg-slate-900/80 border border-slate-700 shadow-xl">
          <p className="text-slate-200 text-sm tracking-wide">
            Loading your chat workspace<span className="animate-pulse">...</span>
          </p>
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-6 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50"
          : "bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 text-slate-900"
      }`}
    >
      <div
        className={`w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden rounded-3xl backdrop-blur-xl transform transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)] border ${
          isDark
            ? "bg-slate-900/70 border-slate-700/60 shadow-2xl shadow-slate-950/80"
            : "bg-white/90 border-slate-200 shadow-2xl shadow-slate-900/10"
        }`}
      >
        {/* Top bar */}
        <header
          className={`px-6 py-4 flex items-center justify-between backdrop-blur-sm border-b ${
            isDark
              ? "bg-slate-900/60 border-slate-700/70"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <div>
            <p
              className={`text-xs uppercase tracking-[0.28em] ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Conversation
            </p>
            <h1
              className={`text-lg font-semibold ${
                isDark ? "text-slate-50" : "text-slate-900"
              }`}
            >
              Room <span className="text-blue-400">#{roomId}</span>
            </h1>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Signed in as{" "}
              <span className="font-medium text-slate-100">
                {user?.name || user?.email || `User ${user?.id}`}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Connected to live chat</span>
            <span className="sm:hidden">Live</span>
          </div>
        </header>

        {/* Messages area */}
          <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700/70 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div
                className={`h-full flex flex-col items-center justify-center text-center ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <p className="text-sm font-medium">
                  No messages in this room yet.
                </p>
                <p className="text-xs mt-1">
                  Start the conversation by sending the first message.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isOwn = msg.sender === user.id;
              const timeLabel = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={idx}
                  className={`flex w-full ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] items-end gap-2 ${
                      isOwn ? "flex-row-reverse text-right" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold uppercase shadow-inner ${
                        isDark
                          ? "bg-slate-800 text-slate-100 shadow-slate-900"
                          : "bg-slate-200 text-slate-700 shadow-slate-300"
                      }`}
                    >
                      {typeof msg.sender === "string"
                        ? msg.sender.charAt(0)
                        : "U"}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-md transform transition-all duration-200 ${
                        isOwn
                          ? isDark
                            ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-blue-900/40 hover:shadow-blue-900/70 hover:-translate-y-0.5"
                            : "bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-slate-400/40 hover:shadow-slate-500/70 hover:-translate-y-0.5"
                          : isDark
                          ? "bg-slate-800/90 text-slate-50 shadow-slate-900/40 border border-slate-700/60 hover:-translate-y-0.5 hover:shadow-slate-900"
                          : "bg-white text-slate-900 shadow-slate-300/70 border border-slate-200 hover:-translate-y-0.5 hover:shadow-slate-400/80"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <p className="text-[11px] font-semibold tracking-wide uppercase opacity-80">
                          {isOwn ? "You" : msg.sender}
                        </p>
                        {timeLabel && (
                          <span className="text-[10px] font-medium opacity-70">
                            {timeLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed break-words">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSend}
            className="border-t border-slate-700/70 bg-slate-900/70 px-3 sm:px-4 py-3 flex items-end gap-2"
          >
            <div className="flex-1 flex flex-col gap-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message to the broker..."
                className="w-full rounded-2xl bg-slate-900/80 border border-slate-700/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 transition shadow-inner shadow-slate-900"
              />
              <p className="text-[10px] text-slate-500 px-1">
                Press <span className="font-semibold text-slate-300">Enter</span>{" "}
                to send.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-lg shadow-blue-900/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



// import { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import { v4 as uuidv4 } from 'uuid'; // Import UUID
// import API from "../services/api";

// const SOCKET_SERVER_URL = "http://localhost:4000"; // adjust to your backend port

// export default function ChatWrapper() {
//   const { roomId } = useParams(); // get roomId from URL
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [user, setUser] = useState(null);
//   const socketRef = useRef();

//   // Load user from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Fetch old messages
//   useEffect(() => {
//     if (!roomId) return;
//     const fetchMessages = async () => {
//       try {
//         const res = await API.get(`/messages/${roomId}`);
//         // Sort by `createdAt` in descending order when fetching
//         const sortedMessages = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         setMessages(sortedMessages);
//       } catch (error) {
//         console.error("Error loading messages:", error);
//       }
//     };
//     fetchMessages();
//   }, [roomId]);

//   // Mark messages as read
//   useEffect(() => {
//     if (!user || !roomId) return;
//     const markAsRead = async () => {
//       try {
//         await API.post(`/chatrooms/${roomId}/read`, { userId: user.id });
//       } catch (error) {
//         console.error("Error marking as read:", error);
//       }
//     };
//     markAsRead();
//   }, [user, roomId]);

//   // Setup socket connection
//   useEffect(() => {
//     if (!roomId || !user) return;

//     socketRef.current = io(SOCKET_SERVER_URL);

//     socketRef.current.emit("joinRoom", roomId);

//     // Listen for incoming messages
//     socketRef.current.on("receiveMessage", (msg) => {
//         setMessages((prev) => {
//             const isDuplicate = prev.some(m => m._id === msg._id);
//             return isDuplicate ? prev : [...prev, msg];
//         });
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [roomId, user]);

//   // Send message
//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !user) return;

//     const tempId = uuidv4();  // Generate client-side id
//     const messageData = {
//       roomId,
//       message: newMessage,
//       sender: user.id,
//       createdAt: new Date(),
//       _id: tempId,    // Client-side ID for deduplication
//     };

//     // ✅ Optimistically update local state
//     setMessages((prevMessages) => [...prevMessages, messageData]);

//     // ✅ Only emit to server — don't add to UI here
//     socketRef.current.emit("sendMessage", messageData);

//     setNewMessage("");
//   };

//   if (!user) return <p className="text-center mt-4">Loading user...</p>;

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 p-4">
//       {/* Messages list */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-3">
//         {messages.map((msg, idx) => (
//           <div
//             key={msg._id || idx}  // Use msg._id if available
//             className={`p-2 rounded-lg max-w-xs ${
//               msg.sender === user.id
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-white text-gray-800"
//             }`}
//           >
//             <p className="text-sm font-semibold">{msg.sender}</p>
//             <p>{msg.message}</p>
//             <p className="text-xs text-gray-400 mt-1">
//               {new Date(msg.createdAt).toLocaleTimeString()}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Input box */}
//       <form onSubmit={handleSend} className="flex gap-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 border p-2 rounded-lg"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";

const SOCKET_SERVER_URL = "http://localhost:4000"; // adjust to your backend port

export default function ChatWrapper() {
  const { roomId } = useParams(); // get roomId from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const socketRef = useRef();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
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

  if (!user) return <p className="text-center mt-4">Loading user...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.sender === user.id
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-gray-800"
            }`}
          >
            <p className="text-sm font-semibold">{msg.sender}</p>
            <p>{msg.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
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

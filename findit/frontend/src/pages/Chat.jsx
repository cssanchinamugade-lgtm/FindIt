
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import "./Chat.css";

// ===============================
// SOCKET CONNECTION
// ===============================

const BACKEND_URL = "https://findit-backend-lees.onrender.com";

const socket = io(BACKEND_URL, {
    transports: ["websocket", "polling"],
    autoConnect: true
});

function Chat() {
    const {
        itemId,
        receiverId: routeReceiverId
    } = useParams();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const bottomRef = useRef(null);

    // ===============================
    // GET LOGGED-IN USER
    // ===============================

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        console.log("Error reading user:", error);
    }

    const userId = user?.id;
    const userName = user?.name || "User";
    const receiverId = routeReceiverId;

    // ===============================
    // CREATE CHAT ID
    // ===============================

    const chatId =
        userId && receiverId
            ? [String(userId), String(receiverId)]
                .sort()
                .join("_")
            : "";

    // ===============================
    // LOAD OLD MESSAGES
    // ===============================

    useEffect(() => {
        if (!chatId) return;

        const loadMessages = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/chat/${chatId}`
                );

                if (!response.ok) {
                    throw new Error("Unable to load messages");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setMessages((previous) => {
                        const combined = [...data, ...previous];
                        const unique = [];

                        combined.forEach((msg) => {
                            const key = msg._id
                                ? String(msg._id)
                                : `${msg.senderId}_${msg.createdAt}_${msg.message}`;

                            if (
                                !unique.some((item) => {
                                    const existingKey = item._id
                                        ? String(item._id)
                                        : `${item.senderId}_${item.createdAt}_${item.message}`;

                                    return existingKey === key;
                                })
                            ) {
                                unique.push(msg);
                            }
                        });

                        return unique.sort(
                            (a, b) =>
                                new Date(a.createdAt) -
                                new Date(b.createdAt)
                        );
                    });
                }
            } catch (error) {
                console.log("Error loading messages:", error);
            }
        };

        loadMessages();
    }, [chatId]);

    // ===============================
    // REAL-TIME SOCKET CONNECTION
    // ===============================

    useEffect(() => {
        if (!chatId || !userId) return;

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);

            // Join personal user room
            socket.emit("joinUser", String(userId));

            // Join this chat room
            socket.emit("joinChat", chatId);
        };

        const receiveMessage = (data) => {
            console.log("MESSAGE RECEIVED:", data);

            if (String(data.chatId) !== String(chatId)) {
                return;
            }

            setMessages((previous) => {
                const alreadyExists = previous.some((msg) => {
                    if (msg._id && data._id) {
                        return String(msg._id) === String(data._id);
                    }

                    return (
                        String(msg.senderId) === String(data.senderId) &&
                        String(msg.createdAt) === String(data.createdAt) &&
                        msg.message === data.message
                    );
                });

                if (alreadyExists) {
                    return previous;
                }

                return [...previous, data];
            });
        };

        // Listen before joining the room
        socket.on("receiveMessage", receiveMessage);
        socket.on("connect", handleConnect);

        // Handle an already-connected socket
        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off("receiveMessage", receiveMessage);
            socket.off("connect", handleConnect);
        };
    }, [chatId, userId]);

    // ===============================
    // AUTO SCROLL
    // ===============================

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    // ===============================
    // SEND MESSAGE
    // ===============================

    const sendMessage = async () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        if (!userId || !receiverId || !chatId) {
            alert("Unable to start chat. Please check the user details.");
            return;
        }

        const data = {
            chatId,
            senderId: String(userId),
            receiverId: String(receiverId),
            senderName: userName,
            message: trimmedMessage,
            createdAt: new Date().toISOString()
        };

        console.log("SENDING MESSAGE:", data);

        try {
            // First save the message in MongoDB
            const response = await fetch(
                `${BACKEND_URL}/api/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                throw new Error("Message could not be saved");
            }

            const result = await response.json();

            console.log("MESSAGE SAVED:", result);

            // Broadcast only after successful saving
            socket.emit("sendMessage", {
                ...data,
                ...(result.message || {})
            });

            setMessage("");

        } catch (error) {
            console.log("ERROR SENDING MESSAGE:", error);
            alert("Message could not be sent. Please try again.");
        }
    };

    // ===============================
    // LOGIN CHECK
    // ===============================

    if (!user) {
        return (
            <h2 className="login-message">
                Please login to use chat 💬
            </h2>
        );
    }

    // ===============================
    // CHAT UI
    // ===============================

    return (
        <div className="whatsapp-container">

            <div className="chat-header">
                <h2>
                    Chat With User 💬
                </h2>

                <span>
                    Online 🟢
                </span>
            </div>

            <div className="messages">

                {messages.map((msg, index) => (
                    <div
                        key={msg._id || index}
                        className={
                            String(msg.senderId) === String(userId)
                                ? "my-message"
                                : "other-message"
                        }
                    >
                        <p>
                            {msg.message}
                        </p>

                        <small>
                            {new Date(
                                msg.createdAt
                            ).toLocaleTimeString()}
                        </small>
                    </div>
                ))}

                <div ref={bottomRef}></div>

            </div>

            <div className="input-area">

                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    placeholder="Type your message..."
                />

                <button onClick={sendMessage}>
                    ➤
                </button>

            </div>

        </div>
    );
}

export default Chat;

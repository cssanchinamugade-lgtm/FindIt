import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import "./Chat.css";

const socket = io(
    "https://findit-backend-lees.onrender.com"
);

function Chat() {

    const {
        itemId,
        receiverId
    } = useParams();

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const [receiverName, setReceiverName] =
        useState("Chat With User");

    const bottomRef = useRef();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const userId = user?.id;

    const userName = user?.name;

    const chatId = userId && receiverId
        ? [
            userId,
            receiverId
        ]
        .sort()
        .join("_")
        : "";

    // ===============================
    // GET REAL RECEIVER NAME
    // ===============================

    useEffect(() => {

        const getReceiverName = async () => {

            try {

                const response = await fetch(
                    `https://findit-backend-lees.onrender.com/api/auth/user/${receiverId}`
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                setReceiverName(data.name);

            }

            catch (error) {

                console.log(
                    "Error getting user:",
                    error
                );

            }

        };

        if (receiverId) {
            getReceiverName();
        }

    }, [receiverId]);


    // ===============================
    // LOAD PREVIOUS MESSAGES
    // ===============================

    useEffect(() => {

        const loadMessages = async () => {

            try {

                const response = await fetch(
                    `https://findit-backend-lees.onrender.com/api/chat/${chatId}`
                );

                const data = await response.json();

                setMessages(data);

            }

            catch (error) {

                console.log(
                    "Error loading messages:",
                    error
                );

            }

        };

        if (chatId) {
            loadMessages();
        }

    }, [chatId]);


    // ===============================
    // REAL TIME CHAT
    // ===============================

    useEffect(() => {

        if (!chatId) {
            return;
        }

        socket.emit(
            "joinChat",
            chatId
        );


        // Receive message

        const receiveMessage = (data) => {

            setMessages(
                prev => [
                    ...prev,
                    data
                ]
            );

        };


        socket.on(
            "receiveMessage",
            receiveMessage
        );


        // Notification

        const receiveNotification = (data) => {

            if (
                data.receiverId === userId
            ) {

                if (
                    "Notification" in window &&
                    Notification.permission === "granted"
                ) {

                    new Notification(
                        `New message from ${data.senderName}`,
                        {
                            body: data.message
                        }
                    );

                }

            }

        };


        socket.on(
            "newMessageNotification",
            receiveNotification
        );


        // Ask notification permission

        if (
            "Notification" in window &&
            Notification.permission === "default"
        ) {

            Notification.requestPermission();

        }


        return () => {

            socket.off(
                "receiveMessage",
                receiveMessage
            );

            socket.off(
                "newMessageNotification",
                receiveNotification
            );

        };

    }, [chatId, userId]);


    // ===============================
    // SCROLL TO BOTTOM
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

        if (!message.trim()) {
            return;
        }

        const data = {

            chatId,

            itemId,

            senderId: userId,

            receiverId,

            senderName: userName,

            message: message.trim(),

            time: new Date()

        };


        // Real-time message

        socket.emit(
            "sendMessage",
            data
        );


        // Save message in MongoDB

        try {

            await fetch(

                "https://findit-backend-lees.onrender.com/api/chat",

                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(data)

                }

            );

        }

        catch (error) {

            console.log(
                "Error saving message:",
                error
            );

        }


        setMessage("");

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
                    {receiverName} 💬
                </h2>

                <span>
                    Online 🟢
                </span>

            </div>


            <div className="messages">

                {
                    messages.map(
                        (msg, index) => (

                            <div

                                key={
                                    msg._id || index
                                }

                                className={

                                    msg.senderId === userId

                                        ?

                                        "my-message"

                                        :

                                        "other-message"

                                }

                            >

                                <p>
                                    {msg.message}
                                </p>

                                <small>

                                    {
                                        new Date(
                                            msg.time
                                        )
                                        .toLocaleTimeString()
                                    }

                                </small>

                            </div>

                        )
                    )
                }


                <div ref={bottomRef}></div>

            </div>


            <div className="input-area">

                <input

                    value={message}

                    onChange={
                        (e) =>
                            setMessage(e.target.value)
                    }

                    onKeyDown={
                        (e) => {

                            if (
                                e.key === "Enter"
                            ) {

                                sendMessage();

                            }

                        }
                    }

                    placeholder="Type your message..."

                />


                <button
                    onClick={sendMessage}
                >

                    ➤

                </button>

            </div>

        </div>

    );

}

export default Chat;
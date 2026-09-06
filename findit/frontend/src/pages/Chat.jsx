
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
        receiverId: routeReceiverId
    } = useParams();


    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const bottomRef = useRef();


    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const userId = user?.id;

    const userName = user?.name;


    const receiverId =
        routeReceiverId;


    const chatId =
        userId && receiverId
            ?
            [
                userId,
                receiverId
            ]
                .sort()
                .join("_")
            :
            "";


    // ===============================
    // LOAD OLD MESSAGES
    // ===============================

    useEffect(() => {

        const loadMessages = async () => {

            try {

                const response = await fetch(

                    `https://findit-backend-lees.onrender.com/api/chat/${chatId}`

                );


                const data =
                    await response.json();


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
    // REAL TIME SOCKET
    // ===============================

    useEffect(() => {

        if (!chatId) {
            return;
        }


        console.log(
            "Joining chat:",
            chatId
        );


        socket.emit(
            "joinChat",
            chatId
        );


        const receiveMessage = (data) => {

            console.log(
                "MESSAGE RECEIVED:",
                data
            );


            if (
                data.chatId === chatId
            ) {

                setMessages(
                    previous => [
                        ...previous,
                        data
                    ]
                );

            }

        };


        socket.on(
            "receiveMessage",
            receiveMessage
        );


        return () => {

            socket.off(
                "receiveMessage",
                receiveMessage
            );

        };


    }, [chatId]);


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

        if (!message.trim()) {
            return;
        }


        const data = {

            chatId,

            senderId: userId,

            receiverId,

            senderName: userName,

            message: message.trim(),

            createdAt: new Date()

        };


        console.log(
            "SENDING MESSAGE:",
            data
        );


        // Send through Socket.IO

        socket.emit(
            "sendMessage",
            data
        );


        // Save in MongoDB

        try {

            const response = await fetch(

                "https://findit-backend-lees.onrender.com/api/chat",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(data)

                }

            );


            const result =
                await response.json();


            console.log(
                "MESSAGE SAVED:",
                result
            );


        }

        catch (error) {

            console.log(
                "ERROR SAVING MESSAGE:",
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


                {

                    messages.map(

                        (msg, index) => (

                            <div

                                key={
                                    msg._id || index
                                }

                                className={

                                    String(
                                        msg.senderId
                                    ) === String(
                                        userId
                                    )

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
                                            msg.createdAt
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
                            setMessage(
                                e.target.value
                            )

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


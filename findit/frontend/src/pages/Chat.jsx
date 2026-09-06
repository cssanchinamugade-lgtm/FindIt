import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import "./Chat.css";


const socket = io(
    "https://findit-backend-lees.onrender.com"
);



function Chat(){

    const {
        itemId,
        receiverId
    } = useParams();



    const [message,setMessage] = useState("");

    const [messages,setMessages] = useState([]);


    const bottomRef = useRef();



    const user = JSON.parse(
        localStorage.getItem("user")
    );



    if(!user){

        return(

            <h2 className="login-message">
                Please login to use chat 💬
            </h2>

        );

    }



    const userId = user._id;

    const userName = user.name;



    const chatId = [
        userId,
        receiverId
    ]
    .sort()
    .join("_");



    // ===============================
    // LOAD PREVIOUS MESSAGES
    // ===============================

    useEffect(()=>{

        const loadMessages = async()=>{

            try{

                const response = await fetch(
                    `https://findit-backend-lees.onrender.com/api/chat/${chatId}`
                );

                const data = await response.json();

                setMessages(data);

            }
            catch(error){

                console.log(
                    "Error loading messages:",
                    error
                );

            }

        };


        loadMessages();

    },[chatId]);



    // ===============================
    // REAL TIME CHAT + NOTIFICATIONS
    // ===============================

    useEffect(()=>{


        // Ask for notification permission

        if(
            "Notification" in window &&
            Notification.permission === "default"
        ){

            Notification.requestPermission();

        }



        // Join chat room

        socket.emit(
            "joinChat",
            chatId
        );



        // Receive real-time message

        const receiveMessage = (data)=>{

            setMessages(
                prev=>[
                    ...prev,
                    data
                ]
            );

        };



        socket.on(
            "receiveMessage",
            receiveMessage
        );



        // Receive notification

        const receiveNotification = (data)=>{


            // Only notify the receiver

            if(
                data.receiverId === userId
            ){

                if(
                    "Notification" in window &&
                    Notification.permission === "granted"
                ){

                    new Notification(
                        `New message from ${data.senderName}`,
                        {
                            body:data.message
                        }
                    );

                }

            }

        };



        socket.on(
            "newMessageNotification",
            receiveNotification
        );



        // Cleanup

        return()=>{

            socket.off(
                "receiveMessage",
                receiveMessage
            );


            socket.off(
                "newMessageNotification",
                receiveNotification
            );

        };


    },[chatId,userId]);



    // ===============================
    // SCROLL TO LATEST MESSAGE
    // ===============================

    useEffect(()=>{

        bottomRef.current?.scrollIntoView({

            behavior:"smooth"

        });

    },[messages]);



    // ===============================
    // SEND MESSAGE
    // ===============================

    const sendMessage = async()=>{


        if(!message.trim())
            return;



        const data={

            chatId,

            itemId,

            senderId:userId,

            receiverId,

            senderName:userName,

            message:message.trim(),

            time:new Date()

        };



        // Send instantly using Socket.IO

        socket.emit(
            "sendMessage",
            data
        );



        // Save message in MongoDB

        try{

            await fetch(

                "https://findit-backend-lees.onrender.com/api/chat",

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json"

                    },

                    body:JSON.stringify(data)

                }

            );

        }

        catch(error){

            console.log(
                "Error saving message:",
                error
            );

        }



        setMessage("");

    };



    // ===============================
    // CHAT UI
    // ===============================

    return(


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

                        (msg,index)=>(

                            <div

                                key={
                                    msg._id || index
                                }

                                className={

                                    msg.senderId===userId

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

                        (e)=>
                        setMessage(e.target.value)

                    }

                    onKeyDown={

                        (e)=>{

                            if(
                                e.key==="Enter"
                            ){

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
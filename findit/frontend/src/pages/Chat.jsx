import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import "./Chat.css";


const socket = io("http://localhost:5000");


function Chat(){

    const {
    itemId,
    receiverId
}=useParams();


    const [message,setMessage] = useState("");

    const [messages,setMessages] = useState([]);


    const bottomRef = useRef();



   const user = JSON.parse(
    localStorage.getItem("user")
);


const userId = user._id;

const userName = user.name;


   const chatId = 
[userId, receiverId]
.sort()
.join("_");



    useEffect(()=>{


        socket.emit(
            "joinChat",
            chatId
        );



        socket.on(
            "receiveMessage",
            (data)=>{

                setMessages(
                    (prev)=>[
                        ...prev,
                        data
                    ]
                );

            }
        );



        return()=>{

            socket.off(
                "receiveMessage"
            );

        }


    },[]);





    // Auto scroll

    useEffect(()=>{

        bottomRef.current?.scrollIntoView({
            behavior:"smooth"
        });


    },[messages]);







    const sendMessage=async()=>{


        if(!message.trim())
            return;



        const data={

            chatId,

            senderId:userId,

            receiverId,

            senderName:userName,

            message,

            time:new Date()

        };



        socket.emit(
            "sendMessage",
            data
        );



        await fetch(
            "http://localhost:5000/api/chat",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(data)

            }
        );



        setMessage("");

    };







return(

<div className="whatsapp-container">


    <div className="chat-header">

        <div>

            <h3>
                Item Owner
            </h3>

            <span>
                Online
            </span>

        </div>

    </div>





    <div className="messages">


    {
        messages.map(
            (msg,index)=>(


            <div

            key={index}

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
            e=>setMessage(e.target.value)
        }

        onKeyDown={
            e=>{
                if(e.key==="Enter")
                    sendMessage()
            }
        }

        placeholder="Type a message"

        />



        <button
        onClick={sendMessage}
        >

        ➤

        </button>


    </div>


</div>


)


}


export default Chat;
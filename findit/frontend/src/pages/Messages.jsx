import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Messages.css";


function Messages() {

    const navigate = useNavigate();


    const [conversations, setConversations] =
        useState([]);


    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // ===============================
    // LOAD CONVERSATIONS
    // ===============================

    useEffect(() => {

        const loadMessages = async () => {

            if (!user?.id) {

                return;

            }


            try {

                const response = await fetch(

                    `https://findit-backend-lees.onrender.com/api/chat/conversations/${user.id}`

                );


                const data =
                    await response.json();


                setConversations(
                    data
                );


            }

            catch (error) {

                console.log(
                    "ERROR LOADING MESSAGES:",
                    error
                );

            }

        };


        loadMessages();


    }, [user?.id]);


    // ===============================
    // LOGIN CHECK
    // ===============================

    if (!user) {

        return (

            <h2 className="login-message">

                Please login to view messages.

            </h2>

        );

    }


    // ===============================
    // PAGE
    // ===============================

    return (

        <div className="messages-page">


            <div className="messages-card">


                <h2>
                    💬 Messages
                </h2>


                {

                    conversations.length === 0

                    ?

                    <p className="no-messages">

                        No messages yet.

                    </p>

                    :

                    conversations.map(
                        (chat) => (

                            <div

                                className="conversation"

                                key={
                                    chat.userId
                                }

                                onClick={() =>
                                    navigate(
                                        `/chat/${chat.userId}`
                                    )
                                }

                            >


                                <div className="conversation-icon">

                                    👤

                                </div>


                                <div className="conversation-info">


                                    <h3>

                                        {
                                            chat.name
                                        }

                                    </h3>


                                    <p>

                                        {
                                            chat.lastMessage
                                        }

                                    </p>


                                </div>


                            </div>

                        )
                    )

                }


            </div>


        </div>

    );

}


export default Messages;

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();


// ===============================
// ROUTES
// ===============================

const authRoutes =
    require("./routes/auth");

const lostItemRoutes =
    require("./routes/lostItem");

const foundItemRoutes =
    require("./routes/foundItem");

const dashboardRoutes =
    require("./routes/dashboard");

const chatRoutes =
    require("./routes/chat");


// ===============================
// APP
// ===============================

const app = express();


// ===============================
// ALLOWED FRONTENDS
// ===============================

const allowedOrigins = [

    "http://localhost:5173",

    "https://find-it-pi-eight.vercel.app",

    "https://find-mpef8gc2l-cssanchinamugade-lgtms-projects.vercel.app",

    "https://find-it-q5xe.vercel.app"

];


// ===============================
// CORS
// ===============================

app.use(
    cors({

        origin: function (origin, callback) {

            if (!origin) {

                return callback(null, true);

            }


            if (
                allowedOrigins.includes(origin)
            ) {

                return callback(null, true);

            }


            return callback(
                new Error(
                    "Not allowed by CORS"
                )
            );

        },

        credentials: true

    })
);


// ===============================
// MIDDLEWARE
// ===============================

app.use(
    express.json()
);


// ===============================
// UPLOADS
// ===============================

app.use(
    "/uploads",

    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


// ===============================
// API ROUTES
// ===============================

app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/lost-items",
    lostItemRoutes
);


app.use(
    "/api/found-items",
    foundItemRoutes
);


app.use(
    "/api/dashboard",
    dashboardRoutes
);


app.use(
    "/api/chat",
    chatRoutes
);


// ===============================
// MONGODB
// ===============================

mongoose.connect(
    process.env.MONGO_URI
)

.then(() => {

    console.log(
        "MongoDB Connected"
    );

})

.catch((error) => {

    console.log(
        "MongoDB Connection Error:",
        error
    );

});


// ===============================
// HOME
// ===============================

app.get(
    "/",
    (req, res) => {

        res.send(
            "FindIt Backend Server Running"
        );

    }
);


// ===============================
// HTTP SERVER
// ===============================

const server =
    http.createServer(app);


// ===============================
// SOCKET.IO
// ===============================

const io = new Server(
    server,
    {

        cors: {

            origin: allowedOrigins,

            methods: [
                "GET",
                "POST"
            ],

            credentials: true

        }

    }
);


// ===============================
// SOCKET CONNECTION
// ===============================

io.on(
    "connection",
    (socket) => {

        console.log(
            "User Connected:",
            socket.id
        );


        // ===============================
        // JOIN PERSONAL USER ROOM
        // ===============================

        socket.on(
            "joinUser",
            (userId) => {

                socket.join(userId);

                console.log(
                    "User joined personal room:",
                    userId
                );

            }
        );


        // ===============================
        // JOIN CHAT
        // ===============================

        socket.on(
            "joinChat",
            (chatId) => {

                socket.join(chatId);

                console.log(
                    "User joined chat:",
                    chatId
                );

            }
        );


        // ===============================
        // SEND MESSAGE
        // ===============================

        socket.on(
            "sendMessage",
            (data) => {

                console.log(
                    "Message:",
                    data
                );


                // Send message to users
                // inside this chat room

                io
                    .to(data.chatId)
                    .emit(
                        "receiveMessage",
                        data
                    );


                // Send notification directly
                // to receiver's personal room

                io
                    .to(data.receiverId)
                    .emit(
                        "newMessageNotification",
                        {

                            senderId:
                                data.senderId,

                            senderName:
                                data.senderName,

                            message:
                                data.message,

                            receiverId:
                                data.receiverId,

                            chatId:
                                data.chatId

                        }
                    );

            }
        );


        // ===============================
        // DISCONNECT
        // ===============================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "User Disconnected:",
                    socket.id
                );

            }
        );

    }
);


// ===============================
// START SERVER
// ===============================

const PORT =
    process.env.PORT || 5000;


server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);



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

const authRoutes = require("./routes/auth");
const lostItemRoutes = require("./routes/lostItem");
const foundItemRoutes = require("./routes/foundItem");
const dashboardRoutes = require("./routes/dashboard");
const chatRoutes = require("./routes/chat");

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

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
};

app.use(cors(corsOptions));

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

// ===============================
// UPLOADS
// ===============================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);

// ===============================
// MONGODB
// ===============================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.send("FindIt Backend Server Running");
});

// ===============================
// HTTP SERVER
// ===============================

const server = http.createServer(app);

// ===============================
// SOCKET.IO
// ===============================

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// ===============================
// SOCKET CONNECTION
// ===============================

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // ===============================
    // JOIN PERSONAL USER ROOM
    // ===============================

    socket.on("joinUser", (userId) => {
        if (!userId) {
            return;
        }

        const userRoom = String(userId);

        socket.join(userRoom);

        console.log("User joined personal room:", userRoom);
    });

    // ===============================
    // JOIN CHAT ROOM
    // ===============================

    socket.on("joinChat", (chatId) => {
        if (!chatId) {
            return;
        }

        const roomId = String(chatId);

        socket.join(roomId);

        console.log("User joined chat:", roomId);
    });

    // ===============================
    // SEND REAL-TIME MESSAGE
    // ===============================

    socket.on("sendMessage", (data) => {
        try {
            // Check that all required message
            // information is present.

            if (
                !data ||
                !data.chatId ||
                !data.senderId ||
                !data.receiverId ||
                !data.message ||
                !String(data.message).trim()
            ) {
                console.log("Invalid message received");
                return;
            }

            const messageData = {
                chatId: String(data.chatId),
                senderId: String(data.senderId),
                receiverId: String(data.receiverId),
                senderName: data.senderName || "User",
                message: String(data.message).trim(),
                createdAt: data.createdAt || new Date()
            };

            console.log("Real-time message:", messageData);

            // Send message to everyone
            // currently inside this chat room.

            io.to(messageData.chatId).emit(
                "receiveMessage",
                messageData
            );

            // Send notification to receiver's
            // personal room.

            io.to(messageData.receiverId).emit(
                "newMessageNotification",
                {
                    senderId: messageData.senderId,
                    senderName: messageData.senderName,
                    message: messageData.message,
                    receiverId: messageData.receiverId,
                    chatId: messageData.chatId
                }
            );

        } catch (error) {
            console.log("Socket Message Error:", error);
        }
    });

    // ===============================
    // DISCONNECT
    // ===============================

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

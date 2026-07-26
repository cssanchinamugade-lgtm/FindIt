const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();


// Routes
const authRoutes = require("./routes/auth");
const lostItemRoutes = require("./routes/lostItem");
const foundItemRoutes = require("./routes/foundItem");
const dashboardRoutes = require("./routes/dashboard");
const chatRoutes = require("./routes/chat");



const app = express();


// Middleware

app.use(cors());

app.use(express.json());


app.use(
    "/uploads",
    express.static(path.join(__dirname,"uploads"))
);



// API Routes

app.use("/api/auth",authRoutes);

app.use("/api/lost-items",lostItemRoutes);

app.use("/api/found-items",foundItemRoutes);

app.use("/api/dashboard",dashboardRoutes);

app.use("/api/chat",chatRoutes);




// MongoDB Connection

mongoose.connect(process.env.MONGO_URI)

.then(()=>{

    console.log("MongoDB Connected");

})

.catch((error)=>{

    console.log(error);

});




// Home Route

app.get("/",(req,res)=>{

    res.send("FindIt Backend Server Running");

});





// ---------------- SOCKET.IO ----------------


const server = http.createServer(app);



const io = new Server(server,{

    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }

});




io.on("connection",(socket)=>{


    console.log("User Connected:",socket.id);



    // Join private chat room

    socket.on("joinChat",(chatId)=>{

        socket.join(chatId);

        console.log(
            "User joined chat:",
            chatId
        );

    });





    // Send message

    socket.on("sendMessage",(data)=>{


        console.log(
            "Message:",
            data
        );


        io
        .to(data.chatId)
        .emit(
            "receiveMessage",
            data
        );


    });





    // Disconnect

    socket.on("disconnect",()=>{

        console.log(
            "User Disconnected:",
            socket.id
        );

    });


});






const PORT = 5000;


server.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});
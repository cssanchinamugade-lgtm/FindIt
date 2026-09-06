const express = require("express");

const router = express.Router();

const Chat = require("../models/Chat");


// ===============================
// GET PREVIOUS MESSAGES
// ===============================

router.get("/:chatId", async (req, res) => {

    try {

        const messages = await Chat.find({
            chatId: req.params.chatId
        }).sort({
            createdAt: 1
        });

        res.json(messages);

    }

    catch (error) {

        console.log(
            "GET CHAT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// ===============================
// SAVE MESSAGE
// ===============================

router.post("/", async (req, res) => {

    try {

        const newMessage = new Chat({

            chatId: req.body.chatId,

            senderId: req.body.senderId,

            receiverId: req.body.receiverId,

            senderName: req.body.senderName,

            message: req.body.message,

            createdAt: new Date()

        });


        const savedMessage =
            await newMessage.save();


        res.status(201).json({

            success: true,

            message: savedMessage

        });

    }

    catch (error) {

        console.log(
            "SAVE CHAT ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});


module.exports = router;
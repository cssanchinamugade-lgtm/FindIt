
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
// GET USER CONVERSATIONS
// ===============================

router.get("/user/:userId", async (req, res) => {

    try {

        const userId =
            req.params.userId;


        const messages =
            await Chat.find({

                $or: [
                    {
                        senderId: userId
                    },
                    {
                        receiverId: userId
                    }
                ]

            }).sort({
                createdAt: -1
            });


        const conversations = [];

        const chatIds = [];


        for (const message of messages) {

            if (
                chatIds.includes(
                    message.chatId
                )
            ) {
                continue;
            }


            chatIds.push(
                message.chatId
            );


            const otherUserId =
                message.senderId === userId
                    ?
                    message.receiverId
                    :
                    message.senderId;


            const otherUserName =
                message.senderId === userId
                    ?
                    "User"
                    :
                    message.senderName;


            conversations.push({

                chatId:
                    message.chatId,

                otherUserId:
                    otherUserId,

                otherUserName:
                    otherUserName,

                lastMessage:
                    message.message

            });

        }


        res.json(
            conversations
        );

    }

    catch (error) {

        console.log(
            "GET USER MESSAGES ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

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


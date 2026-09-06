const express = require("express");

const router = express.Router();

const Chat = require("../models/Chat");
const User = require("../models/User");


// ===============================
// GET ALL MESSAGES OF A USER
// ===============================

router.get("/conversations/:userId", async (req, res) => {

    try {

        const userId = req.params.userId;

        const messages = await Chat.find({

            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]

        }).sort({
            createdAt: -1
        });


        const conversations = [];

        const usedUsers = new Set();


        for (const message of messages) {

            const otherUserId =
                message.senderId === userId
                    ? message.receiverId
                    : message.senderId;


            if (usedUsers.has(otherUserId)) {
                continue;
            }


            usedUsers.add(otherUserId);


            const otherUser =
                await User.findById(
                    otherUserId
                ).select("name email");


            if (!otherUser) {
                continue;
            }


            conversations.push({

                userId: otherUser._id,

                name: otherUser.name,

                email: otherUser.email,

                lastMessage: message.message,

                createdAt: message.createdAt

            });

        }


        res.json(conversations);

    }

    catch (error) {

        console.log(
            "CONVERSATIONS ERROR:",
            error
        );

        res.status(500).json({

            message: "Server error"

        });

    }

});


// ===============================
// GET PREVIOUS CHAT MESSAGES
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

            createdAt:
                req.body.createdAt ||
                new Date()

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
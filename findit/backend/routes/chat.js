
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const User = require("../models/User");

// =====================================
// GET USER CONVERSATIONS
// =====================================

const getUserConversations = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all messages sent or received by this user
        const messages = await Chat.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({
            createdAt: -1
        });

        const conversations = [];
        const chatIds = [];

        for (const message of messages) {

            // Avoid duplicate conversations
            if (chatIds.includes(message.chatId)) {
                continue;
            }

            chatIds.push(message.chatId);

            // Find the other person's ID
            const otherUserId =
                String(message.senderId) === String(userId)
                    ? message.receiverId
                    : message.senderId;

            // Skip invalid user IDs and self-conversations
if (
    String(otherUserId) === String(userId) ||
    !/^[0-9a-fA-F]{24}$/.test(String(otherUserId))
) {
    continue;
}

            // Get the other person's name safely
            let otherUserName =
                message.senderName || "User";

            // Only query MongoDB if the ID is a valid ObjectId
            if (
                mongoose.Types.ObjectId.isValid(String(otherUserId)) &&
                /^[0-9a-fA-F]{24}$/.test(String(otherUserId))
            ) {
                const otherUser = await User.findById(
                    otherUserId
                ).select("name");

                if (otherUser && otherUser.name) {
                    otherUserName = otherUser.name;
                }
            }

            // Add conversation details
            conversations.push({
                chatId: message.chatId,
                otherUserId: otherUserId,
                otherUserName: otherUserName,
                lastMessage: message.message,
                createdAt: message.createdAt
            });
        }

        res.json(conversations);

    } catch (error) {

        console.log(
            "GET USER CONVERSATIONS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =====================================
// GET USER CONVERSATIONS - EXISTING URL
// =====================================

router.get(
    "/user/:userId",
    getUserConversations
);


// =====================================
// GET USER CONVERSATIONS - ALTERNATE URL
// =====================================

router.get(
    "/conversations/:userId",
    getUserConversations
);


// =====================================
// GET PREVIOUS CHAT MESSAGES
// =====================================

router.get("/:chatId", async (req, res) => {

    try {

        const messages = await Chat.find({
            chatId: req.params.chatId
        }).sort({
            createdAt: 1
        });

        res.json(messages);

    } catch (error) {

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


// =====================================
// SAVE MESSAGE IN MONGODB
// =====================================

router.post("/", async (req, res) => {

    try {

        const {
            chatId,
            senderId,
            receiverId,
            senderName,
            message
        } = req.body;

        // Validate required details
        if (
            !chatId ||
            !senderId ||
            !receiverId ||
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Required chat details are missing"
            });

        }

        // Create new message
        const newMessage = new Chat({

            chatId,

            senderId,

            receiverId,

            senderName: senderName || "User",

            message: message.trim(),

            createdAt: req.body.createdAt || new Date()

        });

        // Save message
        const savedMessage = await newMessage.save();

        res.status(201).json({

            success: true,

            message: savedMessage

        });

    } catch (error) {

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

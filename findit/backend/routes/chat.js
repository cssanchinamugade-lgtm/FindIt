
const express = require("express");
const router = express.Router();

const Chat = require("../models/Chat");
const User = require("../models/User");

// =====================================
// GET USER CONVERSATIONS
// =====================================

const getUserConversations = async (req, res) => {
    try {
        const userId = req.params.userId;

        const messages = await Chat.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ createdAt: -1 });

        const conversations = [];
        const chatIds = [];

        for (const message of messages) {
            if (chatIds.includes(message.chatId)) {
                continue;
            }

            chatIds.push(message.chatId);

            const otherUserId =
                String(message.senderId) === String(userId)
                    ? message.receiverId
                    : message.senderId;

            const otherUser = await User.findById(otherUserId);

            conversations.push({
                chatId: message.chatId,
                otherUserId: otherUserId,
                otherUserName: otherUser?.name || message.senderName || "User",
                lastMessage: message.message,
                createdAt: message.createdAt
            });
        }

        res.json(conversations);
    } catch (error) {
        console.log("GET USER CONVERSATIONS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

router.get("/user/:userId", getUserConversations);
router.get("/conversations/:userId", getUserConversations);

// =====================================
// GET PREVIOUS CHAT MESSAGES
// =====================================

router.get("/:chatId", async (req, res) => {
    try {
        const messages = await Chat.find({
            chatId: req.params.chatId
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.log("GET CHAT ERROR:", error);

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

        if (
            !chatId ||
            !senderId ||
            !receiverId ||
            !message ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Required chat details are missing"
            });
        }

        const newMessage = new Chat({
            chatId,
            senderId,
            receiverId,
            senderName: senderName || "User",
            message: message.trim(),
            createdAt: req.body.createdAt || new Date()
        });

        const savedMessage = await newMessage.save();

        res.status(201).json({
            success: true,
            message: savedMessage
        });
    } catch (error) {
        console.log("SAVE CHAT ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

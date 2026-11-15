
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

    chatId: {
        type: String,
        required: true,
        index: true
    },

    senderId: {
        type: String,
        required: true
    },

    receiverId: {
        type: String,
        required: true
    },

    senderName: {
        type: String,
        default: "User"
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Chat", chatSchema);

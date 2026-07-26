const express = require("express");

const router = express.Router();

const Chat = require("../models/Chat");




// Get messages

router.get("/:chatId",async(req,res)=>{


    try{


        const messages = await Chat.find({

            chatId:req.params.chatId

        });


        res.json(messages);


    }
    catch(error){


        res.status(500)
        .json(error);


    }


});







// Save message

router.post("/",async(req,res)=>{


    try{


        const newMessage = await Chat.create(
            req.body
        );


        res.json(newMessage);



    }
    catch(error){


        res.status(500)
        .json(error);


    }


});




module.exports = router;
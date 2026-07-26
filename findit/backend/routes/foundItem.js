const express = require("express");
const router = express.Router();

const multer = require("multer");

const FoundItem = require("../models/FoundItem");



// =========================
// Image Upload Configuration
// =========================

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(null,"uploads/");

    },


    filename:(req,file,cb)=>{


        cb(
            null,
            Date.now() + "-" + file.originalname
        );


    }


});



const upload = multer({

    storage:storage

});





// =========================
// Create Found Item Report
// =========================


router.post(
"/",
upload.single("image"),
async(req,res)=>{


    try{


        const newFoundItem = new FoundItem({


            title:req.body.title,


            description:req.body.description,


            category:req.body.category,


            location:req.body.location,


            date:req.body.date,



            // Logged in user ID

            userId:req.body.userId,



            image:req.file
            ? req.file.filename
            : null



        });





        const savedItem = await newFoundItem.save();




        res.status(201).json({

            message:"Found item reported successfully",

            item:savedItem

        });



    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Server error"

        });


    }


});









// =========================
// Get All Found Items
// =========================


router.get("/",async(req,res)=>{


    try{


        const items = await FoundItem.find()
        .populate(
            "userId",
            "name email"
        );



        res.json(items);



    }

    catch(error){


        res.status(500).json(error);


    }


});









// =========================
// Get Single Found Item
// =========================


router.get("/:id",async(req,res)=>{


    try{


        const item = await FoundItem.findById(
            req.params.id
        )
        .populate(
            "userId",
            "name email"
        );



        if(!item){

            return res.status(404)
            .json({

                message:"Item not found"

            });

        }



        res.json(item);



    }

    catch(error){


        res.status(500).json(error);


    }


});









// =========================
// Delete Found Item
// =========================


router.delete("/:id",async(req,res)=>{


    try{


        await FoundItem.findByIdAndDelete(
            req.params.id
        );



        res.json({

            message:"Found item deleted"

        });



    }

    catch(error){


        res.status(500).json(error);


    }


});





module.exports = router;
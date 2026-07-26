const express = require("express");
const router = express.Router();

const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");


// Get user statistics

router.get("/:userId", async(req,res)=>{

    try{


        const userId = req.params.userId;



        const lostCount = await LostItem.countDocuments({

            userId:userId

        });



        const foundCount = await FoundItem.countDocuments({

            userId:userId

        });




        res.json({

            lostReports: lostCount,

            foundReports: foundCount

        });



    }
    catch(error){


        res.status(500).json({

            message:"Server Error"

        });


    }


});



module.exports = router;
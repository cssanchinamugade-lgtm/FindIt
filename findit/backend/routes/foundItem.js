
const express = require("express");
const router = express.Router();

const multer = require("multer");

const FoundItem = require("../models/FoundItem");

const auth = require("../middleware/auth");



// =========================
// Image Upload Configuration
// =========================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },


    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});


const upload = multer({

    storage: storage

});



// =========================
// Create Found Item Report
// =========================

router.post(
    "/",
    auth,
    upload.single("image"),

    async (req, res) => {

        try {

            const newFoundItem = new FoundItem({

                // Frontend sends itemName
                itemName: req.body.itemName,

                category: req.body.category,

                description: req.body.description,

                location: req.body.location,

                date: req.body.date,

                contact: req.body.contact,


                // Get logged in user's ID
                // from authentication token
                userId: req.user.id,


                // Save uploaded image filename
                image: req.file
                    ? req.file.filename
                    : null

            });


            const savedItem =
                await newFoundItem.save();


            res.status(201).json({

                success: true,

                message:
                    "Found item reported successfully",

                item: savedItem

            });

        }

        catch (error) {

            console.log(
                "Found Item Error:",
                error
            );


            res.status(500).json({

                success: false,

                message: "Server error"

            });

        }

    }
);



// =========================
// Get All Found Items
// =========================

router.get(
    "/",
    async (req, res) => {

        try {

            const items =
                await FoundItem
                    .find()
                    .populate(
                        "userId",
                        "name email"
                    );


            res.json(items);

        }

        catch (error) {

            console.log(
                "Get Found Items Error:",
                error
            );


            res.status(500).json({

                success: false,

                message: "Server error"

            });

        }

    }
);



// =========================
// Get Single Found Item
// =========================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const item =
                await FoundItem
                    .findById(
                        req.params.id
                    )
                    .populate(
                        "userId",
                        "name email"
                    );


            if (!item) {

                return res.status(404).json({

                    message:
                        "Item not found"

                });

            }


            res.json(item);

        }

        catch (error) {

            console.log(
                "Get Single Found Item Error:",
                error
            );


            res.status(500).json({

                success: false,

                message: "Server error"

            });

        }

    }
);



// =========================
// Delete Found Item
// =========================

router.delete(
    "/:id",
    auth,

    async (req, res) => {

        try {

            const item =
                await FoundItem.findById(
                    req.params.id
                );


            if (!item) {

                return res.status(404).json({

                    message:
                        "Item not found"

                });

            }


            // Only the user who reported
            // the item can delete it

            if (
                item.userId.toString() !==
                req.user.id.toString()
            ) {

                return res.status(403).json({

                    message:
                        "Unauthorized"

                });

            }


            await FoundItem.findByIdAndDelete(
                req.params.id
            );


            res.json({

                message:
                    "Found item deleted"

            });

        }

        catch (error) {

            console.log(
                "Delete Found Item Error:",
                error
            );


            res.status(500).json({

                success: false,

                message: "Server error"

            });

        }

    }
);



module.exports = router;


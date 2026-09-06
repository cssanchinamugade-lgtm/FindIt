const express = require("express");
const router = express.Router();

const multer = require("multer");
const FoundItem = require("../models/FoundItem");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({ storage: storage });


// REPORT FOUND ITEM
router.post(
    "/",
    auth,
    upload.single("image"),
    async (req, res) => {

        try {

            const newFoundItem = new FoundItem({

                itemName: req.body.itemName,

                description: req.body.description,

                category: req.body.category,

                location: req.body.location,

                date: req.body.date,

                contact: req.body.contact,

                userId: req.user.id,

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
                "FOUND ITEM ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


// GET ALL FOUND ITEMS
router.get("/", async (req, res) => {

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
            "GET FOUND ITEMS ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});


// GET SINGLE FOUND ITEM
router.get("/:id", async (req, res) => {

    try {

        const item =
            await FoundItem
                .findById(req.params.id)
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
            "GET SINGLE FOUND ITEM ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});


// DELETE FOUND ITEM
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
                "DELETE FOUND ITEM ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);


module.exports = router;
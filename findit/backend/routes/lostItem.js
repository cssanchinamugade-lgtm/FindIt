const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const LostItem = require("../models/LostItem");
const upload = require("../middleware/multer");

// Report Lost Item
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const lostItem = new LostItem({
  itemName: req.body.itemName,
  category: req.body.category,
  description: req.body.description,
  location: req.body.location,
  date: req.body.date,
  contact: req.body.contact,
  image: req.file ? req.file.filename : "",
  user: req.user.id,
});

    await lostItem.save();

    res.status(201).json({
      success: true,
      message: "Lost item reported successfully",
      data: lostItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get All Lost Items
router.get("/", async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get My Reports
router.get("/my-reports", auth, async (req, res) => {
  try {
    const reports = await LostItem.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Delete Report
router.delete("/:id", auth, async (req, res) => {
  try {
    const report = await LostItem.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.user !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await LostItem.findByIdAndDelete(req.params.id);

    res.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Update Report
router.put("/:id", auth, async (req, res) => {
  try {
    const report = await LostItem.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.user !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    report.itemName = req.body.itemName;
    report.category = req.body.category;
    report.description = req.body.description;
    report.location = req.body.location;
    report.date = req.body.date;
    report.contact = req.body.contact;

    await report.save();

    res.json({
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
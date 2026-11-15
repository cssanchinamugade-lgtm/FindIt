
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const LostItem = require("../models/LostItem");
const upload = require("../middleware/multer");

// =====================================================
// REPORT LOST ITEM
// =====================================================

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
      userId: req.user.id
    });

    await lostItem.save();

    res.status(201).json({
      success: true,
      message: "Lost item reported successfully",
      data: lostItem
    });

  } catch (error) {
    console.error("Lost Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

// =====================================================
// GET ALL LOST ITEMS
// =====================================================

router.get("/", async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);

  } catch (error) {
    console.error("Get Lost Items Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// =====================================================
// GET MY REPORTS
// =====================================================

router.get("/my-reports", auth, async (req, res) => {
  try {
    const reports = await LostItem.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(reports);

  } catch (error) {
    console.error("My Reports Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// =====================================================
// DELETE REPORT
// =====================================================

router.delete("/:id", auth, async (req, res) => {
  try {
    const report = await LostItem.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found"
      });
    }

    if (report.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    await LostItem.findByIdAndDelete(req.params.id);

    res.json({
      message: "Report deleted successfully"
    });

  } catch (error) {
    console.error("Delete Report Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// =====================================================
// UPDATE REPORT
// =====================================================

router.put(
  "/:id",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("Update Report Request:", req.params.id);
      console.log("Received Body:", req.body);

      const report = await LostItem.findById(req.params.id);

      if (!report) {
        return res.status(404).json({
          message: "Report not found"
        });
      }

      if (report.userId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          message: "Unauthorized"
        });
      }

      // Safely handle missing request body
      const body = req.body || {};

      // Update only fields sent by frontend
      if (body.itemName !== undefined) {
        report.itemName = body.itemName;
      }

      if (body.category !== undefined) {
        report.category = body.category;
      }

      if (body.description !== undefined) {
        report.description = body.description;
      }

      if (body.location !== undefined) {
        report.location = body.location;
      }

      if (body.date !== undefined) {
        report.date = body.date;
      }

      if (body.contact !== undefined) {
        report.contact = body.contact;
      }

      // Update image only if a new image is uploaded
      if (req.file) {
        report.image = req.file.filename;
      }

      await report.save();

      console.log("Report Updated Successfully");

      res.status(200).json({
        success: true,
        message: "Report updated successfully",
        report
      });

    } catch (error) {
      console.error("Update Report Error:", error);

      res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  }
);

module.exports = router;

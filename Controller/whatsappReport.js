const express = require("express");
const router = express.Router();
const { db } = require("../config/db");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");

router.all("/whatsappReport",catchAsyncErrors( async (req, res) => {  
  try {
    let resdata;
    if (req.method === "GET") {
      resdata = req.query;
    }

    if (req.method === "POST") {
      resdata = req.body;
    }

    if (resdata.method === "whatsappReport") {
      const query3 = "SELECT * FROM tbl_whatsapp_queue";
      const query4 = "SELECT * FROM tbl_whatsapp_airtel";
      const query5 = "SELECT * FROM tbl_whatsapp_datagen";
      const query6 = "SELECT * FROM tbl_whatsapp_pinnacle";

      try {
        const [ results3, results4, results5, results6] = await Promise.all([
          db.promise().query(query3),
          db.promise().query(query4),
          db.promise().query(query5),
          db.promise().query(query6),
        ]);

        const combinedResults = {
          whatsapp_queue: results3,
          whatsapp_airtel: results4,
          whatsapp_datagen: results5,
          whatsapp_pinnacle: results6,
        };

        return res.status(200).json({
          success: true,
          message: "Data fetched successfully",
          data: combinedResults,
        });
      } catch (err) {
        console.error("Error executing queries:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch data",
          error: err.message,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid method",
      });
    }
  } catch (error) {
    console.error("Error in request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process request",
      error: error.message,
    });
  }
}));

module.exports = router;

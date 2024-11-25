const express = require("express");
const router = express.Router();
const { db } = require("../config/db");

router.all("/respReport", async (req, res) => {  
  try {
    let resdata;
    if (req.method === "GET") {
      resdata = req.query;
    }

    if (req.method === "POST") {
      resdata = req.body;
    }

    if (  resdata.method === "respReport") {
      const query1 = "SELECT * FROM tbl_whatsapp_airtel_resp_incoming";
      const query2 = "SELECT * FROM tbl_wp_facebook_resp_incoming";

      try {
        const [results1] = await db.promise().query(query1);
        const [results2] = await db.promise().query(query2);

        const combinedResults = {
          whatsapp: results1,
          facebook: results2,
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
    } 
    else {
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
});

module.exports = router;

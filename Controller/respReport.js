const express = require("express");
const router = express.Router();
const db = require("../config/databaseconnection");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");

router.all(
  "/respReport",
  catchAsyncErrors(async (req, res) => {
    try {
      let resdata;
      if (req.method === "GET") {
        resdata = req.query;
      }

      if (req.method === "POST") {
        resdata = req.body;
      }

      if (resdata.method === "respReport") {
        const query1 =
          "SELECT COUNT(*) as whatsappCount FROM tbl_whatsapp_airtel_resp_incoming";
        const query2 =
          "SELECT COUNT(*) as facebookCount FROM tbl_wp_facebook_resp_incoming";

        try {
          const results1 = await db(query1); 
          const results2 = await db(query2); 

          const counts = {
            whatsapp: results1[0].whatsappCount || 0,
            facebook: results2[0].facebookCount || 0,
          };
          return res.status(200).json({
            success: true,
            message: "Counts fetched successfully",
            data: counts,
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
  })
);

module.exports = router;

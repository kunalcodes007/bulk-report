const express = require("express");
const router = express.Router();
const { db } = require("../config/db");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");

router.all(
  "/whatsappReport",
  catchAsyncErrors(async (req, res) => {
    try {
      let resdata;
      if (req.method === "GET") {
        resdata = req.query;
      }

      if (req.method === "POST") {
        resdata = req.body;
      }

      if (resdata.method === "whatsappReport") {
        const queryQueue = "SELECT COUNT(*) as whatsappQueueCount FROM tbl_whatsapp_queue";
        const queryAirtel = "SELECT COUNT(*) as whatsappAirtelCount FROM tbl_whatsapp_airtel";
        const queryDatagen = "SELECT COUNT(*) as whatsappDatagenCount FROM tbl_whatsapp_datagen";
        const queryPinnacle = "SELECT COUNT(*) as whatsappPinnacleCount FROM tbl_whatsapp_pinnacle";

        try {
          const [queueResults] = await db.promise().query(queryQueue);
          const [airtelResults] = await db.promise().query(queryAirtel);
          const [datagenResults] = await db.promise().query(queryDatagen);
          const [pinnacleResults] = await db.promise().query(queryPinnacle);

          const counts = {
            whatsappQueue: queueResults[0].whatsappQueueCount,
            whatsappAirtel: airtelResults[0].whatsappAirtelCount,
            whatsappDatagen: datagenResults[0].whatsappDatagenCount,
            whatsappPinnacle: pinnacleResults[0].whatsappPinnacleCount,
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

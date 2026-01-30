const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/summary", reportController.getSummary);
router.get("/by-category", reportController.getByCategory);
router.get("/monthly", reportController.getMonthly);

module.exports = router;

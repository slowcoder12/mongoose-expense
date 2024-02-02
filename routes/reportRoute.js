const express = require("express");
const router = express.Router();

const userAuthenticate = require("../middleware/auth");

const reportController = require("../controllers/reportController");

router.get(
  "/displayEItems",
  userAuthenticate.authenticate,
  reportController.displayItems
);

router.get(
  "/download",
  userAuthenticate.authenticate,
  reportController.downloadExpenses
);

router.post(
  "/savelink",
  userAuthenticate.authenticate,
  reportController.saveLink
);

router.get(
  "/reportData",
  userAuthenticate.authenticate,
  reportController.reportData
);

module.exports = router;

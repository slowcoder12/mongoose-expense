const express = require("express");
const router = express.Router();

const passwordController = require("../controllers/passwordController");

router.post("/forgotPassword", passwordController.forgotPassword);

router.get("/resetPassword/:requestId", passwordController.resetPassword);

router.post("/updatePassword/:requestId", passwordController.updatePassword);

module.exports = router;

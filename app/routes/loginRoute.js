const express = require("express");
const router = express.Router();

const login_controller = require("@/controllers/login_controller");
router.post("/login", login_controller.loginUser)
router.get("/getUserList/:heirachy_id", login_controller.getUserList)
router.post("/addEditUsers/:heirachy_id", login_controller.addEditUsers)

module.exports = router;

const express = require("express");
const router = express.Router();

const login_controller = require("@/controllers/login_controller");
const fileMulter = require("@/controllers/FileMulterController,js");
router.post("/login", login_controller.loginUser)
router.get("/getUserList/:heirachy_id", login_controller.getUserList)
router.post("/addEditUsers/:heirachy_id", login_controller.addEditUsers)
router.post("/linkRelation/:user_id/:heirachy_id", login_controller.linkRelation)
router.post("/deattachRelation/:user_id/:heirachy_id", login_controller.deattachRelation)
router.post("/getHeirachy/:heirachy_id", login_controller.getHeirachyFamily)

router
  .route("/uploadimage")
  .post(
    fileMulter.uploadImageController
  );

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controller/LocationController");

router.get("/", controller.view);
router.post("/", controller.find);
router.get("/add", controller.form);
router.post("/create", controller.create);
router.get("/:id", controller.delete);
router.get("/edit/:id", controller.edit);
router.post("/update/:id", controller.update);
router.get("/detail/:id", controller.detail);




module.exports = router
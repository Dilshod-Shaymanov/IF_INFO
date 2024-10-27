const express = require("express");
const {
  addAdmin,
  getAdmin,
  deleteAdmin,
  updateAdmin,
  loginAdmin,
  logoutAdmin,
  testToken,
  getByIdAdmin,
  refreshToken,
  adminActivate,
} = require("../controllers/admin.controller");
const admin_police = require("../middleware/admin_police");

 
const router = express.Router();


router.post("/add", addAdmin);
router.post("/login", loginAdmin);
router.post("/refresh",refreshToken);
router.get("/logout", logoutAdmin);
router.get("/test",testToken);
router.get("/activate/:link", adminActivate);

router.get("/",admin_police,getAdmin);
router.get("/:id", admin_police, getByIdAdmin);

router.patch("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;

const { Router } = require("express");
const {
  getUser,
  addUser,
  deleteUser,
  updateUser,
  getByIdUser,
  loginUser,
  logoutUser,
  testToken,
  refreshToken,
  userActivate,
} = require("../controllers/user.controller");
const router = Router();

const userPolice = require("../middleware/user_police");

router.get("/test", testToken);
router.get("/logout", logoutUser);
router.get("/activate/:link", userActivate);
router.post("/", addUser);
router.post("/refresh",refreshToken);
router.get("/",userPolice, getUser);
router.get("/:id",userPolice, getByIdUser);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);
router.post("/login", loginUser);

module.exports = router;

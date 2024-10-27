const { Router } = require("express");
const { getGuests, addGuest, getByIdGuest, deleteGuest, updateGuest } = require("../controllers/guest.controller");
const router = Router();

router.get("/", getGuests);
router.post("/", addGuest);
router.get("/:id", getByIdGuest);
router.delete("/:id", deleteGuest);
router.patch("/:id", updateGuest);

module.exports = router;

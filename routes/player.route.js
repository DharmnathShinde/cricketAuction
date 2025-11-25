const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { isOrganizer } = require("../middleware/organizer");
const {
  getPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
  getPlayerCount,
  getOrganizerPlayers,
} = require("../controller/player");

// All routes require authentication
router.get("/", auth, getPlayers);
router.post("/", auth, addPlayer);
router.put("/:id", auth, updatePlayer);
router.delete("/:id", auth, deletePlayer);
router.get("/count", auth, getPlayerCount);

// Organizer-only routes
router.get("/organizer", auth, isOrganizer, getOrganizerPlayers);

module.exports = router;

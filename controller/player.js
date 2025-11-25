const Player = require("../database/models/player.model");
const User = require("../database/models/user.model");

// Get all players for the authenticated user (includes organizer players)
const getPlayers = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    const isOrganizer = user && user.role === "organizer";

    // Get user's own players
    const userPlayers = await Player.find({ owner: req.id }).sort({
      createdAt: -1,
    });

    // Get organizer players (available to all)
    const organizerPlayers = await Player.find({
      isOrganizerPlayer: true,
    }).sort({
      createdAt: -1,
    });

    // Combine players
    const allPlayers = [...userPlayers, ...organizerPlayers];

    res.status(200).send({
      success: true,
      players: allPlayers,
      isOrganizer,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching players",
      error: error.message,
    });
  }
};

// Add a new player
const addPlayer = async (req, res) => {
  try {
    const { name, role, isOrganizerPlayer } = req.body;
    const user = await User.findById(req.id);
    const isOrganizer = user && user.role === "organizer";

    if (!name || !role) {
      return res.status(400).send({
        success: false,
        message: "Player name and role are required",
      });
    }

    // Validate role
    const validRoles = ["batter", "bowler", "allrounder", "wicketkeeper"];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).send({
        success: false,
        message:
          "Invalid role. Must be: batter, bowler, allrounder, or wicketkeeper",
      });
    }

    // If trying to add organizer player, check if user is organizer
    if (isOrganizerPlayer && !isOrganizer) {
      return res.status(403).send({
        success: false,
        message: "Only organizers can add players for all auctions",
      });
    }

    // If organizer is adding a player for all auctions
    if (isOrganizer && isOrganizerPlayer) {
      // Check if organizer player with same name already exists globally
      const existingPlayer = await Player.findOne({
        name: name.trim(),
        isOrganizerPlayer: true,
      });

      if (existingPlayer) {
        return res.status(400).send({
          success: false,
          message: "An organizer player with this name already exists",
        });
      }

      const player = new Player({
        name: name.trim(),
        role: role.toLowerCase(),
        owner: null, // No owner for organizer players
        addedBy: req.id,
        isOrganizerPlayer: true,
      });

      await player.save();

      return res.status(201).send({
        success: true,
        message: "Player added successfully for all auctions",
        player,
      });
    }

    // Regular participant adding their own player
    // Check if player with same name already exists for this user
    const existingPlayer = await Player.findOne({
      name: name.trim(),
      owner: req.id,
    });

    if (existingPlayer) {
      return res.status(400).send({
        success: false,
        message: "You already have a player with this name",
      });
    }

    const player = new Player({
      name: name.trim(),
      role: role.toLowerCase(),
      owner: req.id,
      addedBy: req.id,
      isOrganizerPlayer: false,
    });

    await player.save();

    res.status(201).send({
      success: true,
      message: "Player added successfully",
      player,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({
        success: false,
        message: "A player with this name already exists",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error adding player",
      error: error.message,
    });
  }
};

// Update a player
const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;
    const user = await User.findById(req.id);
    const isOrganizer = user && user.role === "organizer";

    // Find player - check if user owns it or if it's an organizer player and user is organizer
    let player;
    if (isOrganizer) {
      // Organizers can update their own players or organizer players
      player = await Player.findOne({
        _id: id,
        $or: [{ owner: req.id }, { isOrganizerPlayer: true }],
      });
    } else {
      // Regular users can only update their own players
      player = await Player.findOne({ _id: id, owner: req.id });
    }

    if (!player) {
      return res.status(404).send({
        success: false,
        message: "Player not found",
      });
    }

    // If updating name, check for duplicate
    if (name && name.trim() !== player.name) {
      let existingPlayer;
      if (player.isOrganizerPlayer && isOrganizer) {
        // Check globally for organizer players
        existingPlayer = await Player.findOne({
          name: name.trim(),
          isOrganizerPlayer: true,
          _id: { $ne: id },
        });
      } else {
        // Check within user's players
        existingPlayer = await Player.findOne({
          name: name.trim(),
          owner: req.id,
          _id: { $ne: id },
        });
      }

      if (existingPlayer) {
        return res.status(400).send({
          success: false,
          message: "A player with this name already exists",
        });
      }
      player.name = name.trim();
    }
    if (role) {
      const validRoles = ["batter", "bowler", "allrounder", "wicketkeeper"];
      if (!validRoles.includes(role.toLowerCase())) {
        return res.status(400).send({
          success: false,
          message:
            "Invalid role. Must be: batter, bowler, allrounder, or wicketkeeper",
        });
      }
      player.role = role.toLowerCase();
    }

    await player.save();

    res.status(200).send({
      success: true,
      message: "Player updated successfully",
      player,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({
        success: false,
        message: "A player with this name already exists",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error updating player",
      error: error.message,
    });
  }
};

// Delete a player
const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.id);
    const isOrganizer = user && user.role === "organizer";

    // Find player - check if user owns it or if it's an organizer player and user is organizer
    let player;
    if (isOrganizer) {
      // Organizers can delete their own players or organizer players
      player = await Player.findOne({
        _id: id,
        $or: [{ owner: req.id }, { isOrganizerPlayer: true }],
      });
    } else {
      // Regular users can only delete their own players
      player = await Player.findOne({ _id: id, owner: req.id });
    }

    if (!player) {
      return res.status(404).send({
        success: false,
        message: "Player not found",
      });
    }

    await Player.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Player deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting player",
      error: error.message,
    });
  }
};

// Get player count for user (includes organizer players)
const getPlayerCount = async (req, res) => {
  try {
    const user = await User.findById(req.id);

    // Count user's own players
    const userPlayerCount = await Player.countDocuments({ owner: req.id });

    // Count organizer players (available to all)
    const organizerPlayerCount = await Player.countDocuments({
      isOrganizerPlayer: true,
    });

    const totalCount = userPlayerCount + organizerPlayerCount;

    res.status(200).send({
      success: true,
      count: totalCount,
      userPlayerCount,
      organizerPlayerCount,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching player count",
      error: error.message,
    });
  }
};

// Get all organizer players (organizer only)
const getOrganizerPlayers = async (req, res) => {
  try {
    const players = await Player.find({ isOrganizerPlayer: true })
      .populate("addedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      players,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching organizer players",
      error: error.message,
    });
  }
};

module.exports = {
  getPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
  getPlayerCount,
  getOrganizerPlayers,
};

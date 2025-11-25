const User = require("../database/models/user.model");

const isOrganizer = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role !== "organizer") {
      return res.status(403).send({
        success: false,
        message: "Access denied. Organizer role required.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error checking organizer status",
      error: error.message,
    });
  }
};

module.exports = { isOrganizer };

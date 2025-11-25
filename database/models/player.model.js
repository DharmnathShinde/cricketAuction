const mongoose = require("mongoose");
const { Schema } = mongoose;

// Player Schema
const PlayerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["batter", "bowler", "allrounder", "wicketkeeper"],
      lowercase: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for organizer-added players
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Always track who added the player
    },
    isOrganizerPlayer: {
      type: Boolean,
      default: false, // True if added by organizer for all auctions
    },
  },
  {
    timestamps: true,
  }
);

// Index to ensure unique player names per owner (for participant players)
PlayerSchema.index({ name: 1, owner: 1 }, { unique: true, sparse: true });

// Index to ensure unique organizer player names globally
PlayerSchema.index(
  { name: 1, isOrganizerPlayer: 1 },
  { unique: true, partialFilterExpression: { isOrganizerPlayer: true } }
);

const Player = mongoose.model("Player", PlayerSchema);

module.exports = Player;

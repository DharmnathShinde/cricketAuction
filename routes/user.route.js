const express = require("express");
const User = require("../database/models/user.model");
const router = express.Router();
const { auth } = require("../middleware/auth");
// Sign up route, used for creating new accounts
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).send({
        success: false,
        message: "Username, email, password, and role are required",
      });
    }

    // Validate role
    const validRoles = ["organizer", "captain", "viewer"];
    if (!validRoles.includes(role)) {
      return res.status(400).send({
        success: false,
        message: "Invalid role. Must be: organizer, captain, or viewer",
      });
    }

    const user = new User({ username, email, password, role });
    const token = await user.generateAuthToken();
    // Creating a http only cookie, which is used for authorization
    res.cookie("jwt", token, {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      httpOnly: true,
    });
    res.status(201).send({
      success: true,
      message: "Successfully created an account",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    const message = error.message;
    let errorMessage = "";
    console.log(error.message);
    // Checking for duplicates
    if (message.includes("username")) {
      errorMessage =
        "Opps, the username you have enter already exists, try a different one";
    } else if (message.includes("email")) {
      errorMessage =
        "Looks like you have an account associated with us. Please login in.";
    } else {
      errorMessage = "Opps, something went wrong, try again.";
    }
    res.status(400).send({
      success: false,
      message: errorMessage,
    });
  }
});
// Login route used to login existing users
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials({ ...req.body });

    // Ensure user has a valid role (for existing users)
    const validRoles = ["organizer", "captain", "viewer"];
    if (!user.role || !validRoles.includes(user.role)) {
      user.role = "viewer";
      await user.save();
    }

    const token = await user.generateAuthToken();
    // Creating a http only cookie, which is used for authorization
    res.cookie("jwt", token, {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      httpOnly: true,
    });
    res.status(200).send({
      success: true,
      message: "Successfully logged in.",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).send({
      success: false,
      message: error.message || "Login failed. Please check your credentials.",
    });
  }
});
// Authenticating the http only cookie
router.get("/user", auth, async (req, res) => {
  const id = req.id;
  const user = await User.findById(id);
  if (user) {
    res.send({
      success: true,
      message: "Successfully Authenticated",
      user: user.getPublicProfile(),
    });
  } else {
    res.status(401).send({
      success: false,
      message: "Not authenticated",
    });
  }
});
router.get("/logout", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.id, {
    $pull: { tokens: { token: req.token } },
  });
  res
    .clearCookie("jwt", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      httpOnly: true,
    })
    .send({
      success: true,
      message: "Successfully logged out",
    });
});
module.exports = router;

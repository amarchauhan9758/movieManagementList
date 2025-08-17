const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "Email already registered!",
      });
    }

    const encrpytedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: encrpytedPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      status: "success",
      data: { id: user._id, email: user.email, role: user.role },
      message: "User Created Successfully!",
    });
  } catch (error) {
    console.log(error, "line no 28");
    res.status(400).json({
      status: "error",
      data: null,
      message: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid Credentials");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new Error("Invalid Credentials");

    const token = user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      status: "success",
      data: { id: user._id, email: user.email, role: user.role },
      message: "Login Successfully!",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      data: null,
      message: error.message,
    });
  }
});

module.exports = authRouter;

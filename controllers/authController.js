import expressAsyncHandler from "express-async-handler";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register User
// route    POST /api/auth/register
// @access  Public

export const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login User
// route    POST /api/auth/login
// @access  Public

export const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// @desc    Logout User
// route    POST /api/auth/logout
// @access  Private

export const logoutUser = expressAsyncHandler(async (req, res) => {
  res.cookie('jwt', '',{
    httpOnly : true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "User logged out" });
});

// @desc    Get User Info
// route    POST /api/auth/user
// @access  Private

export const getUser = expressAsyncHandler(async (req, res) => {
  const {_id, name, email} = req.user
  res.status(200).json({_id,name,email});
});

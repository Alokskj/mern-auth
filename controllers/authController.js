import expressAsyncHandler from "express-async-handler";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import OTP from "../model/otpModel.js";

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
  if (!user) {
    res.status(400).json({ message: "User is not registered" });
  } else if (user && (await user.matchPassword(password))) {
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
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

// @desc    Get User Info
// route    POST /api/auth/user
// @access  Private

export const getUser = expressAsyncHandler(async (req, res) => {
  const { _id, name, email } = req.user;
  res.status(200).json({ _id, name, email });
});

// @desc    Get User Info
// route    POST /api/auth/generate-otp
// @access  Private

export const generateOtp = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  if(!email){
    res.status(400)
    throw new Error('Please Enter the email')
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User is not registered");
  } else if (user.isVerified) {
    res.status(400);
    throw new Error("User is already registered");
  }
  const deleteOldOtp = await OTP.findOneAndDelete({ email });
  const otp = Math.floor(100000 + Math.random() * 900000);
  const sendOtp = await OTP.create({ email, otp });
  res.status(201).json({ message: "OTP send successfully" });
});

export const verifyOtp = expressAsyncHandler(async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    res.status(400);
    throw new Error("Please enter the otp and email");
  }
  
  const userOtp = await OTP.findOne({ email });
  if (!userOtp) {
    res.status(400);
    throw new Error("OTP had expired");
  }
  if (parseInt(otp) !== parseInt(userOtp.otp)) {
    res.status(401);
    throw new Error("Invalid OTP");
  }
  const verifyUser = await User.findOneAndUpdate(
    { email },
    { isVerified: true }
  );
  res.status(200).json({ message: "User is verified" });
});

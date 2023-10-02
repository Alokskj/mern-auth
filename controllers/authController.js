import expressAsyncHandler from "express-async-handler";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import OTP from "../model/otpModel.js";

// @desc    Register User
// route    POST /api/auth/register
// @access  Public

export const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password){
    res.status(400);
    throw new Error("Please provide details");
  }
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
    generateToken(res, user._id,user.tokenVersion);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email,success : true });
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
  if(!email || !password){
    res.status(400);
    throw new Error("Please provide details");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "User is not registered" });
  }
  else if(!user.password){
    res.status(201).json({message : "No password,Try social login or forget your password"})
  }
  else if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id,user.tokenVersion);
    const {_id,name,email,isVerified} = user
    res.status(201).json({  _id,name,email,isVerified, success : true });
  } else {
    res.status(401).json({ message: "Invalid password" });
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
  res.status(200).json({ _id, name, email,success : true });
});

// @desc    Generate otp for user verification
// route    POST /api/auth/generate-otp
// @access  Public

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
  res.status(201).json({ message: "OTP send successfully", success : true });
});
// @desc    verify otp for user verification
// route    POST /api/auth/verify-otp
// @access  Public

export const verifyOtp = expressAsyncHandler(async (req, res) => {
  const { otp, email, password } = req.body;
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
  const user = await User.findOne({email})
  if(password){
    user.password = password
    user.tokenVersion++
  }
  user.isVerified = true
  await user.save()
  res.status(200).json({ message: password ? "password changed successfully":"User is verified",success : true });
});


// @desc    forget user password
// route    POST /api/auth/forget-password
// @access  Public

export const forgetPassword = expressAsyncHandler(async (req,res)=>{
  const {email} = req.body
  if(!email){
    res.status(400)
    throw new Error('Please Enter the email')
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invaid email or user is not registered");
  }
  const deleteOldOtp = await OTP.findOneAndDelete({ email });
  const otp = Math.floor(100000 + Math.random() * 900000);
  const sendOtp = await OTP.create({ email, otp });
  res.status(201).json({ message: "OTP send successfully" ,success : true});

})

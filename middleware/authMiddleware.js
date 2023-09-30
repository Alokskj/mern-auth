import expressAsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../model/userModel.js";
export const protectedRoute = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if(req.isAuthenticated()){
    next()
  }
  if (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.userId).select('-password')
        if(!req.user.isVerified){
          res.status(401)
          res.json({message : 'User is not verified'})
        }
        next()
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized, no token");
  }
});

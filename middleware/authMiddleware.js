import expressAsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../model/userModel.js";
export const protectedRoute = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select('-password')
        if(decoded.tokenVersion !== user.tokenVersion)
        {
          res.status(401)
          res.json({message : 'Unauthorized, invalid token'})
        }
        if(!user.isVerified){
          res.status(401)
          res.json({message : 'User is not verified'})
        }
        req.user = user
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

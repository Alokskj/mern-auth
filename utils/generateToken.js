import jwt from "jsonwebtoken"
const generateToken = (res, userId, tokenVersion=0) =>{
const token = jwt.sign({userId, tokenVersion}, process.env.JWT_SECRET,{expiresIn : '30d'})
console.log(token)
 res.cookie('jwt', token, {
    httpOnly : true,
    secure : process.env.NODE_ENV !== 'development',
    maxAge : 30 * 24 * 60 * 60 * 1000
 })
 return token
}
export default generateToken
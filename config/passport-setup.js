import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20'
import LocalStrategy from 'passport-local'
import User from "../model/userModel.js";
import expressAsyncHandler from "express-async-handler";

passport.serializeUser((user,done)=>{
    done(null, user)
})
passport.deserializeUser((user, done)=>{
    done(null, user)
})

passport.use(new GoogleStrategy.Strategy({
    clientID : '1011048307889-f2qr131ldpbgak019slfefg4uvfb67mf.apps.googleusercontent.com',
    clientSecret : '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',
    callbackURL : '/api/auth/google/callback',
    
},expressAsyncHandler(async (accessToken,refreshToken,profile,done)=>{
    console.log(profile)
    const user = await User.findOne({email : profile.emails[0].value})
    if(user){
          return done(null, user)
    }
    else{
        const newUser = await User.create({
            name: profile.displayName,
            googleId : profile.id,
            email : profile.emails[0].value,
            isVerified : true
        })
        return done(null, newUser)

    }
})))
export default passport
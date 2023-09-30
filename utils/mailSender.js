import expressAsyncHandler from "express-async-handler";
import nodemailer from 'nodemailer'
const mailSender = expressAsyncHandler(async (email, title, body) =>{
   const transporter = nodemailer.createTransport({
    host : process.env.MAIL_HOST,
    auth : {
        user : process.env.MAIL_USER,
        pass : process.env.MAIL_PASS
    }
   })
   const mailOptions = {
    from : process.env.MAIL_USER,
    to : email,
    subject : title,
    html : body
   }
   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to send OTP email.' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(201).json({ message: 'OTP sent successfully.' });
    }
  });
})
export default mailSender
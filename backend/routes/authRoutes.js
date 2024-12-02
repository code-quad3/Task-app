const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Person = require('../models/Person')

const{generateToken} = require('../jwt');
router.post("/signup", async (req, res) => {
    try {
      const data = req.body;
      const newPerson = new Person(data);
      const response = await newPerson.save();
      console.log(response,"data saved");
      const payload = {
        id: response.id,
        username: response.username,
        email: response.email,
      };
      const token = generateToken(payload);
      res.cookie("access_token",{token},{httpOnly: true,
        path:'/',
        maxAge: 8*60*60,
        sameSite: "Lax"

      });
      res.status(200).json({message: "Signup done Successfully"})
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  



  router.post("/login", passport.authenticate('local', { session: false }), async (req, res) => {
    try { 
      if (!req.user) {
        const message = req.authInfo?.message || "Authentication failed"; 
        return res.status(401).json({ error: message });
      }
  
      const user = req.user;
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    
      const token = generateToken(payload);
      res.cookie('access_token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
        sameSite: 'Lax', 
       
      });
  
      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


   
router.post('/logout', (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('jwt', {
      httpOnly: true, 
      sameSite: 'Lax' // Helps mitigate CSRF attacks
  });

  res.status(200).json({ message: 'Logged out successfully' });
});


router.post('/forgot-password',async (req ,res)=>{
  
  const {Email} =req.body;
  
  const user = await Person.findOne({ email: Email });
  
  if(!user){
    
    return res.status(400).send('user not found');

  }
const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});

await transporter.sendMail({
  from:`${process.env.EMAIL_USER}`,
  to: Email,
  subject: 'Password Reset',
  text: `Your token is : ${token},`
});
res.status(200).send('Password reset link sent');
});


router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

// Verify token  
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return res.status(400).send('Invalid token');
  }
  //Update password
   
  const user = await Person.findById(userId);
  if (!user) {
    return res.status(400).send('User not found');
  }

  user.password = newPassword; 
  await user.save();

  
  res.status(200).send('Password has been reset');
});








module.exports = router;





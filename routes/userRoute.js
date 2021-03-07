const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user.js")
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken"); 
const verifyToken = require("./middleware/userVerify");

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const nodemailerSmtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();

let errors = []

const transport = nodemailer.createTransport( 
    nodemailerSmtpTransport({ service: "gmail",
    auth:{
      user: "feddynamiskweb@gmail.com",
      pass: "FedDynamiskWeb.2021"
    }
})
)

router.get("/test", verifyToken, (req, res)=>{
    res.send("it works ")
})

router.get("/logout", (req, res)=>{
    res.clearCookie("jwtToken").send("it is done!")
})


router.get("/register", (req, res) => {
    res.render("register.ejs", { errors })
})

router.post("/register", async (req, res) => {
    if (!req.body.name) {
        errors.push(" Name is required")
    }

    if (!req.body.password) {
        errors.push(" password is required")
    }

    if (!req.body.name || !req.body.password) {
        res.render("register.ejs", { errors })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = await new User({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email
    }).save()

    res.redirect("/login")
})

router.get("/login", (req, res) => {
    res.render("login.ejs")
})

router.post("/login", async (req, res) => {
    const name = req.body.name;
    const user = await User.findOne({ name: name })

    const checkedPassword = await bcrypt.compare(req.body.password, user.password)

    if (checkedPassword) {
        
        const jwtToken = await jwt.sign({user:user}, process.env.secretKey)
        
        if(jwtToken)
        {
            const cookie = req.cookies.jwtToken

            if(!cookie) {
              
                res.cookie("jwtToken", jwtToken, {maxAge:3600000, httpOnly: true} )
            }
         return  res.redirect("/")
        }
       
    }
    res.send(" försök igen")
})

router.get("/reset", (req, res)=> {

    res.render("reset.ejs")

})

router.post("/reset",  async (req, res)=>{


   const user =  await User.findOne({email:req.body.email})

      if (user) {
      const token = await crypto.randomBytes(32);

         user.token= token.toString("hex");
         user.tokenExpiration = Date.now() + 3600000;
         await user.save();
    
    await transport.sendMail({
            from: "feddynamiskweb@gmail.com",
            to: user.email, 
            subject: 'Återställa ditt lösenord',
            html: `<h1> Trycka på den här länken : <a href=" http://localhost:8000/reset/${user.token}"> Link  </a> </h1>`,
         }) 
       return res.send("ditt lösenord är skickat")
      }

})

router.get("/reset/:token", async (req, res)=>{

 const token =  req.params.token

 const userWithtokenExist = await User.findOne({token:token, tokenExpiration: {$gt:Date.now()}})

 res.render("resetPassForm.ejs", {user:userWithtokenExist})


})


router.post("/resetPass" , async (req, res)=>{
const nyttPass = req.body.password;
const user = await User.findOne({email:req.body.email})
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(nyttPass, salt)
  user.password = hashedPassword ;

  user.save();

res.send("Lykades att skapa nytt lösenord")


})

router.get("/logout", async (req,res) => {
    res.clearCookie("jwtToken").redirect("/login");
})


module.exports = router;
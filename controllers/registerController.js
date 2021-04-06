const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt")

const registerRender = (req,res)=>{


res.render("register.ejs", {err:""})

}

const registerSubmit = async (req,res) => {

const { name,email,password} = req.body;

const existingEmail = await User.findOne({ email: req.body.email })
if (existingEmail) {
  res.render('register.ejs', { error: "Email already registered" })
}

const { error } = validateUser(req.body)
if (error) return res.render("register.ejs", { error: error.details[0].message });


try{
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash(password, salt)
const user = await new User({
    name,
    email,
    password:hashedPassword,
}).save();
return res.redirect("/login")
}
catch(err){
    if(err) return res.render("register.ejs", {err:err})
}
}

module.exports = {
    registerRender,
    registerSubmit
}
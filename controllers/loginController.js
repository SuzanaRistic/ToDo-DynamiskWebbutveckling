const User = require("./models/user");
const bcrypt= require("bcrypt");
const jwt = require ("jsonwebtoken");
require("dotenv").config();

const loginRender = (req,res) => {
    res.render ("login.ejs", {err:" "})

}
const loginSubmit = async(req,res)=> {

    const {email, password} = req.body;

    const user = await User.findOne({email:email});

    if(!user) return res.redirect("/register")

    const validUser = await bcrypt.compare(password, user.password)

    console.log(validUser)

    if (!validUser) return res.redirect("/login");

    const jwtToken = await jwt.sign({user:user}, process.env.SECRET_KEY)

    if(jwtToken) {
        const cookie = req.cookies.jwtToken

        if(!cookie) {
        res.cookie("jwtToken", jwtToken, {maxAge:36000000, httpOnly:true})
        }
        return res.redirect("/")
    }
    return res.redirect("/")

}

module.exports = {
    loginRender, 
    loginSubmit
}
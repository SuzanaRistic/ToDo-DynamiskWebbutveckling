const jwt = require("jsonwebtoken");
require("dotenv").config();



const verifyToken = (req, res, next)=> {
 
    const token = req.cookies.jwtToken;
    
    if(!token) return res.send("You don't have authentication")
    
    const verifiedUser = jwt.verify(token, process.env.secretKey)
    
    req.user= verifiedUser;
    
    
    next();
    
    }

    module.exports = verifyToken;
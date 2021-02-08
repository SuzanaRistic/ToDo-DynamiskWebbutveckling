const express = require('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const router = require("./routes/todoRoute");
const userRouter = require("./routes/userRoute");
require("dotenv").config();


const app = express();

app.use(express.static(__dirname + "/public"))

app.use(bodyParser.urlencoded({extended:false})) 

app.set("view engine", "ejs")


app.use("/", router)
app.use("/", userRouter)


mongoose.connect(process.env.DATABASE_URL, 
{
    useNewUrlParser: true,
    useUnifiedTopology:true   

}, (err) => {
    if (err) return
    app.listen(process.env.PORT || 8001, () => {
        console.log("app is working")
    })
})


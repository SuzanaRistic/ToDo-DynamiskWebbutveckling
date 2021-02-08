const express = require("express");
const Todo = require("../models/todo");
const router = express.Router(); 


router.get("/", async (req, res)=>{
    const sorted = + req.query.sorted || 1
    const page = +req.query.page || 1;
try{
     const totalData = await Todo.find().countDocuments();
     const dataToShowPerReq = 2;
     const totalDataPart = Math.ceil(totalData/dataToShowPerReq);
     
     const dataToShow= dataToShowPerReq * page
    const data =  await Todo.find().limit(dataToShow).sort({name: sorted})
      res.render("index.ejs", 
      { data,
        totalData,
        totalDataPart, 
        dataToShow,
        dataToShowPerReq,
        errors:"empty"} )
}
catch(err){
    res.render("error.ejs", {error:err})
} 
 })
 

router.post("/", async (req, res)=>{
 console.log(  req.body.name) 
 try{
 await new Todo({
     name:req.body.name
 }).save();
 res.redirect("/")
}
catch(err){
    res.render("error.ejs" , {error: err})
}
 })


 router.get("/edit/:id",  async (req, res)=>{
     console.log(req.query)
    const todo=  await Todo.findOne({_id:req.params.id})
    console.log(todo)

    res.render("edit.ejs", {todo:todo})
 })
 
 
 
 router.post("/edit", async (req, res)=>{
 console.log(req.body)
 await Todo.updateOne( {_id:req.body.id}, {
     name:req.body.name
 })
 res.redirect("/")
 })
 

 router.get("/delete/:id", async (req, res)=>{
     await Todo.deleteOne({_id:req.params.id})
     
     res.redirect("/")
 })
 

 module.exports = router;
const mongoose = require("mongoose");
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    email: {type: String , required:true, unique:true},
    password: {type: String, required:true},
    token: String, 
    tokenExpiration: Date,
    role: { type: String, required: true, default: "Customer" }
})

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    email: Joi.string().min(5).max(100).email().required(),
    password: Joi.string().min(5).max(100).required()
  })
  return schema.validate(user)
}

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  validateUser
}


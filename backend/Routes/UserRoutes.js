const express =require("express")
const jwt= require("jsonwebtoken")
const User =require("../models/User")
const Router = express.Router()



// @route POST /api/users/register
// @desc Register a new user
// @access Public
Router.post("/register", async (req, res) => {
    


    const {name , email , password} = req.body; // Create a new user with req.body data
    try {
        let user= await User.findOne({email})
        if(user) return res.status(400).json({message : "User already exist"})
        let NewUser=new User({name , email , password})
        await NewUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
module.exports = Router;
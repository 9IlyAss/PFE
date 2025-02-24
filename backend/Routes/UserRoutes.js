const express =require("express")
const jwt= require("jsonwebtoken")
const User =require("../models/User")
const Router = express.Router()

Router.post("/register", async (req, res) => {
    
        const {name , email , password} = req.body; // Create a new user with req.body data
    try {
        await newUser.save(); // Save user to the database
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

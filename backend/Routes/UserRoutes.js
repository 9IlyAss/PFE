const express =require("express")
const jwt= require("jsonwebtoken")
const User =require("../models/User")
const Router = express.Router()
const {protect} =require("../middleware/authMiddleware")


// @route POST /api/users/register
// @desc Register a new user
// @access Public
Router.post("/register", async (req, res) => {
    const {name , email , password} = req.body;
    try {
        let user= await User.findOne({email})
        if(user) return res.status(400).json({message : "User already exist"})

        let NewUser=new User({name , email , password})
        await NewUser.save();
        // res.status(201).json({ message: "User registered successfully!" });
        const payload= {user : { id:NewUser._id ,role : NewUser.role}};
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token) => {
            if(err) throw err
            res.status(201).json(
                {
                    user : {
                        _id : NewUser._id,
                        name : NewUser.name,
                        email : NewUser.email,
                        role : NewUser.role
                    },
                    token,
                }
            )
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @route POST /api/users/login
// @desc Log in to your account
// @access Public
Router.post("/login",async (req,res)=>{
    const {email,password}=req.body
    try{
        let user= await User.findOne({email})
            if(!user)
                return res.status(400).json({message : "User dosen't exist"})
            const isMatch = await user.matchPassword(password)
            if(!isMatch)
                return res.status(400).json({message : "Incorrect Password"}) 
            
            const payload= {user : { id:user._id ,role : user.role}};
            
            jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token) => {
            if(err) throw err
            res.json(
                {
                    user : {
                        _id : user._id,
                        name : user.name,
                        email : user.email,
                        role : user.role
                    },
                    token,
                }
            )
        })
    }
    catch(error){
        res.status(500).send("Server Error")

    }
});

// @route Get /api/users/profile
// @desc access to your profile
// @access private
Router.get("/profile",protect, (req,res)=> {
    res.json(req.user)
})


module.exports = Router;
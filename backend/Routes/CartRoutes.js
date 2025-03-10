const express =require("express")
const Product=require("../models/Product")
const { protect , admin } = require("../middleware/authMiddleware")
const Router=express.Router()

Router.post("/",async (req,res)=>{
    
})
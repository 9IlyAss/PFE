const Order =require("../models/Order")
const express =require("express")
const Router = express.Router()
const { protect } = require("../middleware/authMiddleware")


// @route Get /orders/my-orders  
// @desc retrive logged-in user's orders
// @access Private
Router.get("/my-orders",protect ,async (req,res)=>{
    try{
        let myOrders=await Order.find({user : req.user._id}).sort({createdAt : -1})
        res.json(myOrders)
    }catch(error){
        res.status(500).json({ message: "server error" });
    }
})

// @route Get /orders/:id 
// @desc get order details
// @access Private
Router.get("/:id",protect,async (req,res)=>{
    try{
        let order = await Order.findById(req.params.id).populate("user","name email")
        if(!order) return res.status(404).json({ message: 'order not found ' })
        res.status(200).json(order)
    }catch(error){
        res.status(500).json({ message: "server error" });
    }
})
 
module.exports = Router


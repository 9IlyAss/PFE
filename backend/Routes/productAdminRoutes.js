const express = require("express")
const Product = require("../models/Product")
const { protect, admin } = require("../middleware/authMiddleware")



const Router = express.Router()

// @route GET /api/admin/products
// @desc get all products (only admin) 
// @access Private
Router.get("/", protect, admin,async (req,res)=>{
    try {
        let products=await Product.find({})
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.error("Error mergin cart:", error);
    }
})

module.exports = Router
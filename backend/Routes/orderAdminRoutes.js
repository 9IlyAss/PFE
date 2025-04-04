const express = require("express")
const Order = require("../models/Order")
const { protect, admin } = require("../middleware/authMiddleware")

const Router = express.Router()

// @route GET /api/admin/orders
// @desc get all orders (only admin) 
// @access Private
Router.get("/", protect, admin,async(req,res)=>{
    try {
        let orders= await Order.find({}).populate("user","name email")
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.error("Error mergin cart:", error);
    }
}) 
// @route PUT /api/admin/orders/:id
// @desc Update order status (only admin) 
// @access Private
Router.put("/:id", protect, admin,async (req,res)=>{
    try {
        let order= await Order.findById(req.params.id).populate("user","name")
        if(!order) return res.status(404).json({ message: 'order not found ' })
            order.status = req.body.status ||  order.status
            order.isDelivered = req.body.status = "Delivered" ? true : order.isDelivered 
            order.deliveredAt = req.body.status = "Delivered" ? Date.now() : order.deliveredAt 
            let updateOrder= await order.save()
            res.json(updateOrder)
        }catch(error){
        res.status(500).json({ message: "server error" });
        console.error("Error mergin cart:", error);

    }
})

// @route DELETE /api/admin/orders/:id
// @desc Delete a user by id (only admin) 
// @access Private
Router.delete("/:id", protect, admin, async (req, res) => {
    try {
        let order = await Order.findById(req.params.id)
        if (!order) return res.status(404).json({ message: "Order not found" })
        await order.deleteOne()
        res.json({ message: "Order deleted successflly" })
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.error("Error mergin cart:", error);
    }
})
module.exports = Router
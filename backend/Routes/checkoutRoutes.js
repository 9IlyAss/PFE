const Cart = require("../models/Cart")
const Checkout = require("../models/Cheackout")
const Product = require("../models/Product")
const Order = require("../models/Order")
const express = require("express")
const Router = express.Router()
const { protect } = require("../middleware/authMiddleware")


// @route POST    
// @desc Create a new checkout session 
// @access Private
Router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body

    if (!checkoutItems || checkoutItems.length === 0)
        return res.status(400).json({ message: 'no item in checkout ' })
    try {
        let newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        })
        console.log(`Checkout created for user : ${req.user._id}`)
        res.status(200).json(newCheckout)
    } catch (error) {
        console.log("error Creating checkout ", error)
        res.status(500).send("Server Error");
    }
})

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to marked as Paid 
// @access Private
Router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body
    try {
        let checkout = await Checkout.findById(req.params.id)
        if (!checkout) return res.status(404).json({ message: 'checkout not found ' })
        if (paymentStatus === "paid") {
            checkout.isPaid = true
            checkout.paymentStatus = paymentStatus
            checkout.paymentDetails = paymentDetails
            checkout.paidAt = Date.now()
            await checkout.save()
            res.status(200).json(checkout)
        }
        else {
            res.status(400).json({ message: 'invalid Payment Status' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error");
    }
})

// @route POST /api/checkout/:id/finalize
// @desc finalize checkout and convert to an order after payment confirmation
// @access Private
Router.post("/:id/finalize", protect, async (req, res) => {
    try {
        let checkout = await Checkout.findById(req.params.id)
        if (!checkout) return res.status(404).json({ message: 'checkout not found ' })
        if (checkout.isPaid && !checkout.isFinalized) {
            let finalOrder = await Order.create({
                user: req.user._id,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails // !!!!
            })
            checkout.isFinalized = true
            checkout.finalizedAt = Date.now()
            await checkout.save()
            await Cart.findOneAndDelete({ user: req.user._id })
            await Checkout.findOneAndDelete({ user: checkout.user })
            res.status(201).json(finalOrder)
        } else if (checkout.isFinalized)
            res.status(400).json({ message: "Checkout already finalized " })
        else
            res.status(400).json({ message: "Checkout is not Paid" })

    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error");
    }
})

module.exports=Router
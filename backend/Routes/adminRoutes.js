const express = require("express")
const User = require("../models/User")
const { protect, admin } = require("../middleware/authMiddleware")


const Router = express.Router()

// @route GET /api/admin/users
// @desc get all users (only admin) 
// @access Private
Router.get("/", protect, admin, async (req, res) => {
    try {
        let users = await User.find({})
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.error("Error mergin cart:", error);
    }
})

// @route POST /api/admin/users
// @desc Create User (only admin) 
// @access Private
Router.post("/", protect, admin, async (req, res) => {
    let { name, email, password, role } = req.body
    try {
        let user = await User.findOne({email})
        if (user) return res.status(400).json({ message: "User already exist" })
        user = new User({
            name,
            email,
            password,
            role: role || "customer"
        })
        await user.save()
        res.status(201).json({ message: "User registered successfully!", user })
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.error("Error mergin cart:", error);
    }
})

// @route Put /api/admin/users/:id
// @desc update a user info by id (only admin) 
// @access Private
Router.put("/:id", protect, admin, async (req, res) => {
    let { name, email, role } = req.body
    try {
        let user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: "User not found" })
        user.name = name || user.name
        user.email = email || user.email
        user.role = role || user.role
        let updateUser = await user.save()
        res.json({ message: "User updated successfully", user: updateUser })
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.error("Error mergin cart:", error);
    }
})

// @route DELETE /api/admin/users/:id
// @desc Delete a user by id (only admin) 
// @access Private
Router.delete("/:id", protect, admin, async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: "User not found" })
        await user.deleteOne()
        res.json({ message: "User deleted successflly" })
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.error("Error mergin cart:", error);
    }
})

module.exports = Router
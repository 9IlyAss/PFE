const express = require("express")
const Product = require("../models/Product")
const Cart = require("../models/Cart")

const { protect, admin } = require("../middleware/authMiddleware")
const Router = express.Router()


const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId })
    }
    else if(guestId) {
        return await Cart.findOne({ guestId: guestId })
    }
    return null
}

// @route POST /api/cart
// @desc Create cart for user if he's guest or user 
// @access Public
Router.post("/", async (req, res) => {
    const { productId,quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) => p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                // If the product already exists, update the quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            // Recalculate the total price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create a new cart for the guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity, // Convert quantity to a number
                    },
                ],
                totalPrice: product.price * quantity,
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// @route PUT /api/cart
// @desc Update quantity in cart for user or guest
// @access Public
Router.put("/", async (req, res) => {
    const { productId,quantity, size, color,  guestId, userId } = req.body;

    try {
        // Get cart for the user or guest
        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            // If product exists, update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                // If quantity is 0, remove the product
                cart.products.splice(productIndex, 1);
            }

            // Update total price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            // Save the updated cart
            await cart.save();
            return res.status(200).json({ success: true, cart });
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log("Error updating cart:", error);
        return res.status(500).json({ message: " server error" });
    }
});

// @route DELETE /api/cart
// @desc remove a product from cart
// @access Public
Router.delete("/", async (req, res) => {
    const { productId, size, color,guestId, userId} = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json({ message: "Product Removed successfully from Cart", cart });
        }
        return res.status(404).json({ message: "Product not found in cart" });
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.log(error)
    }
});
// @route GET /api/cart
// @desc get the cart
// @access Public
Router.get("/", async (req, res) => {
    const {  userId,guestId } = req.query
    try {
        let cart = await getCart(userId, guestId)
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        return res.status(200).json( cart );
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
})

// @route POST /api/cart/merge
// @desc merge guest cart into user cart on login
// @access Private
Router.post("/merge", protect, async (req, res) => {

    const { guestId } = req.body
    try {
        let guestCart = await Cart.findOne({ guestId })
        let userCart = await Cart.findOne({ user: req.user._id })
        if (guestCart) {
            if (guestCart.products.length === 0)
                return res.status(404).json({ message: "Cart not found" });
            if (userCart) {
                guestCart.products.forEach((guestItem) => {
                    //check if product exist in cart
                    const productIndex = userCart.products.findIndex(
                        (p) =>
                            p.productId.toString() === guestItem.productId &&
                            p.size === guestItem.size &&
                            p.color === guestItem.color
                    );
                    if (productIndex > -1)
                        userCart.products[productIndex].quantity += guestItem.quantity
                    else
                        userCart.products.push(guestItem)
                })
                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
                await userCart.save()
                //delete cart after mergin
                Cart.deleteOne({ guestId })
            } else {
                guestCart.user = req.user._id;
                guestCart.guestId = undefined
                await guestCart.save()
                return res.status(200).json(guestCart);
            }
        } else {
            if (userCart)
                res.status(200).json(userCart);
            else
                res.status(404).json({ message: "Guest cart not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.error("Error mergin cart:", error);

    }
})






module.exports = Router
const express =require("express")
const Product=require("../models/Product")
const Cart =require("../models/Cart")

const { protect , admin } = require("../middleware/authMiddleware")
const Router=express.Router()


const getCart = async (userId,guestId) => {
    if(userId){
        return await Cart.findOne({user : userId})
    } 
    else{
        return await Cart.findOne({guestId : guestId})
    }
    return null
}

// @route POST /api/cart
// @desc Create cart for user if he's guest or user 
// @access Public
Router.post("/", async (req, res) => {
    const { productId, size, color, quantity, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex(
                p => p.productId.toString() === productId &&
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
                user : userId ? userId : undefined,
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
    const { productId, size, color, quantity, guestId, userId } = req.body;

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
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: " server error" });
    }
});

module.exports=Router
const express = require("express")
const cors = require("cors")
const env=require("dotenv")
const app = express();
const ConnectDB = require("./config/db")

const userRoutes= require("./Routes/UserRoutes")
const ProductRoutes=require("./Routes/ProductRoutes")
const CartRoutes =require("./Routes/CartRoutes")
const CheckoutRoutes=require("./Routes/CheckoutRoutes")
const OrderRoutes=require("./Routes/OrderRoutes")

app.use(express.json());
app.use(cors());
env.config()


const PORT =process.env.PORT || 3000;
ConnectDB();
app.get("/",(req,res)=>{
    res.end("waaaaach amonami")
});

app.use("/api/users",userRoutes)
app.use("/api/products",ProductRoutes)
app.use("/api/cart",CartRoutes)
app.use("/api/checkout",CheckoutRoutes)
app.use("/api/orders",OrderRoutes)



app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})



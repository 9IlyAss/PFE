const express = require("express")
const cors = require("cors")
const env=require("dotenv")
const app = express();
const ConnectDB = require("./config/db")

const userRoutes= require("./Routes/userRoutes")
const ProductRoutes=require("./Routes/productRoutes")
const CartRoutes =require("./Routes/cartRoutes")
const CheckoutRoutes=require("./Routes/checkoutRoutes")
const OrderRoutes=require("./Routes/orderRoutes")
const UploadRoutes=require("./Routes/uploadRoutes")
const subscribeRoutes=require("./Routes/subscribeRoutes")
const adminRoutes=require("./Routes/adminRoutes")
const productAdminRoutes=require("./Routes/productAdminRoutes")
const orderAdminRoutes=require("./Routes/orderAdminRoutes")



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
app.use("/api/upload",UploadRoutes)
app.use("/api",subscribeRoutes)


//admin
app.use("/api/admin/users",adminRoutes)
app.use("/api/admin/products",productAdminRoutes)
app.use("/api/admin/orders",orderAdminRoutes)

app.get("/", (req, res) => {
    res.send("BACKEND API IS WORKKING!")}),

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})










const express = require("express")
const cors = require("cors")
const env=require("dotenv")
const app = express();
const ConnectDB = require("./config/db")

const userRoutes= require("./Routes/userRoutes")
const productRoutes=require("./Routes/productRoutes")
const cartRoutes =require("./Routes/cartRoutes")
const checkoutRoutes=require("./Routes/checkoutRoutes")
const orderRoutes=require("./Routes/orderRoutes")
const uploadRoutes=require("./Routes/uploadRoutes")
const subscribeRoutes=require("./Routes/subscribeRoutes")
const adminRoutes=require("./Routes/adminRoutes")
const productAdminRoutes=require("./Routes/productAdminRoutes")
const orderAdminRoutes=require("./Routes/orderAdminRoutes")



app.use(express.json());
env.config()

// const corsOptions = {
//   origin: [
//       'https://kz-eight.vercel.app', // ton frontend
//       'http://localhost:9000'        // pour dev local si tu utilises Vite
//   ],
//   credentials: true, // autorise les cookies ou headers auth si nécessaires
// };

app.use(cors());

const PORT =process.env.PORT || 3000;
ConnectDB();
app.get("/",(req,res)=>{
    res.end("waaaaach amonami")
});

app.use("/api/users",userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/checkout",checkoutRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/upload",uploadRoutes)
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










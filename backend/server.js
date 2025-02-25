const express = require("express")
const cors = require("cors")
const env=require("dotenv")
const app = express();
const ConnectDB = require("./config/db")
const userRoutes= require("./Routes/UserRoutes")

app.use(express.json());
app.use(cors());
env.config()

const PORT =process.env.PORT || 3000;

ConnectDB();
app.get("/",(req,res)=>{
    res.end("<h1>hiiiiiii</hi>")
});

app.use("/api/users",userRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})



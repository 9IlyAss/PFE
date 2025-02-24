const express = require("express")
const cors = require("cors")
const env=require("dotenv")
const app = express();

app.use(express.json());
app.use(cors());
env.config()

const PORT =process.env.PORT || 3000;
const 


app.get("/",(req,res)=>{
    res.end("<h1>hiiiiiii</hi>")
})
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})



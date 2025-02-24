const mongoose = require("mongoose")

const ConnectDB= async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connection Succece ",error)
    } catch (error) {
        console.log("Connection Failed ",error)
    }
}
module.exports=ConnectDB
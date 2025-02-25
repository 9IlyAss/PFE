const mongoose = require("mongoose")

const ConnectDB= async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connection Successe ! ")
    } catch (error) {
        console.log("Connection Failed ",error)
        process.exit(1)
    }
}
module.exports=ConnectDB
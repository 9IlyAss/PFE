const mongoose =require("mongoose")


const subcribeSchema= new mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            trim : true,
            unique : true,
            lowercase : true
        },
        subscribedAt : {
            type : Date,
            default : Date.now()
        }
    }
)

module.exports=mongoose.model("Subscriber",subcribeSchema)
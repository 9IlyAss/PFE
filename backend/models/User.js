const mongoose = require("mongoose")
const bcrypt=require("bcryptjs")

const UserSchema=new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        
    },
    {
        timestamps : true
    }
);
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt= await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword =async function (password){
    return await bcrypt.compare(password,this.password)
}

module.exports= mongoose.model("User",UserSchema)
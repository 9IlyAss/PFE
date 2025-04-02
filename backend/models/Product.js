const mongoose=require("mongoose")


const ProductSchema=new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },
        description : {
            type : String,
            required : true,
        },
        price : {
            type : Number,
            required: true,
        },
        discountPrice : {
            type : Number,

        },
        countInStock : {
            type : Number,
            required : true,
            default : 0
        },
        sku : {
            type : String,
            required : true,
            unique: true
        },
        category : {
            type : String,
            required : true

        },
        brand : {
            type : String,
        },
        sizes : {
            type : [String],
            required : true
        },
        colors : {
            type : [String],
            required : true
        },
        collections : {
            type : String,
            required : true
        },
        material : String,
        gender : {
            type : String,
            enum : ['Men','Women','Unisex'],
            required : true
        },
        images : [{
            url : {
                type : String,
                required : true
            },
            altText : {
                type : String,
            },
        },],
        isFeatured : {
            type : Boolean,
            default : false
        },
        isPublished : {
            type : Boolean,
            default : false
        },
        rating : {
            type : Number,
            default : 0
        },
        numReviews : {
            type : Number,
            default : 0
        },
        tags : {
            type : [String]
        },
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required :true
        },
        metaTitle: String,
        metaDescription: String,  
        metaKeywords: String,

        dimensions : {
            length : Number,
            width : Number,
            height : Number
        },
        weight : Number,
    },
    {
        timestamps : true
    }
);


module.exports=mongoose.model("Product",ProductSchema)
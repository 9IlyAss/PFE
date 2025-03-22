const express =require("express")
const Product=require("../models/Product")
const { protect , admin } = require("../middleware/authMiddleware")
const Router=express.Router()

// @route POST /api/products/
// @desc Create new product
// @access private only admin

Router.post("/",protect,admin,async (req,res)=>{
    const {name,description,price,discountPrice,
            countInStock,sku,category,brand,sizes,
            colors,collections,material,gender,images,
            isFeatured,isPublished,tags,dimensions,weight}=req.body
    try{
        let exist=await Product.findOne({sku})
        if(exist)
            return res.status(400).json({message : "Product already exist"})
        let NewProduct=new Product({name,description,price,
            discountPrice,countInStock,sku,category,brand,sizes,
            colors,collections,material,gender,images,
            isFeatured,isPublished,tags,dimensions,weight,user:req.user._id     })
            await NewProduct.save()
            return res.status(201).json({ message: "Product created successfully", NewProduct });
        }
    catch(error){
        res.status(500).send("Server Error");

    }
})


// @route PUT /api/products/:id
// @desc Update product 
// @access private only admin
Router.put("/:id",protect,admin,async (req,res)=>{
    const {name,description,price,discountPrice,
        countInStock,sku,category,brand,sizes,
        colors,collections,material,gender,images,
        isFeatured,isPublished,tags,dimensions,weight}=req.body
    try{
        let UpdateProduct=await Product.findById(req.params.id)
        if(!UpdateProduct)
            return res.status(404).json({message : "Product not found"})
        UpdateProduct.name = name || UpdateProduct.name
        UpdateProduct.description = description || UpdateProduct.description
        UpdateProduct.price = price || UpdateProduct.price
        UpdateProduct.discountPrice = discountPrice || UpdateProduct.discountPrice
        UpdateProduct.countInStock = countInStock || UpdateProduct.countInStock
        UpdateProduct.category = category || UpdateProduct.category
        UpdateProduct.brand = brand || UpdateProduct.brand
        UpdateProduct.sizes = sizes || UpdateProduct.sizes
        UpdateProduct.colors = colors || UpdateProduct.colors
        UpdateProduct.collections = collections || UpdateProduct.collections
        UpdateProduct.material = material || UpdateProduct.material
        UpdateProduct.gender = gender || UpdateProduct.gender
        UpdateProduct.images = images || UpdateProduct.images
        UpdateProduct.isFeatured = isFeatured !== undefined ? isFeatured : UpdateProduct.isFeatured;
        UpdateProduct.isPublished = isPublished !== undefined ? isPublished : UpdateProduct.isPublished;        
        UpdateProduct.tags = tags || UpdateProduct.tags
        UpdateProduct.dimensions = dimensions || UpdateProduct.dimensions
        UpdateProduct.weight = weight || UpdateProduct.weight
        UpdateProduct.sku = sku || UpdateProduct.sku
        const updatedProduct = await  UpdateProduct.save();
        res.json({ message: "Product Updated successfully", updatedProduct });
        }
        catch(error){
            res.status(500).send("Server Error");
        }}
    )

// @route Delete /api/products/:id
// @desc Delete product
// @access private only admin
Router.delete("/:id",protect,admin,async (req,res)=>{
    try {
        let product= await Product.findById(req.params.id)
        if(!product)
            return res.status(404).json({message : "Product not Found"})
        await product.deleteOne()
        res.json({ message: "Product Removed successfully"})
    } catch (error) {
        res.status(500).send("Server Error");
    }

})

// @route Get /api/products
// @desc Filter to get  products
// @access Public
Router.get("/",async (req,res)=>{

    try {
        const {collections,size,color,gender,minPrice,maxPrice,sortBy,
                search,category,material,brand,limit}= req.query
        let filter={};
        if(collections&&collections.toLocaleLowerCase() !=="all")
            filter.collections=collections
        if(category&&category.toLocaleLowerCase() !=="all")
            filter.category=category
        if(size)
            filter.sizes={ $in : size.split(",")}
        if(material)
            filter.material={ $in : material.split(",")}
        if(brand)
            filter.brand={ $in : brand.split(",")}
        if(color)
            filter.colors={ $in : [color]}
        if(gender)
            filter.gender={ $in : gender}
        if(minPrice || maxPrice){
            filter.price={}
            if(minPrice) filter.price.gte=Number(minPrice)
            if(maxPrice) filter.price.lte=Number(maxPrice)
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } }, 
                { description: { $regex: search, $options: "i" } }
            ];
        }
        let sort={};
        if(sortBy)
            switch(sortBy){
                case "priceAsc": sort={ price: 1}; break;
                case "priceDesc": sort={ price:-1}; break;
                case "popularity": sort={rating:-1}; break;
                default : break;
            }
        let products = await Product.find(filter).sort(sort).limit(Number(limit) || 0);
        res.json(products)

    } catch (error) {
        res.status(500).send("Server Error");
    }
})
// @route Get /api/products/best-seller
// @desc retreve best product by rating
// @access Public
Router.get("/best-seller",async (req,res)=>{
    try{
    let bestSeller=await Product.findOne().sort({rating : -1});
    if(!bestSeller)
        res.status(404).json({ message: "No best-seller product found" });
    res.status(200).json(bestSeller)
    }
    catch(error){
    res.status(500).send("Server Error") 
    }
})

// @route Get /api/products/best-seller
// @desc retrive similar product limit 4
// @access Public
Router.get("/similar/:id",async (req,res)=>{
        try {
            let product= await Product.findById(req.params.id)
            if(!product)
                res.status(404).json({ message: "No product found" })
            let sumilar= await Product.find({ _id : { $ne : product._id},
                                            category : product.category ,
                                            gender : product.gender}).limit(4)
            res.status(200).json(sumilar)                               
        } catch (error) {
            res.status(500).send("Server Error") 
        }
})
// @route Get /api/products/new-arrivals
// @desc retrive new products
// @access Public
Router.get("/new-arrivals",async (req,res)=>{
    try {
        let newArrivals=await Product.find().sort({ createdAt: -1 }).limit(8)
        res.json(newArrivals)
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error") 

    }
})
// @route Get /api/products/id
// @desc get a single product
// @access Public
Router.get("/:id",async (req,res)=>{
    try {
        let product = await Product.findById(req.params.id)
        if(!product) 
            return res.status(404).json({message : "Product not found"})
        res.status(200).json(product)
    } catch (error) {
        res.status(500).send("Server Error")
    }
})



module.exports=Router
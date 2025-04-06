import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { createProduct } from "../../redux/slices/adminProductSlice"

const AddProductPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { createStatus, createError } = useSelector((state) => state.adminProducts)
    
    // Initialize with example product data
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Red", "Blue", "Yellow"],
        collections: "",
        material: "",
        gender: "Men",
        images: [],
        isFeatured: false,
        isPublished: true,
        tags: ["shirt", "formal", "cotton"],
        dimensions: {
            length: 0,
            width: 0,
            height: 0
        },
        weight: 0
    })
    
    const [uploading, setUploading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setProductData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleDimensionChange = (e) => {
        const { name, value } = e.target
        setProductData(prev => ({
            ...prev,
            dimensions: {
                ...prev.dimensions,
                [name]: Number(value) || 0
            }
        }))
    }

    const handleArrayChange = (e) => {
        const { name, value } = e.target
        setProductData(prev => ({
            ...prev,
            [name]: value.split(',').map(item => item.trim()).filter(item => item)
        }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        
        const formData = new FormData()
        formData.append("image", file)
        
        try {
            setUploading(true)
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData, 
                {
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            )
            
            setProductData(prev => ({
                ...prev, 
                images: [...prev.images, { url: data.imageUrl, altText: "" }]
            }))
        } catch (error) {
            console.error("Upload failed:", error)
            alert("Image upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveImage = (index) => {
        setProductData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Prepare final product data
        const finalProduct = {
            ...productData,
            price: Number(productData.price),
            discountPrice: Number(productData.discountPrice) || undefined,
            countInStock: Number(productData.countInStock) || 0,
            weight: Number(productData.weight) || 0,
            // Ensure enum values match schema
            gender: productData.gender.charAt(0).toUpperCase() + productData.gender.slice(1).toLowerCase()
        }

        try {
            const result = await dispatch(createProduct(finalProduct)).unwrap()
            console.log("Product created:", result)
            navigate("/admin/products")
        } catch (error) {
            console.error("Creation failed:", error)
            alert(`Error: ${error.payload?.message || "Check console for details"}`)
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
            <h2 className="text-3xl font-bold mb-6">Add New Product</h2>
            
            {createStatus === 'failed' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {createError}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Name */}
                    <div className="col-span-2">
                        <label className="block font-semibold mb-2">Product Name *</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={productData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2" 
                            required 
                        />
                    </div>
                    
                    {/* Description */}
                    <div className="col-span-2">
                        <label className="block font-semibold mb-2">Description *</label>
                        <textarea 
                            name="description" 
                            value={productData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2" 
                            rows={4}
                            required
                        />
                    </div>
                    
                    {/* Pricing */}
                    <div>
                        <label className="block font-semibold mb-2">Price *</label>
                        <input 
                            type="number" 
                            name="price" 
                            value={productData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded-md p-2" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Discount Price</label>
                        <input 
                            type="number" 
                            name="discountPrice" 
                            value={productData.discountPrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    
                    {/* Inventory */}
                    <div>
                        <label className="block font-semibold mb-2">Stock Quantity *</label>
                        <input 
                            type="number" 
                            name="countInStock" 
                            value={productData.countInStock}
                            onChange={handleChange}
                            min="0"
                            className="w-full border border-gray-300 rounded-md p-2" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">SKU *</label>
                        <input 
                            type="text" 
                            name="sku" 
                            value={productData.sku}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2" 
                            required
                        />
                    </div>
                    
                    {/* Category and Brand */}
                    <div>
                        <label className="block font-semibold mb-2">Category *</label>
                        <input 
                            type="text" 
                            name="category" 
                            value={productData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Brand</label>
                        <input 
                            type="text" 
                            name="brand" 
                            value={productData.brand}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    
                    {/* Sizes and Colors */}
                    <div>
                        <label className="block font-semibold mb-2">Sizes (comma separated) *</label>
                        <input 
                            type="text" 
                            name="sizes" 
                            value={productData.sizes.join(", ")}
                            onChange={handleArrayChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="S, M, L, XL"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Colors (comma separated) *</label>
                        <input 
                            type="text" 
                            name="colors" 
                            value={productData.colors.join(", ")}
                            onChange={handleArrayChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="Red, Blue, Green"
                            required
                        />
                    </div>
                    
                    {/* Collections and Gender */}
                    <div>
                        <label className="block font-semibold mb-2">Collection *</label>
                        <input 
                            type="text" 
                            name="collections" 
                            value={productData.collections}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Gender *</label>
                        <select 
                            name="gender" 
                            value={productData.gender}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>
                    
                    {/* Material and Weight */}
                    <div>
                        <label className="block font-semibold mb-2">Material</label>
                        <input 
                            type="text" 
                            name="material" 
                            value={productData.material}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Weight (kg)</label>
                        <input 
                            type="number" 
                            name="weight" 
                            value={productData.weight}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    
                    {/* Dimensions */}
                    <div className="col-span-2">
                        <label className="block font-semibold mb-2">Dimensions (cm)</label>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Length</label>
                                <input 
                                    type="number" 
                                    name="length" 
                                    value={productData.dimensions.length}
                                    onChange={handleDimensionChange}
                                    min="0"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Width</label>
                                <input 
                                    type="number" 
                                    name="width" 
                                    value={productData.dimensions.width}
                                    onChange={handleDimensionChange}
                                    min="0"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Height</label>
                                <input 
                                    type="number" 
                                    name="height" 
                                    value={productData.dimensions.height}
                                    onChange={handleDimensionChange}
                                    min="0"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="col-span-2">
                        <label className="block font-semibold mb-2">Tags (comma separated)</label>
                        <input 
                            type="text" 
                            name="tags" 
                            value={productData.tags.join(", ")}
                            onChange={handleArrayChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="shirt, formal, cotton"
                        />
                    </div>
                    
                    {/* Status Toggles */}
                    <div className="col-span-2 flex gap-6">
                        <label className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="isFeatured" 
                                checked={productData.isFeatured}
                                onChange={handleChange}
                                className="h-5 w-5"
                            />
                            <span>Featured Product</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="isPublished" 
                                checked={productData.isPublished}
                                onChange={handleChange}
                                className="h-5 w-5"
                            />
                            <span>Published</span>
                        </label>
                    </div>
                </div>
                
                {/* Image Upload */}
                <div className="mb-8">
                    <label className="block font-semibold mb-2">Product Images *</label>
                    <input 
                        type="file" 
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="mb-4"
                        disabled={uploading}
                    />
                    {uploading && <p className="text-blue-500 mb-4">Uploading image...</p>}
                    
                    <div className="flex flex-wrap gap-4">
                        {productData.images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img 
                                    src={image.url} 
                                    alt={image.altText || "Product image"} 
                                    className="w-24 h-24 object-cover rounded-md shadow-md"
                                />
                                <button 
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Submit Buttons */}
                <div className="flex gap-4">
                    <button 
                        type="submit" 
                        disabled={createStatus === 'loading'}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    >
                        {createStatus === 'loading' ? 'Creating...' : 'Create Product'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddProductPage
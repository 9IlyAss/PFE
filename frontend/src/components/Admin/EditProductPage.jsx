import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import { updateProduct, fetchProductDetails } from "../../redux/slices/productSlice"

const EditProductPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { selectedProduct, loading, error } = useSelector((state) => state.products)
  
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: []
  })
  
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct)
    }
  }, [selectedProduct])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
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
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      
      setProductData(prev => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }]
      }))
    } catch (error) {
      console.error("Image upload failed:", error)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateProduct({ id, productData }))
    navigate("/admin/products")
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Price *</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Description *</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
            required
          />
        </div>

        {/* Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Stock Quantity *</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Sizes (comma separated)</label>
            <input
              type="text"
              value={productData.sizes.join(", ")}
              onChange={(e) => handleArrayChange('sizes', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="S, M, L"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Colors (comma separated)</label>
            <input
              type="text"
              value={productData.colors.join(", ")}
              onChange={(e) => handleArrayChange('colors', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Red, Blue"
            />
          </div>
        </div>

        {/* Image Management */}
        <div>
          <label className="block font-medium mb-1">Product Images</label>
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="mb-2"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
          
          <div className="flex flex-wrap gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={image.altText || "Product image"}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProductPage